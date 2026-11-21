import { Component, lazy, Suspense, useState } from 'react'
import type { ReactNode } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Minus, Plus, RotateCw, SprayCan, Box, PackageOpen, Droplet, Hand, Image as ImageIcon } from 'lucide-react'
import { getItem, items, money } from './catalog'
import type { Item } from './catalog'
import { useBag } from './bag'
import { useLang } from './i18n'
import type { Key } from './i18n'
import { AccordBars, HeartButton, NoteTile, ProductCard, useText } from './ui'
import { notePhotos } from './notePhotos'
import { noteKind, noteTint } from './NoteIcon'

const Bottle3D = lazy(() => import('./Bottle3D'))

class Boundary extends Component<{ fallback: ReactNode; children: ReactNode }, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() { return { failed: true } }
  render() { return this.state.failed ? this.props.fallback : this.props.children }
}

export default function Product() {
  const { slug = '' } = useParams()
  const { t, to } = useLang()
  const item = getItem(slug)
  if (!item) return <section className="t-section t-center"><h1 className="t-h2">{t('notFound')}</h1><Link to={to('/shop')} className="t-btn">{t('toShop')}</Link></section>
  return <ProductView key={item.slug} item={item} />
}

function ProductView({ item }: { item: Item }) {
  const { add, setOpen } = useBag()
  const { t, to, note, pick } = useLang()
  const tx = useText()
  const [size, setSize] = useState(item.sizes.find(s => s.label === '50 mL') ?? item.sizes[0])
  const [qty, setQty] = useState(1)
  const [view, setView] = useState<'photo' | '3d'>('photo')
  const [open, setOpenCap] = useState(false)
  const [spray, setSpray] = useState(0)
  const [spin, setSpin] = useState(false)
  const [refill, setRefill] = useState(false)
  const has3d = item.kind !== 'package' && item.kind !== 'hoodie'
  const isPerfume = item.kind === 'perfume'
  const related = items.filter(i => i.slug !== item.slug && i.kind === item.kind && i.families.some(f => item.families.includes(f))).slice(0, 4)
  const name = tx.name(item)
  const to3d = () => setView('3d')
  const price = refill ? Math.round(size.price * .7) : size.price
  const tiers: [Key, string[]][] = item.pyramid ? [['top', item.pyramid.top], ['middle', item.pyramid.heart], ['base', item.pyramid.base]]
    : item.notes.length ? [['notes', item.notes]] : []
  const photo = <img src={item.image} alt={name} className="t-pdp-photo" />

  return <>
    <nav className="t-crumbs" aria-label={t('crumbs')}><Link to={to('/')}>{t('home')}</Link> / <Link to={to('/shop')}>{t('shop')}</Link> / <span>{name}</span></nav>
    <section className="t-pdp">
      <div className="t-pdp-media">
        <div className="t-pdp-stage t-frame">
          {view === 'photo' || !has3d ? photo
            : <Boundary fallback={photo}>
                <Suspense fallback={<p className="t-muted t-pdp-loading">{t('loading')}</p>}>
                  <Bottle3D kind={item.kind} shape={item.shape} liquid={item.liquid} open={open} actionKey={spray} spin={spin} notes={item.notes.map(n => ({ label: note(n), src: notePhotos[n]?.src, tint: noteTint[noteKind(n)] }))} />
                </Suspense>
              </Boundary>}
          {view === '3d' && <p className="t-pdp-hint">{t('dragHint')}</p>}
        </div>
        {has3d && <div className="t-pdp-tools" role="group" aria-label={t('viewTools')}>
          <button aria-pressed={view === 'photo'} onClick={() => setView('photo')}><ImageIcon size={16} />{t('photo')}</button>
          <button aria-pressed={view === '3d'} onClick={to3d}><Box size={16} />{t('view360')}</button>
          <button aria-pressed={open} onClick={() => { to3d(); setOpenCap(o => !o) }}><PackageOpen size={16} />{open ? t(isPerfume ? 'closeLid' : 'closeCap') : t(isPerfume ? 'openLid' : 'openCap')}</button>
          <button onClick={() => { to3d(); setOpenCap(true); setSpray(n => n + 1) }}>{item.kind === 'cream' ? <Hand size={16} /> : item.kind === 'oil' ? <Droplet size={16} /> : <SprayCan size={16} />}{t(item.kind === 'cream' ? 'squeeze' : item.kind === 'oil' ? 'drop' : 'spray')}</button>
          <button aria-pressed={spin} onClick={() => { to3d(); setSpin(s => !s) }}><RotateCw size={16} />{spin ? t('stopSpin') : t('spin')}</button>
        </div>}
      </div>

      <div className="t-pdp-info">
        <div className="t-pdp-title"><h1>{name}</h1><HeartButton slug={item.slug} label={name} /></div>
        {item.tagline && <p className="t-pdp-tag" dir="ltr">{item.tagline}</p>}
        <p className="t-pdp-price" dir="ltr">{(item.was || refill) && <s>{money(item.was ?? size.price)}</s>} {money(price)}</p>
        {tx.story(item) && <p className="t-pdp-story">{tx.story(item)}</p>}
        <p className="t-pdp-desc">{tx.desc(item)}</p>
        <AccordBars slug={item.slug} />

        <fieldset className="t-sizes">
          <legend>{t('capacity')}</legend>
          <div>{item.sizes.map(s => <button key={s.label} type="button" aria-pressed={s.label === size.label} onClick={() => setSize(s)}><bdi>{s.label}</bdi></button>)}</div>
        </fieldset>

        {isPerfume && <div className="t-refill-opt">
          <label><input type="checkbox" checked={refill} onChange={e => setRefill(e.target.checked)} /> <b>{t('refillOption')}</b></label>
          <p className="t-muted t-small">{t('refillOptionHelp')} <Link to={to(`/refill?scent=${item.slug}`)} className="t-link">{t('useThis')}</Link></p>
        </div>}
        <div className="t-buy">
          <div className="t-qty" dir="ltr">
            <button aria-label={t('qtyDown')} disabled={qty === 1} onClick={() => setQty(q => q - 1)}><Minus size={14} /></button>
            <output aria-label={t('qty')}>{qty}</output>
            <button aria-label={t('qtyUp')} onClick={() => setQty(q => Math.min(99, q + 1))}><Plus size={14} /></button>
          </div>
          <button className="t-btn t-btn-wide" onClick={() => { add({ slug: item.slug, size: size.label, price, detail: refill ? t('refillDetail') : undefined }, qty); setOpen(true) }}>{t('addToBag')}</button>
        </div>

        <dl className="t-meta">
          {item.families.length > 0 && <><dt>{t('categories')}</dt><dd>{item.families.map(tx.family).join(pick('، ', ', '))}</dd></>}
          <dt>{t('forWho')}</dt><dd>{item.for.map(tx.who).join(pick('، ', ', '))}</dd>
        </dl>
        {item.sizes.length > 1 && <p className="t-muted t-small">{t('priceNote')}</p>}
      </div>
    </section>

    {tiers.length > 0 && <section className="t-pyramid" aria-labelledby="pyr">
      <h2 className="t-h2" id="pyr">{t('pyramid')}</h2>
      {tiers.length > 1 && <p className="t-lead">{t('pyramidLead')}</p>}
      {tiers.map(([k, notes]) => <div key={k} className="t-tier">
        <h3>{t(k)}</h3>
        <div className="t-tier-row">{notes.map(n => <NoteTile key={n} name={n} />)}</div>
      </div>)}
    </section>}

    {related.length > 0 && <section className="t-section"><h2 className="t-h2">{t('related')}</h2><div className="t-grid">{related.map(r => <ProductCard key={r.slug} item={r} />)}</div></section>}
  </>
}
