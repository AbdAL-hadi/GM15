import { createContext, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { demoCatalogSource } from '../data/catalog'
import type { Catalog, CatalogSource } from '../data/catalog'

const Context = createContext<Catalog | null>(null)
export function CatalogProvider({ children, source = demoCatalogSource, initialData }: {
  children: ReactNode; source?: CatalogSource; initialData?: Catalog
}) {
  const [data, setData] = useState(initialData)
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>(initialData ? 'ready' : 'loading')
  const [attempt, setAttempt] = useState(0)
  useEffect(() => {
    if (initialData) return
    const controller = new AbortController()
    Promise.resolve().then(() => source.load(controller.signal)).then(result => {
      if (!controller.signal.aborted) { setData(result); setStatus('ready') }
    }).catch(() => { if (!controller.signal.aborted) setStatus('error') })
    return () => controller.abort()
  }, [source, attempt, initialData])
  const retry = () => { setStatus('loading'); setAttempt(n => n + 1) }
  if (status === 'loading') return <main className="empty-page" role="status">جارٍ تحميل المجموعة…</main>
  if (status === 'error') return <main className="empty-page" role="alert"><h1>تعذر تحميل المجموعة</h1><p>حاول مرة أخرى للمتابعة.</p><button className="button" onClick={retry}>إعادة المحاولة</button></main>
  if (!data?.products.length) return <main className="empty-page"><h1>المجموعة غير متاحة حاليًا</h1><button className="button" onClick={retry}>إعادة المحاولة</button></main>
  return <Context.Provider value={data}>{children}</Context.Provider>
}
export function useCatalog() {
  const data = useContext(Context)
  if (!data) throw new Error('Missing CatalogProvider')
  return { ...data, getProduct: (id: string) => data.products.find(p => p.id === id || p.slug === id),
    findLayering: (perfume: string, oil: string) => data.layerings.find(p => p.perfume === perfume && p.oil === oil) }
}
