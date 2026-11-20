import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useCatalog } from '../state/Catalog'
import { BottleArt } from '../components/BottleArt'
import { NotFound } from '../components/UI'
export default function Journey(){
 const {slug}=useParams(),{getProduct}=useCatalog(),[stage,setStage]=useState(0)
 const product=getProduct(slug??'')
 if(!product?.pyramid)return <NotFound product/>
 const stages=[{title:'المقدمة',notes:product.pyramid.top},{title:'القلب',notes:product.pyramid.heart},{title:'القاعدة',notes:product.pyramid.base}],current=stages[stage]
 return <main className="journey-page"><div className="section journey-header"><Link to={`/product/${product.slug}`}>العودة إلى {product.arabicName}</Link><h1>رحلة رائحة {product.arabicName}</h1><p>اكتشف طبقات الرائحة، من المقدمة إلى القاعدة.</p></div><section className="journey-layout"><div className="journey-visual"><BottleArt name={product.name}/></div><div className="journey-content"><h2 aria-live="polite">{current.title}</h2><div className="journey-notes">{current.notes.map(n=><div key={n}><span aria-hidden="true">○</span><h3>{n}</h3></div>)}</div><div className="journey-slider"><label htmlFor="journey-range">تنقّل عبر مراحل الرائحة</label><input id="journey-range" type="range" min="0" max="2" value={stage} onChange={e=>setStage(Number(e.target.value))}/><div>{stages.map((s,i)=><button key={s.title} aria-pressed={stage===i} onClick={()=>setStage(i)}>{s.title}</button>)}</div></div><p className="notice">عرض بصري للنوتات، وليس محاكاة علمية لتبخر العطر. النوتات تصف الرائحة وليست قائمة المكونات الفعلية.</p></div></section></main>
}
