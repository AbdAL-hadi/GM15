import { describe, expect, it } from 'vitest'
import { cartReducer, cartTotal, sanitizeCart } from './cart'
import { makePair } from './pair'
import { products, getVariant } from '../data/products'
describe('cart and variant integrity',()=>{
  it('keeps sizes separate, merges identical variants and uses current prices',()=>{
    let cart=cartReducer([],{type:'add',lines:[{productId:'shams',size:15,quantity:1},{productId:'shams',size:50,quantity:2}]})
    cart=cartReducer(cart,{type:'add',lines:[{productId:'shams',size:50,quantity:1}]})
    expect(cart).toHaveLength(2);expect(cart[1].quantity).toBe(3);expect(cartTotal(cart)).toBe(530)
  })
  it('updates quantities, clamps limits, removes and clears',()=>{
    let cart=cartReducer([],{type:'add',lines:[{productId:'shams',size:50,quantity:1}]})
    cart=cartReducer(cart,{type:'quantity',productId:'shams',size:50,quantity:4});expect(cartTotal(cart)).toBe(600)
    expect(cartReducer(cart,{type:'quantity',productId:'shams',size:50,quantity:-1})[0].quantity).toBe(1)
    expect(cartReducer(cart,{type:'quantity',productId:'shams',size:50,quantity:100})[0].quantity).toBe(99)
    expect(cartReducer(cart,{type:'remove',productId:'shams',size:50})).toEqual([])
    expect(cartReducer(cart,{type:'clear'})).toEqual([])
  })
  it('rejects invalid, unavailable and corrupt persisted lines',()=>{
    expect(sanitizeCart(null)).toEqual([])
    expect(sanitizeCart([{productId:'missing',size:50,quantity:1},{productId:'shams',size:999,quantity:1},{productId:'jawa',size:50,quantity:1},{productId:'shams',size:50,quantity:-2},null,'x'])).toEqual([])
    expect(sanitizeCart([{productId:'shams',size:50,quantity:1},{productId:'shams',size:50,quantity:2}])).toEqual([{productId:'shams',size:50,quantity:3}])
  })
  it('caps rapid repeat additions at 99',()=>{
    const cart=cartReducer([{productId:'shams',size:50,quantity:98}],{type:'add',lines:[{productId:'shams',size:50,quantity:3}]})
    expect(cart[0].quantity).toBe(99)
  })
  it('has unique IDs, positive prices and distinct sizes in a unified catalog',()=>{
    expect(new Set(products.map(p=>p.id)).size).toBe(products.length)
    for(const p of products){expect(new Set(p.variants.map(v=>v.size)).size).toBe(p.variants.length);for(const v of p.variants){expect(v.price).toBeGreaterThan(0);expect(getVariant(p,v.size)).toEqual(v)}}
  })
})
describe('curated layering',()=>{
  it('adds exactly the selected perfume size and 5ml oil once each',()=>{
    const pair=makePair('shams','vanilla-oil',100)!
    expect(pair).toEqual([{productId:'shams',size:100,quantity:1},{productId:'vanilla-oil',size:5,quantity:1}]);expect(cartTotal(pair)).toBe(245)
    expect(cartReducer([], {type:'add',lines:pair})).toHaveLength(2)
  })
  it('rejects unlisted, unavailable, unknown and invalid-sized combinations',()=>{
    expect(makePair('shams','dimashq-oil',50)).toBeNull();expect(makePair('jawa','vanilla-oil',50)).toBeNull();expect(makePair('shams','vanilla-oil',999)).toBeNull();expect(makePair('missing','vanilla-oil',50)).toBeNull()
  })
  it('resolves other verified pairings from the shared catalog',()=>{
    expect(makePair('day','dimashq-oil',30)?.[0].size).toBe(30)
    expect(makePair('vanilla','vanilla-oil',15)?.[1].size).toBe(5)
  })
})
