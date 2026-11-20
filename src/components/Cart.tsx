import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Check, Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react'
import { useStore } from '../state/Store'
import { getVariant, money } from '../data/products'
import { useCatalog } from '../state/Catalog'
import { cartTotal } from '../state/cart'
import { BottleArt } from './BottleArt'
import { Dialog } from './UI'
export function Cart() {
  const { products, getProduct } = useCatalog()
  const { cart, dispatch, cartOpen, setCartOpen } = useStore()
  const [step, setStep] = useState<'cart' | 'checkout' | 'done'>('cart')
  const close = () => { setCartOpen(false); setStep('cart') }
  return <Dialog open={cartOpen} onClose={close} title={step === 'cart' ? `حقيبة العطور (${cart.reduce((n,l) => n+l.quantity,0)})` : step === 'checkout' ? 'مراجعة الطلب التجريبي' : 'اكتملت التجربة'} className="cart-dialog">
    {step === 'done' ? <div className="cart-empty"><span className="success-mark"><Check size={30}/></span><h3>ذكرى جميلة، حتى هنا.</h3><p>تمت محاكاة إتمام الطلب بنجاح. لم يُرسل أي طلب حقيقي ولم يتم تحصيل أي مبلغ.</p><button className="button" onClick={close}>متابعة الاكتشاف <ArrowLeft size={17}/></button></div> : cart.length === 0 ? <div className="cart-empty"><ShoppingBag size={42} strokeWidth={1}/><h3>حقيبتك تنتظر أول ذكرى</h3><p>ابدأ بعطر يشبهك، وأضف إليه لمستك.</p><Link className="button" to="/shop" onClick={close}>اكتشف العطور <ArrowLeft size={17}/></Link></div> : <>
      {step === 'checkout' && <div className="notice checkout-notice"><strong>هذه تجربة Frontend فقط.</strong><p>الأسعار والمخزون تجريبيان. لن تُطلب بيانات شخصية أو بطاقة دفع، ولن يُرسل طلب حقيقي.</p></div>}
      <div className="cart-lines">{cart.map(line => { const p = getProduct(line.productId)!; const v = getVariant(p,line.size)!; return <article className="cart-line" key={`${p.id}-${line.size}`}><Link to={`/product/${p.slug}`} onClick={close} className="cart-line-art"><BottleArt name={p.name} color={p.color} oil={p.type==='oil'}/></Link><div className="cart-line-info"><Link to={`/product/${p.slug}`} onClick={close}><h3 dir="ltr">{p.name}</h3></Link><p><bdi>{line.size} ml</bdi> · {p.type === 'oil' ? 'زيت عطري' : 'أو دو بارفان'}</p><strong dir="ltr">{money(v.price * line.quantity)}</strong>{step === 'cart' ? <div className="quantity"><button aria-label={`تقليل كمية ${p.name} ${line.size} مل`} disabled={line.quantity<=1} onClick={()=>dispatch({type:'quantity',...line,quantity:line.quantity-1})}><Minus size={14}/></button><output>{line.quantity}</output><button aria-label={`زيادة كمية ${p.name} ${line.size} مل`} disabled={line.quantity>=99} onClick={()=>dispatch({type:'quantity',...line,quantity:line.quantity+1})}><Plus size={14}/></button></div> : <small>الكمية: {line.quantity}</small>}</div>{step === 'cart' && <button className="icon-button remove-line" aria-label={`حذف ${p.name} ${line.size} مل`} onClick={()=>dispatch({type:'remove',productId:p.id,size:line.size})}><Trash2 size={17}/></button>}</article> })}</div>
      <div className="cart-summary"><div><span>المجموع</span><strong dir="ltr">{money(cartTotal(cart, products))}</strong></div><p>أسعار تجريبية · لا يشمل أي شحن أو رسوم فعلية.</p><button className="button full" onClick={() => { if(step==='cart')setStep('checkout');else {dispatch({type:'clear'});setStep('done')} }}>{step === 'cart' ? 'إتمام الطلب التجريبي' : 'تأكيد التجربة دون دفع'}<ArrowLeft size={18}/></button>{step === 'checkout' && <button className="text-button" onClick={()=>setStep('cart')}>العودة إلى الحقيبة</button>}</div>
    </>}
  </Dialog>
}
