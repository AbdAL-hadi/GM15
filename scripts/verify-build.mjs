import { readFile, readdir, stat, writeFile, mkdir } from 'node:fs/promises'
import { join, relative } from 'node:path'
const origin=process.argv[2]??'http://127.0.0.1:4173'
const routes=['/','/shop','/shop?q=shams','/product/shams','/product/vanilla-oil','/journey/shams','/layering','/about','/product/missing','/missing-route']
const results=[]
for(const route of routes){
  const response=await fetch(new URL(route,origin));const html=await response.text()
  if(!response.ok||!html.includes('id="root"')||!html.includes('dir="rtl"'))throw new Error(`Route shell failed: ${route} (${response.status})`)
  results.push({route,status:response.status,check:'Vite SPA shell served; browser interaction not tested'})
}
async function files(dir){const output=[];for(const item of await readdir(dir)){const path=join(dir,item);if((await stat(path)).isDirectory())output.push(...await files(path));else output.push(path)}return output}
const built=await files('dist');let assets=0
for(const file of built){
  const path='/'+relative('dist',file).replaceAll('\\','/')
  const response=await fetch(new URL(path,origin));if(!response.ok)throw new Error(`Missing asset: ${path}`)
  if(path.endsWith('.js')&&!response.headers.get('content-type')?.includes('javascript'))throw new Error(`Wrong JS content type: ${path}`)
  assets++
}
const html=await readFile('dist/index.html','utf8')
if(html.includes('BottleScene'))throw new Error('Heavy scene incorrectly preloaded on every page')
const jsFiles=built.filter(f=>f.endsWith('.js'))
for(const path of jsFiles){
  const content=await readFile(path,'utf8')
  if(/https?:\/\/[^"'`\s]+\.(?:hdr|glb|gltf|woff2?|png|jpe?g|webp)/i.test(content))throw new Error(`Unexpected external runtime asset in ${path}`)
}
const report={checkedAt:new Date().toISOString(),origin,routes:results,assetsChecked:assets,localFonts:true,sceneLoadedLazily:true,scope:'HTTP and artifact checks only. No browser, WebGL, pointer, layout or console verification.'}
await mkdir('verification',{recursive:true});await writeFile('verification/http-check.json',JSON.stringify(report,null,2)+'\n')
console.log(JSON.stringify(report,null,2))
