import { createContext, useContext, useState } from 'react'
import type { ReactNode } from 'react'
import { clearProgress, initialProgress, readProgress, writeProgress } from './model'
import type { Progress } from './model'

const Context = createContext<{ progress: Progress; update: (next: Progress) => void; save: (id: string) => boolean; restart: () => boolean } | null>(null)
export function DiscoveryProvider({children}: {children: ReactNode}) {
  const [progress,setProgress] = useState(readProgress)
  const update = (next: Progress) => { setProgress(next); writeProgress(next) }
  const save = (id: string) => { const next={...progress,savedResult:id}; const ok=writeProgress(next); if(ok)setProgress(next); return ok }
  const restart = () => { const ok=clearProgress();setProgress(initialProgress());return ok }
  return <Context.Provider value={{progress,update,save,restart}}>{children}</Context.Provider>
}
export function useDiscovery() { const value=useContext(Context); if(!value)throw Error('Missing DiscoveryProvider');return value }
