import type { Product } from '../data/products'
import { products as demoProducts, getVariant } from '../data/products'
export interface CartLine { productId: string; size: number; quantity: number }
export type CartAction = { type: 'add'; lines: CartLine[] } | { type: 'quantity'; productId: string; size: number; quantity: number } | { type: 'remove'; productId: string; size: number } | { type: 'clear' }
export function validLine(line: unknown, products: Product[] = demoProducts): line is CartLine {
  if (!line || typeof line !== 'object') return false
  const l = line as CartLine
  const p = products.find(p => p.id === l.productId)
  return !!p && !!getVariant(p, l.size)?.available && Number.isInteger(l.quantity) && l.quantity > 0 && l.quantity <= 99
}
export function cartReducer(state: CartLine[], action: CartAction, products: Product[] = demoProducts): CartLine[] {
  if (action.type === 'clear') return []
  if (action.type === 'remove') return state.filter(l => l.productId !== action.productId || l.size !== action.size)
  if (action.type === 'quantity') return state.map(l => l.productId === action.productId && l.size === action.size ? { ...l, quantity: Math.max(1, Math.min(99, Math.round(action.quantity) || 1)) } : l)
  const next = state.map(l => ({ ...l }))
  for (const line of action.lines.filter(line => validLine(line, products))) {
    const existing = next.find(l => l.productId === line.productId && l.size === line.size)
    if (existing) existing.quantity = Math.min(99, existing.quantity + line.quantity)
    else next.push({ ...line })
  }
  return next
}
export function sanitizeCart(value: unknown, products: Product[] = demoProducts): CartLine[] {
  return Array.isArray(value) ? cartReducer([], { type: 'add', lines: value.filter(line => validLine(line, products)) }, products) : []
}
export const cartTotal = (lines: CartLine[], products: Product[] = demoProducts) => lines.reduce((sum, l) => {
  const p = products.find(p => p.id === l.productId)
  return sum + (p ? getVariant(p, l.size)?.price ?? 0 : 0) * l.quantity
}, 0)
export function readStored<T>(key: string, fallback: T): T {
  try { const raw = localStorage.getItem(key); return raw ? JSON.parse(raw) : fallback } catch { return fallback }
}
