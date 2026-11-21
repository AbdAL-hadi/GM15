import { useState } from 'react'
import { Link } from 'react-router-dom'
import { perfumes, priceText } from './catalog'
import type { Family, For, Item } from './catalog'
import { useLang } from './i18n'
import type { Key } from './i18n'
import { AccordBars, useText } from './ui'

type Answers = { who?: For | 'any'; families: Family[]; time?: 'day' | 'night' | 'both'; strength?: 1 | 2 | 3 }
type Step = { id: 'who' | 'families' | 'time' | 'strength'; q: [string, string]; hint?: [string, string]; options: [string, string, string][] }

const steps: Step[] = [
  { id: 'who', q: ['لمن العطر؟', 'Who is the perfume for?'], options: [['women', 'للمرأة', 'For her'], ['men', 'للرجل', 'For him'], ['unisex', 'للجنسين', 'For anyone'], ['any', 'لا فرق', 'It doesn’t matter']] },
  { id: 'families', q: ['أي رائحة تشدّك أكثر؟', 'Which kind of scent draws you in?'], hint: ['اختر حتى اثنتين.', 'Pick up to two.'], options: [
    ['floral', 'زهرية: ورد وياسمين', 'Floral: rose and jasmine'], ['citrus', 'حمضية ومنعشة', 'Citrus and fresh'], ['sweet', 'حلوة', 'Sweet'],
    ['vanilla', 'فانيليا دافئة', 'Warm vanilla'], ['oud', 'عود وأخشاب', 'Oud and woods'], ['spicy', 'توابل', 'Spicy'], ['fresh', 'نظيفة ومسكية', 'Clean and musky']] },
  { id: 'time', q: ['متى ستضعه غالبا؟', 'When will you wear it most?'], options: [['day', 'في النهار', 'During the day'], ['night', 'في المساء', 'In the evening'], ['both', 'الاثنين', 'Both']] },
  { id: 'strength', q: ['كم تحب أن تكون الرائحة قوية؟', 'How strong do you like a scent?'], options: [['1', 'ناعمة وقريبة', 'Soft and close to the skin'], ['2', 'متوسطة', 'In between'], ['3', 'قوية وتُلاحظ', 'Strong and noticed']] },
]

function score(i: Item, a: Answers) {
  let s = 0; const why: { fam: Family[]; time?: Key; strength?: Key } = { fam: [] }
  if (a.who && a.who !== 'any') {
    if (i.for.includes(a.who)) s += 3; else if (a.who === 'unisex' || i.for.includes('unisex')) s += 1; else s -= 6
  }
  why.fam = a.families.filter(f => i.families.includes(f)); s += why.fam.length * 4
  if (a.time === 'both' ? i.time.length === 2 : a.time && i.time.includes(a.time)) { s += 2; why.time = a.time === 'day' ? 'forDay' : a.time === 'night' ? 'forNight' : 'forBoth' }
  if (a.strength) { const d = Math.abs(i.strength - a.strength); s += 2 - d * 1.5; if (!d) why.strength = (['soft', 'medium', 'strong'] as const)[i.strength - 1] }
  return { i, s, why }
}

export default function Quiz() {
  const { t, to, pick } = useLang()
  const tx = useText()
  const [step, setStep] = useState(0)
  const [a, setA] = useState<Answers>({ families: [] })
  const done = step >= steps.length
  const cur = steps[Math.min(step, steps.length - 1)]

  const choose = (v: string) => {
    if (cur.id === 'families') {
      setA(x => ({ ...x, families: x.families.includes(v as Family) ? x.families.filter(f => f !== v) : [...x.families, v as Family].slice(-2) }))
      return
    }
    setA(x => ({ ...x, [cur.id]: cur.id === 'strength' ? Number(v) : v }))
    setStep(s => s + 1)
  }
  const selected = (v: string) => cur.id === 'families' ? a.families.includes(v as Family) : String(a[cur.id] ?? '') === v

  if (done) {
    const ranked = perfumes.map(i => score(i, a)).sort((x, y) => y.s - x.s).slice(0, 3)
    return <section className="t-section t-quiz">
      <p className="t-eyebrow">{t('resultsEyebrow')}</p>
      <h1 className="t-h2">{t('resultsTitle')}</h1>
      <ol className="t-results">{ranked.map(({ i, why }, k) => {
        const reasons = [why.fam.map(tx.family).join(t('and')), why.time && t(why.time), why.strength && t(why.strength)].filter(Boolean).map(r => pick(r as string, (r as string).toLowerCase()))
        return <li key={i.slug}>
          <span className="t-rank">{k + 1}</span>
          <Link to={to(`/p/${i.slug}`)} className="t-result-img"><img src={i.image} alt="" /></Link>
          <div>
            <Link to={to(`/p/${i.slug}`)} className="t-result-name">{tx.name(i)} <span dir="ltr">{i.latin}</span></Link>
            {reasons.length > 0 && <p className="t-result-why">{t('why', { x: reasons.join(pick('، ', ', ')) })}</p>}
            <AccordBars slug={i.slug} compact />
            <p dir="ltr" className="t-result-price">{priceText(i)}</p>
          </div>
        </li>
      })}</ol>
      <p className="t-center"><button className="t-btn t-btn-line" onClick={() => { setA({ families: [] }); setStep(0) }}>{t('retake')}</button></p>
    </section>
  }

  return <section className="t-section t-quiz">
    <p className="t-eyebrow">{t('quizEyebrow')}</p>
    <div className="t-quiz-bar" aria-hidden="true"><span style={{ width: `${(step / steps.length) * 100}%` }} /></div>
    <p className="t-muted t-small">{t('question', { n: step + 1, m: steps.length })}</p>
    <h1 className="t-h2">{pick(...cur.q)}</h1>
    {cur.hint && <p className="t-muted">{pick(...cur.hint)}</p>}
    <div className="t-options">{cur.options.map(([v, ar, en]) => <button key={v} aria-pressed={selected(v)} onClick={() => choose(v)}>{pick(ar, en)}</button>)}</div>
    <div className="t-quiz-nav">
      {step > 0 && <button className="t-link" onClick={() => setStep(s => s - 1)}>{t('back')}</button>}
      {cur.id === 'families' && <button className="t-btn" disabled={!a.families.length} onClick={() => setStep(s => s + 1)}>{t('next')}</button>}
    </div>
  </section>
}
