import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, ChevronLeft, ChevronRight, ArrowUpLeft } from 'lucide-react'
import { BottleArt } from '../components/BottleArt'
import { ProductCard, SectionTitle } from '../components/UI'
import { useCatalog } from '../state/Catalog'
export default function Home() {
  const { products } = useCatalog()
  const perfumes=products.filter(p=>p.type==='perfume')
  const [index,setIndex]=useState(0)
  const featured=perfumes[index]??perfumes[0]
  return <main className="home-page">
    <section className="home-hero" aria-label="عطور تروي حكايتك">
      <div className="home-hero-visual">
        <Link className="home-hero-image" to={`/product/${featured.slug}`} aria-label={`اكتشف عطر ${featured.arabicName}`}><BottleArt name={featured.name} color={featured.color}/></Link>
        <div className="home-hero-product"><Link to={`/product/${featured.slug}`}><bdi>{featured.name} / {featured.arabicName}</bdi></Link><div className="home-hero-controls"><button aria-label="العطر السابق" onClick={()=>setIndex(i=>(i-1+perfumes.length)%perfumes.length)}><ChevronLeft size={19}/></button><span dir="ltr">{String(index+1).padStart(2,'0')} / {String(perfumes.length).padStart(2,'0')}</span><button aria-label="العطر التالي" onClick={()=>setIndex(i=>(i+1)%perfumes.length)}><ChevronRight size={19}/></button></div></div>
      </div>
      <div className="home-hero-copy" dir="rtl"><span>عطور تروي حكايتك</span><h1>لكل ذكرى<br/>رائحة</h1><p>اكتشف عطرك، وخلّي رائحتك تحكي عنك.</p><div className="home-hero-actions"><Link className="button" to="/shop">اكتشف المجموعة</Link><Link className="home-hero-secondary" to="/discover">اكتشف ذوقك <ArrowLeft size={20}/></Link></div></div>
    </section>
    <nav className="home-entrances" aria-label="ابدأ رحلتك"><Link to="/shop"><img src="/discover/floral-photo.jpg" alt=""/><span>اكتشف الروائح <ArrowLeft size={18}/></span></Link><Link to="/discover"><img src="/discover/vanilla-photo.jpg" alt=""/><span>اعثر على عطرك <ArrowLeft size={18}/></span></Link><Link to={`/journey/${featured.slug}`}><img src="/discover/woods-photo.jpg" alt=""/><span>رحلة النوتات <ArrowLeft size={18}/></span></Link></nav>
    <section className="section collection"><SectionTitle eyebrow="THE SCENT COLLECTION" title="أيّ رائحة تحكي عنك؟"><Link className="text-link" to="/shop">جميع العطور <ArrowLeft size={18}/></Link></SectionTitle><div className="product-grid">{perfumes.map(p=><ProductCard key={p.id} product={p}/>)}</div><p className="data-caption">مجموعة مختارة للتجربة · الأسعار والمخزون تجريبيان</p></section>
    <section className="discovery-section"><div className="discovery-art"><BottleArt name={featured.name}/></div><div className="editorial-copy"><span className="eyebrow">BEYOND THE FIRST SPRAY</span><h2>لا تكتفِ بالرائحة،<br/>اكتشف حكايتها.</h2><p>أدر الزجاجة، افتح الغطاء، واكتشف النوتات التي تصنع شخصية عطرك.</p><Link to={`/product/${featured.slug}`} className="text-link">ادخل تجربة {featured.arabicName} <ArrowUpLeft size={20}/></Link><small>مجسّم بصري تجريبي، ورذاذ تمثيلي.</small></div></section>
    <section className="section home-layering-note"><h2>تنسيقات المجموعة الجديدة ستضاف لاحقًا</h2></section>
    <section className="home-story"><span className="eyebrow">SUBJECTIVELY, YOURS</span><h2>العطر شخصيّ.<br/>لذلك، سمّيناه <em>ذاتيّة.</em></h2><p>نؤمن أن الرائحة قادرة على إعادتك إلى لحظة، أو مكان، أو شخص.<br/>عطور تصبح جزءًا من قصتك، وتحمل شيئًا منك أينما ذهبت.</p><Link to="/about" className="text-link">تعرّف إلى ذاتية <ArrowUpLeft size={18}/></Link></section>
  </main>
}

