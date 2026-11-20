import { chromium,expect } from '@playwright/test'
const browser=await chromium.launch({channel:'msedge',headless:true})
for(const width of [1440,390]){
 const page=await browser.newPage({viewport:{width,height:900}}),errors=[]
 page.on('pageerror',e=>errors.push(e.message))
 const measure=()=>page.evaluate(()=>{const css=s=>{const e=globalThis.document.querySelector(s);if(!e)return null;const x=globalThis.getComputedStyle(e);return {font:x.fontFamily,weight:x.fontWeight,color:x.color,background:x.backgroundColor,height:x.height}};return {header:css('.header'),logo:css('.wordmark'),nav:css('.desktop-nav a.active'),count:css('.count'),title:css('.discover-intro h1'),question:css('.discover-intro h2'),choice:css('.discover-choice'),progress:css('.discover-progress i.active'),imageFilter:globalThis.document.querySelector('.discover-picture img')?globalThis.getComputedStyle(globalThis.document.querySelector('.discover-picture img')).filter:null,overflow:globalThis.document.documentElement.scrollWidth>globalThis.innerWidth,fontsReady:globalThis.document.fonts.check('700 16px Tajawal')}})
 await page.goto('http://127.0.0.1:4184/product/ward')
 await page.getByRole('button',{name:'أضف إلى الحقيبة'}).click();await page.keyboard.press('Escape')
 await page.goto('http://127.0.0.1:4184/')
 await page.evaluate(()=>globalThis.document.fonts.ready);const home=await measure()
 await page.goto('http://127.0.0.1:4184/discover')
 await page.evaluate(()=>globalThis.document.fonts.ready);const first=await measure()
 for(const key of ['header','logo','count'])expect(first[key]).toEqual(home[key])
 expect(first.fontsReady).toBe(true);expect(first.overflow).toBe(false);expect(first.imageFilter).toBe('none')
 await page.getByRole('button',{name:'دفء الفانيلا'}).click()
 await page.getByRole('button',{name:'التالي'}).click()
 const second=await measure();expect(second.imageFilter).toBe('none')
 await page.getByRole('button',{name:'فانيلا',exact:true}).click()
 await page.getByRole('button',{name:'التالي'}).click()
 await page.getByRole('button',{name:'ما عندي تفضيل'}).click()
 await page.getByRole('button',{name:'التالي'}).click()
 const fourth=await measure();expect(fourth.choice.font).toContain('Tajawal');expect(fourth.choice.color).toBe('rgb(17, 17, 17)');expect(fourth.progress.background).toBe('rgb(17, 17, 17)')
 await page.evaluate(()=>globalThis.scrollTo(0,0));await page.screenshot({path:`verification/screenshots/discover-theme-step4-${width}.png`,fullPage:false})
 await page.getByRole('button',{name:'بدون تفضيل'}).click();await page.getByRole('button',{name:'التالي'}).click()
 await page.getByRole('button',{name:'بدون تحديد'}).click();await page.getByRole('button',{name:'اكتشف اقتراحاتي'}).click()
 await expect(page.getByRole('heading',{name:'رائحة أقرب لذوقك'})).toBeVisible()
 const result=await measure();for(const key of ['header','logo','count'])expect(result[key]).toEqual(home[key]);expect(result.overflow).toBe(false)
 expect(await page.locator('.results-visual img').evaluate(i=>globalThis.getComputedStyle(i).filter)).toBe('none')
 await page.screenshot({path:`verification/screenshots/discover-theme-result-${width}.png`,fullPage:false})
 await page.getByRole('link',{name:'عدّل اختياراتك'}).click();await expect(page.getByRole('heading',{name:'شو الميزانية المناسبة إلك؟'})).toBeVisible()
 expect(errors).toEqual([])
 console.log(width,JSON.stringify({home,first,fourth,result}))
 await page.close()
}
await browser.close()



