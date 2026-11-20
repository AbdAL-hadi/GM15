import { expect, it } from 'vitest'
import { existsSync } from 'node:fs'
import { products } from './products'
import expected from './catalog-expected.json'
import { layerings } from './layerings'
import { sanitizeCart } from '../state/cart'
it('matches all ten supplied names, stages and local images',()=>{
 const perfumes=products.filter(p=>p.type==='perfume')
 expect(perfumes).toHaveLength(10)
 expect(new Set(perfumes.map(p=>p.slug)).size).toBe(10)
 for(const row of expected){const p=perfumes.find(p=>p.id===row.id)!
 expect(p.slug).toBe(row.id);expect(p.arabicName).toBe(row.arabicName)
 expect(p.pyramid).toEqual({top:row.top,heart:row.heart,base:row.base})
 expect(p.source).toBe('user-provided');expect(existsSync(`public${p.image}`)).toBe(true)
 }
 expect(layerings).toEqual([])
})
it('removes retired cart references while retaining valid lines',()=>{
 expect(sanitizeCart([{productId:'shams',size:50,quantity:1},{productId:'ward',size:50,quantity:2}])).toEqual([{productId:'ward',size:50,quantity:2}])
})
