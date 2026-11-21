import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { Heart, LogOut, MapPin, Package, User } from 'lucide-react'
import { getItem, money } from './catalog'
import { useBag, useWish } from './bag'
import { useLang } from './i18n'
import { useText } from './ui'

/* Review mock of the account area. Everything stays in this browser; there is no real sign-in yet. */
interface Profile { name: string; email: string; phone: string }
interface Address { city: string; street: string }
const read = <T,>(k: string, d: T): T => { try { return JSON.parse(localStorage.getItem(k) || '') as T } catch { return d } }
const write = (k: string, v: unknown) => { try { localStorage.setItem(k, JSON.stringify(v)) } catch { /* private mode */ } }

export default function Account() {
  const [user, setUser] = useState<Profile | null>(() => read<Profile | null>('thetia-user', null))
  useEffect(() => { if (user) write('thetia-user', user); else { try { localStorage.removeItem('thetia-user') } catch { /* private mode */ } } }, [user])
  return user ? <Dashboard user={user} setUser={setUser} /> : <SignIn onDone={setUser} />
}

function SignIn({ onDone }: { onDone: (p: Profile) => void }) {
  const { t } = useLang()
  const [mode, setMode] = useState<'in' | 'up'>('in')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const submit = (e: FormEvent) => { e.preventDefault(); onDone({ name: name || email.split('@')[0], email, phone: '' }) }
  return <section className="t-section t-auth">
    <h1 className="t-h2">{t('account')}</h1>
    <div className="t-tabs" role="tablist">
      <button role="tab" aria-selected={mode === 'in'} aria-pressed={mode === 'in'} onClick={() => setMode('in')}>{t('signIn')}</button>
      <button role="tab" aria-selected={mode === 'up'} aria-pressed={mode === 'up'} onClick={() => setMode('up')}>{t('createAccount')}</button>
    </div>
    <form className="t-auth-form" onSubmit={submit}>
      {mode === 'up' && <label className="t-field"><span>{t('fullName')}</span><input type="text" value={name} onChange={e => setName(e.target.value)} autoComplete="name" required /></label>}
      <label className="t-field"><span>{t('email')}</span><input type="email" value={email} onChange={e => setEmail(e.target.value)} autoComplete="email" dir="ltr" required /></label>
      <label className="t-field"><span>{t('password')}</span><input type="password" autoComplete={mode === 'up' ? 'new-password' : 'current-password'} dir="ltr" required minLength={6} /></label>
      <button className="t-btn" type="submit">{mode === 'in' ? t('signIn') : t('createAccount')}</button>
      <p className="t-muted t-small">{t('demoAuth')}</p>
    </form>
  </section>
}

type Tab = 'profile' | 'orders' | 'addresses'
function Dashboard({ user, setUser }: { user: Profile; setUser: (p: Profile | null) => void }) {
  const { t, to } = useLang()
  const tx = useText()
  const { lines } = useBag()
  const { slugs } = useWish()
  const [tab, setTab] = useState<Tab>('profile')
  const [draft, setDraft] = useState(user)
  const [saved, setSaved] = useState(false)
  const [addresses, setAddresses] = useState<Address[]>(() => read<Address[]>('thetia-addresses', []))
  const [city, setCity] = useState('')
  const [street, setStreet] = useState('')
  useEffect(() => write('thetia-addresses', addresses), [addresses])
  const tabs: { id: Tab; label: string; icon: typeof User }[] = [{ id: 'profile', label: t('profile'), icon: User }, { id: 'orders', label: t('orders'), icon: Package }, { id: 'addresses', label: t('addresses'), icon: MapPin }]

  return <section className="t-section t-dash">
    <h1 className="t-h2">{t('hello', { n: user.name })}</h1>
    <div className="t-dash-grid">
      <nav className="t-dash-nav" aria-label={t('account')}>
        {tabs.map(x => <button key={x.id} aria-current={tab === x.id} onClick={() => setTab(x.id)}><x.icon size={17} />{x.label}</button>)}
        <Link to={to('/wishlist')}><Heart size={17} />{t('wishlist')} <span className="t-muted">({slugs.length})</span></Link>
        <button onClick={() => setUser(null)}><LogOut size={17} />{t('signOut')}</button>
      </nav>
      <div className="t-dash-panel">
        {tab === 'profile' && <form className="t-auth-form" onSubmit={e => { e.preventDefault(); setUser(draft); setSaved(true); setTimeout(() => setSaved(false), 2000) }}>
          <label className="t-field"><span>{t('fullName')}</span><input type="text" value={draft.name} onChange={e => setDraft({ ...draft, name: e.target.value })} autoComplete="name" /></label>
          <label className="t-field"><span>{t('email')}</span><input type="email" value={draft.email} onChange={e => setDraft({ ...draft, email: e.target.value })} autoComplete="email" dir="ltr" /></label>
          <label className="t-field"><span>{t('phone')}</span><input type="tel" value={draft.phone} onChange={e => setDraft({ ...draft, phone: e.target.value })} autoComplete="tel" dir="ltr" /></label>
          <button className="t-btn" type="submit">{saved ? t('saved') : t('saveChanges')}</button>
          <p className="t-muted t-small">{t('demoAuth')}</p>
        </form>}
        {tab === 'orders' && <div className="t-dash-orders">
          <p className="t-muted">{t('noOrders')}</p>
          {lines.length > 0 && <><h3>{t('inBag')}</h3><ul className="t-dash-lines">{lines.map((l, i) => {
            const it = getItem(l.slug)
            return <li key={i}><img src={it?.image} alt="" /><span><b>{l.title ?? (it ? tx.name(it) : l.slug)}</b><small dir="ltr">{l.size} · {l.qty} × {money(l.price)}</small></span></li>
          })}</ul></>}
          <Link to={to('/shop')} className="t-btn t-btn-line">{t('toShop')}</Link>
        </div>}
        {tab === 'addresses' && <div>
          {addresses.length === 0 ? <p className="t-muted">{t('noAddresses')}</p> : <ul className="t-addr">{addresses.map((a, i) => <li key={i}><MapPin size={16} /><span><b>{a.city}</b><br />{a.street}</span><button className="t-link" onClick={() => setAddresses(addresses.filter((_, j) => j !== i))}>{t('removeAddress')}</button></li>)}</ul>}
          <form className="t-auth-form" onSubmit={e => { e.preventDefault(); setAddresses([...addresses, { city, street }]); setCity(''); setStreet('') }}>
            <h3>{t('addAddress')}</h3>
            <label className="t-field"><span>{t('city')}</span><input type="text" value={city} onChange={e => setCity(e.target.value)} autoComplete="address-level2" required /></label>
            <label className="t-field"><span>{t('street')}</span><input type="text" value={street} onChange={e => setStreet(e.target.value)} autoComplete="street-address" required /></label>
            <button className="t-btn" type="submit">{t('addAddress')}</button>
          </form>
        </div>}
      </div>
    </div>
  </section>
}
