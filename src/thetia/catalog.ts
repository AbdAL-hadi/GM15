/* Real THETIA catalogue, read from https://thetia.shop/ar/ on 2026-11-20.
   Names, photos, notes and price ranges come from the live product pages.
   Per-size prices inside a range are estimates until the shop confirms them. */

const IMG = 'https://thetia.shop/wp-content/uploads/'
export const LOGO = IMG + '2023/12/1.png'

export type Kind = 'perfume' | 'oil' | 'cream' | 'package' | 'hoodie'
export type For = 'women' | 'men' | 'unisex'
export type Family = 'citrus' | 'floral' | 'sweet' | 'vanilla' | 'oud' | 'fresh' | 'spicy'
export type Shape = 'tall' | 'squat' | 'roll'

export interface Size { label: string; price: number }
export interface Item {
  slug: string; name: string; latin: string; kind: Kind; image: string
  tagline?: string; description: string
  pyramid?: { top: string[]; heart: string[]; base: string[] }
  notes: string[]
  for: For[]; families: Family[]
  sizes: Size[]; was?: number
  shape: Shape; liquid: string
  /** 1 = soft, 3 = strong. Used by the quiz. */
  strength: 1 | 2 | 3
  time: ('day' | 'night')[]
}

const range = (from: number, to: number): Size[] =>
  from === 40 && to === 200 ? [{ label: '15 mL', price: 40 }, { label: '30 mL', price: 80 }, { label: '50 mL', price: 130 }, { label: '100 mL', price: 200 }]
  : from === 40 ? [{ label: '15 mL', price: 40 }, { label: '30 mL', price: 80 }, { label: '50 mL', price: 130 }]
  : [{ label: '30 mL', price: 80 }, { label: '50 mL', price: 130 }, { label: '100 mL', price: 200 }]

const p = (top: string[], heart: string[], base: string[]) => ({ pyramid: { top, heart, base }, notes: [...top, ...heart, ...base] })

