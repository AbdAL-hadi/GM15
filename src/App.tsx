import { Suspense, lazy } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { StoreProvider } from './state/Store'
import { Shell } from './components/Shell'
import { NotFound } from './components/UI'
import Home from './pages/Home'
const Shop=lazy(()=>import('./pages/Shop'))
const Product=lazy(()=>import('./pages/Product'))
const Journey=lazy(()=>import('./pages/Journey'))
const Layering=lazy(()=>import('./pages/Layering'))
const About=lazy(()=>import('./pages/About'))
export default function App(){return <BrowserRouter><StoreProvider><Suspense fallback={<div className="page-loading">لحظة من فضلك…</div>}><Routes><Route element={<Shell/>}><Route index element={<Home/>}/><Route path="shop" element={<Shop/>}/><Route path="product/:slug" element={<Product/>}/><Route path="journey/:slug" element={<Journey/>}/><Route path="layering" element={<Layering/>}/><Route path="about" element={<About/>}/><Route path="*" element={<NotFound/>}/></Route></Routes></Suspense></StoreProvider></BrowserRouter>}
