import { useEffect, useMemo, useState } from 'react'
import type { CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { bestSellers, getItem, items, kinds, perfumes, priceText } from './catalog'
import type { Family, Item } from './catalog'
import { useLang } from './i18n'
import { AccordBars, ProductCard, useText } from './ui'
import NotesWheel from './NotesWheel'
import { Film } from './Refill'
import { InstagramStrip, MadeInPalestine } from './Story'

const SLIDE_MS = 7000

export default function Home() {
  const { t, to } = useLang()
  return <>
    <BestSellerHero />
    <Categories />
    <Collection />
    <section className="t-section t-wheel-section">
      <h2 className="t-h2">{t('wheelTitle')}</h2>
      <p className="t-lead">{t('wheelLead')}</p>
      <NotesWheel />
    </section>
    <section className="t-section t-refill-band">
      <h2 className="t-h2">{t('refillBand')}</h2>
      <p className="t-lead">{t('refillBandText')}</p>
      <p className="t-center"><Link to={to('/refill')} className="t-btn">{t('openRefill')}</Link></p>
    </section>
    <Film />
    <MadeInPalestine />
    <InstagramStrip />
    <section className="t-quiz-band">
      <h2>{t('quizBandTitle')}</h2>
      <p>{t('quizBandText')}</p>
      <Link to={to('/choose')} className="t-btn">{t('start')}</Link>
    </section>
  </>
}

/* Best sellers from the live homepage, one at a time, changing every 12 seconds. */
function BestSellerHero() {
  const { t, to, dir } = useLang()
  const tx = useText()
  const slides = useMemo(() => bestSellers.map(getItem).filter(Boolean) as Item[], [])
  const [i, setI] = useState(0)
  const [paused, setPaused] = useState(false)
  useEffect(() => {
    if (paused) return
    const id = setTimeout(() => setI(n => (n + 1) % slides.length), SLIDE_MS)
    return () => clearTimeout(id)
  }, [i, paused, slides.length])
  // Load every slide's photo up front so a change never waits on the network.
  useEffect(() => { slides.forEach(s => { const im = new Image(); im.src = s.image }) }, [slides])
  const go = (d: number) => setI(n => (n + d + slides.length) % slides.length)
  const Back = dir === 'rtl' ? ChevronRight : ChevronLeft
  const Fwd = dir === 'rtl' ? ChevronLeft : ChevronRight

  return <section className="t-hero" aria-roledescription="carousel" aria-label={t('bestSeller')} onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onFocus={() => setPaused(true)} onBlur={() => setPaused(false)}>
    <h1 className="t-sr">THETIA</h1>
    <div className="t-hero-track">{slides.map((item, k) => <div key={item.slug} className={`t-hero-slide${k === i ? ' is-on' : ''}`} aria-hidden={k !== i} aria-live={k === i ? 'polite' : undefined}>
      <p className="t-hero-giant" aria-hidden="true" dir="ltr" style={{ '--len': item.latin.length } as CSSProperties}>{item.latin}</p>
      <div className="t-hero-copy">
        <p className="t-eyebrow">{t('bestSeller')}</p>
        <h2 className="t-hero-name">{tx.name(item)}</h2>
        {item.tagline && <p className="t-hero-tag" dir="ltr">{item.tagline}</p>}
        <p className="t-hero-price" dir="ltr">{priceText(item)}</p>
        <Link to={to(`/p/${item.slug}`)} className="t-btn" tabIndex={k === i ? 0 : -1}>{t('discover')}</Link>
      </div>
      <div className="t-hero-stage"><div className="t-hero-bottle t-glow"><img src={item.image} alt={tx.name(item)} /></div></div>
      <div className="t-hero-accords">{k === i && <AccordBars slug={item.slug} />}</div>
    </div>)}</div>
    <div className="t-hero-nav">
      <button aria-label={t('prev')} onClick={() => go(-1)}><Back size={22} /></button>
      <div className="t-dots">{slides.map((s, k) => <button key={s.slug} aria-label={tx.name(s)} aria-current={k === i} onClick={() => setI(k)}>{k === i && !paused && <span style={{ animationDuration: `${SLIDE_MS}ms` }} />}</button>)}</div>
      <button aria-label={t('next')} onClick={() => go(1)}><Fwd size={22} /></button>
    </div>
  </section>
}

function Categories() {
  const { t, to } = useLang()
  const tx = useText()
  const cover: Record<string, string> = { perfume: 'jawa', oil: 'vanilla-oil', cream: 'body-lotion', package: 'oil-package', hoodie: 'black-hoodie' }
  return <section className="t-cats" aria-label={t('sections')}>{kinds.map(k =>
    <Link key={k.id} to={to(`/shop?kind=${k.id}`)} className="t-cat"><span><img src={getItem(cover[k.id])?.image} alt="" loading="lazy" /></span>{tx.kind(k.id)}</Link>)}
  </section>
}

const filters: (Family | 'all')[] = ['all', 'floral', 'citrus', 'sweet', 'vanilla', 'oud', 'fresh', 'spicy']

function Collection() {
  const { t, to } = useLang()
  const tx = useText()
  const [f, setF] = useState<Family | 'all'>('all')
  const list = f === 'all' ? perfumes : perfumes.filter(p => p.families.includes(f))
  return <section className="t-section">
    <h2 className="t-h2">{t('collection')}</h2>
    <div className="t-chips" role="group" aria-label={t('family')}>{filters.map(x =>
      <button key={x} aria-pressed={f === x} onClick={() => setF(x)}>{x === 'all' ? t('all') : tx.family(x)}</button>)}</div>
    <div className="t-grid">{list.map(p => <ProductCard key={p.slug} item={p} />)}</div>
    <p className="t-center"><Link to={to('/shop')} className="t-btn t-btn-line">{t('viewAll', { n: items.length })}</Link></p>
  </section>
}
