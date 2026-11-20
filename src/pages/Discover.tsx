import { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Check } from 'lucide-react'
import { families, familyNames, conflict } from '../discovery/model'
import type { Answers, Budget, Family, Occasion } from '../discovery/model'
import { useDiscovery } from '../discovery/state'
const moods: {id:Family;label:string}[] = [
  {id:'vanilla',label:'دفء الفانيلا'}, {id:'floral',label:'حديقة الياسمين'},
  {id:'citrus',label:'انتعاش الحمضيات'}, {id:'woods',label:'عمق الأخشاب'},
]
const questions=['أي أجواء أقرب لذوقك؟','شو الروائح اللي بتحبها؟','في روائح ما بتفضّلها؟','لأي وقت بدك عطرك؟','شو الميزانية المناسبة إلك؟']
const occasions: {id:Occasion;label:string}[]=[{id:'daily',label:'استخدام يومي'},{id:'event',label:'مناسبة'},{id:'gift',label:'هدية'},{id:'any',label:'بدون تفضيل'}]
const budgets: {id:Budget;label:string}[]=[{id:'under100',label:'أقل من 100 ₪'},{id:'100to150',label:'100–150 ₪'},{id:'151to200',label:'151–200 ₪'},{id:'over200',label:'أكثر من 200 ₪'},{id:'any',label:'بدون تحديد'}]
function Picture({id}:{id:Family}) { return <img src={`/discover/${['vanilla','floral','citrus','woods'].includes(id)?id:'floral'}-photo.jpg`} alt="" onError={e=>{if(!e.currentTarget.src.endsWith('.svg'))e.currentTarget.src=`/discover/${id}.svg`}}/> }
export default function Discover() {
  const {progress,update,restart}=useDiscovery(), navigate=useNavigate()
  const location=useLocation()
  const {step,answers}=progress
  const [message,setMessage]=useState('')
  const heading=useRef<HTMLHeadingElement>(null)
  useEffect(()=>{heading.current?.focus()},[step])
  useEffect(()=>{const params=new URLSearchParams(location.search), requested=Number(params.get('step'));if(params.has('step')&&Number.isInteger(requested)&&requested>=1&&requested<=5&&requested-1!==progress.step)update({...progress,step:requested-1})},[location.key])
  const change=(next:Answers)=>{update({...progress,answers:next,savedResult:null});setMessage('')}
  const toggle=(key:'moods'|'likes'|'dislikes',id:Family)=>{const current=answers[key];change({...answers,[key]:current.includes(id)?current.filter(v=>v!==id):[...current,id],...(key==='likes'?{likesUnsure:false}:{}),...(key==='dislikes'?{dislikesNone:false}:{})})}
  const next=()=>{
    if(step===0&&!answers.moods.length||step===1&&!answers.likes.length&&!answers.likesUnsure){setMessage('اختر إجابة واحدة على الأقل للمتابعة.');return}
    if(step===2&&!answers.dislikes.length&&!answers.dislikesNone){setMessage('اختر رائحة أو حدّد ما عندي تفضيل.');return}
    if((step===1||step===2)&&conflict(answers).length){setMessage('اخترت الرائحة نفسها كمحبوبة وغير مفضلة. عدّل أحد الاختيارين للمتابعة.');return}
    if(step===3&&!answers.occasion||step===4&&!answers.budget){setMessage('اختر إجابة للمتابعة.');return}
    setMessage('')
    if(step===4)navigate('/discover/results')
    else {update({...progress,step:step+1});navigate(`/discover?step=${step+2}`)}
  }
  return <main className="discover-page"><div className="discover-wrap">
    <div className="discover-intro"><h1>اكتشف ذوقك</h1><h2 ref={heading} tabIndex={-1}>{questions[step]}</h2></div>
    <div className="discover-progress"><span dir="ltr">{String(step+1).padStart(2,'0')} / 05</span><div role="progressbar" aria-valuenow={step+1} aria-valuemin={1} aria-valuemax={5} aria-label="تقدم الاختبار">{Array.from({length:5},(_,index)=><i key={index} className={index<=step?'active':''}/>)}</div></div>
    <section className="discover-question" aria-live="polite">
      {step<3&&<div className={`discover-options ${step===0?'mood-options':''}`}>
        {(step===0?moods:families.map(id=>({id,label:familyNames[id]}))).map(({id,label})=>{const selected=answers[step===0?'moods':step===1?'likes':'dislikes'].includes(id);return <button key={id} type="button" className={`discover-card ${selected?'selected':''}`} aria-pressed={selected} onClick={()=>toggle(step===0?'moods':step===1?'likes':'dislikes',id)}><span className="discover-picture"><Picture id={id}/><span className="discover-check"><Check size={18}/></span></span><span className="discover-card-name">{label}</span></button>})}
        {step!==0&&<button className={`discover-card simple ${step===1?answers.likesUnsure?'selected':'':answers.dislikesNone?'selected':''}`} type="button" aria-pressed={step===1?answers.likesUnsure:answers.dislikesNone} onClick={()=>change(step===1?{...answers,likes:[],likesUnsure:!answers.likesUnsure}:{...answers,dislikes:[],dislikesNone:!answers.dislikesNone})}><span className="discover-picture"><span className="discover-uncertain">؟</span></span><span className="discover-card-name">{step===1?'لسا مش متأكد':'ما عندي تفضيل'}</span></button>}
      </div>}
      {step===3&&<div className="discover-options compact">{occasions.map(option=><button key={option.id} className={`discover-choice ${answers.occasion===option.id?'selected':''}`} aria-pressed={answers.occasion===option.id} onClick={()=>change({...answers,occasion:option.id})}>{option.label}<Check size={18}/></button>)}</div>}
      {step===4&&<div className="discover-options compact">{budgets.map(option=><button key={option.id} className={`discover-choice ${answers.budget===option.id?'selected':''}`} aria-pressed={answers.budget===option.id} onClick={()=>change({...answers,budget:option.id})}><bdi>{option.label}</bdi><Check size={18}/></button>)}</div>}
      <p className="discover-help">{step===0||step===1?'يمكنك اختيار أكثر من إجابة':step===2?'الاختيارات المحددة تستبعد العطور ذات التصنيف المطابق المعروف.':step===3?'نستخدم المناسبة فقط عندما تتوفر عنها معلومات موثقة.':'الميزانية لعبوة عطر واحدة قبل الزيت والتوصيل.'}</p>
      {conflict(answers).length>0&&<p className="discover-alert" role="alert">تعارض في {conflict(answers).map(f=>familyNames[f]).join('، ')}. عدّل الروائح المحبوبة أو المستبعدة.</p>}
      {message&&<p className="discover-alert" role="alert">{message}</p>}
      <div className="discover-actions"><button className="button" onClick={next}>{step===4?'اكتشف اقتراحاتي':'التالي'} <ArrowLeft size={19}/></button>{step>0&&<button className="discover-back" onClick={()=>{setMessage('');update({...progress,step:step-1});navigate(`/discover?step=${step}`)}}><ArrowRight size={17}/> السابق</button>}</div>
    </section><div className="discover-bottom"><Link to="/shop">تصفّح العطور</Link><button onClick={()=>{restart();setMessage('');navigate('/discover',{replace:true});heading.current?.focus()}}>إعادة البدء</button></div>
  </div></main>
}
