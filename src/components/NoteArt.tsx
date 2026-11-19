import { useId } from 'react'
import type { NoteId } from '../data/products'
export function NoteArt({ note, className = '' }: { note: NoteId; className?: string }) {
  const id = useId().replace(/:/g, '')
  return <svg viewBox="0 0 120 100" className={`note-art ${className}`} aria-hidden="true"><defs><radialGradient id={id}><stop stopColor="#fffdf0"/><stop offset=".65" stopColor="#f7efd8"/><stop offset="1" stopColor="#cabc98"/></radialGradient></defs>
    {note === 'vanilla' && <><path d="M20 81Q60 47 92 19M27 86Q74 61 105 39" stroke="#544333" strokeWidth="5" strokeLinecap="round"/>{[0,72,144,216,288].map(a=><ellipse key={a} cx="64" cy="31" rx="11" ry="26" transform={`rotate(${a} 64 53)`} fill={`url(#${id})`} stroke="#dfd4b8" strokeWidth=".5"/>)}<circle cx="64" cy="53" r="9" fill="#c5a74e"/><path d="M62 51l9 4-10 5" stroke="#f2d57c" strokeWidth="3"/></>}
    {note === 'honey' && <><path d="M29 35L43 15H76L96 35 88 71 60 84 27 69Z" fill="#e9af35"/>{[[39,35],[60,35],[80,35],[49,53],[70,53],[59,71]].map(([x,y],i)=><path key={i} d={`M${x-9} ${y-5}l9-5 9 5v10l-9 5-9-5Z`} fill="#f6c45c" stroke="#c78d26" strokeWidth="1.2"/>)}<path d="M83 68q-8 17 0 23 9-4 0-23" fill="#dba334"/><path d="M32 27L42 18" stroke="#ffe2a2" strokeWidth="3"/></>}
    {note === 'patchouli' && <><path d="M61 90V24M61 65L28 42M61 53L93 31" stroke="#677044" strokeWidth="2"/>{[[46,50,-50],[77,41,45],[47,29,-30],[72,68,65],[38,71,-60]].map(([x,y,r],i)=><g key={i} transform={`translate(${x} ${y}) rotate(${r})`}><path d="M0 16Q-24 0 0-28Q24 0 0 16" fill={i%2?'#7e8b47':'#9b9d5c'} stroke="#677b3d"/><path d="M0 14V-21M0-6L10-12M0 1L-10-5" stroke="#d1d69b" strokeWidth=".7"/></g>)}</>}
    {note === 'powder' && <><ellipse cx="62" cy="79" rx="43" ry="8" fill="#dfd4c2" opacity=".4"/><path d="M23 77Q35 57 46 54Q64 20 80 53Q89 56 103 77" fill={`url(#${id})`}/>{[0,1,2,3,4,5,6].map(i=><circle key={i} cx={29+i*12} cy={33+(i%3)*7} r="1.7" fill="#cfbfa6"/>)}</>}
    {note === 'sugar' && <>{[[30,55,-15],[57,40,8],[77,62,-6]].map(([x,y,r],i)=><g key={i} transform={`translate(${x} ${y}) rotate(${r})`}><rect width="27" height="26" rx="3" fill="#b58c54"/><path d="M0 0L7-8H33L27 0Z" fill="#d6b77c"/><path d="M27 0L33-8V17L27 26Z" fill="#977343"/>{[0,1,2,3,4].map(j=><circle key={j} cx={4+j*4} cy={5+(j%2)*9} r="1" fill="#e3c79c"/>)}</g>)}</>}
  </svg>
}
