import { products as catalogProducts } from '../data/products'
import type { Product } from '../data/products'

export const families = ['vanilla', 'floral', 'citrus', 'woods', 'powder', 'fruity', 'musky', 'spicy'] as const
export type Family = typeof families[number]
export const familyNames: Record<Family, string> = { vanilla: 'فانيلا', floral: 'زهور وياسمين', citrus: 'حمضيات', woods: 'أخشاب وعود', powder: 'بودرة', fruity:'فاكهي', musky:'مسكي', spicy:'حار' }
export type Occasion = 'daily' | 'event' | 'gift' | 'any'
export type Budget = 'under100' | '100to150' | '151to200' | 'over200' | 'any'
export interface Answers { moods: Family[]; likes: Family[]; likesUnsure: boolean; dislikes: Family[]; dislikesNone: boolean; occasion: Occasion | null; budget: Budget | null }
export interface Progress { answers: Answers; step: number; savedResult: string | null }
export const emptyAnswers = (): Answers => ({ moods: [], likes: [], likesUnsure: false, dislikes: [], dislikesNone: false, occasion: null, budget: null })
export const initialProgress = (): Progress => ({ answers: emptyAnswers(), step: 0, savedResult: null })
export const storageKey = 'thetia-discover-v1'
const validFamilies = (value: unknown): value is Family[] => Array.isArray(value) && value.length <= families.length && value.every(v => families.includes(v)) && new Set(value).size === value.length
export function validAnswers(value: unknown): value is Answers {
  if (!value || typeof value !== 'object') return false
  const v = value as Answers
  return validFamilies(v.moods) && validFamilies(v.likes) && typeof v.likesUnsure === 'boolean' && !(v.likesUnsure && v.likes.length) && validFamilies(v.dislikes) && typeof v.dislikesNone === 'boolean' && !(v.dislikesNone && v.dislikes.length) && (v.occasion === null || ['daily','event','gift','any'].includes(v.occasion)) && (v.budget === null || ['under100','100to150','151to200','over200','any'].includes(v.budget))
}
export function readProgress(): Progress {
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(storageKey) || 'null')
    if (!parsed || typeof parsed !== 'object') return initialProgress()
    const value = parsed as Record<string, unknown>
    if (value.version !== 1 || !validAnswers(value.answers) || !Number.isInteger(value.step) || Number(value.step) < 0 || Number(value.step) > 4 || (value.savedResult !== null && typeof value.savedResult !== 'string')) return initialProgress()
    return { answers: value.answers, step: Number(value.step), savedResult: value.savedResult as string | null }
  } catch { return initialProgress() }
}
export function writeProgress(progress: Progress): boolean {
  try { localStorage.setItem(storageKey, JSON.stringify({ version: 1, ...progress })); return true } catch { return false }
}
export function clearProgress(): boolean {
  try { localStorage.removeItem(storageKey); return true } catch { return false }
}
export function conflict(a: Answers): Family[] { return a.likes.filter(f => a.dislikes.includes(f)) }
export function complete(a: Answers): boolean { return a.moods.length > 0 && (a.likes.length > 0 || a.likesUnsure) && (a.dislikes.length > 0 || a.dislikesNone) && a.occasion !== null && a.budget !== null && conflict(a).length === 0 }
export function budgetMatch(price: number, budget: Budget): boolean {
  return budget === 'any' || budget === 'under100' && price < 100 || budget === '100to150' && price >= 100 && price <= 150 || budget === '151to200' && price >= 151 && price <= 200 || budget === 'over200' && price > 200
}
interface Profile { productId: string; families: Family[]; occasion?: Exclude<Occasion,'any'>[]; source: string; status: 'verified' | 'demo' | 'user-provided' }
// Only Shams has enough sourced scent detail for a personal explanation today.
// Further profiles can be added after their particular attributes are verified.
export const recommendationProfiles: Profile[] = catalogProducts.filter(p=>p.type==='perfume').map(p=>({productId:p.id,families:families.filter(f=>p.notes.some(n=> f==='vanilla'?n.includes('فانيلي'):f==='floral'?/ورد|ياسمين|فاونيا|زهر/.test(n):f==='citrus'?/برغموت|ليمون|يوسفي/.test(n):f==='woods'?/صندل/.test(n):f==='fruity'?/ليتشي|كمثرى|توت|خوخ|تين|برقوق/.test(n):f==='musky'?/مسك/.test(n):f==='spicy'?/فلفل/.test(n):false)),source:'user-provided; internal note grouping',status:'user-provided'}))

export interface Recommendation { product: Product; size: number; price: number; score: number; reasons: string[]; matched: Family[]; status: 'verified' | 'demo' | 'user-provided' }
export function recommend(a: Answers, products: Product[], profiles: Profile[] = recommendationProfiles): Recommendation[] {
  if (!complete(a)) return []
  return profiles.flatMap((profile, order) => {
    const product = products.find(p => p.id === profile.productId && p.type === 'perfume')
    if (!product || profile.families.some(f => a.dislikes.includes(f))) return []
    const eligible = product.variants.filter(v => v.available && budgetMatch(v.price, a.budget!)).sort((x,y) => y.size - x.size)
    if (!eligible.length) return []
    const matched = a.likes.filter(f => profile.families.includes(f))
    const mood = a.moods.filter(f => profile.families.includes(f) && !matched.includes(f))
    const occasion = profile.occasion?.includes(a.occasion as Exclude<Occasion,'any'>) ? a.occasion : null
    if (!matched.length && !mood.length && !occasion) return []
    const reasons = [ ...matched.map(f => `اخترت ${familyNames[f]}، وتتضمن نوتات ${product.arabicName}: ${product.notes.filter(n=>f==='vanilla'?/فانيلي/.test(n):f==='floral'?/ورد|ياسمين|فاونيا|زهر/.test(n):f==='citrus'?/ليمون|برغموت|يوسفي/.test(n):f==='woods'?/صندل/.test(n):f==='fruity'?/ليتشي|كمثرى|توت|خوخ|تين|برقوق/.test(n):f==='musky'?/مسك/.test(n):/فلفل/.test(n)).join('، ')}.`), ...mood.map(f => `الأجواء التي اخترتها تلتقي مع ملمح ${familyNames[f]} في الرائحة.`) ]
    if (occasion) reasons.push('وصف الاستخدام الموثق يناسب الوقت الذي اخترته.')
    return [{ product, size: eligible[0].size, price: eligible[0].price, score: matched.length * 5 + mood.length + (occasion ? 1 : 0), reasons: reasons.slice(0,3), matched: [...matched,...mood], status: profile.status, order }]
  }).sort((x,y) => y.score - x.score || x.order - y.order).slice(0,3).map(({order: _order,...result}) => { void _order; return result })
}
