import { useEffect, useState } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { Heart, Instagram, Menu, Search, ShoppingBag, User, X } from 'lucide-react'
import { LOGO, brand, getItem, money } from './catalog'
import { BagProvider, WishProvider, useBag, useWish } from './bag'
import { useLang } from './i18n'
import { useText } from './ui'
import './thetia.css'

function Drawer() {
  const { lines, remove, open, setOpen } = useBag()
  const { t } = useLang()
  const tx = useText()
  const total = lines.reduce((s, l) => s + l.price * l.qty, 0)
  if (!open) return null
  return <div className="t-drawer-wrap" onClick={() => setOpen(false)}>
    <aside className="t-drawer" role="dialog" aria-label={t('bag')} onClick={e => e.stopPropagation()}>
      <header><h2>{t('bag')}</h2><button aria-label={t('close')} onClick={() => setOpen(false)}><X size={20} /></button></header>
      {lines.length === 0 ? <p className="t-muted">{t('bagEmpty')}</p> : <ul>{lines.map((l, i) => {
        const it = getItem(l.slug)
        return <li key={i}><img src={it?.image} alt="" /><div><b>{l.title ?? (it ? tx.name(it) : l.slug)}</b>{l.detail && <span>{l.detail}</span>}<span dir="ltr">{l.size} · {l.qty} × {money(l.price)}</span></div><button className="t-link" onClick={() => remove(i)}>{t('remove')}</button></li>
      })}</ul>}
      <footer><span>{t('total')}</span><b dir="ltr">{money(total)}</b></footer>
      <p className="t-muted t-small">{t('checkoutOff')}</p>
    </aside>
  </div>
}

function Header({ menu, setMenu }: { menu: boolean; setMenu: (v: boolean) => void }) {
  const { lines, setOpen } = useBag()
  const { slugs } = useWish()
  const { t, to, other, lang } = useLang()
  const count = lines.reduce((s, l) => s + l.qty, 0)
  const nav = [
    { to: to('/'), label: t('home'), end: true },
    { to: to('/shop'), label: t('shop') },
    { to: to('/refill'), label: t('refillBar') },
    { to: to('/notes'), label: t('wheel') },
    { to: to('/choose'), label: t('choose') },
    { to: to('/story'), label: t('story') },
    { to: to('/contact'), label: t('contact') },
  ]
  return <header className="t-header">
    <button className="t-burger" aria-label={t('menu')} aria-expanded={menu} onClick={() => setMenu(!menu)}>{menu ? <X size={24} /> : <Menu size={26} strokeWidth={1.5} />}</button>
    <Link to={to('/')} className="t-logo" aria-label={t('homeLink')}><img src={LOGO} alt="THETIA" /></Link>
    <nav className={`t-nav${menu ? ' is-open' : ''}`}>
      {nav.map(n => <NavLink key={n.to} to={n.to} end={n.end}>{n.label}</NavLink>)}
      <Link to={to('/account')} className="t-nav-extra">{t('account')}</Link>
      <Link to={other} className="t-lang t-lang-mobile" lang={lang === 'ar' ? 'en' : 'ar'}>{t('switchLang')}</Link>
    </nav>
    <div className="t-tools">
      <Link to={other} className="t-lang" aria-label={t('switchLangLabel')} lang={lang === 'ar' ? 'en' : 'ar'}>{t('switchLang')}</Link>
      <Link to={to('/shop')} aria-label={t('search')}><Search size={18} /></Link>
      <Link to={to('/account')} aria-label={t('account')} className="t-hide-sm"><User size={18} /></Link>
      <Link to={to('/wishlist')} aria-label={t('wishlist')} className="t-bag"><Heart size={18} />{slugs.length > 0 && <span>{slugs.length}</span>}</Link>
      <button aria-label={t('bagCount', { n: count })} onClick={() => setOpen(true)} className="t-bag"><ShoppingBag size={18} />{count > 0 && <span>{count}</span>}</button>
    </div>
  </header>
}

function Shell() {
  const [menu, setMenu] = useState(false)
  const { pathname } = useLocation()
  const { lang, dir, t, to } = useLang()
  useEffect(() => { setMenu(false); window.scrollTo(0, 0) }, [pathname])
  useEffect(() => { document.documentElement.lang = lang; document.documentElement.dir = dir; document.title = lang === 'en' ? 'THETIA · Perfumes' : 'THETIA · عطور' }, [lang, dir])
  return <div className={`t-site is-${lang}`} dir={dir} lang={lang}>
    <Header menu={menu} setMenu={setMenu} />
    <main className="t-main"><Outlet /></main>
    <footer className="t-footer">
      <img src={LOGO} alt="THETIA" className="t-footer-logo" />
      <p className="t-footer-made">{t('madeIn')}</p>
      <p>{t('thanks')}</p>
      <nav><Link to={to('/shop')}>{t('shop')}</Link><Link to={to('/notes')}>{t('wheel')}</Link><Link to={to('/choose')}>{t('choose')}</Link><Link to={to('/refill')}>{t('refillBar')}</Link><Link to={to('/wishlist')}>{t('wishlist')}</Link><Link to={to('/story')}>{t('story')}</Link><Link to={to('/contact')}>{t('contact')}</Link><Link to={to('/account')}>{t('account')}</Link></nav>
      <a className="t-footer-ig" href={brand.instagram.url} target="_blank" rel="noreferrer"><Instagram size={16} /> <bdi dir="ltr">{brand.instagram.handle}</bdi></a>
      <p className="t-muted" dir="ltr">{brand.emails[0]} · {brand.phone}</p>
    </footer>
    <Drawer />
  </div>
}

export default function Layout() {
  return <BagProvider><WishProvider><Shell /></WishProvider></BagProvider>
}
