import { chromium, expect } from '@playwright/test'
import { PerspectiveCamera, Vector3 } from 'three'
import { writeFile } from 'node:fs/promises'
const browser=await chromium.launch({channel:'msedge',headless:true})
const context=await browser.newContext({viewport:{width:390,height:844},hasTouch:true})
const page=await context.newPage(), results=[], errors=[]
page.on('pageerror',e=>errors.push(e.message))
page.on('console',e=>{if(e.type()==='error')errors.push(e.text())})
async function check(name,run){try{await run();results.push({name,passed:true});console.log('PASS',name)}catch(e){results.push({name,passed:false,error:e.message});console.log('FAIL',name,e.message)}}
await page.addInitScript(() => {
  globalThis.qaTimeouts=[]
  const timeout=globalThis.setTimeout
  globalThis.setTimeout=function(handler,delay,...args){globalThis.qaTimeouts.push(delay);return timeout(handler,delay,...args)}
  const live={buffers:new Set(),textures:new Set(),programs:new Set()}
  for(const [name,kind] of [['Buffer','buffers'],['Texture','textures'],['Program','programs']]){
    const proto=globalThis.WebGL2RenderingContext.prototype, create=proto['create'+name], dispose=proto['delete'+name]
    proto['create'+name]=function(...args){const result=create.apply(this,args);if(result)live[kind].add(result);return result}
    proto['delete'+name]=function(value){live[kind].delete(value);return dispose.call(this,value)}
  }
  globalThis.qaGpuCounts=()=>Object.fromEntries(Object.entries(live).map(([key,set])=>[key,set.size]))
})
await page.goto('http://127.0.0.1:4180/product/shams')
await expect(page.locator('canvas')).toBeVisible(); await page.waitForTimeout(1500)
const scene=page.locator('.scene-canvas'), canvas=page.locator('canvas')
async function projected(y){const box=await canvas.boundingBox();const camera=new PerspectiveCamera(39,box.width/box.height,.1,1000);camera.position.set(3.6,2.1,8);camera.lookAt(0,.25,0);camera.updateMatrixWorld();const p=new Vector3(0,y,0).project(camera);return {x:box.x+(p.x+1)*box.width/2,y:box.y+(1-p.y)*box.height/2}}
const reset=()=>page.getByRole('button',{name:'إعادة ضبط المشهد',exact:true}).click()
await check('repeat spray during opening preserves the remaining opening delay',async()=>{
  await reset();await page.evaluate(()=>{globalThis.qaTimeouts=[]})
  await page.locator('.scene-tools button').nth(2).click()
  await page.locator('.scene-tools button').nth(2).click()
  const delays=await page.evaluate(()=>globalThis.qaTimeouts.filter(n=>n>100&&n<=650))
  expect(delays.length).toBeGreaterThanOrEqual(2)
  await reset()
})
await check('cap mesh click and drag starting over cap',async()=>{
  await scene.scrollIntoViewIfNeeded();const p=await projected(1.5)
  await page.mouse.click(p.x,p.y);await expect(page.locator('.scene-state')).toContainText('الغطاء مفتوح')
  await reset(); await page.waitForTimeout(200);await scene.scrollIntoViewIfNeeded();const start=await projected(1.5)
  await page.mouse.move(start.x,start.y);await page.mouse.down();await page.mouse.move(start.x+90,start.y,{steps:12});await page.mouse.up()
  await expect(page.locator('.scene-state')).toContainText('الغطاء مغلق')
  await canvas.screenshot({path:'verification/screenshots/scene-rotated.png'})
  await reset();await page.waitForTimeout(100);await canvas.screenshot({path:'verification/screenshots/scene-reset.png'})
})
await check('nozzle drag while open does not trigger cap toggle',async()=>{
  await page.locator('.scene-tools button').nth(1).click();await page.waitForTimeout(900);await scene.scrollIntoViewIfNeeded()
  const p=await projected(1.08);await page.mouse.move(p.x,p.y);await page.mouse.down();await page.mouse.move(p.x-90,p.y,{steps:12});await page.mouse.up()
  await expect(page.locator('.scene-state')).toContainText('الغطاء مفتوح');await reset()
})
const cdp=await context.newCDPSession(page)
async function touch(x,y,dx,dy){await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x,y}]});for(let i=1;i<=12;i++){await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:x+dx*i/12,y:y+dy*i/12}]});await page.waitForTimeout(20)}await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await page.waitForTimeout(250)}
await check('emulated touch horizontal rotation and vertical page scroll',async()=>{
  await scene.scrollIntoViewIfNeeded();const p=await projected(.5), before=await page.evaluate(()=>globalThis.scrollY)
  await touch(p.x,p.y,90,0);expect(Math.abs(await page.evaluate(()=>globalThis.scrollY)-before)).toBeLessThan(3)
  await reset();await scene.scrollIntoViewIfNeeded();const q=await projected(.5), start=await page.evaluate(()=>globalThis.scrollY)
  await touch(q.x,q.y,0,-130);expect(await page.evaluate(()=>globalThis.scrollY)).toBeGreaterThan(start+30)
})
await check('reset cancels pending opening spray; repeat reset during spray and rotation',async()=>{
  await reset();await page.locator('.scene-tools button').nth(2).click();await reset();await page.waitForTimeout(800)
  await expect(page.locator('.scene-state')).toContainText('الغطاء مغلق')
  await page.locator('.scene-tools button').nth(2).click();await page.waitForTimeout(700);await reset()
  await page.locator('.scene-tools button').nth(0).click();await reset();await expect(page.locator('.scene-state')).toContainText('الغطاء مغلق')
})
await check('30 sprays reuse GPU buffers, textures and programs',async()=>{
  await reset();await page.locator('.scene-tools button').nth(2).click();await page.waitForTimeout(1600)
  const before=await page.evaluate(()=>globalThis.qaGpuCounts())
  for(let i=0;i<30;i++)await page.locator('.scene-tools button').nth(2).click()
  await page.waitForTimeout(1600)
  const after=await page.evaluate(()=>globalThis.qaGpuCounts())
  expect(after).toEqual(before);results.push({name:'GPU live resources before/after sprays',before,after,passed:true})
  await reset()
})
await check('context loss activates fallback',async()=>{
  await page.evaluate(()=>{const c=globalThis.document.querySelector('canvas');c.getContext('webgl2').getExtension('WEBGL_lose_context').loseContext()})
  await expect(page.locator('.scene-fallback')).toBeVisible()
})
for(const mode of ['retry','empty']) await check(`catalog ${mode} and retry to ready`,async()=>{
  await page.goto(`http://127.0.0.1:5180/verification/catalog-harness.html?mode=${mode}`)
  await expect(page.getByRole('status')).toContainText('جارٍ تحميل')
  await expect(page.getByRole('heading')).toContainText(mode==='retry'?'تعذر تحميل':'المجموعة غير متاحة')
  await page.getByRole('button',{name:'إعادة المحاولة'}).click();await expect(page.getByRole('heading')).toHaveText('loaded 6')
})
await browser.close();await writeFile('verification/scene-results.json',JSON.stringify({results,errors},null,2));if(results.some(r=>!r.passed)||errors.length)process.exitCode=1
