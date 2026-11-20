import { Link } from 'react-router-dom'
import { ArrowLeft, ArrowUpLeft } from 'lucide-react'
import { BottleArt } from '../components/BottleArt'
import { useCatalog } from '../state/Catalog'
export default function About(){
 const {products}=useCatalog()
 const ward=products.find(p=>p.id==='ward'&&p.type==='perfume')
 return <main className="about-page">
   <section className="about-feature">
     <div className="about-feature-visual">{ward&&<><div className="about-feature-image"><BottleArt name={ward.name} color={ward.color}/></div><div className="about-feature-label"><Link to={`/product/${ward.slug}`}><bdi>{ward.name} / {ward.arabicName}</bdi></Link></div></>}</div>
     <div className="about-feature-copy" dir="rtl"><span className="about-kicker" dir="ltr">SUBJECTIVELY, YOURS</span><h1>ليست كل<br/>الذكريات صورًا.<br/>بعضها روائح.</h1><p>في ذاتية، نؤمن أن الرائحة قد تحمل مكانًا، ولحظة، وشخصًا. وما يعنيه العطر لك، يخصّك وحدك.</p><div className="about-feature-actions"><Link className="button" to="/discover">اكتشف عطرك</Link><Link className="about-text-link" to="/shop">تصفّح المجموعة <ArrowLeft size={19}/></Link></div></div>
   </section>
   <section className="about-way"><div><h2>الرائحة، بطريقتك.</h2><p>اختر النوتات التي تفضّلها، واكتشف العطور التي تعبّر عن ذوقك بأسلوبك الخاص.</p></div><nav aria-label="استكشف ذاتية"><Link to="/discover">اكتشف ذوقك <ArrowLeft size={19}/></Link>{ward&&<Link to={`/journey/${ward.slug}`}>استكشف النوتات <ArrowLeft size={19}/></Link>}</nav></section>
   <section id="sources" className="sources-section section"><span className="eyebrow">A NOTE ON THIS EXPERIENCE</span><h2>عن التجربة ومصادرها</h2><p>THETIA علامة عطور فلسطينية ترتبط هويتها بالذكريات والتجارب الشخصية. هذه واجهة تجريبية مستقلة؛ لا تتصل بخدمة دفع أو تسجيل دخول، ولا تُرسل طلبات شراء حقيقية.</p><div className="source-grid"><article><span>01</span><h3>المنتجات والنوتات</h3><p>أسماء العطور العشرة ونوتاتها وتقسيم المقدمة والقلب والقاعدة مقدمة من صاحب المشروع. النوتات أوصاف للرائحة وليست قائمة مواد.</p></article><article><span>02</span><h3>فن التنسيق</h3><p>لم تُقدَّم تنسيقات زيت معتمدة للمجموعة الجديدة، لذلك تعرض صفحة التنسيق حالة انتظار واضحة.</p></article><article><span>03</span><h3>بيانات التجربة</h3><p>أحجام العطور وأسعارها والمخزون قيم تجريبية تحتاج تأكيدًا. صور المنتجات من صاحب المشروع، ومجسّم 360° تمثيل تقريبي.</p><Link to="/shop">تصفّح المنتجات <ArrowUpLeft size={15}/></Link></article></div><p className="data-caption align-start">تحتاج الأسعار والأحجام والتوفر إلى اعتماد صاحب المشروع قبل أي استخدام تجاري.</p></section>
 </main>
}
