import { useEffect, useMemo, useRef, useState } from 'react'
import type { CSSProperties, Ref } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Play } from 'lucide-react'
import { accords, getItem, money, perfumes } from './catalog'
import type { Accord, Item } from './catalog'
import { useBag } from './bag'
import { useLang } from './i18n'
import { AccordBars, useText } from './ui'

/* ---------- shared bits ---------- */

/** Demo stock levels for the wall, until the shop shares real ones. */
const level = (slug: string) => 18 + ([...slug].reduce((s, c) => s + c.charCodeAt(0), 0) * 37) % 78

/** Real perfume colours, like the juices on THETIA's refill wall: amber, honey, gold, pale yellow, straw, clear. */
const JUICE = { amber: '#c4842c', honey: '#d6a03e', gold: '#dcbc58', pale: '#e9dd98', straw: '#efe6bf', clear: '#f1efe6' }
const juiceOf: Record<string, string> = {
  jawa: JUICE.amber, dana: JUICE.honey, skie: JUICE.gold, shams: JUICE.pale, 'vanilla-perfume': JUICE.straw, cloud: JUICE.straw,
  amar: JUICE.pale, ayden: JUICE.gold, sweet: JUICE.straw, wassim: JUICE.pale, day: JUICE.clear, love: JUICE.clear, leil: JUICE.clear, mood: JUICE.clear,
}
const tint = (i: Item) => juiceOf[i.slug] ?? JUICE.straw
function mixHex(a: string, b: string, t: number) {
  const p = (h: string) => [1, 3, 5].map(k => parseInt(h.slice(k, k + 2), 16))
  const [x, y] = [p(a), p(b)]
  return '#' + x.map((v, k) => Math.round(v * (1 - t) + y[k] * t).toString(16).padStart(2, '0')).join('')
}
const shade = (h: string, t: number) => mixHex(h, '#5a3a10', t)
const refillPrice = (p: number) => Math.round(p * .7)

/* Shared shading for glass, steel and black plastic. Rendered once per page. */
export function GlassDefs() {
  return <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true"><defs>
    <linearGradient id="g-glass" x1="0" x2="1">
      <stop offset="0" stopColor="#a9b2b6" stopOpacity=".55" /><stop offset=".1" stopColor="#fff" stopOpacity=".35" />
      <stop offset=".22" stopColor="#fff" stopOpacity=".05" /><stop offset=".7" stopColor="#fff" stopOpacity="0" />
      <stop offset=".86" stopColor="#fff" stopOpacity=".3" /><stop offset="1" stopColor="#8e989d" stopOpacity=".6" />
    </linearGradient>
    <linearGradient id="g-steel" x1="0" x2="1">
      <stop offset="0" stopColor="#8d949a" /><stop offset=".3" stopColor="#eef1f3" /><stop offset=".55" stopColor="#b8bfc5" /><stop offset="1" stopColor="#6f777d" />
    </linearGradient>
    <linearGradient id="g-black" x1="0" x2="1">
      <stop offset="0" stopColor="#050505" /><stop offset=".35" stopColor="#3a3a3a" /><stop offset=".5" stopColor="#151515" /><stop offset="1" stopColor="#000" />
    </linearGradient>
    <linearGradient id="g-shine" x1="0" x2="1"><stop offset="0" stopColor="#fff" stopOpacity="0" /><stop offset=".5" stopColor="#fff" stopOpacity=".85" /><stop offset="1" stopColor="#fff" stopOpacity="0" /></linearGradient>
    <filter id="g-blur" x="-50%" y="-20%" width="200%" height="140%"><feGaussianBlur stdDeviation="4" /></filter>
  </defs></svg>
}

