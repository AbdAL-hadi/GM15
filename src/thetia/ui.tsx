import type { CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import { Heart } from 'lucide-react'
import { accordInfo, accords, english, story, familyEn, familyLabel, forEn, forLabel, kindEn, kinds, priceText } from './catalog'
import type { Accord, Family, For, Item, Kind } from './catalog'
import { useLang } from './i18n'
import { useWish } from './bag'
import { NoteIcon, noteKind, noteTint } from './NoteIcon'
import { notePhotos } from './notePhotos'

/** Text for an item in the current language. */
export function useText() {
  const { lang, note } = useLang()
  const ar = lang === 'ar'
  return {
    name: (i: Item) => ar ? i.name : english[i.slug]?.name ?? i.latin,
    desc: (i: Item) => ar ? i.description : english[i.slug]?.description ?? i.description,
    story: (i: Item) => story[i.slug]?.[ar ? 'ar' : 'en'],
    kind: (k: Kind) => ar ? kinds.find(x => x.id === k)!.label : kindEn[k],
    family: (f: Family) => ar ? familyLabel[f] : familyEn[f],
    who: (f: For) => ar ? forLabel[f] : forEn[f],
    note,
  }
}

/* Main accords: coloured bars, widest first, like perfume reference sites. */
export function AccordBars({ slug, list: given, title, compact = false }: { slug?: string; list?: [Accord, number][]; title?: string; compact?: boolean }) {
  const { lang, t } = useLang()
  const list = given ?? (slug ? accords[slug] : undefined)
  if (!list) return null
  return <div className={`t-accords${compact ? ' is-compact' : ''}`}>
    <h3>{title ?? t('mainAccords')}</h3>
    <ul>{list.map(([a, w], k) => {
      const info = accordInfo[a]
      return <li key={a} style={{ '--w': `${w}%`, '--c': info.color, '--ink': info.ink, '--i': k } as CSSProperties}><span>{lang === 'ar' ? info.ar : info.en}</span></li>
    })}</ul>
  </div>
}


export function NoteTile({ name, size = 'md' }: { name: string; size?: 'sm' | 'md' }) {
  const { note } = useLang()
  const kind = noteKind(name)
  const photo = notePhotos[name]
  return <figure className={`t-note-tile is-${size}`}>
    <span className="t-note-pic" style={{ background: photo ? '#fff' : noteTint[kind] }}>
      {photo ? <img src={photo.src} alt="" loading="lazy" /> : <NoteIcon kind={kind} size={size === 'sm' ? 26 : 38} />}
    </span>
    <figcaption>{note(name)}</figcaption>
  </figure>
}

export function HeartButton({ slug, label }: { slug: string; label: string }) {
  const { has, toggle } = useWish()
  const { t } = useLang()
  const on = has(slug)
  return <button type="button" className={`t-heart${on ? ' is-on' : ''}`} aria-pressed={on} aria-label={`${on ? t('removeWish') : t('addWish')}: ${label}`}
    onClick={e => { e.preventDefault(); e.stopPropagation(); toggle(slug) }}>
    <Heart size={18} strokeWidth={1.6} fill={on ? 'currentColor' : 'none'} />
  </button>
}

export function ProductCard({ item }: { item: Item }) {
  const { to } = useLang()
  const tx = useText()
  const sale = item.was ? Math.round((1 - item.sizes[0].price / item.was) * 100) : 0
  return <div className="t-card">
    <Link to={to(`/p/${item.slug}`)} className="t-card-link">
      <span className="t-card-img t-frame">
        {sale > 0 && <span className="t-badge" dir="ltr">-{sale}%</span>}
        <img src={item.image} alt="" loading="lazy" />
      </span>
      <span className="t-card-name">{tx.name(item)}</span>
      <span className="t-card-latin" dir="ltr">{item.latin}</span>
      <span className="t-card-price" dir="ltr">{item.was && <s>₪{item.was}</s>} {priceText(item)}</span>
    </Link>
    <HeartButton slug={item.slug} label={tx.name(item)} />
  </div>
}