export const items: Item[] = [
  { slug: 'jawa', name: 'جوى', latin: 'JAWA', kind: 'perfume', image: IMG + '2024/08/ayden-featured-1.png', tagline: 'RED GOLD · THE LANGUAGE OF ELEGANCE',
    description: 'أرقى عطورنا، مع نوتات عليا من الزعفران والياسمين، التنوب والأرز، مع لمسة من خشب العنبر وإحساس هادئ بالغموض.',
    ...p(['زعفران', 'ياسمين'], ['خشب العنبر', 'عنبر'], ['راتنج التنوب', 'أرز']),
    for: ['women', 'unisex'], families: ['vanilla', 'oud'], sizes: range(80, 200), shape: 'tall', liquid: '#efe6c4', strength: 3, time: ['night'] },
  { slug: 'cloud', name: 'كلاود', latin: 'CLOUD', kind: 'perfume', image: IMG + '2020/10/musk-altahara-featured.png', tagline: 'CLOUDY SKY · COTTON FEELING',
    description: 'سرير من النوتات الغائمة: اللوز المر، الطحلب، ياسمين سامباك، الفانيليا والمسك، لرائحة تجمع الحلاوة والنوتات الجوزية والفواكه.',
    ...p(['مشمش', 'برقوق', 'جوز الهند'], ['توبيروز', 'ياسمين', 'ورد'], ['خشب الصندل', 'لوز', 'فانيليا', 'مسك']),
    for: ['women'], families: ['vanilla', 'sweet'], sizes: range(40, 130), shape: 'tall', liquid: '#f4f4f1', strength: 2, time: ['day', 'night'] },
  { slug: 'shams', name: 'شمس', latin: 'SHAMS', kind: 'perfume', image: IMG + '2024/08/30-clear-1-500x500.png', tagline: 'GOLDEN SUN · THE DESCRIPTION OF DELICACY',
    description: 'فانيليا، بودرة أطفال، سكر بني، عسل، باتشولي، وعناق دافئ.',
    notes: ['فانيليا', 'بودرة أطفال', 'سكر بني', 'عسل', 'باتشولي'],
    for: ['women'], families: ['vanilla', 'sweet'], sizes: range(80, 200), shape: 'squat', liquid: '#f6f3ea', strength: 2, time: ['day', 'night'] },
  { slug: 'dana', name: 'دانا', latin: 'DANA', kind: 'perfume', image: IMG + '2024/08/dana-feature.png', tagline: 'CANDY BED · FLOWERY FEELING',
    description: 'ياسمين منعش وفانيليا سوداء مع طبقة حلوة من الكراميل، لحقل من الزهور لا يتوقف.',
    ...p(['برتقال دموي', 'فانيليا سوداء'], ['عسل', 'غاردينيا', 'زهر البرتقال', 'ياسمين', 'خوخ'], ['شمع العسل', 'كراميل', 'باتشولي', 'عرق سوس']),
    for: ['women'], families: ['sweet', 'floral'], sizes: range(80, 200), shape: 'tall', liquid: '#efdcb6', strength: 3, time: ['night'] },
  { slug: 'amar', name: 'قمر', latin: 'AMAR', kind: 'perfume', image: IMG + '2020/10/amar-featured-1.png', tagline: 'LEMON GARDEN · AN AROMA OF SPRING',
    description: 'رائحة حلوة، حمضية، مسكية ومشمسة مع لمسة نقية من الانتعاش.',
    notes: ['ليمون', 'حمضيات', 'مسك'],
    for: ['women'], families: ['citrus', 'fresh'], sizes: range(40, 200), shape: 'tall', liquid: '#eef0cf', strength: 1, time: ['day'] },
  { slug: 'ayden', name: 'ايدن', latin: 'AYDEN', kind: 'perfume', image: IMG + '2024/08/ayden-featured-1.png', tagline: 'SPICY CLOUD · ON A COLD NIGHT',
    description: 'ترحيب زهري دافئ، بقاعدة من ياسمين سامباك وخشب الكشميران والتوابل.',
    ...p(['ياسمين سامباك'], ['خشب الكشميران', 'عنبر أبيض'], ['مسك أبيض', 'خشب الصندل']),
    for: ['women'], families: ['floral', 'oud', 'spicy'], sizes: range(40, 200), shape: 'tall', liquid: '#efe6c4', strength: 2, time: ['night'] },
  { slug: 'day', name: 'داي', latin: 'DAY', kind: 'perfume', image: IMG + '2024/08/day-feature.png', tagline: 'CITRUS GARDEN · A PURE REPRESENTATION OF SPRING',
    description: 'مزيج من الفواكه الحمضية مع نوتات عليا من الجريب فروت والزنجبيل والباتشولي، ولمسة ياسمين في حمام من النوتات البودرية.',
    ...p(['برتقال صقلي', 'ليمون', 'برغموت'], ['نوتات فاكهية', 'نوتات متوسطية'], ['مسك أبيض', 'عنبر', 'فانيليا']),
    for: ['women', 'unisex'], families: ['citrus', 'fresh'], sizes: range(40, 130), shape: 'squat', liquid: '#f5f5f2', strength: 1, time: ['day'] },
  { slug: 'love', name: 'لوف', latin: 'LOVE', kind: 'perfume', image: IMG + '2024/08/day-feature.png', tagline: 'FLOWER BED · A FIELD OF POWER',
    description: 'الورد والحب والتوابل في مزيج واحد. إحساس زهري، نقي ومسكي، على سرير من الخشب.',
    ...p(['ورد', 'عنبر', 'ليمون'], ['سكر', 'توابل شرقية'], ['خوخ', 'قرنفل']),
    for: ['women', 'unisex'], families: ['floral', 'oud', 'spicy'], sizes: range(80, 200), shape: 'squat', liquid: '#f5f5f2', strength: 2, time: ['day', 'night'] },
  { slug: 'skie', name: 'سكاي', latin: 'SKIE', kind: 'perfume', image: IMG + '2024/08/ayden-featured-1.png', tagline: 'PINK PEPPER',
    description: 'زهر البرتقال، القهوة، الفانيليا، خشب الأرز والباتشولي، لأمسية خارجة ولامرأة قوية ذات حضور لافت.',
    ...p(['كمثرى', 'فلفل وردي', 'زهر البرتقال'], ['قهوة', 'ياسمين', 'لوز مر', 'عرق سوس'], ['فانيليا', 'باتشولي', 'أرز', 'خشب الكشمير']),
    for: ['women'], families: ['floral', 'sweet', 'spicy'], sizes: range(40, 200), shape: 'tall', liquid: '#efe6c4', strength: 3, time: ['night'] },
  { slug: 'sweet', name: 'سويت', latin: 'SWEET', kind: 'perfume', image: IMG + '2024/08/ayden-featured-1.png', tagline: 'CANDY LAND',
    description: 'الهيل والفلفل الوردي وأوراق البنفسج، مع قطرة فانيليا ونفحة كستناء حلوة، كحقل من حلوى الحمضيات.',
    notes: ['هيل', 'فلفل وردي', 'أوراق البنفسج', 'فانيليا', 'كستناء'],
    for: ['women'], families: ['sweet', 'spicy'], sizes: range(80, 200), shape: 'tall', liquid: '#efe6c4', strength: 2, time: ['day', 'night'] },
  { slug: 'vanilla-perfume', name: 'فانيلا', latin: 'VANILLA', kind: 'perfume', image: IMG + '2020/10/vanilla.png', tagline: 'PURE VANILLA',
    description: 'عطر الفانيليا النقي: كأنك نائم على حلوى المارشميلو على حافة سحابة، مع قطرات آيس كريم الفانيليا.',
    notes: ['فانيليا', 'مارشميلو'],
    for: ['women'], families: ['vanilla', 'sweet'], sizes: range(40, 200), shape: 'tall', liquid: '#efdcb6', strength: 2, time: ['day', 'night'] },
  { slug: 'leil', name: 'ليل', latin: 'LEIL', kind: 'perfume', image: IMG + '2024/08/day-feature.png', tagline: 'DARK SENSATION · A ROOM OF MYSTERY',
    description: 'البرغموت والأناناس والورد مع لمسة فانيليا. ليلة قمر مكتمل مظلمة هي الوقت المثالي لهذا العطر.',
    ...p(['زنجبيل', 'فلفل وردي', 'ماندرين'], ['باتشولي', 'ورد', 'فتيفير', 'أناناس'], ['مسك', 'ستيراكس', 'بنفسج']),
    for: ['men'], families: ['spicy', 'fresh'], sizes: range(80, 200), shape: 'squat', liquid: '#f5f5f2', strength: 3, time: ['night'] },
  { slug: 'mood', name: 'مود', latin: 'MOOD', kind: 'perfume', image: IMG + '2024/08/day-feature.png', tagline: 'SECRET RAIN · IN A SHALLOW FOREST',
    description: 'غامض، مسكي وبري. شتاء وليلة باردة بجانب النار، مع ليمون وزنجبيل وياسمين وفلفل وردي.',
    ...p(['ليمون', 'نعناع', 'فلفل وردي', 'جريب فروت'], ['زنجبيل', 'جوزة الطيب', 'ياسمين'], ['لابدانوم']),
    for: ['men'], families: ['fresh', 'citrus', 'spicy'], sizes: range(40, 130), shape: 'squat', liquid: '#f5f5f2', strength: 2, time: ['day', 'night'] },
  { slug: 'wassim', name: 'وسيم', latin: 'WASSIM', kind: 'perfume', image: IMG + '2024/08/ayden-featured-1.png', tagline: 'FRESH DROP · FINEST TOUCH',
    description: 'فلفل سيتشوان، البرغموت، اللافندر وجوزة الطيب.',
    ...p(['برغموت', 'فلفل'], ['فلفل سيتشوان', 'لافندر', 'فلفل وردي', 'فتيفير', 'باتشولي'], ['أمبروكسان', 'أرز', 'لابدانوم']),
    for: ['men'], families: ['fresh', 'spicy'], sizes: range(40, 130), shape: 'tall', liquid: '#efe6c4', strength: 2, time: ['day'] },

  { slug: 'vanilla-oil', name: 'زيت فانيلا', latin: 'VANILLA OIL', kind: 'oil', image: IMG + '2023/12/vanilla-1-500x500.png', description: 'زيت عطري رول أون 5 مل، للتنسيق مع عطرك.', notes: ['فانيليا'],
    for: ['women', 'unisex'], families: ['vanilla'], sizes: [{ label: '5 mL', price: 75 }], was: 150, shape: 'roll', liquid: '#e2b93b', strength: 2, time: ['day', 'night'] },
  { slug: 'dimashq', name: 'دمشق', latin: 'DIMASHQ', kind: 'oil', image: IMG + '2023/12/dimashq-featured.png', description: 'زيت عطري رول أون 5 مل.', notes: ['ورد'],
    for: ['unisex'], families: ['floral'], sizes: [{ label: '5 mL', price: 75 }], was: 150, shape: 'roll', liquid: '#e2b93b', strength: 2, time: ['day', 'night'] },
  { slug: 'musk-al-tahara', name: 'مسك الطهارة', latin: 'MUSK AL TAHARA', kind: 'oil', image: IMG + '2023/12/musk-altahara.png', description: 'زيت عطري رول أون 5 مل.', notes: ['مسك'],
    for: ['unisex'], families: ['fresh'], sizes: [{ label: '5 mL', price: 75 }], was: 150, shape: 'roll', liquid: '#f3f0e3', strength: 1, time: ['day'] },
  { slug: 'oud', name: 'عود', latin: 'OUD', kind: 'oil', image: IMG + '2023/12/oud-and-sparks-featured.png', description: 'زيت عطري رول أون 5 مل.', notes: ['عود'],
    for: ['unisex'], families: ['oud'], sizes: [{ label: '5 mL', price: 150 }], shape: 'roll', liquid: '#f0ead6', strength: 3, time: ['night'] },
  { slug: 'spark', name: 'سبارك', latin: 'SPARK', kind: 'oil', image: IMG + '2023/12/oud-and-sparks-featured.png', description: 'زيت عطري رول أون 5 مل.', notes: [],
    for: ['unisex'], families: ['fresh'], sizes: [{ label: '5 mL', price: 150 }], shape: 'roll', liquid: '#f0ead6', strength: 2, time: ['day', 'night'] },

  { slug: 'body-lotion', name: 'لوشن الجسم', latin: 'BODY LOTION', kind: 'cream', image: IMG + '2026/11/IMG_3118-removebg-preview.png', description: 'لوشن جسم من ذاتية.', notes: [],
    for: ['unisex'], families: [], sizes: [{ label: 'لوشن', price: 59 }], shape: 'tall', liquid: '#fff', strength: 1, time: ['day'] },
  { slug: 'milk-honey-hand-cream', name: 'كريم يدين حليب وعسل', latin: 'MILK & HONEY', kind: 'cream', image: IMG + '2026/11/IMG_3119-removebg-preview.png', description: 'كريم يدين بالحليب والعسل.', notes: ['حليب', 'عسل'],
    for: ['unisex'], families: [], sizes: [{ label: 'كريم', price: 30 }], shape: 'tall', liquid: '#fff', strength: 1, time: ['day'] },

  { slug: 'sprayer-3in1', name: 'عرض 3 في 1', latin: '3 IN 1 · 15 mL', kind: 'package', image: IMG + '2024/08/3in1.png', description: 'ثلاثة عطور بحجم 15 مل في علبة واحدة.', notes: [],
    for: ['unisex'], families: [], sizes: [{ label: '3 × 15 mL', price: 240 }], shape: 'tall', liquid: '#fff', strength: 1, time: ['day'] },
  { slug: 'oil-package', name: 'مجموعة زيوت 5 في 1', latin: '5 IN 1 OILS', kind: 'package', image: IMG + '2020/10/5in1-package.png', description: 'خمسة زيوت عطرية بحجم 5 مل: سبارك، عود، دمشق، مسك الطهارة، فانيلا.', notes: [],
    for: ['unisex'], families: [], sizes: [{ label: '5 × 5 mL', price: 750 }], shape: 'tall', liquid: '#fff', strength: 1, time: ['day'] },

  { slug: 'black-hoodie', name: 'هودي أسود', latin: 'BLACK HOODIE', kind: 'hoodie', image: IMG + '2026/08/IMG_0397-removebg-preview.png', description: 'هودي THETIA باللون الأسود.', notes: [],
    for: ['unisex'], families: [], sizes: [{ label: 'S', price: 175 }, { label: 'M', price: 175 }, { label: 'L', price: 175 }, { label: 'XL', price: 175 }], was: 250, shape: 'tall', liquid: '#fff', strength: 1, time: ['day'] },
  { slug: 'white-hoodie', name: 'هودي أبيض', latin: 'WHITE HOODIE', kind: 'hoodie', image: IMG + '2026/08/IMG_0395-removebg-preview.png', description: 'هودي THETIA باللون الأبيض.', notes: [],
    for: ['unisex'], families: [], sizes: [{ label: 'S', price: 175 }, { label: 'M', price: 175 }, { label: 'L', price: 175 }, { label: 'XL', price: 175 }], was: 250, shape: 'tall', liquid: '#fff', strength: 1, time: ['day'] },
]

