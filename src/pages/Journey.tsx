import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Info } from 'lucide-react'
import { BottleArt } from '../components/BottleArt'
import { NoteArt } from '../components/NoteArt'
import { NotFound } from '../components/UI'
import { stages, journeyDisclaimer } from '../data/journey'
import { notes } from '../data/products'
export default function Journey() {
  const {slug}=useParams(); const [stage,setStage]=useState(0)
  if(slug!=='shams')return <NotFound product/>
  const current=stages[stage]
  return <main className="journey-page"><div className="section journey-header"><Link to="/product/shams" className="text-link"><ArrowRight size={16}/> العودة إلى شمس</Link><span className="eyebrow">AN UNFOLDING STORY</span><h1>الرائحة لا تبقى كما بدأت.</h1><p>كل عطر حكاية تتكشف. اكتشف طبقات شمس، من الانطباع الأول إلى عمق الرائحة.</p></div><section className="journey-layout"><div className="journey-visual" style={{'--stage-color':current.color} as React.CSSProperties}><div className="journey-halo"/><BottleArt name="SHAMS" color={current.color} reflection/><span className="journey-watermark" dir="ltr">{String(stage+1).padStart(2,'0')}</span><div key={current.id} className="journey-visual-notes">{current.notes.map(n=><NoteArt key={n} note={n}/>)}</div></div><div className="journey-content"><div className="journey-stage-indicator"><span dir="ltr">0{stage+1}</span><span>/ 03</span></div><div key={current.id} className="journey-stage-copy" aria-live="polite"><span className="eyebrow">{current.english}</span><h2>{current.title}</h2><p className="journey-description">{current.description}</p><div className="journey-notes">{current.notes.map(n=><div key={n}><NoteArt note={n}/><div><h3>{notes[n].name}</h3><p>{notes[n].description}</p></div></div>)}</div></div><div className="journey-slider"><label htmlFor="journey-range">تنقّل عبر مراحل الرائحة</label><input id="journey-range" type="range" min="0" max="2" step="1" value={stage} aria-valuetext={current.title} onChange={e=>setStage(Number(e.target.value))}/><div>{stages.map((s,i)=><button className={stage===i?'active':''} key={s.id} onClick={()=>setStage(i)} aria-pressed={stage===i}><span>0{i+1}</span>{s.title}</button>)}</div></div><div className="notice journey-notice"><Info size={17}/><p><strong>{journeyDisclaimer}.</strong><br/>لا يحدد وصف Shams الرسمي ترتيب النوتات. هذه قراءة بصرية تخيّلية، وليست محاكاة علمية لتبخر العطر أو بيانًا لمدة ثباته.</p></div><a href="https://thetia.shop/en/shop/shams/" target="_blank" rel="noreferrer" className="source-link">مصدر النوتات: وصف Shams الرسمي</a><Link to="/layering" className="text-link">أضف لمستك إلى الحكاية <ArrowLeft size={17}/></Link></div></section></main>
}
