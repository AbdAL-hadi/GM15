export const layeringSource = 'https://thetia.shop/en/layering/'
export const layerings = [
  { perfume: 'shams', oil: 'vanilla-oil', title: 'دفءٌ يشبهك', description: 'فانيلا محمّصة، جريئة ودافئة. يجمع هذا التنسيق Shams مع زيت الفانيلا، كما تقترحه ذاتية.' },
  { perfume: 'vanilla', oil: 'vanilla-oil', title: 'حلاوة التفاصيل', description: 'إيحاء حلو يستحضر كعكة الفانيلا. تنسيق مقترح من ذاتية.' },
  { perfume: 'jawa', oil: 'vanilla-oil', title: 'لمسة من الأناقة', description: 'تنسيق تصفه ذاتية بطابع أنيق وراقٍ.' },
  { perfume: 'day', oil: 'dimashq-oil', title: 'إشراقة الياسمين', description: 'تنسيق تقترحه ذاتية بإيحاءات الحمضيات والياسمين.' },
]
export const findLayering = (perfume: string, oil: string) => layerings.find(l => l.perfume === perfume && l.oil === oil)
