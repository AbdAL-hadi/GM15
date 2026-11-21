import { useLocation } from 'react-router-dom'

/* Two hand-written languages. Arabic (RTL) lives at /, English (LTR) at /en.
   Every string is written by hand for each language; nothing is machine translated. */
export type Lang = 'ar' | 'en'

const dict = {
  // nav + chrome
  home: ['الرئيسية', 'Home'],
  shop: ['المتجر', 'Shop'],
  wheel: ['عجلة النوتات', 'Notes wheel'],
  choose: ['ساعدني أختار', 'Help me choose'],
  wishlist: ['المفضلة', 'Wishlist'],
  search: ['بحث', 'Search'],
  menu: ['القائمة', 'Menu'],
  close: ['إغلاق', 'Close'],
  homeLink: ['THETIA الرئيسية', 'THETIA home'],
  bag: ['السلة', 'Bag'],
  bagCount: ['السلة، {n} قطع', 'Bag, {n} items'],
  bagEmpty: ['سلتك فارغة. أضف عطرا من المتجر.', 'Your bag is empty. Add a perfume from the shop.'],
  remove: ['إزالة', 'Remove'],
  total: ['المجموع', 'Total'],
  checkoutOff: ['نسخة للمراجعة: الدفع غير مفعّل.', 'Review version: checkout is switched off.'],
  thanks: ['شكرا لزيارتكم Thetia', 'Thank you for visiting Thetia'],
  switchLang: ['English', 'العربية'],
  switchLangLabel: ['Switch to English', 'التبديل إلى العربية'],
  loading: ['لحظة…', 'One moment…'],

  // home
  bestSeller: ['الأكثر مبيعا', 'Best seller'],
  discover: ['اكتشف العطر', 'Discover it'],
  prev: ['السابق', 'Previous'],
  next: ['التالي', 'Next'],
  mainAccords: ['المكونات الرئيسية', 'Main accords'],
  sections: ['الأقسام', 'Categories'],
  collection: ['المجموعة', 'The collection'],
  all: ['الكل', 'All'],
  family: ['العائلة العطرية', 'Scent family'],
  viewAll: ['عرض الكل ({n})', 'View all ({n})'],
  wheelTitle: ['عطرك من نوتاته', 'Find a perfume by its notes'],
  wheelLead: ['أدر العجلة إلى النوتة التي تحبها، فتدور إليك العطور التي تحملها.', 'Turn the wheel to a note you love and the perfumes that carry it come round to you.'],
  quizBandTitle: ['دعنا نساعدك في اختيار عطرك', 'Let us help you choose your perfume'],
  quizBandText: ['أربعة أسئلة قصيرة عن ذوقك، ونقترح لك العطور الأقرب إليك.', 'Four short questions about your taste, then the perfumes closest to it.'],
  start: ['ابدأ الآن', 'Start now'],

  // shop
  shopTitle: ['متجر', 'Shop'],
  showAll: ['عرض الكل', 'Show all'],
  section: ['القسم', 'Category'],
  forWho: ['لمن', 'For'],
  everyone: ['الجميع', 'Everyone'],
  allScents: ['كل الروائح', 'All scents'],
  count: ['{n} منتج', '{n} products'],

  // product
  crumbs: ['مسار التنقل', 'Breadcrumb'],
  notFound: ['هذا المنتج غير موجود.', 'We could not find this product.'],
  toShop: ['إلى المتجر', 'Go to the shop'],
  photo: ['الصورة', 'Photo'],
  view360: ['عرض 360°', '360° view'],
  openLid: ['افتح الغطاء', 'Open the lid'],
  closeLid: ['أغلق الغطاء', 'Close the lid'],
  spray: ['رشّة', 'Spray'],
  openCap: ['افتح الغطاء', 'Open the cap'],
  closeCap: ['أغلق الغطاء', 'Close the cap'],
  squeeze: ['اعصر', 'Squeeze'],
  drop: ['قطرة زيت', 'Add a drop'],
  spin: ['دوران', 'Spin'],
  stopSpin: ['أوقف الدوران', 'Stop spinning'],
  dragHint: ['اسحب للدوران 360°', 'Drag to turn 360°'],
  viewTools: ['أدوات العرض', 'View tools'],
  capacity: ['الحجم', 'Capacity'],
  qtyUp: ['زيادة الكمية', 'Increase quantity'],
  qtyDown: ['تقليل الكمية', 'Decrease quantity'],
  qty: ['الكمية', 'Quantity'],
  addToBag: ['إضافة إلى السلة', 'Add to bag'],
  categories: ['التصنيفات', 'Categories'],
  priceNote: ['أسعار الأحجام داخل النطاق تقديرية في هذه النسخة.', 'Prices per size inside a range are estimates in this version.'],
  related: ['منتجات ذات صلة', 'You may also like'],
  pyramid: ['هرم العطر', 'Perfume pyramid'],
  pyramidLead: ['النوتات كما تظهر على بشرتك: العليا أولا، ثم الوسطى، ثم الأساسية التي تبقى.', 'The notes in the order your skin meets them: top first, then middle, then the base that stays.'],
  top: ['النوتات العليا', 'Top notes'],
  middle: ['النوتات الوسطى', 'Middle notes'],
  base: ['النوتات الأساسية', 'Base notes'],
  notes: ['النوتات', 'Notes'],
  addWish: ['أضف إلى المفضلة', 'Add to wishlist'],
  removeWish: ['أزل من المفضلة', 'Remove from wishlist'],

  // wishlist
  wishTitle: ['المفضلة', 'Wishlist'],
  wishEmpty: ['لا شيء في المفضلة بعد. اضغط القلب على أي منتج لتحفظه هنا.', 'Nothing saved yet. Tap the heart on any product to keep it here.'],
  wishCount: ['{n} محفوظ', '{n} saved'],

  // wheel
  pickNote: ['اختر النوتة', 'Choose a note'],
  products: ['{n} منتجات', '{n} products'],
  product1: ['منتج واحد', '1 product'],
  noMatch: ['لا عطور بهذه النوتة بعد.', 'No perfumes carry this note yet.'],
  inThis: ['في هذا العطر', 'In this perfume'],
  wheelHint: ['اسحب العجلة أو اضغط اسم النوتة', 'Drag the wheel or tap a note'],

  // refill bar
  refillBar: ['بار التعبئة', 'Refill bar'],
  refillTitle: ['بار التعبئة', 'The refill bar'],
  refillLead: ['كل عطر في ذاتية يُعبّأ باليد من هذا الجدار. اختر من الأنابيب، املأ زجاجتك، أو اخلط عطرك الخاص وسمّه.', 'Every THETIA bottle is filled by hand from this wall. Pick from the tubes, fill your own bottle, or blend a perfume of your own and name it.'],
  wallLabel: ['جدار التعبئة: اختر عطرا', 'Refill wall: choose a scent'],
  almostGone: ['قارب على النفاد', 'Almost gone'],
  level: ['متبقٍ {n}%', '{n}% left'],
  useThis: ['استخدمه في عطري', 'Use in my perfume'],
  viewScent: ['صفحة العطر', 'Perfume page'],
  makeTitle: ['اصنع عطرك', 'Make your own perfume'],
  makeLead: ['عطر واحد أو مزيج من عطرين. اضبط النسبة، اختر الحجم، شاهده يُعبّأ، ثم سمّه.', 'One scent or a blend of two. Set the mix, pick a size, watch it pour, then give it a name.'],
  step1: ['العطر الأول', 'First scent'],
  step2: ['العطر الثاني (اختياري)', 'Second scent (optional)'],
  none: ['بدون', 'None'],
  mix: ['النسبة', 'The mix'],
  size: ['الحجم', 'Size'],
  nameIt: ['سمِّ عطرك', 'Name your perfume'],
  namePh: ['مثلا: ليالي يافا', 'For example: Jaffa Nights'],
  nameHelp: ['حتى 18 حرفا. يُطبع الاسم على ملصق زجاجتك.', 'Up to 18 characters. The name is printed on your bottle’s label.'],
  yourPerfume: ['عطري', 'My perfume'],
  pour: ['املأ الزجاجة', 'Fill the bottle'],
  pouring: ['جارٍ التعبئة…', 'Filling…'],
  addBlend: ['أضف عطري إلى السلة', 'Add my perfume to the bag'],
  blendFee: ['المزيج يضيف ₪10 لكل زجاجة. الأسعار تقديرية في هذه النسخة.', 'A blend adds ₪10 per bottle. Prices are estimates in this version.'],
  blendAccords: ['مكونات مزيجك', 'Your blend’s accords'],
  returnTitle: ['أعد زجاجتك', 'Bring your bottle back'],
  returnLead: ['أحضر زجاجة ذاتية فارغة إلى المتجر واملأها بسعر أقل. أقل زجاج، والرائحة نفسها.', 'Bring an empty THETIA bottle to the shop and refill it for less. Less glass, the same scent.'],
  refillPrice: ['سعر التعبئة', 'Refill price'],
  newPrice: ['زجاجة جديدة', 'New bottle'],
  save: ['توفّر', 'You save'],
  refillOption: ['أعيد تعبئة زجاجتي', 'Refill my own bottle'],
  refillOptionHelp: ['أحضر زجاجتك الفارغة إلى المتجر. السعر أقل بنسبة 30%.', 'Bring your empty bottle to the shop. 30% off the price.'],
  refillDetail: ['تعبئة زجاجة العميل', 'Refill of your own bottle'],
  filmTitle: ['من الجدار إلى زجاجتك', 'From the wall to your bottle'],
  filmLead: ['فيلم قصير من متجر ذاتية: كيف تُعبّأ كل زجاجة باليد.', 'A short film from the THETIA shop: how each bottle is filled by hand.'],
  filmSoon: ['الفيلم قريبا', 'Film coming soon'],
  refillBand: ['املأ زجاجتك من جدار ذاتية', 'Fill your bottle from the THETIA wall'],
  refillBandText: ['اختر من الأنابيب، اخلط عطرين، وسمِّ عطرك.', 'Pick from the tubes, blend two scents, and name your own.'],
  openRefill: ['إلى بار التعبئة', 'Go to the refill bar'],

  // story
  story: ['قصتنا', 'Our story'],
  storyHero: ['وُلدت ذاتية من رائحة ضاعت', 'THETIA was born from a scent that was lost'],
  storyIntro: ['بعد أن فقدت حاسة الشم بسبب كوفيد-19، نُصحت تيا بأن تعرّض حاستها لروائح معينة كل يوم. من هذا التمرين البسيط بدأت علامة عطور بروائح لم تكن موجودة من قبل.', 'After losing her sense of smell to COVID-19, Tia was told to train it with chosen scents every day. That simple exercise became a perfume house with scents that did not exist before.'],
  ch1t: ['الفقدان', 'The loss'],
  ch1: ['بدأت الرحلة بتحدٍ لم يتوقعه أحد: فقدان عميق لحاسة الشم. ما بدا عقبة صار شرارة للإبداع.', 'It began with a challenge nobody expected: a deep loss of smell. What looked like an obstacle became the spark.'],
  ch2t: ['العودة', 'The return'],
  ch2: ['رائحة بعد رائحة، عادت الذاكرة. ومعها رغبة في صنع عطور لا تثير المشاعر فقط، بل تعيد تعريف التجربة الحسية.', 'Scent by scent, memory came back, and with it the wish to make perfumes that do more than stir feelings: they redefine the senses.'],
  ch3t: ['ذاتية', 'THETIA'],
  ch3: ['من الكلمة العربية «الذاتية»: إيماننا بأن كل رائحة تحمل ذكرى خاصة بك. عطورنا صُممت لتصبح جزءا من قصتك.', 'From the Arabic word “al-dhatiya”, the self: we believe every scent carries a memory that is yours. Our perfumes are made to become part of your story.'],
  ch4t: ['اليوم', 'Today'],
  ch4: ['من مشروع صغير إلى علامة يحتفي بها الناس لعمقها وأصالتها. هنا قاد الفقدان إلى الاكتشاف، وصارت الأحلام واقعا.', 'From a small start-up to a house loved for depth and authenticity. Here loss led to discovery, and dreams became real.'],
  madeIn: ['صنع في فلسطين', 'Made in Palestine'],
  madeInText: ['كل زجاجة تُعبّأ باليد في متجرنا في رام الله، من جدار التعبئة إلى يدك.', 'Every bottle is filled by hand in our Ramallah shop, from the refill wall to your hands.'],
  followIg: ['تابعونا على إنستغرام', 'Follow us on Instagram'],
  followIgText: ['عطور جديدة، لحظات من المتجر، وطرق لدمج الروائح.', 'New scents, moments from the shop, and ways to layer.'],
  openIg: ['افتح إنستغرام', 'Open Instagram'],
  // contact
  contact: ['الاتصال', 'Contact'],
  storeName: ['متجر THETIA', 'THETIA store'],
  address: ['العنوان', 'Address'],
  phones: ['الهاتف', 'Phone'],
  email: ['البريد الإلكتروني', 'Email'],
  social: ['تابعونا', 'Follow us'],
  contactText: ['منتجاتنا متوفرة للشراء عبر الإنترنت مع توصيل إلى باب منزلك أينما كنت. وإذا كنت في رام الله، يسعدنا أن تزورنا في آيكون مول في سردا لتجربة عطورنا بنفسك.', 'Our products are available online with delivery to your door, wherever you are. If you are in Ramallah, visit us at Icon Mall in Surda and try the perfumes yourself.'],
  openMaps: ['افتح في الخرائط', 'Open in Maps'],
  writeUs: ['راسلنا', 'Write to us'],
  yourName: ['الاسم', 'Name'],
  yourEmail: ['بريدك الإلكتروني', 'Your email'],
  message: ['رسالتك', 'Your message'],
  send: ['أرسل الرسالة', 'Send message'],
  sendHelp: ['يفتح تطبيق البريد لديك مع رسالتك جاهزة.', 'Opens your email app with your message ready.'],
  call: ['اتصل بنا', 'Call us'],
  // account
  account: ['حسابي', 'My account'],
  signIn: ['تسجيل الدخول', 'Sign in'],
  createAccount: ['إنشاء حساب', 'Create account'],
  password: ['كلمة المرور', 'Password'],
  fullName: ['الاسم الكامل', 'Full name'],
  phone: ['رقم الهاتف', 'Phone number'],
  demoAuth: ['نسخة للمراجعة: الحساب يُحفظ على هذا الجهاز فقط ولا تُرسل أي بيانات.', 'Review version: your account is saved on this device only and nothing is sent anywhere.'],
  hello: ['أهلا {n}', 'Hello {n}'],
  profile: ['الملف الشخصي', 'Profile'],
  orders: ['طلباتي', 'My orders'],
  addresses: ['العناوين', 'Addresses'],
  signOut: ['تسجيل الخروج', 'Sign out'],
  saveChanges: ['احفظ التغييرات', 'Save changes'],
  saved: ['تم الحفظ', 'Saved'],
  noOrders: ['لا طلبات بعد. عندما تطلب، ستجد طلباتك هنا.', 'No orders yet. When you order, you will find them here.'],
  addAddress: ['أضف عنوانا', 'Add an address'],
  city: ['المدينة', 'City'],
  street: ['الشارع والتفاصيل', 'Street and details'],
  noAddresses: ['لا عناوين محفوظة بعد.', 'No saved addresses yet.'],
  removeAddress: ['احذف', 'Delete'],
  inBag: ['في سلتك الآن', 'In your bag now'],

  // quiz
  quizEyebrow: ['دعنا نساعدك في اختيار عطرك', 'Let us help you choose your perfume'],
  question: ['السؤال {n} من {m}', 'Question {n} of {m}'],
  back: ['رجوع', 'Back'],
  resultsEyebrow: ['اقتراحاتنا لك', 'Our picks for you'],
  resultsTitle: ['هذه العطور الأقرب إلى ذوقك', 'These perfumes are closest to your taste'],
  why: ['يناسبك لأنه: {x}', 'Suits you because it is {x}'],
  retake: ['أعد الاختبار', 'Take it again'],
  forDay: ['للنهار', 'made for daytime'],
  forNight: ['للمساء', 'made for evenings'],
  forBoth: ['لكل الأوقات', 'right for any time'],
  soft: ['ناعم', 'soft'],
  medium: ['متوسط القوة', 'medium strength'],
  strong: ['قوي', 'strong'],
  and: [' و', ' and '],
} as const satisfies Record<string, readonly [string, string]>

