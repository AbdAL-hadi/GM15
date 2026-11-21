import { createContext, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'

/** A bag line. `title` and `detail` describe a custom blend or a refill. */
export interface Line { slug: string; size: string; price: number; qty: number; title?: string; detail?: string }
interface Bag { lines: Line[]; add: (l: Omit<Line, 'qty'>, qty?: number) => void; remove: (i: number) => void; open: boolean; setOpen: (v: boolean) => void }
const BagContext = createContext<Bag | null>(null)
export const useBag = () => useContext(BagContext)!

export function BagProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<Line[]>(() => { try { return JSON.parse(localStorage.getItem('thetia-bag') || '[]') } catch { return [] } })
  const [open, setOpen] = useState(false)
  useEffect(() => { try { localStorage.setItem('thetia-bag', JSON.stringify(lines)) } catch { /* private mode */ } }, [lines])
  const add: Bag['add'] = (l, qty = 1) => setLines(ls => {
    const i = ls.findIndex(x => x.slug === l.slug && x.size === l.size && x.title === l.title && x.detail === l.detail)
    if (i < 0) return [...ls, { ...l, qty }]
    return ls.map((x, j) => j === i ? { ...x, qty: x.qty + qty } : x)
  })
  const remove = (i: number) => setLines(ls => ls.filter((_, j) => j !== i))
  return <BagContext.Provider value={{ lines, add, remove, open, setOpen }}>{children}</BagContext.Provider>
}

/* Wishlist: product slugs kept in this browser. */
interface Wish { slugs: string[]; has: (s: string) => boolean; toggle: (s: string) => void }
const WishContext = createContext<Wish | null>(null)
export const useWish = () => useContext(WishContext)!

export function WishProvider({ children }: { children: ReactNode }) {
  const [slugs, setSlugs] = useState<string[]>(() => { try { return JSON.parse(localStorage.getItem('thetia-wish') || '[]') } catch { return [] } })
  useEffect(() => { try { localStorage.setItem('thetia-wish', JSON.stringify(slugs)) } catch { /* private mode */ } }, [slugs])
  const toggle = (s: string) => setSlugs(l => l.includes(s) ? l.filter(x => x !== s) : [...l, s])
  return <WishContext.Provider value={{ slugs, has: s => slugs.includes(s), toggle }}>{children}</WishContext.Provider>
}
