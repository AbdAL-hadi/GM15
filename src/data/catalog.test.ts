import { describe, expect, it } from 'vitest'
import { demoCatalogSource } from './catalog'
import { products } from './products'
import { cartReducer, cartTotal, sanitizeCart } from '../state/cart'
import { makePair } from '../state/pair'

describe('catalog boundary', () => {
  it('returns independent snapshots and honors cancellation', async () => {
    const snapshot = await demoCatalogSource.load(new AbortController().signal)
    snapshot.products[0].name = 'changed'
    expect(products[0].name).toBe('WARD')
    const controller = new AbortController(); controller.abort()
    await expect(demoCatalogSource.load(controller.signal)).rejects.toThrow()
  })
  it('cart and pair use loaded prices and availability instead of demo defaults', () => {
    const catalog = structuredClone(products)
    catalog[0].variants.find(v => v.size === 50)!.price = 12
    const line = { productId: 'ward', size: 50, quantity: 2 }
    expect(cartTotal(cartReducer([], { type: 'add', lines: [line] }, catalog), catalog)).toBe(24)
    expect(makePair('ward', 'vanilla-oil', 50, catalog, false)).toBeNull()
    catalog[0].variants.find(v => v.size === 50)!.available = false
    expect(sanitizeCart([line], catalog)).toEqual([])
    expect(makePair('ward', 'vanilla-oil', 50, catalog, true)).toBeNull()
  })
})