/* One hanging dispenser: an upside-down glass bottle in a steel clamp, a black tap underneath. */
const BODY = 'M10 22 Q10 8 24 8 H56 Q70 8 70 22 V138 Q70 160 50 170 V188 H30 V170 Q10 160 10 138Z'
function Dispenser({ item, active, onPick }: { item: Item; active: boolean; onPick: () => void }) {
  const { t, to } = useLang()
  const tx = useText()
  const lv = level(item.slug)
  const top = 186 - 172 * lv / 100
  const id = `d-${item.slug}`
  const j = tint(item)
  return <li className={`t-disp${active ? ' is-active' : ''}`}>
    <button type="button" onClick={onPick} aria-pressed={active} aria-label={`${tx.name(item)}, ${t('level', { n: lv })}`}>
      <svg viewBox="0 0 80 262" aria-hidden="true">
        <defs>
          <clipPath id={id}><path d={BODY} /></clipPath>
          <linearGradient id={`${id}-j`} x1="0" x2="1"><stop offset="0" stopColor={shade(j, .28)} /><stop offset=".35" stopColor={j} /><stop offset=".6" stopColor={mixHex(j, '#ffffff', .25)} /><stop offset="1" stopColor={shade(j, .32)} /></linearGradient>
        </defs>
        <ellipse cx="50" cy="110" rx="26" ry="96" fill="#7a6a55" opacity=".16" filter="url(#g-blur)" />
        <rect x="37" y="0" width="6" height="262" fill="url(#g-steel)" opacity=".9" />
        <g clipPath={`url(#${id})`}>
          <rect x="0" y={top} width="80" height={200 - top} fill={`url(#${id}-j)`} className="t-disp-liquid" opacity=".92" />
          <ellipse cx="40" cy={top} rx="31" ry="2.4" fill="#fff" opacity=".45" />
        </g>
        <path d={BODY} fill="url(#g-glass)" stroke="#a7b0b4" strokeWidth=".8" />
        <rect x="17" y="14" width="5" height="140" rx="2.5" fill="url(#g-shine)" opacity=".8" />
        <rect x="60" y="20" width="2.5" height="126" rx="1.2" fill="#fff" opacity=".5" />
        <rect x="7" y="104" width="66" height="9" rx="2" fill="url(#g-steel)" stroke="#7b8288" strokeWidth=".4" />
        <rect x="27" y="186" width="26" height="10" rx="2" fill="url(#g-black)" />
        <rect x="33" y="196" width="14" height="22" rx="2" fill="url(#g-black)" />
        <path d="M47 202 h18 a3 3 0 0 1 0 6 h-18z" fill="url(#g-black)" />
        <rect x="37" y="218" width="6" height="9" rx="1" fill="#111" />
        {active && <ellipse cx="40" cy="236" rx="2.6" ry="3.4" fill={j} stroke={shade(j, .3)} strokeWidth=".4" className="t-disp-drip" />}
      </svg>
    </button>
    <span className="t-disp-name">{tx.name(item)}</span>
    <span className={`t-disp-level${lv < 30 ? ' is-low' : ''}`}>{lv < 30 ? t('almostGone') : t('level', { n: lv })}</span>
    <Link to={to(`/p/${item.slug}`)} className="t-link t-small">{t('viewScent')}</Link>
  </li>
}

/* ---------- page ---------- */

