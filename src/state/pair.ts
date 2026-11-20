import type { Product } from '../data/products'
import { products as demoProducts, getVariant } from '../data/products'
import { findLayering } from '../data/layerings'
import type { CartLine } from './cart'
export function makePair(perfumeId: string, oilId: string, size: number, products: Product[] = demoProducts, listed = !!findLayering(perfumeId,oilId)): CartLine[] | null {
  const perfume=products.find(p=>p.id===perfumeId),oil=products.find(p=>p.id===oilId)
  if(!perfume||!oil||!listed||!getVariant(perfume,size)?.available||!oil.variants[0]?.available)return null
  return [{productId:perfumeId,size,quantity:1},{productId:oilId,size:oil.variants[0].size,quantity:1}]
}

