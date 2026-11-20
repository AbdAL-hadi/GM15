import { chromium, expect } from '@playwright/test'
import { mkdir, writeFile } from 'node:fs/promises'
const browser=await chromium.launch({channel:'msedge',headless:true})
const results=[],errors=[]
await mkdir('verification/screenshots',{recursive:true})
async function check(name,fn){try{await fn();results.push({name,passed:true});console.log('PASS',name)}catch(e){results.push({name,passed:false,error:e.message});console.log('FAIL',name,e.message)}}
for(const width of [1440,390]){
  const context=await browser.newContext({viewport:{width,height:900}}),page=await context.newPage()
  page.on('pageerror',e=>errors.push(e.message));page.on('console',e=>{if(e.type()==='error')errors.push(e.text())})
  await check(`${width} direct result without answers`,async()=>{await page.goto('http://127.0.0.1:4181/discover/results');await expect(page.getByRole('heading',{name:'ابدأ باكتشاف ذوقك'})).toBeVisible()})
  await check(`${width} complete journey, persistence, product and layering`,async()=>{
    await page.goto('http://127.0.0.1:4181/')
    await page.getByRole('link',{name:/اكتشف ذوقك بخمس خطوات/}).click()
    await expect(page).toHaveURL(/\/discover$/)
    await expect(page.getByRole('heading',{name:'أي أجواء أقرب لذوقك؟'})).toBeVisible()
    await page.getByRole('button',{name:'التالي'}).click();await expect(page.getByRole('alert')).toContainText('اختر')
    const vanilla=page.getByRole('button',{name:'دفء الفانيلا'});await vanilla.click();await expect(vanilla).toHaveAttribute('aria-pressed','true');await page.screenshot({path:`verification/screenshots/discover-step1-${width}.png`,fullPage:true,animations:'disabled'});await vanilla.click();await expect(vanilla).toHaveAttribute('aria-pressed','false');await vanilla.click()
    await page.getByRole('button',{name:'حديقة الياسمين'}).click()
    await page.getByRole('button',{name:'التالي'}).click();await expect(page.getByRole('heading',{name:'شو الروائح اللي بتحبها؟'})).toBeVisible()
    await page.reload();await expect(page.getByRole('heading',{name:'شو الروائح اللي بتحبها؟'})).toBeVisible()
    await page.getByRole('button',{name:'فانيلا',exact:true}).click();await page.getByRole('button',{name:'بودرة',exact:true}).click();await page.getByRole('button',{name:'التالي'}).click()
    await page.getByRole('button',{name:'فانيلا',exact:true}).click();await page.getByRole('button',{name:'التالي'}).click();await expect(page.getByRole('alert').first()).toContainText('تعارض')
    await page.getByRole('button',{name:'فانيلا',exact:true}).click();await page.getByRole('button',{name:'ما عندي تفضيل'}).click();await page.getByRole('button',{name:'التالي'}).click()
    await page.getByRole('button',{name:'بدون تفضيل'}).click();await page.getByRole('button',{name:'التالي'}).click()
    await page.getByRole('button',{name:'100–150 ₪'}).click();await page.getByRole('button',{name:'اكتشف اقتراحاتي'}).click()
    await expect(page.getByRole('heading',{name:'رائحة أقرب لذوقك'})).toBeVisible()
    await expect(page.locator('.results-copy h2')).toHaveText('SHAMS');await expect(page.locator('.results-size')).toContainText('50 ml')
    await page.screenshot({path:`verification/screenshots/discover-results-${width}.png`,fullPage:true,animations:'disabled'})
    await page.getByRole('button',{name:'احفظ النتيجة'}).click();await expect(page.locator('.results-actions [role=status]')).toContainText('حُفظت')
    await page.reload();await expect(page.locator('.results-copy h2')).toHaveText('SHAMS')
    await page.getByRole('link',{name:'استكشف العطر'}).click();await expect(page.locator('.sizes button.active')).toContainText('50 ml');await expect(page.locator('canvas')).toBeVisible()
    await page.goBack();await page.getByRole('link',{name:/اكتشف التنسيق المناسب/}).click();await expect(page).toHaveURL(/perfume=shams.*oil=vanilla-oil/)
    await page.goBack();await page.getByRole('link',{name:'عدّل اختياراتك'}).click();await expect(page.getByRole('heading',{name:'شو الميزانية المناسبة إلك؟'})).toBeVisible()
  })
  await check(`${width} no results and restart only discovery storage`,async()=>{
    await page.getByRole('button',{name:'أكثر من 200 ₪'}).click()
    await page.getByRole('button',{name:'اكتشف اقتراحاتي'}).click()
    await expect(page.getByRole('heading',{name:'ما لقينا اقتراحًا مناسبًا حاليًا'})).toBeVisible()
    await page.screenshot({path:`verification/screenshots/discover-empty-${width}.png`,fullPage:true,animations:'disabled'})
    await page.getByRole('link',{name:/عدّل اختياراتك/}).click()
    await page.getByRole('button',{name:'إعادة البدء'}).click()
    await expect(page.getByRole('heading',{name:'أي أجواء أقرب لذوقك؟'})).toBeVisible()
  })
  await check(`${width} invalid storage and no overflow`,async()=>{
    await page.evaluate(()=>localStorage.setItem('thetia-discover-v1','{"version":0,"step":4}'))
    await page.reload();await expect(page.getByRole('heading',{name:'أي أجواء أقرب لذوقك؟'})).toBeVisible()
    expect(await page.evaluate(()=>globalThis.document.documentElement.scrollWidth<=globalThis.innerWidth)).toBe(true)
  })
  await context.close()
}
await browser.close();await writeFile('verification/discovery-browser-results.json',JSON.stringify({results,errors},null,2));if(results.some(r=>!r.passed)||errors.length)process.exitCode=1