/** The live homepage's "الاكثر مبيعا" row. */
export const bestSellers = ['jawa', 'vanilla-oil', 'cloud', 'shams']

export const kinds: { id: Kind; label: string }[] = [
  { id: 'perfume', label: 'العطور' }, { id: 'oil', label: 'زيوت' }, { id: 'cream', label: 'كريمات' }, { id: 'package', label: 'باقات' }, { id: 'hoodie', label: 'هوديز' },
]
export const familyLabel: Record<Family, string> = {
  citrus: 'حمضي', floral: 'زهري', sweet: 'سويت', vanilla: 'فانيليا', oud: 'عود', fresh: 'منعش', spicy: 'توابل',
}
export const forLabel: Record<For, string> = { women: 'المرأة', men: 'الرجال', unisex: 'للجنسين' }

export const getItem = (slug: string) => items.find(i => i.slug === slug)
export const money = (n: number) => `₪${n}`
export const priceText = (i: Item) => i.sizes.length > 1 ? `${money(i.sizes[0].price)} – ${money(i.sizes[i.sizes.length - 1].price)}` : money(i.sizes[0].price)
export const perfumes = items.filter(i => i.kind === 'perfume')

/* ---------- English copy (written by hand from the live Arabic and English pages) ---------- */
export const english: Record<string, { name: string; description: string }> = {
  jawa: { name: 'Jawa', description: 'Our finest perfume: top notes of saffron and jasmine, fir and cedar, with a touch of amberwood and a calm sense of mystery.' },
  cloud: { name: 'Cloud', description: 'A bed of cloudy notes: bitter almond, moss, jasmine sambac, vanilla and musk, for a scent that brings together sweetness, nutty notes and fruit.' },
  shams: { name: 'Shams', description: 'Vanilla, baby powder, brown sugar, honey, patchouli and a warm embrace.' },
  dana: { name: 'Dana', description: 'Fresh jasmine and black vanilla with a sweet caramel topping, for an endless field of flowers.' },
  amar: { name: 'Amar', description: 'Sweet, citrusy, musky and sunny, with a clean touch of freshness.' },
  ayden: { name: 'Ayden', description: 'A warm floral welcome, on a base of jasmine sambac, cashmeran wood and spices.' },
  day: { name: 'Day', description: 'A mix of citrus fruits with top notes of grapefruit, ginger and patchouli, and a touch of jasmine in a bath of powdery notes.' },
  love: { name: 'Love', description: 'Rose, love and spice blended into one. Floral, clean and musky, on a bed of wood.' },
  skie: { name: 'Skie', description: 'Orange blossom, coffee, vanilla, cedar and patchouli, blended for a night out. Made for a strong woman with a striking presence.' },
  sweet: { name: 'Sweet', description: 'Cardamom, pink pepper and violet leaf make this perfume unique. Add a drop of vanilla and a hint of sweet chestnut, and you have a field of citrus candy.' },
  'vanilla-perfume': { name: 'Vanilla', description: 'Our pure vanilla perfume feels like sleeping on marshmallows at the edge of a cloud, with drops of vanilla ice cream.' },
  leil: { name: 'Leil', description: 'Bergamot, pineapple and rose with a touch of vanilla, all in one blend. A dark full-moon night is the perfect time to wear it.' },
  mood: { name: 'Mood', description: 'Mysterious, musky and wild. A winter mood, a cold night by the fire, brought to life by lemon, ginger, jasmine and pink pepper.' },
  wassim: { name: 'Wassim', description: 'Sichuan pepper, bergamot, lavender and nutmeg.' },
  'vanilla-oil': { name: 'Vanilla oil', description: 'A 5 mL roll-on perfume oil to layer with your perfume.' },
  dimashq: { name: 'Dimashq', description: 'A 5 mL roll-on perfume oil.' },
  'musk-al-tahara': { name: 'Musk Al Tahara', description: 'A 5 mL roll-on perfume oil.' },
  oud: { name: 'Oud', description: 'A 5 mL roll-on perfume oil.' },
  spark: { name: 'Spark', description: 'A 5 mL roll-on perfume oil.' },
  'body-lotion': { name: 'Body lotion', description: 'THETIA body lotion.' },
  'milk-honey-hand-cream': { name: 'Milk & honey hand cream', description: 'A hand cream with milk and honey.' },
  'sprayer-3in1': { name: '3 in 1 offer', description: 'Three 15 mL perfumes in one box.' },
  'black-hoodie': { name: 'Black hoodie', description: 'THETIA hoodie in black.' },
  'white-hoodie': { name: 'White hoodie', description: 'THETIA hoodie in white.' },
  'oil-package': { name: '5 in 1 oil set', description: 'Five 5 mL perfume oils: Spark, Oud, Dimashq, Musk Al Tahara and Vanilla.' },
}

