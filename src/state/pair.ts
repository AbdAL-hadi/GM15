import { getProduct, getVariant } from '../data/products'
import { findLayering } from '../data/layerings'
import type { CartLine } from './cart'
export function makePair(perfumeId: string, oilId: string, size: number): CartLine[] | null {
  const perfume=getProduct(perfumeId),oil=getProduct(oilId)
  if(!perfume||!oil||!findLayering(perfumeId,oilId)||!getVariant(perfume,size)?.available||!oil.variants[0]?.available)return null
  return [{productId:perfumeId,size,quantity:1},{productId:oilId,size:oil.variants[0].size,quantity:1}]
}
