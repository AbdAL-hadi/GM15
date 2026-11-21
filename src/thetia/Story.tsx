import { Link } from 'react-router-dom'
import { Instagram } from 'lucide-react'
import { brand, getItem, items } from './catalog'
import type { Key } from './i18n'
import { useLang } from './i18n'

/* Our story: four short chapters told in order, then Made in Palestine and the Instagram feed. */
const chapters: { t: Key; p: Key; img: string }[] = [
  { t: 'ch1t', p: 'ch1', img: 'amar' },
  { t: 'ch2t', p: 'ch2', img: 'cloud' },
  { t: 'ch3t', p: 'ch3', img: 'jawa' },
  { t: 'ch4t', p: 'ch4', img: 'shams' },
]

export default function Story() {
  const { t, to } = useLang()
  return <>
    <section className="t-story-hero">
      <p className="t-eyebrow">{t('story')}</p>
      <h1>{t('storyHero')}</h1>
      <p className="t-story-intro">{t('storyIntro')}</p>
    </section>
    <ol className="t-chapters">{chapters.map((c, k) => <li key={c.t} className="t-chapter">
      <span className="t-chapter-num" aria-hidden="true">{String(k + 1).padStart(2, '0')}</span>
      <div className="t-chapter-text"><h2>{t(c.t)}</h2><p>{t(c.p)}</p></div>
      <div className="t-chapter-img t-frame"><img src={getItem(c.img)?.image} alt="" loading="lazy" /></div>
    </li>)}</ol>
    <MadeInPalestine />
    <InstagramStrip />
    <p className="t-center t-section"><Link to={to('/shop')} className="t-btn">{t('toShop')}</Link></p>
  </>
}

export function MadeInPalestine() {
  const { t, lang } = useLang()
  const ar = lang === 'ar'
  const topLine = ar ? 'صنع في فلسطين' : 'MADE IN PALESTINE'
  const bottomLine = ar ? 'رام الله ✦ يُعبّأ باليد' : 'RAMALLAH ✦ FILLED BY HAND'
  return <section className="t-made" aria-labelledby="made-title">
    <div className="t-stamp" aria-hidden="true">
      <svg viewBox="0 0 200 200">
        <defs>
          {/* top arc runs left to right over the top; bottom arc runs left to right under the bottom, so both read upright */}
          <path id="stamp-top" d="M26 100 A74 74 0 0 1 174 100" />
          <path id="stamp-bottom" d="M16 100 A84 84 0 0 0 184 100" />
        </defs>
        <circle cx="100" cy="100" r="96" className="t-stamp-line" />
        <circle cx="100" cy="100" r="60" className="t-stamp-line" />
        <text className={`t-stamp-ring${ar ? ' is-ar' : ''}`} direction={ar ? 'rtl' : 'ltr'}><textPath href="#stamp-top" startOffset="50%" textAnchor="middle">{topLine}</textPath></text>
        <text className={`t-stamp-ring${ar ? ' is-ar' : ''}`} direction={ar ? 'rtl' : 'ltr'}><textPath href="#stamp-bottom" startOffset="50%" textAnchor="middle">{bottomLine}</textPath></text>
        <circle cx="21" cy="100" r="2" /><circle cx="179" cy="100" r="2" />
        <text x="100" y="96" textAnchor="middle" className="t-stamp-brand">THETIA</text>
        <text x="100" y="118" textAnchor="middle" className={`t-stamp-sub${ar ? ' is-ar' : ''}`}>{ar ? 'فلسطين' : 'PALESTINE'}</text>
      </svg>
    </div>
    <div>
      <h2 id="made-title" className="t-h2">{t('madeIn')}</h2>
      <p className="t-lead">{t('madeInText')}</p>
    </div>
  </section>
}

export function InstagramStrip() {
  const { t } = useLang()
  const tiles = items.filter(i => i.kind !== 'package').slice(0, 6)
  return <section className="t-section t-ig" aria-labelledby="ig-title">
    <h2 id="ig-title" className="t-h2">{t('followIg')}</h2>
    <p className="t-lead">{t('followIgText')}</p>
    <a className="t-ig-grid" href={brand.instagram.url} target="_blank" rel="noreferrer" aria-label={`${t('openIg')} ${brand.instagram.handle}`}>
      {tiles.map(i => <span key={i.slug} className="t-ig-tile"><img src={i.image} alt="" loading="lazy" /></span>)}
    </a>
    <p className="t-center"><a className="t-btn t-btn-line" href={brand.instagram.url} target="_blank" rel="noreferrer"><Instagram size={16} /> <bdi dir="ltr">{brand.instagram.handle}</bdi></a></p>
  </section>
}
