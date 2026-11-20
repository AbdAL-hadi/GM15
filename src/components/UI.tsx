import { Component, useEffect, useRef } from 'react'
import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpLeft, Heart, X } from 'lucide-react'
import type { Product } from '../data/products'
import { money, defaultSize } from '../data/products'
import { useStore } from '../state/Store'
import { BottleArt } from './BottleArt'

export class AssetBoundary extends Component<{ children: ReactNode; fallback: ReactNode }, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() { return { failed: true } }
  render() { return this.state.failed ? this.props.fallback : this.props.children }
}

export function Dialog({ open, onClose, title, children, className = '' }: { open: boolean; onClose: () => void; title: string; children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDialogElement>(null)
  useEffect(() => {
    const dialog = ref.current
    if (!dialog || !open) return
    const trapTab = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return
      const controls = [...dialog.querySelectorAll<HTMLElement>('a[href], button:not(:disabled), input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])')].filter(el => el.getClientRects().length > 0)
      const first = controls[0], last = controls.at(-1)
      if (!first || !last) { event.preventDefault(); dialog.focus(); return }
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus() }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus() }
    }
    dialog.addEventListener('keydown', trapTab)
    return () => dialog.removeEventListener('keydown', trapTab)
  }, [open])
  useEffect(() => {
    const dialog = ref.current
    if (!dialog || !open) return
    const previous = document.activeElement as HTMLElement | null
    const previousOverflow = document.body.style.overflow
    dialog.showModal(); document.body.style.overflow = 'hidden'
    dialog.querySelector<HTMLElement>('[data-dialog-autofocus]')?.focus()
    return () => { dialog.close(); document.body.style.overflow = previousOverflow; previous?.focus() }
  }, [open])
  return <dialog ref={ref} className={`dialog ${className}`} aria-label={title} onCancel={onClose} onClick={e => { if (e.target === e.currentTarget) { const r = e.currentTarget.getBoundingClientRect(); if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) onClose() } }}><div className="dialog-heading"><h2>{title}</h2><button className="icon-button" onClick={onClose} aria-label="إغلاق"><X size={22}/></button></div>{children}</dialog>
}
export function FavoriteButton({ id }: { id: string }) {
  const { favorites, toggleFavorite } = useStore()
  const selected = favorites.includes(id)
  return <button className={`icon-button favorite ${selected ? 'selected' : ''}`} aria-label={selected ? 'إزالة من المفضلة' : 'حفظ في المفضلة'} aria-pressed={selected} onClick={() => toggleFavorite(id)}><Heart size={20} fill={selected ? 'currentColor' : 'none'}/></button>
}
export function ProductCard({ product }: { product: Product }) {
  const size = defaultSize(product)
  const available = product.variants.some(v => v.available)
  return <article className="product-card"><div className="product-card-image"><FavoriteButton id={product.id}/>{product.id === 'shams' && <span className="product-tag">اختيارنا لك</span>}{!available && <span className="product-tag">غير متوفر · تجريبي</span>}<Link to={`/product/${product.slug}`} aria-label={`اكتشف ${product.name}`}><BottleArt name={product.name} color={product.color} oil={product.type === 'oil'}/></Link><Link className="card-discover" to={`/product/${product.slug}`}>اكتشف الرائحة <ArrowUpLeft size={15}/></Link></div><div className="product-card-info"><Link to={`/product/${product.slug}`}><h3 dir="ltr">{product.name}</h3><p>{product.type === 'oil' ? 'زيت عطري' : 'أو دو بارفان'}<span> / </span>{product.arabicName}</p></Link><span className="product-price" dir="ltr">{money(product.variants.find(v => v.size === size)?.price ?? 0)}</span></div></article>
}
export function SectionTitle({ eyebrow, title, children }: { eyebrow: string; title: string; children?: ReactNode }) {
  return <div className="section-heading"><div><span className="eyebrow">{eyebrow}</span><h2>{title}</h2></div>{children}</div>
}
export function NotFound({ product = false }: { product?: boolean }) {
  return <main className="empty-page"><span className="eyebrow" dir="ltr">A DIFFERENT PATH</span><h1>{product ? 'لم نعثر على هذا العطر' : 'هذه الصفحة ليست هنا'}</h1><p>هناك رائحة تنتظرك في مكان آخر.</p><Link className="button" to="/shop">اكتشف المجموعة <ArrowUpLeft size={18}/></Link></main>
}
