import { describe, expect, it } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import type { ReactNode } from 'react'
import { StoreProvider } from '../state/Store'
import { CatalogProvider } from '../state/Catalog'
import { products } from '../data/products'
import { layerings } from '../data/layerings'
import Home from './Home'
import Shop from './Shop'
import Product from './Product'
import Journey from './Journey'
import Layering from './Layering'
import About from './About'
function render(path: string, route: string, page: ReactNode) {
  return renderToStaticMarkup(<MemoryRouter initialEntries={[path]}><CatalogProvider initialData={{products,layerings}}><StoreProvider><Routes><Route path={route} element={page}/></Routes></StoreProvider></CatalogProvider></MemoryRouter>)
}
describe('page rendering and data disclosures (server smoke tests, not browser tests)',()=>{
  it('renders home with working links to product, shop and layering',()=>{
    const html=render('/','/',<Home/>);expect(html).toContain('لكل ذكرى');for(const path of ['/product/ward','/shop'])expect(html).toContain(`href="${path}"`)
  })
  it('renders the catalog and a useful empty result for a query',()=>{
    expect(render('/shop','/shop',<Shop/>)).toContain('WARD')
    expect(render('/shop?q=not-a-fragrance','/shop',<Shop/>)).toContain('إعادة ضبط الفلاتر')
  })
  it('renders product variants, declared notes and demo data labels',()=>{
    const html=render('/product/ward','/product/:slug',<Product/>);expect(html).toContain('WARD');expect(html).toContain('100 ml');expect(html).toContain('ورد دمشقي');expect(html).toContain('الأحجام والأسعار والتوفر تجريبية')
  })
  it('handles unknown products and unknown journey paths',()=>{
    expect(render('/product/missing','/product/:slug',<Product/>)).toContain('لم نعثر على هذا العطر')
    expect(render('/journey/missing','/journey/:slug',<Journey/>)).toContain('لم نعثر على هذا العطر')
  })
  it('keeps the illustrative journey disclaimer visible',()=>{
    const html=render('/journey/sukoon','/journey/:slug',<Journey/>);expect(html).toContain('عرض بصري للنوتات');expect(html).toContain('type="range"')
  })
  it('renders the documented pairing and rejects an unlisted pairing',()=>{
    expect(render('/layering','/layering',<Layering/>)).toContain('تنسيقات المجموعة الجديدة ستضاف لاحقًا')
    const html=render('/layering?perfume=sukoon&oil=dimashq-oil','/layering',<Layering/>);expect(html).toContain('تنسيقات المجموعة الجديدة ستضاف لاحقًا');expect(html).not.toContain('<select')
  })
  it('documents sources and independent demo status',()=>{
    const html=render('/about','/about',<About/>);expect(html).toContain('واجهة تجريبية مستقلة');expect(html).toContain('عن التجربة ومصادرها')
  })
})

