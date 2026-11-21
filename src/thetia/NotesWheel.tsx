import { useMemo, useRef, useState } from 'react'
import type { CSSProperties, KeyboardEvent, PointerEvent } from 'react'
import { Link } from 'react-router-dom'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { items, priceText } from './catalog'
import { noteKind, noteTint } from './NoteIcon'
import type { NoteKind } from './NoteIcon'
import { useLang } from './i18n'
import { AccordBars, NoteTile, useText } from './ui'
import { notePhotos } from './notePhotos'

/* A photo that stands for each group in the middle of the dial. */
const groupPhoto: Record<NoteKind, string> = { flower: 'ورد', citrus: 'ليمون', vanilla: 'فانيليا', wood: 'عود', spice: 'توابل شرقية', fruit: 'نوتات فاكهية', sweet: 'عسل', musk: 'مسك', leaf: 'نعناع', coffee: 'قهوة' }

/* Bottles orbit a dial (reference video 2). The dial is a ring of note groups; turning it to a
   group brings the bottles that carry those notes round to the front. */
const RING: { kind: NoteKind; ar: string; en: string }[] = [
  { kind: 'flower', ar: 'زهور', en: 'Flowers' }, { kind: 'citrus', ar: 'حمضيات', en: 'Citrus' }, { kind: 'vanilla', ar: 'فانيليا', en: 'Vanilla' },
  { kind: 'wood', ar: 'أخشاب', en: 'Woods' }, { kind: 'spice', ar: 'توابل', en: 'Spices' }, { kind: 'fruit', ar: 'فواكه', en: 'Fruits' },
  { kind: 'sweet', ar: 'حلو', en: 'Sweet' }, { kind: 'musk', ar: 'مسك', en: 'Musk' }, { kind: 'leaf', ar: 'أخضر', en: 'Green' }, { kind: 'coffee', ar: 'قهوة', en: 'Coffee' },
]
const N = RING.length
const STEP = 360 / N
const mod = (n: number) => ((n % N) + N) % N

function arc(r1: number, r2: number, a0: number, a1: number) {
  const p = (r: number, a: number) => `${(r * Math.sin(a * Math.PI / 180)).toFixed(2)} ${(-r * Math.cos(a * Math.PI / 180)).toFixed(2)}`
  return `M${p(r2, a0)} A${r2} ${r2} 0 0 1 ${p(r2, a1)} L${p(r1, a1)} A${r1} ${r1} 0 0 0 ${p(r1, a0)}Z`
}