export const kindEn: Record<Kind, string> = { perfume: 'Perfumes', oil: 'Oils', cream: 'Creams', package: 'Packages', hoodie: 'Hoodies' }
export const familyEn: Record<Family, string> = { citrus: 'Citrus', floral: 'Floral', sweet: 'Sweet', vanilla: 'Vanilla', oud: 'Oud', fresh: 'Fresh', spicy: 'Spicy' }
export const forEn: Record<For, string> = { women: 'Women', men: 'Men', unisex: 'Unisex' }

/* ---------- Main accords, shown as coloured bars like perfume reference sites ---------- */
export type Accord = 'citrus' | 'floral' | 'white-floral' | 'rose' | 'sweet' | 'vanilla' | 'woody' | 'amber' | 'warm-spicy' | 'fresh-spicy'
  | 'fruity' | 'powdery' | 'musky' | 'aromatic' | 'fresh' | 'honey' | 'coffee' | 'nutty' | 'earthy'

export const accordInfo: Record<Accord, { ar: string; en: string; color: string; ink: string }> = {
  citrus: { ar: 'حمضي', en: 'citrus', color: '#f2e04b', ink: '#000' },
  floral: { ar: 'زهري', en: 'floral', color: '#f4a3bd', ink: '#000' },
  'white-floral': { ar: 'زهور بيضاء', en: 'white floral', color: '#eef0dc', ink: '#000' },
  rose: { ar: 'ورد', en: 'rose', color: '#e6577a', ink: '#fff' },
  sweet: { ar: 'حلو', en: 'sweet', color: '#e2445a', ink: '#fff' },
  vanilla: { ar: 'فانيليا', en: 'vanilla', color: '#f3e5bc', ink: '#000' },
  woody: { ar: 'خشبي', en: 'woody', color: '#7d5236', ink: '#fff' },
  amber: { ar: 'عنبري', en: 'amber', color: '#c66f22', ink: '#fff' },
  'warm-spicy': { ar: 'توابل دافئة', en: 'warm spicy', color: '#c13d22', ink: '#fff' },
  'fresh-spicy': { ar: 'توابل منعشة', en: 'fresh spicy', color: '#8cc59a', ink: '#000' },
  fruity: { ar: 'فاكهي', en: 'fruity', color: '#f2814f', ink: '#000' },
  powdery: { ar: 'بودري', en: 'powdery', color: '#e9d8c6', ink: '#000' },
  musky: { ar: 'مسكي', en: 'musky', color: '#dcd2e6', ink: '#000' },
  aromatic: { ar: 'عطري', en: 'aromatic', color: '#4f9a80', ink: '#fff' },
  fresh: { ar: 'منعش', en: 'fresh', color: '#a6dbe4', ink: '#000' },
  honey: { ar: 'عسلي', en: 'honey', color: '#e8b642', ink: '#000' },
  coffee: { ar: 'قهوة', en: 'coffee', color: '#5c3d2b', ink: '#fff' },
  nutty: { ar: 'جوزي', en: 'nutty', color: '#c9a27a', ink: '#000' },
  earthy: { ar: 'ترابي', en: 'earthy', color: '#8a7a55', ink: '#fff' },
}

