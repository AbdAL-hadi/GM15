import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, ArrowUpLeft, ChevronLeft, Droplets, Expand, Info, Minus, Plus, RotateCcw, RotateCw, ShoppingBag, Sparkles } from 'lucide-react'
import { defaultSize, getProduct, getVariant, money, notes } from '../data/products'
import type { NoteId } from '../data/products'
import { useStore } from '../state/Store'
import { BottleArt } from '../components/BottleArt'
import { NoteArt } from '../components/NoteArt'
import { AssetBoundary, FavoriteButton, NotFound } from '../components/UI'
const BottleScene = lazy(()=>import('../scene/BottleScene'))
export default function Product() {
  const { slug }=useParams(); const product=getProduct(slug??'')
  if(!product)return <NotFound product/>
  return <ProductExperience key={product.id} id={product.id}/>
}
function ProductExperience({id}:{id:string}) {
  const product=getProduct(id)!
  const [size,setSize]=useState<number|undefined>(defaultSize(product))
  const [quantity,setQuantity]=useState(1)
  const [capOpen,setCapOpen]=useState(false); const [sprayId,setSprayId]=useState(0)
  const [angle,setAngle]=useState(0); const [resetKey,setResetKey]=useState(0)
  const [explore,setExplore]=useState(false); const [selectedNote,setSelectedNote]=useState<NoteId>('vanilla')
  const sprayTimer=useRef<ReturnType<typeof setTimeout>|undefined>(undefined)
  const {dispatch,setCartOpen,notify}=useStore()
  const variant=size===undefined?undefined:getVariant(product,size)
  useEffect(()=>()=>clearTimeout(sprayTimer.current),[])
  const toggleCap=()=>{clearTimeout(sprayTimer.current);setCapOpen(open=>!open)}
  const spray=()=>{clearTimeout(sprayTimer.current);if(!capOpen){setCapOpen(true);notify('فتحنا الغطاء لتجربة الرشّة. الرذاذ تمثيل بصري فقط.');sprayTimer.current=setTimeout(()=>setSprayId(n=>n+1),650)}else setSprayId(n=>n+1)}
  const reset=()=>{clearTimeout(sprayTimer.current);setCapOpen(false);setSprayId(0);setAngle(0);setExplore(false);setResetKey(n=>n+1)}
  const add=()=>{if(!variant){notify('اختر حجمًا أولًا');return}if(!variant.available)return;dispatch({type:'add',lines:[{productId:id,size:variant.size,quantity}]});setCartOpen(true)}
  const isPerfume=product.type==='perfume'
  return <main className="product-page"><div className="breadcrumbs"><Link to="/">الرئيسية</Link><ChevronLeft size={13}/><Link to="/shop">{isPerfume?'العطور':'الزيوت'}</Link><ChevronLeft size={13}/><span dir="ltr">{product.name}</span></div><div className="product-layout"><section className={`product-stage ${explore?'exploring':''}`} aria-label="تجربة العبوة"><div className="stage-topline"><span className="eyebrow">THE SCENT, IN EVERY DIMENSION</span><span className="stage-badge"><span/> {isPerfume?'تجربة تفاعلية':'الزيت العطري'}</span></div>{isPerfume?<AssetBoundary fallback={<div className="scene-fallback"><BottleArt name={product.name} color={product.color}/><p>تعذر تحميل المشهد. يمكنك متابعة التسوق وقراءة النوتات.</p></div>}><Suspense fallback={<div className="scene-loading"><span/> جارٍ تحميل المشهد…</div>}><BottleScene name={product.name} color={product.color} capOpen={capOpen} sprayId={sprayId} angle={angle} onAngleChange={setAngle} onCapToggle={toggleCap} onSpray={spray} resetKey={resetKey} explore={explore}/></Suspense></AssetBoundary>:<div className="oil-stage"><BottleArt name={product.name} color={product.color} oil/></div>}
      {explore&&product.notes.length>0&&<div className="scene-note-orbit">{product.notes.map((n,i)=><button style={{'--note-index':i} as React.CSSProperties} className={`scene-note ${selectedNote===n?'active':''}`} key={n} aria-pressed={selectedNote===n} onClick={()=>setSelectedNote(n as NoteId)}><NoteArt note={n as NoteId}/><span>{notes[n as NoteId].name}</span></button>)}</div>}
      {isPerfume&&<><div className="stage-drag-hint"><RotateCw size={17}/><span>اسحب لاكتشاف كل زاوية</span><bdi>360°</bdi></div><div className="scene-tools"><button onClick={()=>setAngle(a=>a+.5)} aria-label="تدوير العبوة"><RotateCw size={19}/><span>تدوير</span></button><button onClick={toggleCap} aria-pressed={capOpen}><Expand size={19}/><span>{capOpen?'أغلق الغطاء':'افتح الغطاء'}</span></button><button onClick={spray}><Droplets size={19}/><span>جرّب الرشّة</span></button>{product.notes.length>0&&<button onClick={()=>setExplore(v=>!v)} aria-pressed={explore}><Sparkles size={19}/><span>النوتات</span></button>}<button onClick={reset} aria-label="إعادة ضبط المشهد"><RotateCcw size={18}/><span>إعادة الضبط</span></button></div><p className="scene-state" role="status">{capOpen?'الغطاء مفتوح · جاهز لتجربة الرشّة':'الغطاء مغلق'}<span> · نموذج بصري تجريبي</span></p></>}
    </section><section className="product-details"><span className="eyebrow">A LITTLE SUNSHINE, JUST FOR YOU</span><div className="product-title-row"><h1 dir="ltr">{product.name}</h1><FavoriteButton id={id}/></div><div className="product-subtitle"><span>{product.arabicName}</span><i/><span>{isPerfume?'أو دو بارفان':'زيت عطري · رول أون'}</span></div><p className="product-description">{product.description}</p>{product.contentStatus==='demo'&&<p className="data-caption align-start">وصف وتصنيف توضيحيان، يحتاجان اعتماد ذاتية.</p>}
      {product.notes.length>0?<div className="product-notes"><div className="subheading"><h2>ملامح الرائحة</h2><button className="text-button" onClick={()=>setExplore(v=>!v)}>استكشف النوتات <ArrowUpLeft size={14}/></button></div><div className="notes-row">{product.notes.map(n=><button key={n} className={selectedNote===n?'active':''} aria-pressed={selectedNote===n} onClick={()=>{setSelectedNote(n as NoteId);setExplore(true)}}><NoteArt note={n as NoteId}/><span>{notes[n as NoteId].name}</span></button>)}</div><div className="note-description" aria-live="polite"><strong>{notes[selectedNote].name}</strong><span>{notes[selectedNote].description}</span></div><small className="muted">النوتات أوصاف للرائحة، وليست قائمة المواد الفعلية.</small></div>:<div className="notice">تفاصيل النوتات غير متاحة ضمن مصادر هذه النسخة.</div>}
      <fieldset className="sizes"><legend>اختر الحجم</legend><div>{product.variants.map(v=><button type="button" key={v.size} className={size===v.size?'active':''} aria-pressed={size===v.size} onClick={()=>setSize(v.size)}><bdi>{v.size} ml</bdi></button>)}</div></fieldset><div className="price-row"><strong dir="ltr">{variant?money(variant.price):'—'}</strong><span>سعر وتوفر تجريبيان</span></div><div className="add-row"><button className="button" disabled={!variant?.available} onClick={add}><ShoppingBag size={18}/>{!variant?'اختر الحجم':variant.available?'أضف إلى الحقيبة':'غير متوفر في التجربة'}</button><div className="quantity product-quantity"><button aria-label="تقليل الكمية" disabled={quantity===1} onClick={()=>setQuantity(q=>q-1)}><Minus size={15}/></button><output>{quantity}</output><button aria-label="زيادة الكمية" disabled={quantity===99} onClick={()=>setQuantity(q=>q+1)}><Plus size={15}/></button></div></div>
      <div className="product-links">{id==='shams'&&<Link to="/journey/shams"><span>من أول انطباع… إلى آخر ذكرى<small>اكتشف رحلة الرائحة</small></span><ArrowLeft size={19}/></Link>}<Link to={`/layering?perfume=${isPerfume?id:'shams'}${!isPerfume?`&oil=${id}`:''}`}><span>لمسة إضافية، تشبهك<small>اكتشف فن التنسيق</small></span><ArrowLeft size={19}/></Link></div><details className="product-source"><summary><Info size={14}/> عن بيانات هذه التجربة</summary><p>الاسم والمحتوى المتحقق منه من موقع ذاتية. جميع الأسعار والمخزون تجريبية. العبوة نموذج بصري تقريبي وليست مطابقة رسمية. <a href={product.source} target="_blank" rel="noreferrer">عرض المصدر الرسمي</a></p></details>
    </section></div></main>
}