export default function NotesWheel() {
  const { t, to, lang, pick } = useLang()
  const tx = useText()
  const [rot, setRot] = useState(0) // degrees, unbounded so turns take the short way
  const [dragging, setDragging] = useState(false)
  const [focus, setFocus] = useState(-1) // -1 = middle bottle
  const drag = useRef<{ a: number; r: number; moved: boolean } | null>(null)
  const wrap = useRef<HTMLDivElement>(null)
  const sel = mod(Math.round(rot / STEP))
  const ring = RING[sel]

  const matches = useMemo(() => items.filter(i => (i.kind === 'perfume' || i.kind === 'oil') && i.notes.some(n => noteKind(n) === ring.kind))
    .map(i => ({ i, hit: i.notes.filter(n => noteKind(n) === ring.kind) })), [ring.kind])
  const f = focus < 0 ? Math.floor((matches.length - 1) / 2) : Math.min(focus, Math.max(0, matches.length - 1))
  const cur = matches[f]

  const turnTo = (k: number) => { let d = k - sel; if (d > N / 2) d -= N; if (d < -N / 2) d += N; setRot(Math.round(rot / STEP) * STEP + d * STEP); setFocus(-1) }
  const angleAt = (e: PointerEvent) => {
    const r = wrap.current!.getBoundingClientRect()
    return Math.atan2(e.clientX - (r.left + r.width / 2), -(e.clientY - (r.top + r.height / 2))) * 180 / Math.PI
  }
  const onDown = (e: PointerEvent<HTMLDivElement>) => { drag.current = { a: angleAt(e), r: rot, moved: false }; e.currentTarget.setPointerCapture(e.pointerId) }
  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!drag.current) return
    let d = angleAt(e) - drag.current.a
    if (d > 180) d -= 360; if (d < -180) d += 360
    if (Math.abs(d) > 2) { drag.current.moved = true; setDragging(true) }
    if (drag.current.moved) setRot(drag.current.r - d)
  }
  const onUp = () => { if (drag.current?.moved) { setRot(r => Math.round(r / STEP) * STEP); setFocus(-1) } drag.current = null; setDragging(false) }
  const onKey = (e: KeyboardEvent) => {
    const back = lang === 'ar' ? 'ArrowRight' : 'ArrowLeft'
    if (e.key === back || e.key === 'ArrowUp') { e.preventDefault(); turnTo(mod(sel - 1)) }
    if (e.key === (lang === 'ar' ? 'ArrowLeft' : 'ArrowRight') || e.key === 'ArrowDown') { e.preventDefault(); turnTo(mod(sel + 1)) }
  }
  const Prev = lang === 'ar' ? ChevronRight : ChevronLeft
  const Next = lang === 'ar' ? ChevronLeft : ChevronRight
  const label = (k: number) => pick(RING[k].ar, RING[k].en)
  const count = matches.length === 1 ? t('product1') : t('products', { n: matches.length })

  return <div className="t-wheel">
    <div className="t-orbit" aria-live="polite">
      {matches.map(({ i }, j) => {
        const o = j - f
        const a = o * 22 * Math.PI / 180
        const style = { '--sx': Math.sin(a) * (lang === 'ar' ? -1 : 1), '--cy': 1 - Math.cos(a), '--s': Math.max(.45, 1 - Math.abs(o) * .24), '--r': `${o * 10 * (lang === 'ar' ? -1 : 1)}deg`, '--o': Math.abs(o) > 2 ? 0 : 1, zIndex: 10 - Math.abs(o) } as CSSProperties
        return <button key={i.slug} className="t-orbit-item" style={style} tabIndex={Math.abs(o) > 2 ? -1 : 0} aria-label={tx.name(i)} aria-current={o === 0} onClick={() => setFocus(j)}><img src={i.image} alt="" /></button>
      })}
      {matches.length === 0 && <p className="t-muted t-orbit-empty">{t('noMatch')}</p>}
    </div>

    <div ref={wrap} className={`t-dial-wrap${dragging ? ' is-dragging' : ''}`} role="slider" tabIndex={0} aria-label={t('pickNote')}
      aria-valuemin={1} aria-valuemax={N} aria-valuenow={sel + 1} aria-valuetext={label(sel)}
      onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerCancel={onUp} onKeyDown={onKey}>
      <svg className="t-dial" viewBox="-210 -210 420 420" aria-hidden="true">
        <circle r="198" className="t-dial-line" />
        <circle r="146" className="t-dial-line" />
        <g style={{ transform: `rotate(${-rot}deg)` }} className="t-dial-rot">
          {RING.map((r, k) => <path key={r.kind} d={arc(122, 142, k * STEP - STEP / 2 + 1.2, k * STEP + STEP / 2 - 1.2)} fill={noteTint[r.kind]} className={k === sel ? 'is-sel' : ''} />)}
          {Array.from({ length: 80 }, (_, k) => <line key={k} x1="0" y1={-198} x2="0" y2={k % 8 ? -194 : -189} transform={`rotate(${k * 4.5})`} className="t-dial-line" />)}
          {RING.map((r, k) => <g key={r.kind} transform={`rotate(${k * STEP}) translate(0 -170) rotate(${-k * STEP})`}>
            <g style={{ transform: `rotate(${rot}deg)` }} className="t-dial-rot">
              <text textAnchor="middle" dy=".35em" className={k === sel ? 'is-sel' : ''} onClick={() => { if (!drag.current?.moved) turnTo(k) }}>{label(k)}</text>
            </g>
          </g>)}
        </g>
        <path d="M0 -146 L-8 -132 L8 -132Z" className="t-dial-pin" />
      </svg>
      <div className="t-dial-center" style={{ '--tint': noteTint[ring.kind] } as CSSProperties}>
        <span className="t-dial-icon"><img key={ring.kind} src={notePhotos[groupPhoto[ring.kind]]?.src} alt="" /></span>
        <b>{label(sel)}</b><span>{count}</span>
      </div>
    </div>
    <p className="t-muted t-small">{t('wheelHint')}</p>

    {cur && <div className="t-orbit-info">
      <button aria-label={t('prev')} disabled={f === 0} onClick={() => setFocus(f - 1)}><Prev size={20} /></button>
      <div className="t-orbit-detail">
        <Link to={to(`/p/${cur.i.slug}`)} className="t-orbit-name">{tx.name(cur.i)} <span dir="ltr">{cur.i.latin}</span></Link>
        <p dir="ltr" className="t-orbit-price">{priceText(cur.i)}</p>
        <h4>{t('inThis')}</h4>
        <div className="t-orbit-notes">{cur.hit.map(n => <NoteTile key={n} name={n} size="sm" />)}</div>
        <AccordBars slug={cur.i.slug} compact />
      </div>
      <button aria-label={t('next')} disabled={f >= matches.length - 1} onClick={() => setFocus(f + 1)}><Next size={20} /></button>
    </div>}
  </div>
}