export const accords: Record<string, [Accord, number][]> = {
  jawa: [['amber', 100], ['woody', 86], ['warm-spicy', 72], ['white-floral', 52]],
  cloud: [['sweet', 100], ['fruity', 82], ['white-floral', 74], ['vanilla', 66], ['nutty', 52], ['musky', 44]],
  shams: [['vanilla', 100], ['powdery', 86], ['sweet', 80], ['honey', 64], ['earthy', 40]],
  dana: [['sweet', 100], ['honey', 84], ['white-floral', 72], ['vanilla', 60], ['citrus', 48], ['earthy', 38]],
  amar: [['citrus', 100], ['fresh', 76], ['sweet', 54], ['musky', 50]],
  ayden: [['white-floral', 100], ['woody', 80], ['amber', 64], ['musky', 54], ['warm-spicy', 44]],
  day: [['citrus', 100], ['fruity', 72], ['powdery', 60], ['musky', 54], ['amber', 40], ['vanilla', 34]],
  love: [['rose', 100], ['warm-spicy', 82], ['sweet', 66], ['fruity', 50], ['amber', 44], ['woody', 40]],
  skie: [['warm-spicy', 100], ['coffee', 82], ['vanilla', 74], ['white-floral', 60], ['woody', 54], ['fruity', 44]],
  sweet: [['sweet', 100], ['warm-spicy', 80], ['vanilla', 70], ['powdery', 54], ['nutty', 44]],
  'vanilla-perfume': [['vanilla', 100], ['sweet', 84], ['powdery', 50]],
  leil: [['fresh-spicy', 100], ['woody', 80], ['rose', 60], ['fruity', 54], ['musky', 50], ['powdery', 40]],
  mood: [['citrus', 100], ['fresh-spicy', 86], ['aromatic', 70], ['white-floral', 50], ['amber', 44]],
  wassim: [['aromatic', 100], ['fresh-spicy', 90], ['citrus', 70], ['woody', 64], ['amber', 50]],
  'vanilla-oil': [['vanilla', 100], ['sweet', 70]],
  dimashq: [['rose', 100], ['floral', 70]],
  'musk-al-tahara': [['musky', 100], ['powdery', 60], ['fresh', 44]],
  oud: [['woody', 100], ['amber', 70], ['warm-spicy', 40]],
  spark: [['fresh', 100], ['citrus', 60]],
}

