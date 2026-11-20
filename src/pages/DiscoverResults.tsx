import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Check } from 'lucide-react'
import { BottleArt } from '../components/BottleArt'
import { money } from '../data/products'
import { complete, familyNames, recommend } from '../discovery/model'
import { useDiscovery } from '../discovery/state'
import { useCatalog } from '../state/Catalog'
export default function DiscoverResults() {
  const {products,layerings}=useCatalog(), {progress,save}=useDiscovery()
  const [saveMessage,setSaveMessage]=useState('')
  const title=useRef<HTMLHeadingElement>(null)
  useEffect(()=>{title.current?.focus()},[])
  const {answers,savedResult}=progress
  const results=recommend(answers,products)
  if(!complete(answers))return <main className="discover-page discover-empty"><span className="eyebrow">YOUR SCENT JOURNEY</span><h1 ref={title} tabIndex={-1}>ابدأ باكتشاف ذوقك</h1><p>أجب عن الخطوات الخمس حتى نعرض اقتراحًا مبنيًا على اختياراتك.</p><Link className="button" to="/discover">ابدأ الاختبار <ArrowLeft size={18}/></Link></main>
  if(!results.length)return <main className="discover-page discover-empty"><span className="eyebrow">BASED ON YOUR CHOICES</span><h1 ref={title} tabIndex={-1}>ما لقينا اقتراحًا مناسبًا حاليًا</h1><p>الميزانية أو الروائح المستبعدة أو نقص تفاصيل الكتالوج قد تمنع الترشيح. عدّل اختياراتك لتجرب مجددًا.</p><div className="discover-actions"><Link className="button" to="/discover">عدّل اختياراتك <ArrowLeft size={18}/></Link><Link to="/shop" className="discover-back">تصفّح العطور</Link></div><p className="data-caption">لا نتجاهل قيودك ولا نفترض أن غياب نوتة من الوصف يعني خلو العطر منها.</p></main>
  const [main,...alternatives]=results
  const pair=layerings.find(p=>p.perfume===main.product.id)
  const pairOil=products.find(p=>p.id===pair?.oil)
  return <main className="discover-page results-page"><div className="results-intro"><span className="eyebrow">بناءً على اختياراتك</span><h1 ref={title} tabIndex={-1}>رائحة أقرب لذوقك</h1></div><div className="results-layout"><div className="results-visual"><BottleArt name={main.product.name} color={main.product.color}/></div><div className="results-copy"><h2 dir="ltr">{main.product.name}</h2><p className="results-arabic">{main.product.arabicName}</p><div className="results-reasons"><h3>ليش رشّحناه؟</h3><ul>{main.reasons.map(reason=><li key={reason}><Check size={18}/>{reason}</li>)}</ul></div><div className="results-tags">{main.matched.map(f=><span key={f}>{familyNames[f]}</span>)}</div>{main.status==='demo'&&<p className="data-caption">اقتراح مبني جزئيًا على تصنيف توضيحي يحتاج اعتماد ذاتية.</p>}<p className="results-size">حجم مقترح <bdi>{main.size} ml</bdi> · <strong dir="ltr">{money(main.price)}</strong></p><p className="data-caption">السعر والتوفر تجريبيان.</p><div className="results-actions"><Link className="button" to={`/product/${main.product.slug}?size=${main.size}`}>استكشف العطر <ArrowLeft size={18}/></Link><button onClick={()=>setSaveMessage(save(main.product.id)?'حُفظت النتيجة على هذا الجهاز.':'تعذر الحفظ على هذا الجهاز؛ يمكنك متابعة التجربة.')}>احفظ النتيجة</button><span role="status">{saveMessage||savedResult===main.product.id&&'النتيجة محفوظة على هذا الجهاز.'}</span></div></div></div>
    {pair&&<Link to={`/layering?perfume=${main.product.id}&oil=${pair.oil}`} className="results-pair"><span>اكتشف التنسيق المناسب <ArrowLeft size={22}/></span>{pairOil&&<BottleArt name={pairOil.name} color={pairOil.color} oil/>}</Link>}
    <Link className="discover-edit" to="/discover">عدّل اختياراتك</Link><p className="results-note">اقتراح يساعدك على الاختيار؛ التجربة الشخصية هي الأهم.</p>
    {alternatives.length>0&&<section className="results-alternatives"><h2>اقتراحات أخرى تستحق التجربة</h2>{alternatives.map(r=><article key={r.product.id}><h3>{r.product.name}</h3><p>{r.reasons[0]}</p><Link to={`/product/${r.product.slug}?size=${r.size}`}>استكشف العطر</Link></article>)}</section>}
  </main>
}

