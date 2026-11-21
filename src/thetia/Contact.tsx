import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { Instagram, Mail, MapPin, Phone, Music2 } from 'lucide-react'
import { brand } from './catalog'
import { useLang } from './i18n'

/* Laid out like THETIA's own contact page: the map on one side, the store's details on the other. */
export default function Contact() {
  const { t, to, pick } = useLang()
  const [name, setName] = useState('')
  const [from, setFrom] = useState('')
  const [msg, setMsg] = useState('')
  const map = `https://www.google.com/maps?q=${encodeURIComponent(brand.mapQuery)}&output=embed`
  const mapLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(brand.mapQuery)}`
  const send = (e: FormEvent) => {
    e.preventDefault()
    const body = `${msg}\n\n${name}${from ? ` · ${from}` : ''}`
    window.location.href = `mailto:${brand.emails[0]}?subject=${encodeURIComponent('THETIA')}&body=${encodeURIComponent(body)}`
  }

  return <>
    <nav className="t-crumbs" aria-label={t('crumbs')}><Link to={to('/')}>{t('home')}</Link> / <span>{t('contact')}</span></nav>
    <section className="t-contact">
      <div className="t-contact-map">
        <div className="t-map-fallback" aria-hidden="true"><MapPin size={34} /><b>{pick(brand.address.ar, brand.address.en)}</b></div>
        <iframe title={pick('خريطة متجر THETIA', 'Map of the THETIA store')} src={map} loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
        <a className="t-map-open" href={mapLink} target="_blank" rel="noreferrer"><MapPin size={15} />{t('openMaps')}</a>
      </div>
      <div className="t-contact-info">
        <h1>{t('storeName')}</h1>
        <dl className="t-contact-grid">
          <div><dt>{t('address')}</dt><dd>{pick(brand.address.ar, brand.address.en)}</dd></div>
          <div><dt>{t('phones')}</dt><dd><a href={`tel:${brand.phone.replace(/\s/g, '')}`} dir="ltr"><Phone size={15} /> {brand.phone}</a></dd></div>
          <div><dt>{t('email')}</dt><dd>{brand.emails.map(m => <a key={m} href={`mailto:${m}`} dir="ltr"><Mail size={15} /> {m}</a>)}</dd></div>
          <div><dt>{t('social')}</dt><dd className="t-socials">
            <a href={brand.instagram.url} target="_blank" rel="noreferrer" aria-label="Instagram"><Instagram size={18} /></a>
            <a href={brand.tiktok.url} target="_blank" rel="noreferrer" aria-label="TikTok"><Music2 size={18} /></a>
          </dd></div>
        </dl>
        <p className="t-contact-text">{t('contactText')}</p>
      </div>
    </section>
    <section className="t-section t-contact-form-wrap">
      <h2 className="t-h2">{t('writeUs')}</h2>
      <form className="t-contact-form" onSubmit={send}>
        <label className="t-field"><span>{t('yourName')}</span><input type="text" value={name} onChange={e => setName(e.target.value)} autoComplete="name" required /></label>
        <label className="t-field"><span>{t('yourEmail')}</span><input type="email" value={from} onChange={e => setFrom(e.target.value)} autoComplete="email" dir="ltr" /></label>
        <label className="t-field t-field-wide"><span>{t('message')}</span><textarea rows={5} value={msg} onChange={e => setMsg(e.target.value)} required /></label>
        <div className="t-field-wide t-contact-actions">
          <button className="t-btn" type="submit">{t('send')}</button>
          <a className="t-btn t-btn-line" href={`tel:${brand.phone.replace(/\s/g, '')}`}><Phone size={16} />{t('call')}</a>
        </div>
        <p className="t-muted t-small t-field-wide">{t('sendHelp')}</p>
      </form>
    </section>
  </>
}
