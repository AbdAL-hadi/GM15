import { createContext, useContext, useEffect, useReducer, useState } from 'react'
import type { ReactNode } from 'react'
import { useCatalog } from './Catalog'
import { cartReducer, readStored, sanitizeCart } from './cart'
import type { CartAction, CartLine } from './cart'
interface StoreValue { cart: CartLine[]; dispatch: React.Dispatch<CartAction>; favorites: string[]; toggleFavorite: (id: string) => void; cartOpen: boolean; setCartOpen: (open: boolean) => void; toast: string; notify: (message: string) => void }
const Store = createContext<StoreValue | null>(null)
export function StoreProvider({ children }: { children: ReactNode }) {
  const { products } = useCatalog()
  const [cart, dispatch] = useReducer((state: CartLine[], action: CartAction) => cartReducer(state, action, products), undefined, () => sanitizeCart(readStored('thetia-cart-v1', []), products))
  const [favorites, setFavorites] = useState<string[]>(() => { const saved = readStored<unknown>('thetia-favorites-v1', []); return Array.isArray(saved) ? [...new Set(saved.filter((id): id is string => typeof id === 'string' && products.some(p => p.id === id)))] : [] })
  const [cartOpen, setCartOpen] = useState(false)
  const [toast, setToast] = useState('')
  useEffect(() => { try { localStorage.setItem('thetia-cart-v1', JSON.stringify(cart)) } catch { /* in-memory store remains usable */ } }, [cart])
  useEffect(() => { try { localStorage.setItem('thetia-favorites-v1', JSON.stringify(favorites)) } catch { /* in-memory store remains usable */ } }, [favorites])
  useEffect(() => { if (!toast) return; const timer = setTimeout(() => setToast(''), 3200); return () => clearTimeout(timer) }, [toast])
  const toggleFavorite = (id: string) => setFavorites(current => current.includes(id) ? current.filter(item => item !== id) : [...current, id])
  return <Store.Provider value={{ cart, dispatch, favorites, toggleFavorite, cartOpen, setCartOpen, toast, notify: setToast }}>{children}<div role="status" aria-live="polite" className={`toast ${toast ? 'visible' : ''}`}>{toast}</div></Store.Provider>
}
export const useStore = () => { const store = useContext(Store); if (!store) throw new Error('Missing StoreProvider'); return store }
