export type ProductType = 'perfume' | 'oil'
export interface Variant { size: number; price: number; available: boolean }
export interface Product {
  id: string; slug: string; name: string; arabicName: string; type: ProductType
  description: string; family: string; notes: string[]; color: string
  variants: Variant[]; source: string; contentStatus: 'verified' | 'demo'
}
const perfumeVariants = (available = true): Variant[] => [
  { size: 15, price: 80, available }, { size: 30, price: 110, available },
  { size: 50, price: 150, available }, { size: 100, price: 200, available },
]
export const products: Product[] = [
  { id: 'shams', slug: 'shams', name: 'SHAMS', arabicName: 'شمس', type: 'perfume', description: 'دفء الفانيلا، ونعومة البودرة، وحلاوة السكر البني والعسل، مع لمسة من الباتشولي. رائحة تستحضر حضنًا دافئًا.', family: 'فانيلا', notes: ['vanilla', 'powder', 'sugar', 'honey', 'patchouli'], color: '#e8c77b', variants: perfumeVariants(), source: 'https://thetia.shop/en/shop/shams/', contentStatus: 'verified' },
  { id: 'vanilla', slug: 'vanilla', name: 'VANILLA', arabicName: 'فانيلا', type: 'perfume', description: 'عطر من مجموعة ذاتية، لاكتشاف عالم الفانيلا. الوصف والتصنيف في هذه النسخة توضيحيان ويحتاجان اعتماد البراند.', family: 'فانيلا', notes: [], color: '#ebd6a1', variants: perfumeVariants(), source: 'https://thetia.shop/en/layering/', contentStatus: 'demo' },
  { id: 'day', slug: 'day', name: 'DAY', arabicName: 'داي', type: 'perfume', description: 'عطر من مجموعة ذاتية، ورد ضمن تنسيق زيت دمشق بإيحاءات الحمضيات والياسمين. التصنيف هنا توضيحي.', family: 'زهري', notes: [], color: '#d5d7b7', variants: perfumeVariants(), source: 'https://thetia.shop/en/layering/', contentStatus: 'demo' },
  { id: 'jawa', slug: 'jawa', name: 'JAWA', arabicName: 'جوا', type: 'perfume', description: 'عطر من مجموعة ذاتية، تقترح العلامة تنسيقه مع زيت الفانيلا. تفاصيل النوتات غير متاحة في بيانات هذه التجربة.', family: 'غير مصنّف', notes: [], color: '#cbad8a', variants: perfumeVariants(false), source: 'https://thetia.shop/en/layering/', contentStatus: 'demo' },
  { id: 'vanilla-oil', slug: 'vanilla-oil', name: 'VANILLA OIL', arabicName: 'زيت الفانيلا', type: 'oil', description: 'زيت عطري من ذاتية بحجم رول أون 5 مل، لاكتشاف فن تنسيق الروائح مع عطرك.', family: 'فانيلا', notes: [], color: '#e8cd91', variants: [{ size: 5, price: 45, available: true }], source: 'https://thetia.shop/en/layering/', contentStatus: 'verified' },
  { id: 'dimashq-oil', slug: 'dimashq-oil', name: 'DIMASHQ OIL', arabicName: 'زيت دمشق', type: 'oil', description: 'زيت عطري من ذاتية بحجم رول أون 5 مل، تقترح العلامة تنسيقه مع عطر Day.', family: 'زهري', notes: [], color: '#ded3a8', variants: [{ size: 5, price: 45, available: true }], source: 'https://thetia.shop/en/layering/', contentStatus: 'verified' },
]
export const getProduct = (id: string) => products.find(p => p.id === id || p.slug === id)
export const getVariant = (product: Product, size: number) => product.variants.find(v => v.size === size)
export const defaultSize = (product: Product) => product.variants.find(v => v.size === 50)?.size ?? product.variants[0]?.size
export const money = (price: number) => `${new Intl.NumberFormat('en', { maximumFractionDigits: 0 }).format(price)} ₪`
export const notes = {
  vanilla: { name: 'الفانيلا', english: 'Vanilla', description: 'إيحاء ناعم ودافئ، يضيف حلاوة مخملية إلى الرائحة.' },
  honey: { name: 'العسل', english: 'Honey', description: 'إيحاء حلو ودافئ يستحضر لون العسل الذهبي.' },
  patchouli: { name: 'الباتشولي', english: 'Patchouli', description: 'إيحاء ترابي عميق يضيف بُعدًا إلى الرائحة.' },
  powder: { name: 'البودرة', english: 'Baby powder', description: 'إيحاء بودري رقيق يستحضر النعومة.' },
  sugar: { name: 'السكر البني', english: 'Brown sugar', description: 'إيحاء حلو غني يستحضر دفء السكر البني.' },
} as const
export type NoteId = keyof typeof notes
export const sourceCheckedAt = '2026-11-17'
