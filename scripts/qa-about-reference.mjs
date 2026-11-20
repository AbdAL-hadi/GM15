import { chromium,expect } from '@playwright/test'
const browser=await chromium.launch({channel:'msedge',headless:true})
for(const [width,height] of [[1440,900],[390,844]]){
 const page=await browser.newPage({viewport:{width,height}}),errors=[]
 page.on('pageerror',e=>errors.push(e.message))
 await page.goto('http://127.0.0.1:4182/about')
 await expect(page.locator('.desktop-nav a[href="/about"]')).toHaveAttribute('aria-current','page')
 await expect(page.locator('.about-feature-image img')).toHaveAttribute('src','/products/ward.jpg')
 expect(await page.locator('.about-feature-image img').evaluate(i=>i.complete&&i.naturalWidth>0)).toBe(true)
 expect(await page.evaluate(()=>globalThis.document.documentElement.scrollWidth<=globalThis.innerWidth)).toBe(true)
 await page.screenshot({path:`verification/screenshots/about-reference-${width}.png`,fullPage:false})
 await page.getByRole('link',{name:'اكتشف عطرك'}).click();await expect(page).toHaveURL(/\/discover/)
 await page.goBack();await page.getByRole('link',{name:'تصفّح المجموعة'}).click();await expect(page).toHaveURL(/\/shop/)
 await page.goBack();await page.getByRole('link',{name:/استكشف النوتات/}).click();await expect(page).toHaveURL(/\/journey\/ward/)
 await page.goto('http://127.0.0.1:4182/about#sources');await expect(page.locator('#sources')).toBeVisible()
 expect(errors).toEqual([])
 console.log(`PASS about ${width}x${height}`)
 await page.close()
}
await browser.close()
