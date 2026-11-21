import { Suspense, lazy } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Layout from './thetia/Layout'
import Home from './thetia/Home'
import { useLang } from './thetia/i18n'

const Shop = lazy(() => import('./thetia/Shop'))
const Product = lazy(() => import('./thetia/Product'))
const Quiz = lazy(() => import('./thetia/Quiz'))
const Wishlist = lazy(() => import('./thetia/Wishlist'))
const Refill = lazy(() => import('./thetia/Refill'))
const Story = lazy(() => import('./thetia/Story'))
const Contact = lazy(() => import('./thetia/Contact'))
const Account = lazy(() => import('./thetia/Account'))
const NotesWheel = lazy(() => import('./thetia/NotesWheel'))

function NotesPage() {
  const { t } = useLang()
  return <section className="t-section t-wheel-section">
    <h1 className="t-h2">{t('wheel')}</h1>
    <p className="t-lead">{t('wheelLead')}</p>
    <NotesWheel />
  </section>
}

function Loading() {
  const { t } = useLang()
  return <div className="page-loading">{t('loading')}</div>
}

const pages = <>
  <Route index element={<Home />} />
  <Route path="shop" element={<Shop />} />
  <Route path="p/:slug" element={<Product />} />
  <Route path="choose" element={<Quiz />} />
  <Route path="notes" element={<NotesPage />} />
  <Route path="wishlist" element={<Wishlist />} />
  <Route path="refill" element={<Refill />} />
  <Route path="story" element={<Story />} />
  <Route path="contact" element={<Contact />} />
  <Route path="account" element={<Account />} />
</>

export default function App() {
  return <BrowserRouter><Suspense fallback={<Loading />}><Routes>
    <Route element={<Layout />}>
      {pages}
      <Route path="en">{pages}</Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Route>
  </Routes></Suspense></BrowserRouter>
}
