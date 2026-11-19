import type { NoteId } from './products'
export const journeyDisclaimer = 'توزيع توضيحي للتجربة، يحتاج اعتماد البراند'
export const stages: { id: string; title: string; english: string; description: string; notes: NoteId[]; color: string }[] = [
  { id: 'opening', title: 'البداية', english: 'THE FIRST IMPRESSION', description: 'نعومة بودرية، كاللحظة الأولى من ذكرى قريبة.', notes: ['powder'], color: '#eee7dc' },
  { id: 'heart', title: 'القلب', english: 'THE HEART OF THE SCENT', description: 'دفء العسل وحلاوة السكر البني، في قلب الحكاية.', notes: ['honey', 'sugar'], color: '#e2c58d' },
  { id: 'base', title: 'القاعدة', english: 'THE LASTING MEMORY', description: 'الفانيلا والباتشولي، خاتمة ناعمة ذات عمق.', notes: ['vanilla', 'patchouli'], color: '#c2b493' },
]
