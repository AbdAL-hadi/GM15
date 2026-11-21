import { useSearchParams } from 'react-router-dom'
import { familyLabel, forLabel, items, kinds } from './catalog'
import type { Family, For, Kind } from './catalog'
import { useLang } from './i18n'
import { ProductCard, useText } from './ui'

export default function Shop() {
  const { t } = useLang()
  const tx = useText()
  const [params, setParams] = useSearchParams()
  const kind = (params.get('kind') as Kind | null) ?? 'all'
  const fam = (params.get('family') as Family | null) ?? 'all'
  const who = (params.get('for') as For | null) ?? 'all'
  const set = (k: string, v: string) => { const n = new URLSearchParams(params); if (v === 'all') n.delete(k); else n.set(k, v); if (k === 'kind') { n.delete('family'); n.delete('for') } setParams(n, { replace: true }) }
  const list = items.filter(i => (kind === 'all' || i.kind === kind) && (fam === 'all' || i.families.includes(fam)) && (who === 'all' || i.for.includes(who)))
  const perfumeFilters = kind === 'all' || kind === 'perfume'

  return <section className="t-section">
    <h1 className="t-h2">{t('shopTitle')}</h1>
    <div className="t-tabs" role="group" aria-label={t('section')}>
      <button aria-pressed={kind === 'all'} onClick={() => set('kind', 'all')}>{t('showAll')}</button>
      {kinds.map(k => <button key={k.id} aria-pressed={kind === k.id} onClick={() => set('kind', k.id)}>{tx.kind(k.id)}</button>)}
    </div>
    {perfumeFilters && <div className="t-filter-row">
      <div className="t-chips" role="group" aria-label={t('forWho')}>
        <button aria-pressed={who === 'all'} onClick={() => set('for', 'all')}>{t('everyone')}</button>
        {(Object.keys(forLabel) as For[]).map(f => <button key={f} aria-pressed={who === f} onClick={() => set('for', f)}>{tx.who(f)}</button>)}
      </div>
      <div className="t-chips" role="group" aria-label={t('family')}>
        <button aria-pressed={fam === 'all'} onClick={() => set('family', 'all')}>{t('allScents')}</button>
        {(Object.keys(familyLabel) as Family[]).map(f => <button key={f} aria-pressed={fam === f} onClick={() => set('family', f)}>{tx.family(f)}</button>)}
      </div>
    </div>}
    <p className="t-muted t-small t-center">{t('count', { n: list.length })}</p>
    <div className="t-grid">{list.map(i => <ProductCard key={i.slug} item={i} />)}</div>
  </section>
}
