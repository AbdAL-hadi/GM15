import type { ReactElement } from 'react'
/* Simple line drawings for note groups. Black ink on white, to sit with THETIA's monochrome look. */
export type NoteKind = 'citrus' | 'flower' | 'vanilla' | 'wood' | 'spice' | 'musk' | 'fruit' | 'sweet' | 'leaf' | 'coffee'

const rules: [NoteKind, RegExp][] = [
  ['citrus', /ليمون|برتقال|برغموت|جريب|ماندرين|يوسفي|حمضيات/],
  ['flower', /ورد|ياسمين|توبيروز|غاردينيا|زهر|بنفسج|لافندر|جيرانيوم|فاونيا/],
  ['vanilla', /فانيليا|مارشميلو/],
  ['wood', /خشب|أرز|صندل|عود|تنوب|فتيفير|باتشولي|كشمير|ستيراكس|لابدانوم|أمبروكسان|راتنج/],
  ['spice', /فلفل|زنجبيل|هيل|قرنفل|جوزة|زعفران|توابل|عرق سوس/],
  ['fruit', /مشمش|برقوق|خوخ|كمثرى|أناناس|جوز الهند|كستناء|لوز|فاكهية|متوسطية/],
  ['sweet', /عسل|كراميل|سكر|شمع|حليب/],
  ['leaf', /نعناع|طحلب|أوراق/],
  ['coffee', /قهوة/],
]
/* Tint behind a note tile, taken from the accord the note belongs to. */
export const noteTint: Record<NoteKind, string> = {
  citrus: '#f7eb8c', flower: '#f7c6d5', vanilla: '#f5ead0', wood: '#d8c0a8', spice: '#eaa38f', musk: '#e8e1ef',
  fruit: '#f6b896', sweet: '#f1b3bc', leaf: '#bfe0c8', coffee: '#c9b3a3',
}
export const noteKind = (note: string): NoteKind => rules.find(([, r]) => r.test(note))?.[0] ?? 'musk'

const paths: Record<NoteKind, ReactElement> = {
  citrus: <><circle cx="24" cy="24" r="17" /><circle cx="24" cy="24" r="13" />{[0, 45, 90, 135].map(a => <line key={a} x1="24" y1="11" x2="24" y2="37" transform={`rotate(${a} 24 24)`} />)}</>,
  flower: <>{[0, 72, 144, 216, 288].map(a => <ellipse key={a} cx="24" cy="13" rx="6" ry="9" transform={`rotate(${a} 24 24)`} />)}<circle cx="24" cy="24" r="4" /></>,
  vanilla: <><path d="M8 42 C14 31 26 18 39 9 C41 11 41 13 39 14 C27 23 16 34 11 44 Z" /><path d="M12 40 C18 31 27 22 37 13" />{[0, 120, 240].map(a => <ellipse key={a} cx="37" cy="5" rx="2.6" ry="4.5" transform={`rotate(${a} 37 9)`} />)}</>,
  wood: <><rect x="8" y="16" width="32" height="16" rx="8" /><ellipse cx="34" cy="24" rx="4" ry="8" /><path d="M12 21 h14 M12 27 h18" /></>,
  spice: <><path d="M24 6 l4 10 10 -2 -6 8 8 6 -10 2 0 10 -6 -8 -6 8 0 -10 -10 -2 8 -6 -6 -8 10 2z" /></>,
  musk: <><path d="M24 6 C30 16 36 22 36 30 a12 12 0 0 1 -24 0 C12 22 18 16 24 6z" /><path d="M19 31 a5 5 0 0 0 5 5" /></>,
  fruit: <><path d="M24 14 C12 10 8 22 10 30 C12 40 20 42 24 39 C28 42 36 40 38 30 C40 22 36 10 24 14z" /><path d="M24 14 C24 9 26 6 30 4" /></>,
  sweet: <><path d="M10 20 h28 l-3 18 h-22z" /><path d="M14 20 c0 -6 4 -10 10 -10 s10 4 10 10" /><path d="M16 28 h16" /></>,
  leaf: <><path d="M8 40 C8 18 22 8 40 8 C40 26 30 40 8 40z" /><path d="M8 40 L30 18" /></>,
  coffee: <><ellipse cx="24" cy="24" rx="12" ry="17" /><path d="M24 7 C18 18 30 30 24 41" /></>,
}

export function NoteIcon({ kind, size = 44 }: { kind: NoteKind; size?: number }) {
  return <svg className="note-icon" width={size} height={size} viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[kind]}</svg>
}