/* ---------- Sensory product stories, written by hand in both languages from each product's notes ---------- */
export const story: Record<string, { ar: string; en: string }> = {
  jawa: {
    ar: 'خيوط زعفران تذوب في ياسمين ليلي، ثم يدفأ كل شيء على خشب العنبر كجمر خافت. في القاعدة، راتنج التنوب والأرز يتركان أثرا ذهبيا هادئا، فخما كقطعة حرير أحمر.',
    en: 'Threads of saffron melt into night-blooming jasmine, then everything warms over amberwood like low embers. Fir resin and cedar settle underneath, leaving a quiet golden trail as rich as red silk.',
  },
  cloud: {
    ar: 'مشمش ناضج وبرقوق عصيري يُغمسان في كريمة جوز الهند. يتفتح التوبيروز والياسمين والورد كباقة بيضاء ناعمة، ثم يذوب كل شيء في لوز محمّص وفانيليا ومسك، كأنك تغفو على غيمة من حلوى القطن.',
    en: 'Ripe apricot and juicy plum dipped in coconut cream. Tuberose, jasmine and rose open like a soft white bouquet, then everything melts into toasted almond, vanilla and musk, like drifting off on a cloud of cotton candy.',
  },
  shams: {
    ar: 'فانيليا دافئة يُرشّ عليها سكر بني ويُسكب فوقها عسل ذهبي. لمسة بودرة ناعمة كبشرة طفل، وباتشولي يمنحها عمقا، كعناق في شمس العصر.',
    en: 'Warm vanilla dusted with brown sugar and drizzled with golden honey. A touch of soft baby powder, a whisper of patchouli for depth, like an embrace in late-afternoon sun.',
  },
  dana: {
    ar: 'برتقال دموي يتلألأ فوق فانيليا سوداء. في القلب، عسل يقطر على الغاردينيا وزهر البرتقال والياسمين والخوخ. ثم كراميل لزج وشمع عسل وعرق سوس، حلاوة لا تقاوَم تبقى على البشرة طويلا.',
    en: 'Blood orange sparkles over black vanilla. At the heart, honey drips onto gardenia, orange blossom, jasmine and peach. Then sticky caramel, beeswax and licorice: an irresistible sweetness that lingers on skin.',
  },
  amar: {
    ar: 'ليمون مقطوف للتو من حديقة في الربيع، حلو ومشمس، يلتف حوله مسك نظيف. رائحة صباح منعش تشعر بها كضوء يدخل من النافذة.',
    en: 'Lemons just picked from a spring garden, sweet and sun-warmed, wrapped in clean musk. A fresh-morning scent that feels like light pouring through a window.',
  },
  ayden: {
    ar: 'ياسمين سامباك أبيض يفتح بتلاته في ليلة باردة. خشب الكشميران والعنبر الأبيض يلفّانه كوشاح دافئ، ومسك أبيض وخشب الصندل يتركان أثرا ناعما كالكشمير.',
    en: 'White jasmine sambac unfolds on a cold night. Cashmeran wood and white amber wrap around it like a warm scarf, while white musk and sandalwood leave a trail as soft as cashmere.',
  },
  day: {
    ar: 'برتقال صقلي وليمون وبرغموت كالابري يتفجّرون كعصير طازج. فواكه متوسطية تحت شمس الظهيرة، ثم مسك أبيض وعنبر وفانيليا مدغشقر تترك نعومة بودرية نظيفة.',
    en: 'Sicilian orange, lemon and Calabrian bergamot burst like fresh-squeezed juice. Mediterranean fruit under the noon sun, then white musk, amber and Madagascar vanilla leave a clean, powdery softness.',
  },
  love: {
    ar: 'ورد جوري مع عنبر وقطرة ليمون. في القلب، سكر يذوب مع توابل شرقية دافئة، ثم خوخ مخملي وقرنفل على سرير من الخشب. رائحة حب واثقة.',
    en: 'Velvet rose with amber and a squeeze of lemon. At the heart, sugar melts into warm oriental spices, then soft peach and clove on a bed of wood. The scent of confident love.',
  },
  skie: {
    ar: 'فلفل وردي يطقطق فوق كمثرى باردة وزهر البرتقال. ثم قهوة محمّصة ولوز مر وعرق سوس كحلوى داكنة، تنتهي بفانيليا وباتشولي وأرز. عطر سهرة لامرأة تُلفت الأنظار.',
    en: 'Pink pepper crackles over cool pear and orange blossom. Then roasted coffee, bitter almond and licorice like a dark dessert, finishing on vanilla, patchouli and cedar. An evening perfume for a woman who turns heads.',
  },
  sweet: {
    ar: 'هيل وفلفل وردي وأوراق بنفسج خضراء، ثم قطرة فانيليا وكستناء محمصة حلوة. كحقل من حلوى الحمضيات يذوب على لسانك.',
    en: 'Cardamom, pink pepper and green violet leaf, then a drop of vanilla and sweet roasted chestnut. Like a field of citrus candy melting on your tongue.',
  },
  'vanilla-perfume': {
    ar: 'فانيليا نقية وناعمة كالمارشميلو، كأنك نائم على حافة سحابة وقطرات آيس كريم الفانيليا تذوب حولك. بسيطة، دافئة، ولا تُنسى.',
    en: 'Pure vanilla as soft as marshmallow, as if you’re asleep on the edge of a cloud with vanilla ice cream melting around you. Simple, warm and unforgettable.',
  },
  leil: {
    ar: 'زنجبيل وفلفل وردي وماندرين يشعلون الليل. أناناس وورد يلمعان فوق باتشولي وفتيفير، ثم مسك وستيراكس وبنفسج بودري. غموض ليلة مقمرة على بشرتك.',
    en: 'Ginger, pink pepper and mandarin light up the night. Pineapple and rose glow over patchouli and vetiver, then musk, styrax and powdery violet. The mystery of a moonlit night on your skin.',
  },
  mood: {
    ar: 'ليمون ونعناع وجريب فروت كمطر بارد في غابة. زنجبيل وجوزة الطيب وياسمين يدفئون اللحظة، ولابدانوم يترك أثرا دخانيا كنار بعيدة في ليلة شتاء.',
    en: 'Lemon, mint and grapefruit like cold rain in a forest. Ginger, nutmeg and jasmine warm the moment, and labdanum leaves a smoky trail like a distant fire on a winter night.',
  },
  wassim: {
    ar: 'برغموت منعش وفلفل حاد يفتحان الطريق. فلفل سيتشوان ولافندر وفتيفير وباتشولي في قلب نظيف وحيوي، ثم أمبروكسان وأرز ولابدانوم. أناقة رجل في قطرة واحدة.',
    en: 'Crisp bergamot and sharp pepper lead the way. Sichuan pepper, lavender, vetiver and patchouli at a clean, lively heart, then ambroxan, cedar and labdanum. A gentleman’s elegance in a single drop.',
  },
  'vanilla-oil': {
    ar: 'زيت فانيليا كثيف وحلو، قطرة واحدة على النبض تجعل أي عطر أدفأ وأطيب.',
    en: 'A rich, sweet vanilla oil. One drop on the pulse makes any perfume warmer and more delicious.',
  },
  dimashq: {
    ar: 'ورد دمشقي مركّز في زيت ذهبي، كأنك تمشي في حديقة ورد بعد المطر.',
    en: 'Damask rose concentrated in a golden oil, like walking through a rose garden after rain.',
  },
  'musk-al-tahara': {
    ar: 'مسك نقي ونظيف كقطن أبيض جف للتو تحت الشمس. ناعم، قريب من البشرة، ومريح.',
    en: 'Pure, clean musk like white cotton just dried in the sun. Soft, close to the skin and comforting.',
  },
  oud: {
    ar: 'عود عميق ودافئ، دخاني وغني، يمنح أي عطر وقارا وحضورا.',
    en: 'Deep, warm oud, smoky and rich, giving any perfume depth and presence.',
  },
  spark: {
    ar: 'زيت منعش ولامع كشرارة، يوقظ عطرك ويمنحه خفة.',
    en: 'A bright, fresh oil like a spark, waking up your perfume and giving it lift.',
  },
  'body-lotion': {
    ar: 'لوشن ناعم يذوب في البشرة ويتركها حريرية، ليكون أساسا مثاليا لعطرك.',
    en: 'A silky lotion that melts into skin and leaves it soft, the perfect base for your perfume.',
  },
  'milk-honey-hand-cream': {
    ar: 'حليب كريمي وعسل ذهبي في كريم يدين غني، يغذي ويترك يديك ناعمتين برائحة حلوة دافئة.',
    en: 'Creamy milk and golden honey in a rich hand cream that nourishes and leaves your hands soft and sweetly scented.',
  },
  'sprayer-3in1': {
    ar: 'ثلاثة عطور صغيرة في علبة واحدة، لتجرّب وتختار، أو لتنتقل بين مزاج وآخر.',
    en: 'Three small perfumes in one box, to try and choose, or to move from one mood to another.',
  },
  'black-hoodie': {
    ar: 'قطن ثقيل وناعم بلون الليل، وشعار THETIA على الصدر. دافئ كعطر ليل، وبسيط كأسلوبك.',
    en: 'Soft, heavyweight cotton the colour of night, with the THETIA wordmark on the chest. Warm like an evening scent, simple like your style.',
  },
  'white-hoodie': {
    ar: 'أبيض نقي كمسك نظيف، قصّة واسعة مريحة وشعار THETIA. القطعة التي ترتديها مع عطرك المفضل.',
    en: 'Pure white like clean musk, a relaxed oversized cut and the THETIA wordmark. The piece you wear with your favourite scent.',
  },
  'oil-package': {
    ar: 'خمسة زيوت عطرية في علبة واحدة: سبارك، عود، دمشق، مسك الطهارة، وفانيلا. مكتبة صغيرة لفن دمج العطور.',
    en: 'Five perfume oils in one box: Spark, Oud, Dimashq, Musk Al Tahara and Vanilla. A small library for the art of layering.',
  },
}

/* ---------- brand details from thetia.shop ---------- */
export const brand = {
  phone: '+970 592415138',
  emails: ['Thetiascents@gmail.com', 'alamitia@gmail.com'],
  address: { ar: 'رام الله، سردا، آيكون مول، الطابق 4', en: 'Icon Mall, 4th floor, Surda, Ramallah' },
  mapQuery: 'Icon Mall Surda Ramallah',
  /** Not listed on thetia.shop. Placeholder until THETIA confirms its handle. */
  instagram: { handle: '@thetia', url: 'https://www.instagram.com/' },
  tiktok: { url: 'https://www.tiktok.com/' },
}