export type Key = keyof typeof dict

/* Note names, Arabic as written on thetia.shop → English. */
const noteEn: Record<string, string> = {
  'زعفران': 'Saffron', 'ياسمين': 'Jasmine', 'خشب العنبر': 'Amberwood', 'عنبر': 'Amber', 'راتنج التنوب': 'Fir resin', 'أرز': 'Cedar',
  'مشمش': 'Apricot', 'برقوق': 'Plum', 'جوز الهند': 'Coconut', 'توبيروز': 'Tuberose', 'ورد': 'Rose', 'خشب الصندل': 'Sandalwood',
  'لوز': 'Almond', 'فانيليا': 'Vanilla', 'مسك': 'Musk', 'بودرة أطفال': 'Baby powder', 'سكر بني': 'Brown sugar', 'عسل': 'Honey',
  'باتشولي': 'Patchouli', 'برتقال دموي': 'Blood orange', 'فانيليا سوداء': 'Black vanilla', 'غاردينيا': 'Gardenia', 'زهر البرتقال': 'Orange blossom',
  'خوخ': 'Peach', 'شمع العسل': 'Beeswax', 'كراميل': 'Caramel', 'عرق سوس': 'Licorice', 'ليمون': 'Lemon', 'حمضيات': 'Citrus',
  'ياسمين سامباك': 'Jasmine sambac', 'خشب الكشميران': 'Cashmeran wood', 'عنبر أبيض': 'White amber', 'مسك أبيض': 'White musk',
  'برتقال صقلي': 'Sicilian orange', 'برغموت': 'Bergamot', 'نوتات فاكهية': 'Fruity notes', 'نوتات متوسطية': 'Mediterranean notes',
  'سكر': 'Sugar', 'توابل شرقية': 'Oriental spices', 'قرنفل': 'Clove', 'كمثرى': 'Pear', 'فلفل وردي': 'Pink pepper', 'قهوة': 'Coffee',
  'لوز مر': 'Bitter almond', 'خشب الكشمير': 'Cashmere wood', 'هيل': 'Cardamom', 'أوراق البنفسج': 'Violet leaf', 'كستناء': 'Chestnut',
  'مارشميلو': 'Marshmallow', 'زنجبيل': 'Ginger', 'ماندرين': 'Mandarin', 'فتيفير': 'Vetiver', 'أناناس': 'Pineapple', 'ستيراكس': 'Styrax',
  'بنفسج': 'Violet', 'نعناع': 'Mint', 'جريب فروت': 'Grapefruit', 'جوزة الطيب': 'Nutmeg', 'لابدانوم': 'Labdanum', 'فلفل': 'Pepper',
  'فلفل سيتشوان': 'Sichuan pepper', 'لافندر': 'Lavender', 'أمبروكسان': 'Ambroxan', 'عود': 'Oud', 'حليب': 'Milk',
}

export function useLang() {
  const { pathname } = useLocation()
  const lang: Lang = pathname === '/en' || pathname.startsWith('/en/') ? 'en' : 'ar'
  const i = lang === 'ar' ? 0 : 1
  const t = (k: Key, vars?: Record<string, string | number>) => {
    let s: string = dict[k][i]
    if (vars) for (const [a, b] of Object.entries(vars)) s = s.replace(`{${a}}`, String(b))
    return s
  }
  /** Prefix an app path for the current language. */
  const to = (path: string) => lang === 'en' ? (path === '/' ? '/en' : `/en${path}`) : path
  /** The same page in the other language. */
  const other = lang === 'en' ? (pathname.replace(/^\/en/, '') || '/') : (pathname === '/' ? '/en' : `/en${pathname}`)
  const note = (n: string) => lang === 'en' ? (noteEn[n] ?? n) : n
  const pick = <T,>(ar: T, en: T) => lang === 'ar' ? ar : en
  return { lang, dir: lang === 'ar' ? 'rtl' as const : 'ltr' as const, t, to, other, note, pick }
}
