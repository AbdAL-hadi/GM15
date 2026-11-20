import { describe, expect, it } from 'vitest'
import { products } from '../data/products'
import { budgetMatch, complete, conflict, emptyAnswers, recommend, validAnswers } from './model'
import type { Answers } from './model'
const answer = (patch: Partial<Answers> = {}): Answers => ({...emptyAnswers(),moods:['vanilla'],likes:['vanilla'],dislikesNone:true,occasion:'any',budget:'any',...patch})
describe('personal scent recommendations', () => {
  it('direct preferences outweigh imagery and ties remain stable', () => {
    const profiles = [
      {productId:'sukoon',families:['vanilla'] as const,source:'test',status:'verified' as const},
      {productId:'ward',families:['floral'] as const,source:'test',status:'demo' as const},
    ]
    const a=answer({moods:['floral'],likes:['vanilla']})
    expect(recommend(a,products,profiles.map(p=>({...p,families:[...p.families]})))[0].product.id).toBe('sukoon')
    const tied=answer({moods:['vanilla','floral'],likesUnsure:true,likes:[]})
    expect(recommend(tied,products,profiles.map(p=>({...p,families:[...p.families]}))).map(r=>r.product.id)).toEqual(['sukoon','ward'])
  })
  it('excludes dislikes and rejects conflicts', () => {
    expect(conflict(answer({dislikes:['vanilla'],dislikesNone:false}))).toEqual(['vanilla'])
    expect(complete(answer({dislikes:['vanilla'],dislikesNone:false}))).toBe(false)
    expect(recommend(answer({dislikes:['vanilla'],dislikesNone:false}),products)).toEqual([])
  })
  it('checks available variants within each budget', () => {
    expect(budgetMatch(100,'under100')).toBe(false)
    expect(recommend(answer({budget:'under100'}),products)[0].size).toBe(15)
    expect(recommend(answer({budget:'100to150'}),products)[0].size).toBe(50)
    const unavailable=structuredClone(products);unavailable.forEach(p=>p.variants.forEach(v=>v.available=false))
    expect(recommend(answer(),unavailable)).toEqual([])
  })
  it('does not promote oils, unknown profiles, or unsupported matches', () => {
    expect(recommend(answer({moods:['powder'],likes:['powder']}),products)).toEqual([])
    expect(recommend(answer(),products)).toHaveLength(3)
    expect(recommend(answer(),products)[0].reasons.every(r=>r.includes('فانيلا'))).toBe(true)
    const oilProfile=[{productId:'vanilla-oil',families:['vanilla' as const],source:'test',status:'verified' as const}]
    expect(recommend(answer(),products,oilProfile)).toEqual([])
  })
  it('keeps demo attribution and rejects malformed progress answers', () => {
    const profile=[{productId:'sukoon',families:['vanilla' as const],source:'test',status:'demo' as const}]
    expect(recommend(answer(),products,profile)[0].status).toBe('demo')
    expect(validAnswers({...answer(),likes:['alien']})).toBe(false)
    expect(validAnswers({...answer(),likesUnsure:true})).toBe(false)
  })
})
