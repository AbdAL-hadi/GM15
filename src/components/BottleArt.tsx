import { useId } from 'react'
export function BottleArt({ name = 'SHAMS', color = '#e8c77b', oil = false, className = '', reflection = false }: { name?: string; color?: string; oil?: boolean; className?: string; reflection?: boolean }) {
  const id = useId().replace(/:/g, '')
  return <svg className={`bottle-art ${className}`} viewBox="0 0 400 530" role="img" aria-label={`عبوة ${name} — نموذج بصري تجريبي`}>
    <defs>
      <linearGradient id={`${id}-metal`}><stop stopColor="#56534b"/><stop offset=".1" stopColor="#e9e6dc"/><stop offset=".22" stopColor="#7a766b"/><stop offset=".31" stopColor="#fffdf5"/><stop offset=".43" stopColor="#a6a195"/><stop offset=".64" stopColor="#efede5"/><stop offset=".77" stopColor="#6e6a5e"/><stop offset=".9" stopColor="#eeece4"/><stop offset="1" stopColor="#8b877d"/></linearGradient>
      <linearGradient id={`${id}-glass`}><stop stopColor="#a7a08c" stopOpacity=".6"/><stop offset=".04" stopColor="#fff" stopOpacity=".95"/><stop offset=".1" stopColor="#c5b994" stopOpacity=".45"/><stop offset=".18" stopColor="#fff" stopOpacity=".65"/><stop offset=".48" stopColor="#fcf9ef" stopOpacity=".2"/><stop offset=".82" stopColor="#fff" stopOpacity=".7"/><stop offset=".94" stopColor="#aa9b79" stopOpacity=".55"/><stop offset="1" stopColor="#fff"/></linearGradient>
      <linearGradient id={`${id}-liquid`} x1="0" y1="0" x2="1" y2=".3"><stop stopColor={color} stopOpacity=".65"/><stop offset=".35" stopColor={color} stopOpacity=".24"/><stop offset=".8" stopColor={color} stopOpacity=".6"/><stop offset="1" stopColor="#ad8c42" stopOpacity=".6"/></linearGradient>
      <linearGradient id={`${id}-shine`}><stop stopColor="#fff" stopOpacity="0"/><stop offset=".4" stopColor="#fff" stopOpacity=".85"/><stop offset=".6" stopColor="#fff" stopOpacity=".15"/><stop offset="1" stopColor="#fff" stopOpacity="0"/></linearGradient>
      <radialGradient id={`${id}-shadow`}><stop stopColor="#665739" stopOpacity=".22"/><stop offset="1" stopColor="#7e7157" stopOpacity="0"/></radialGradient>
      <linearGradient id={`${id}-fade`} x1="0" y1="0" x2="0" y2="1"><stop stopColor="white" stopOpacity=".2"/><stop offset="1" stopColor="white" stopOpacity="0"/></linearGradient>
      <mask id={`${id}-mask`}><rect x="0" y="440" width="400" height="90" fill={`url(#${id}-fade)`}/></mask>
    </defs>
    <ellipse cx="200" cy="450" rx={oil ? 64 : 155} ry="27" fill={`url(#${id}-shadow)`}/>
    <g id={`${id}-bottle`} transform={oil ? 'translate(102 0) scale(.49 1)' : undefined}>
      <rect x="70" y="171" width="260" height="273" rx="22" fill={`url(#${id}-glass)`} stroke="#c6bea8" strokeWidth="1.4"/>
      <path d="M90 202 Q90 184 108 184 H292 Q310 184 310 202 V419 Q310 430 294 430 H106 Q90 430 90 419Z" fill={`url(#${id}-liquid)`} stroke="#cbb77d" strokeOpacity=".8"/>
      <path d="M102 206 Q200 215 300 205" fill="none" stroke="#e8cf8b" strokeWidth="2"/>
      <rect x="81" y="180" width="13" height="245" rx="6" fill="#fff" opacity=".75"/>
      <rect x="310" y="189" width="7" height="232" rx="3" fill="#fff" opacity=".85"/>
      <path d="M91 427H309M100 434H300" stroke="#fff" strokeWidth="3" opacity=".8"/>
      <path d="M91 180Q200 197 313 180M94 175Q200 183 308 175" fill="none" stroke="#fdfbf4" strokeWidth="4"/>
      <rect x="173" y="148" width="54" height="40" rx="7" fill={`url(#${id}-metal)`}/>
      <path d="M201 181V416" stroke="#dad6c2" strokeWidth="3" opacity=".5"/>
      <rect x="148" y="59" width="104" height="109" rx="5" fill={`url(#${id}-metal)`} stroke="#aca69a"/>
      <ellipse cx="200" cy="60" rx="52" ry="8" fill="#d5d1c6" stroke="#8d887c"/>
      <ellipse cx="200" cy="60" rx="46" ry="5" fill={`url(#${id}-metal)`}/>
      <path d="M155 65V161M164 65V162M237 65V162" stroke="#fff" opacity=".6" strokeWidth="2"/>
      <rect x="110" y="228" width="180" height="146" rx="1" fill="#f8f1d9" fillOpacity=".18"/>
      <text x="200" y="282" fill="#282b20" textAnchor="middle" fontSize={oil ? '25' : '24'} fontFamily="Georgia,serif" letterSpacing="5">THETIA</text>
      <text x="200" y="317" fill="#333528" textAnchor="middle" fontSize="11" fontFamily="Arial,sans-serif" letterSpacing="3">{oil ? name.replace(' OIL', '') : name}</text>
      <text x="200" y="389" fill="#414232" textAnchor="middle" fontSize="9" fontFamily="Arial,sans-serif" letterSpacing="1.4">{oil ? 'PERFUME OIL' : 'EAU DE PARFUM'}</text>
      <path d="M96 191L128 191 251 428 216 428Z" fill={`url(#${id}-shine)`} opacity=".35"/>
      <path d="M72 200V422Q72 444 96 444H307" fill="none" stroke="#fff" strokeWidth="3" opacity=".8"/>
    </g>
    {reflection && <use href={`#${id}-bottle`} transform="translate(0 888) scale(1 -1)" mask={`url(#${id}-mask)`} opacity=".4"/>}
  </svg>
}
