import { chromium, expect } from '@playwright/test'
import { mkdir, writeFile } from 'node:fs/promises'
const base = process.env.QA_BASE ?? 'http://127.0.0.1:4180'
await mkdir('verification/screenshots', { recursive: true })
const browser = await chromium.launch({ headless: true, channel: 'msedge' })
const results = [], errors = []
async function check(name, run) {
  try { await run(); results.push({ name, passed: true }); console.log('PASS', name) }
  catch (error) { results.push({ name, passed: false, error: error.message }); console.log('FAIL', name, error.message) }
}
for (const width of [390, 768, 1440]) {
  const context = await browser.newContext({ viewport: { width, height: width === 390 ? 844 : 1024 }, hasTouch: width === 390 })
  const page = await context.newPage()
  page.on('pageerror', e => errors.push({ width, type: 'pageerror', message: e.message }))
  page.on('console', e => { if (e.type() === 'error') errors.push({ width, type: 'console', message: e.text() }) })
  for (const [name, route] of [['home','/'], ['product','/product/shams'], ['journey','/journey/shams'], ['layering','/layering']]) {
    await check(`${width}: ${name} direct/reload/RTL/overflow/screenshot`, async () => {
      await page.goto(base + route); await expect(page.locator('main')).toBeVisible()
      await page.reload(); await expect(page.locator('main h1')).toBeVisible()
      if (name === 'product') { await expect(page.locator('canvas')).toBeVisible(); await page.waitForTimeout(1800) }
      await page.evaluate(() => globalThis.document.fonts.ready)
      expect(await page.locator('html').getAttribute('dir')).toBe('rtl')
      expect(await page.evaluate(() => globalThis.document.documentElement.scrollWidth <= globalThis.innerWidth)).toBe(true)
      await page.screenshot({ path: `verification/screenshots/${name}-${width}.png`, fullPage: true, animations: 'disabled' })
    })
  }
  await check(`${width}: search, filters, empty, reset, sorting`, async () => {
    await page.goto(base+'/shop')
    const input=page.getByRole('textbox', { name:'البحث في المجموعة' })
    for (const term of ['شمس','SHAMS']) { await input.fill(term); await expect(page.locator('.product-card')).toHaveCount(1) }
    await input.fill('no-match'); await expect(page.locator('.empty-results')).toBeVisible()
    await page.locator('.empty-results button').click(); await expect(page.locator('.product-card')).toHaveCount(6)
    await page.getByRole('combobox', {name:'نوع المنتج'}).selectOption('oil'); await expect(page.locator('.product-card')).toHaveCount(2)
    await page.getByRole('combobox', {name:'العائلة العطرية'}).selectOption('فانيلا'); await expect(page.locator('.product-card')).toHaveCount(1)
    await page.getByRole('combobox', {name:'نوع المنتج'}).selectOption('all')
    await page.getByRole('combobox', {name:'العائلة العطرية'}).selectOption('all')
    await page.getByRole('combobox', {name:'ترتيب المنتجات'}).selectOption('price-up')
    await expect(page.locator('.product-card').first()).toContainText('OIL')
  })
  await check(`${width}: variants/cart/quantities/favorites/reload/Escape/focus`, async () => {
    await page.goto(base+'/product/shams')
    await page.getByRole('button',{name:'حفظ في المفضلة',exact:true}).click()
    for (const [size,price] of [[15,80],[30,110],[50,150],[100,200]]) {
      await page.getByRole('button',{name:`${size} ml`,exact:true}).click()
      await expect(page.locator('.price-row strong')).toContainText(String(price))
    }
    const add=page.getByRole('button',{name:'أضف إلى الحقيبة',exact:true})
    await page.getByRole('button',{name:'15 ml',exact:true}).click(); await add.click()
    await expect(page.locator('dialog[open] .cart-line')).toHaveCount(1)
    await page.keyboard.press('Escape'); await expect(add).toBeFocused()
    await page.getByRole('button',{name:'50 ml',exact:true}).click()
    await page.getByRole('button',{name:'زيادة الكمية',exact:true}).click(); await add.click()
    await expect(page.locator('.cart-summary strong')).toContainText('380')
    await page.getByRole('button',{name:'زيادة كمية SHAMS 50 مل',exact:true}).click()
    await expect(page.locator('.cart-summary strong')).toContainText('530')
    await page.getByRole('button',{name:'حذف SHAMS 15 مل',exact:true}).click()
    await expect(page.locator('.cart-summary strong')).toContainText('450')
    await page.keyboard.press('Escape'); await page.reload()
    await expect(page.getByRole('button',{name:'إزالة من المفضلة',exact:true})).toBeVisible()
    const bag=page.getByRole('button',{name:'حقيبة التسوق (3)',exact:true}); await bag.click()
    await expect(page.locator('.cart-line')).toHaveCount(1); await expect(page.locator('.cart-line')).toContainText('50 ml')
    await expect(page.locator('.cart-summary strong')).toContainText('450')
    await page.keyboard.press('Escape'); await expect(bag).toBeFocused()
    const search=page.getByRole('button',{name:'البحث عن عطر',exact:true}); await search.click()
    await expect(page.locator('#global-search')).toBeFocused(); await page.keyboard.press('Escape'); await expect(search).toBeFocused()
  })
  await check(`${width}: layering and unavailable pair`, async () => {
    await page.goto(base+'/layering'); await page.getByRole('button',{name:'100 ml',exact:true}).click()
    await expect(page.locator('.pair-total')).toContainText('245')
    await page.getByRole('button',{name:'أضف التنسيق إلى الحقيبة',exact:true}).click()
    await expect(page.locator('.cart-lines')).toContainText('100 ml'); await expect(page.locator('.cart-lines')).toContainText('5 ml')
    await page.keyboard.press('Escape')
    await page.getByRole('combobox',{name:'الزيت العطري',exact:true}).selectOption('dimashq-oil')
    await expect(page.getByRole('button',{name:'لا يوجد تنسيق مدرج',exact:true})).toBeDisabled()
    await page.getByRole('combobox',{name:'العطر الأساسي',exact:true}).selectOption('jawa')
    await page.getByRole('combobox',{name:'الزيت العطري',exact:true}).selectOption('vanilla-oil')
    await expect(page.getByRole('button',{name:'التنسيق غير متوفر',exact:true})).toBeDisabled()
  })
  await check(`${width}: journey slider, favorites dialog and keyboard focus trap`, async () => {
    await page.goto(base+'/journey/shams')
    const buttons=page.locator('.journey-slider button')
    for(let i=0;i<3;i++){await buttons.nth(i).click();await expect(buttons.nth(i)).toHaveAttribute('aria-pressed','true');await expect(page.locator('#journey-range')).toHaveValue(String(i))}
    await page.locator('#journey-range').focus();await page.keyboard.press('Home');await expect(page.locator('#journey-range')).toHaveValue('0')
    const trigger=width===390?page.getByRole('button',{name:'فتح القائمة',exact:true}):page.locator('.header-favorite')
    await trigger.click()
    if(width===390) await page.getByRole('button',{name:/^المفضلة/}).click()
    await expect(page.locator('.favorites-dialog[open]')).toBeVisible()
    for(let i=0;i<12;i++){await page.keyboard.press('Tab');expect(await page.evaluate(()=>!!globalThis.document.activeElement.closest('dialog[open]'))).toBe(true)}
    await page.keyboard.press('Escape');await expect(trigger).toBeFocused()
  })
  await check(`${width}: WebGL interaction stress/reset/notes/navigation/fallback/reduced motion`, async () => {
    await page.goto(base+'/product/shams'); await expect(page.locator('canvas')).toBeVisible()
    await page.waitForTimeout(1500)
    const scene=page.locator('.scene-canvas'); await scene.scrollIntoViewIfNeeded()
    const box=await scene.boundingBox(); const x=box.x+box.width*.5, y=box.y+box.height*.4
    await page.mouse.move(x,y); await page.mouse.down(); await page.mouse.move(x+100,y+3,{steps:12}); await page.mouse.up()
    await expect(page.locator('.scene-state')).toContainText('الغطاء مغلق')
    for(let i=0;i<10;i++) await page.locator('.scene-tools button').nth(1).click()
    await expect(page.locator('.scene-state')).toContainText('الغطاء مغلق')
    for(let i=0;i<30;i++) await page.locator('.scene-tools button').nth(2).click()
    await page.locator('.scene-tools button').nth(3).click()
    for(const n of ['الفانيلا','العسل','الباتشولي','البودرة','السكر البني']) await page.locator('.notes-row').getByRole('button',{name:n,exact:true}).click()
    await page.getByRole('button',{name:'إعادة ضبط المشهد',exact:true}).click()
    await expect(page.locator('.scene-state')).toContainText('الغطاء مغلق'); await expect(page.locator('.scene-note-orbit')).toHaveCount(0)
    await page.getByRole('link',{name:/من أول انطباع/}).click(); await expect(page).toHaveURL(/journey\/shams/)
    await page.goBack(); await expect(page.locator('canvas')).toBeVisible()
    await page.emulateMedia({reducedMotion:'reduce'})
    await page.locator('.scene-tools button').nth(1).click(); await page.getByRole('button',{name:'إعادة ضبط المشهد',exact:true}).click()
    await page.goto(base+'/product/shams?webgl=off'); await expect(page.locator('.scene-fallback')).toBeVisible(); await expect(page.locator('canvas')).toHaveCount(0)
    await page.getByRole('button',{name:'30 ml',exact:true}).click(); await expect(page.locator('.price-row')).toContainText('110')
  })
  await context.close()
}
await browser.close()
await writeFile('verification/browser-results.json', JSON.stringify({base,results,errors},null,2))
if(results.some(r=>!r.passed)||errors.length) process.exitCode=1