export default function Refill() {
  const { t } = useLang()
  const [params] = useSearchParams()
  const first = getItem(params.get('scent') ?? '')?.slug ?? perfumes[0].slug
  const [a, setA] = useState(first)
  const [b, setB] = useState<string | null>(null)
  const builder = useRef<HTMLElement>(null)

  const pick = (slug: string) => {
    if (slug === a) return
    if (!b && slug !== a) setB(slug); else setA(slug)
    builder.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return <>
    <GlassDefs />
    <section className="t-section t-refill-head">
      <h1 className="t-h2">{t('refillTitle')}</h1>
      <p className="t-lead">{t('refillLead')}</p>
      <div className="t-wall" role="group" aria-label={t('wallLabel')}>
        <ul>{perfumes.map(p => <Dispenser key={p.slug} item={p} active={p.slug === a || p.slug === b} onPick={() => pick(p.slug)} />)}</ul>
      </div>
    </section>
    <Builder ref={builder} a={a} b={b} setA={setA} setB={setB} />
    <ReturnBottle />
    <Film />
  </>
}

/* ---------- make your own ---------- */

function blendAccords(a: Item, b: Item | null, ratio: number): [Accord, number][] {
  const m = new Map<Accord, number>()
  for (const [k, w] of accords[a.slug] ?? []) m.set(k, (m.get(k) ?? 0) + w * (b ? ratio : 1))
  if (b) for (const [k, w] of accords[b.slug] ?? []) m.set(k, (m.get(k) ?? 0) + w * (1 - ratio))
  const list = [...m.entries()].sort((x, y) => y[1] - x[1]).slice(0, 6)
  const top = list[0]?.[1] || 1
  return list.map(([k, w]) => [k, Math.round(w / top * 100)])
}

interface BuilderProps { a: string; b: string | null; setA: (s: string) => void; setB: (s: string | null) => void; ref?: Ref<HTMLElement> }
function Builder({ a, b, setA, setB, ref }: BuilderProps) {
  const { t, pick: pk } = useLang()
  const tx = useText()
  const { add, setOpen } = useBag()
  const A = getItem(a)!
  const B = b ? getItem(b)! : null
  const [ratio, setRatio] = useState(.7)
  const sizes = useMemo(() => A.sizes.filter(s => !B || B.sizes.some(x => x.label === s.label)), [A, B])
  const [size, setSize] = useState('50 mL')
  const sz = sizes.find(s => s.label === size) ?? sizes[sizes.length - 1]
  const price = B ? Math.max(sz.price, B.sizes.find(x => x.label === sz.label)?.price ?? 0) + 10 : sz.price
  const [name, setName] = useState('')
  const [fill, setFill] = useState(0) // 0..1 how full the preview bottle is
  const [pouring, setPouring] = useState(false)
  const raf = useRef(0)
  useEffect(() => { setFill(0); setPouring(false); cancelAnimationFrame(raf.current) }, [a, b, ratio, sz.label])
  useEffect(() => () => cancelAnimationFrame(raf.current), [])

  const pour = () => {
    const start = performance.now(), dur = 2600
    setPouring(true)
    const step = (now: number) => {
      const k = Math.min(1, (now - start) / dur)
      setFill(1 - Math.pow(1 - k, 2))
      if (k < 1) raf.current = requestAnimationFrame(step); else setPouring(false)
    }
    raf.current = requestAnimationFrame(step)
  }
  const colA = tint(A), colB = B ? tint(B) : colA
  const liquid = B ? mixHex(colA, colB, 1 - ratio) : colA
  const blend = blendAccords(A, B, ratio)
  const detail = B ? `${tx.name(A)} ${Math.round(ratio * 100)}% · ${tx.name(B)} ${Math.round((1 - ratio) * 100)}%` : tx.name(A)
  const label = name.trim() || t('yourPerfume')
  const others = perfumes.filter(p => p.slug !== a)

  return <section ref={ref} className="t-section t-builder" aria-labelledby="make-title">
    <h2 className="t-h2" id="make-title">{t('makeTitle')}</h2>
    <p className="t-lead">{t('makeLead')}</p>
    <div className="t-builder-grid">
      <div className="t-builder-stage t-frame">
        <svg viewBox="0 0 200 300" className="t-builder-svg" aria-hidden="true">
          <defs>
            <clipPath id="mini-body"><rect x="52" y="96" width="96" height="176" rx="6" /></clipPath>
            <linearGradient id="mini-j" x1="0" x2="1"><stop offset="0" stopColor={shade(liquid, .25)} /><stop offset=".35" stopColor={liquid} /><stop offset=".62" stopColor={mixHex(liquid, '#ffffff', .3)} /><stop offset="1" stopColor={shade(liquid, .3)} /></linearGradient>
          </defs>
          {/* the tap of the dispenser above */}
          <rect x="88" y="0" width="24" height="12" rx="2" fill="url(#g-black)" />
          <rect x="94" y="12" width="12" height="16" rx="2" fill="url(#g-black)" />
          <rect x="97.5" y="28" width="5" height="8" fill="#111" />
          {pouring && <rect x="98.6" y="36" width="2.8" height={236 - 156 * fill - 36} fill={liquid} className="t-stream" opacity=".9" />}
          {/* THETIA bottle: clear glass cylinder, thick base, silver cap in clear acrylic, black print */}
          <ellipse cx="100" cy="286" rx="58" ry="6" fill="#6a4a1a" opacity=".18" filter="url(#g-blur)" />
          <g clipPath="url(#mini-body)">
            <rect x="52" y={256 - 152 * fill} width="96" height={152 * fill + 20} fill="url(#mini-j)" opacity=".9" />
            {fill > 0 && <ellipse cx="100" cy={256 - 152 * fill} rx="44" ry="2.6" fill="#fff" opacity=".5" />}
          </g>
          <rect x="52" y="96" width="96" height="176" rx="6" fill="url(#g-glass)" stroke="#a9b2b6" strokeWidth=".9" />
          <rect x="54" y="256" width="92" height="15" rx="3" fill="#dfe6e6" opacity=".55" />
          <rect x="62" y="104" width="6" height="146" rx="3" fill="url(#g-shine)" opacity=".75" />
          <rect x="134" y="108" width="3" height="136" rx="1.5" fill="#fff" opacity=".5" />
          <rect x="88" y="86" width="24" height="10" fill="url(#g-steel)" />
          <rect x="95" y="80" width="10" height="6" fill="url(#g-steel)" />
          <g className={`t-mini-cap${fill > 0 || pouring ? ' is-off' : ''}`}>
            <rect x="80" y="40" width="40" height="46" rx="3" fill="url(#g-glass)" stroke="#aab1b7" strokeWidth=".8" />
            <rect x="88" y="42" width="24" height="42" rx="2" fill="url(#g-steel)" />
          </g>
          <text x="100" y="226" textAnchor="middle" className="t-mini-brand">THETIA</text>
          <text x="100" y="242" textAnchor="middle" className="t-mini-name">{label}</text>
          <text x="100" y="252" textAnchor="middle" className="t-mini-size" direction="ltr">{sz.label}</text>
        </svg>
        <button type="button" className="t-btn t-btn-line" onClick={pour} disabled={pouring}>{pouring ? t('pouring') : t('pour')}</button>
      </div>

      <div className="t-builder-form">
        <label className="t-field"><span>{t('step1')}</span>
          <select value={a} onChange={e => { setA(e.target.value); if (e.target.value === b) setB(null) }}>
            {perfumes.map(p => <option key={p.slug} value={p.slug}>{tx.name(p)}</option>)}
          </select>
        </label>
        <label className="t-field"><span>{t('step2')}</span>
          <select value={b ?? ''} onChange={e => setB(e.target.value || null)}>
            <option value="">{t('none')}</option>
            {others.map(p => <option key={p.slug} value={p.slug}>{tx.name(p)}</option>)}
          </select>
        </label>
        {B && <label className="t-field"><span>{t('mix')}</span>
          <div className="t-mix">
            <b style={{ '--c': colA } as CSSProperties}>{tx.name(A)} {Math.round(ratio * 100)}%</b>
            <input type="range" min={20} max={80} step={10} value={Math.round(ratio * 100)} onChange={e => setRatio(Number(e.target.value) / 100)} dir="ltr" aria-valuetext={detail} />
            <b style={{ '--c': colB } as CSSProperties}>{tx.name(B)} {Math.round((1 - ratio) * 100)}%</b>
          </div>
        </label>}
        <fieldset className="t-sizes"><legend>{t('size')}</legend>
          <div>{sizes.map(s => <button key={s.label} type="button" aria-pressed={s.label === sz.label} onClick={() => setSize(s.label)}><bdi>{s.label}</bdi></button>)}</div>
        </fieldset>
        <AccordBars list={blend} title={t('blendAccords')} />
        <label className="t-field"><span>{t('nameIt')}</span>
          <input type="text" value={name} maxLength={18} placeholder={t('namePh')} onChange={e => setName(e.target.value)} />
          <small className="t-muted">{t('nameHelp')}</small>
        </label>
        <div className="t-builder-buy">
          <strong dir="ltr">{money(price)}</strong>
          <button className="t-btn t-btn-wide" onClick={() => { add({ slug: a, size: sz.label, price, title: `${label} · THETIA`, detail }); setOpen(true) }}>{t('addBlend')}</button>
        </div>
        <p className="t-muted t-small">{B ? t('blendFee') : t('priceNote')}</p>
        <p className="t-sr" aria-live="polite">{pk(`${label}: ${detail}`, `${label}: ${detail}`)}</p>
      </div>
    </div>
  </section>
}

/* ---------- bring your bottle back ---------- */

function ReturnBottle() {
  const { t } = useLang()
  const sample = getItem('jawa')!
  return <section className="t-section t-return">
    <h2 className="t-h2">{t('returnTitle')}</h2>
    <p className="t-lead">{t('returnLead')}</p>
    <table className="t-price-table">
      <thead><tr><th>{t('size')}</th><th>{t('newPrice')}</th><th>{t('refillPrice')}</th><th>{t('save')}</th></tr></thead>
      <tbody>{sample.sizes.map(s => <tr key={s.label}><td><bdi>{s.label}</bdi></td><td dir="ltr">{money(s.price)}</td><td dir="ltr"><b>{money(refillPrice(s.price))}</b></td><td dir="ltr">{money(s.price - refillPrice(s.price))}</td></tr>)}</tbody>
    </table>
    <p className="t-muted t-small t-center">{t('priceNote')}</p>
  </section>
}

/* ---------- behind the scenes (placeholder until the real film arrives) ---------- */

export function Film() {
  const { t } = useLang()
  return <section className="t-section t-film">
    <h2 className="t-h2">{t('filmTitle')}</h2>
    <p className="t-lead">{t('filmLead')}</p>
    <div className="t-film-frame t-frame" role="img" aria-label={t('filmSoon')}>
      <div className="t-film-wall" aria-hidden="true">{perfumes.slice(0, 9).map(p => <span key={p.slug} style={{ '--c': tint(p), '--h': `${level(p.slug)}%` } as CSSProperties} />)}</div>
      <span className="t-film-play"><Play size={26} fill="currentColor" /></span>
      <span className="t-film-soon">{t('filmSoon')}</span>
    </div>
  </section>
}

export { refillPrice }
