import { Component, Suspense, useEffect, useMemo, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Environment, Lightformer, RoundedBox } from '@react-three/drei'
import * as THREE from 'three'
import { BottleArt } from '../components/BottleArt'

export interface SceneProps {
  name: string; color: string; capOpen: boolean; sprayId: number; angle: number
  onAngleChange: (angle: number) => void; onCapToggle: () => void; onSpray: () => void
  resetKey: number; explore?: boolean; stage?: number
}
function makeLabel(name: string) {
  const canvas = document.createElement('canvas')
  canvas.width = 768; canvas.height = 768
  const ctx = canvas.getContext('2d')!
  ctx.clearRect(0, 0, 768, 768)
  ctx.fillStyle = 'rgba(249,241,213,.3)'; ctx.fillRect(0, 0, 768, 768)
  ctx.fillStyle = '#292c20'; ctx.textAlign = 'center'
  ctx.font = '60px Georgia'; ctx.letterSpacing = '15px'; ctx.fillText('THETIA', 390, 280)
  ctx.font = '24px Arial'; ctx.letterSpacing = '7px'; ctx.fillText(name, 387, 375)
  ctx.font = '18px Arial'; ctx.letterSpacing = '3px'; ctx.fillText('EAU DE PARFUM', 385, 635)
  const texture = new THREE.CanvasTexture(canvas); texture.colorSpace = THREE.SRGBColorSpace
  return texture
}
function Spray({ sprayId, reduced }: { sprayId: number; reduced: boolean }) {
  const points = useRef<THREE.Points>(null)
  const material = useRef<THREE.PointsMaterial>(null)
  const age = useRef(10)
  const positions = useMemo(() => new Float32Array(72 * 3), [])
  const velocities = useMemo(() => Array.from({ length: 72 }, (_, i) => { const a = i * 2.399; const r = Math.sqrt((i + .5) / 72); return [Math.cos(a) * r * .9, Math.sin(a) * r * .65 + .3, 1.3 + (i % 7) * .08] }), [])
  useEffect(() => { age.current = sprayId > 0 ? 0 : 10 }, [sprayId])
  useFrame((_, delta) => {
    age.current = Math.min(10, age.current + delta)
    if (!points.current || !material.current) return
    const t = age.current
    const active = t < (reduced ? .35 : 1.45)
    points.current.visible = active
    if (!active) return
    material.current.opacity = Math.max(0, (1 - t / 1.45) * .7)
    velocities.forEach((v, i) => { positions[i * 3] = v[0] * t; positions[i * 3 + 1] = 1.65 + v[1] * t; positions[i * 3 + 2] = .26 + v[2] * t })
    points.current.geometry.attributes.position.needsUpdate = true
  })
  return <points ref={points} frustumCulled={false} visible={false}><bufferGeometry><bufferAttribute attach="attributes-position" args={[positions, 3]}/></bufferGeometry><pointsMaterial ref={material} color="#faf1d8" size={.055} transparent opacity={0} depthWrite={false}/></points>
}
/** Procedural bottle adapter: replace only this group with a locally owned GLB later. */
function BottleModel({ capOpen, sprayId, angle, name, color, onCapToggle, onSpray, explore, stage = 0, reduced }: SceneProps & { reduced: boolean }) {
  const cap = useRef<THREE.Group>(null)
  const nozzle = useRef<THREE.Group>(null)
  const root = useRef<THREE.Group>(null)
  const lastSprayAt = useRef(-10)
  const texture = useMemo(() => makeLabel(name), [name])
  useEffect(() => () => texture.dispose(), [texture])
  useEffect(() => { lastSprayAt.current = performance.now() }, [sprayId])
  useFrame((_, delta) => {
    const speed = reduced ? 1 : 1 - Math.exp(-delta * 9)
    if (cap.current) { cap.current.position.y = THREE.MathUtils.lerp(cap.current.position.y, capOpen ? 3.1 : 2.0, speed); cap.current.rotation.z = THREE.MathUtils.lerp(cap.current.rotation.z, capOpen ? -.18 : 0, speed) }
    if (root.current) { root.current.rotation.y = THREE.MathUtils.lerp(root.current.rotation.y, angle, speed); root.current.rotation.z = THREE.MathUtils.lerp(root.current.rotation.z, explore ? -.09 : 0, speed) }
    if (nozzle.current) { const elapsed = (performance.now() - lastSprayAt.current) / 1000; nozzle.current.position.y = 1.58 - (elapsed < .24 && sprayId > 0 ? Math.sin(elapsed / .24 * Math.PI) * .09 : 0) }
  })
  return <group ref={root} position={[0, -.5, 0]}>
    <RoundedBox args={[2.35, 2.8, 1.13]} radius={.17} smoothness={4}>
      <meshPhysicalMaterial color="#fff9e8" roughness={.07} transmission={.92} thickness={.27} ior={1.5} transparent opacity={.72} envMapIntensity={1.4} clearcoat={1}/>
    </RoundedBox>
    <RoundedBox args={[2.08, 2.34, .89]} radius={.12} smoothness={3} position={[0, -.11, 0]}>
      <meshPhysicalMaterial color={color} roughness={.12} transmission={.64} thickness={1.2} ior={1.33} transparent opacity={.82} envMapIntensity={1.15}/>
    </RoundedBox>
    <mesh position={[0, 1.065, 0]} rotation={[Math.PI / 2, 0, 0]}><planeGeometry args={[1.82, .71]}/><meshStandardMaterial color={color} transparent opacity={.23} side={THREE.DoubleSide}/></mesh>
    <mesh position={[0, -.1, .583]}><planeGeometry args={[1.65, 1.88]}/><meshBasicMaterial map={texture} transparent depthWrite={false}/></mesh>
    <mesh position={[0, .01, 0]}><cylinderGeometry args={[.017, .017, 2.5, 8]}/><meshStandardMaterial color="#e7dfc8" transparent opacity={.45}/></mesh>
    <mesh position={[0, 1.44, 0]}><cylinderGeometry args={[.34, .37, .28, 40]}/><meshStandardMaterial color="#cac5b3" metalness={1} roughness={.18}/></mesh>
    <group ref={nozzle} position={[0, 1.58, 0]} onClick={e => { e.stopPropagation(); onSpray() }}>
      <mesh><cylinderGeometry args={[.20, .20, .32, 32]}/><meshStandardMaterial color="#d6d1c5" metalness={1} roughness={.16}/></mesh>
      <mesh position={[0, .02, .203]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[.034, .034, .015, 12]}/><meshStandardMaterial color="#393c32"/></mesh>
    </group>
    <group ref={cap} position={[0, 2, 0]} onClick={e => { e.stopPropagation(); onCapToggle() }}>
      <mesh><cylinderGeometry args={[.47, .47, 1.12, 64]}/><meshStandardMaterial color="#c5c1b6" metalness={1} roughness={.21}/></mesh>
      <mesh position={[0, .565, 0]}><cylinderGeometry args={[.44, .44, .016, 48]}/><meshStandardMaterial color="#d6d1c4" metalness={1} roughness={.23}/></mesh>
      <mesh position={[0, -.56, 0]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[.45, .018, 8, 48]}/><meshStandardMaterial color="#928a76" metalness={1} roughness={.2}/></mesh>
    </group>
    <Spray sprayId={sprayId} reduced={reduced}/>
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.43, 0]}><circleGeometry args={[2.2, 64]}/><meshBasicMaterial color={stage === 1 ? '#cdb67d' : '#bcb19a'} transparent opacity={.08}/></mesh>
  </group>
}
class SceneBoundary extends Component<{ children: ReactNode; fallback: ReactNode }, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() { return { failed: true } }
  render() { return this.state.failed ? this.props.fallback : this.props.children }
}
function hasWebGL() {
  if (new URLSearchParams(location.search).get('webgl') === 'off') return false
  try { const c = document.createElement('canvas'); const gl = c.getContext('webgl2'); if (!gl) return false; gl.getExtension('WEBGL_lose_context')?.loseContext(); return true } catch { return false }
}
export default function BottleScene(props: SceneProps) {
  const [supported] = useState(hasWebGL)
  const [ready, setReady] = useState(false)
  const [lost, setLost] = useState(false)
  const [reduced, setReduced] = useState(() => matchMedia('(prefers-reduced-motion: reduce)').matches)
  const [canvasElement, setCanvasElement] = useState<HTMLCanvasElement | null>(null)
  const drag = useRef<{ start: number; angle: number } | null>(null)
  useEffect(() => { const mq = matchMedia('(prefers-reduced-motion: reduce)'); const change = () => setReduced(mq.matches); mq.addEventListener('change', change); return () => mq.removeEventListener('change', change) }, [])
  useEffect(() => { if (!canvasElement) return; const handleLost = () => setLost(true); canvasElement.addEventListener('webglcontextlost', handleLost); return () => canvasElement.removeEventListener('webglcontextlost', handleLost) }, [canvasElement])
  const fallback = <div className="scene-fallback"><BottleArt name={props.name} color={props.color}/><p>العرض ثلاثي الأبعاد غير متاح على هذا الجهاز.<br/>يمكنك متابعة اكتشاف النوتات والتسوّق.</p></div>
  if (!supported || lost) return fallback
  return <SceneBoundary fallback={fallback}><div className="scene-canvas" tabIndex={0} role="group" aria-label="مجسّم العطر. اسحب أفقيًا أو استخدم سهمي اليمين واليسار للتدوير، ومفتاح Home لإعادة الزاوية." onKeyDown={e => { if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') { e.preventDefault(); props.onAngleChange(props.angle + (e.key === 'ArrowLeft' ? -.25 : .25)) } if (e.key === 'Home') props.onAngleChange(0) }} onPointerDown={e => { drag.current = { start: e.clientX, angle: props.angle } }} onPointerMove={e => { if (drag.current && Math.abs(e.clientX - drag.current.start) > 6) { if (!e.currentTarget.hasPointerCapture(e.pointerId)) e.currentTarget.setPointerCapture(e.pointerId); props.onAngleChange(drag.current.angle + (e.clientX - drag.current.start) * .012) } }} onPointerUp={() => { drag.current = null }} onPointerCancel={() => { drag.current = null }} onLostPointerCapture={() => { drag.current = null }}>
    {!ready && <div className="scene-loading"><span/> جارٍ تجهيز تجربتك…</div>}
    <Canvas dpr={[1, 1.5]} camera={{ position: [3.6, 2.1, 8], fov: 39 }} gl={{ antialias: true, alpha: true, powerPreference: 'low-power' }} onCreated={({ gl, camera }) => { camera.lookAt(0, .25, 0); setCanvasElement(gl.domElement); setReady(true) }}>
      <ambientLight intensity={1.4}/><directionalLight position={[4, 8, 5]} intensity={3} color="#fff6dc"/>
      <Suspense fallback={null}><Environment resolution={64}><Lightformer position={[0, 5, -3]} intensity={4} scale={[6, 8, 1]}/><Lightformer position={[-4, 0, 2]} rotation={[0, Math.PI / 2, 0]} intensity={5} scale={[2, 7, 1]}/><Lightformer position={[4, 1, 3]} rotation={[0, -Math.PI / 3, 0]} intensity={4} scale={[1, 8, 1]}/><Lightformer position={[0, 2, 5]} intensity={2} scale={[4, 1, 1]}/></Environment><BottleModel {...props} reduced={reduced}/></Suspense>
    </Canvas>
  </div></SceneBoundary>
}
