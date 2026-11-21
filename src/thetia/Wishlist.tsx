import { Link } from 'react-router-dom'
import { getItem } from './catalog'
import type { Item } from './catalog'
import { useWish } from './bag'
import { useLang } from './i18n'
import { ProductCard } from './ui'

export default function Wishlist() {
  const { slugs } = useWish()
  const { t, to } = useLang()
  const list = slugs.map(getItem).filter(Boolean) as Item[]
  return <section className="t-section">
    <h1 className="t-h2">{t('wishTitle')}</h1>
    {list.length === 0
      ? <div className="t-empty"><p>{t('wishEmpty')}</p><Link to={to('/shop')} className="t-btn">{t('toShop')}</Link></div>
      : <><p className="t-muted t-small t-center">{t('wishCount', { n: list.length })}</p><div className="t-grid">{list.map(i => <ProductCard key={i.slug} item={i} />)}</div></>}
  </section>
}
