import { useEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { ContactShadows, Environment, Html, Lightformer, OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import type { Kind, Shape } from './catalog'

/* THETIA's real packaging, modelled simply:
   perfume = clear glass cylinder, silver core cap inside clear acrylic, black THETIA print (tall 50/100 mL, squat 30 mL)
   oil     = slim 5 mL roll-on with a silver cap and a roller ball
   cream   = white squeeze tube with a white cap */
const DIMS: Record<Shape, { r: number; h: number; capR: number; capH: number; neck: number }> = {
  tall: { r: .52, h: 1.9, capR: .36, capH: .78, neck: .1 },
  squat: { r: .82, h: 1.05, capR: .74, capH: .62, neck: .08 },
  roll: { r: .26, h: 2.1, capR: .22, capH: .6, neck: .06 },
}

export interface BurstNote { label: string; src?: string; tint: string }
interface Props { kind: Kind; shape: Shape; liquid: string; open: boolean; actionKey: number; spin: boolean; notes: BurstNote[] }

const clamp = (v: number) => Math.max(0, Math.min(1, v))
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3)

function makeLabel(vertical: boolean) {
  const c = document.createElement('canvas'); c.width = 1024; c.height = 256
  const ctx = c.getContext('2d')!
  ctx.fillStyle = '#0b0b0b'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
  ctx.save(); ctx.translate(512, 128); ctx.scale(1.45, 1)
  ctx.font = '900 150px Inter, "Arial Black", sans-serif'
  ctx.fillText('THETIA', -20, 6)
  ctx.font = '500 46px Inter, sans-serif'; ctx.fillText('®', 268, -40)
  ctx.restore()
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8
  if (vertical) { t.center.set(.5, .5); t.rotation = Math.PI / 2 }
  return t
}

/* When the lid opens, the notes burst out of the neck, hang for a moment, then fade away (reference video 1). */
const BURST_S = 3.2
function NoteBurst({ notes, open, top, reduced }: { notes: BurstNote[]; open: boolean; top: number; reduced: boolean }) {
  const groups = useRef<(THREE.Group | null)[]>([])
  const cards = useRef<(HTMLDivElement | null)[]>([])
  const t = useRef(1)
  const list = notes.slice(0, 8)
  useEffect(() => { if (open) t.current = 0 }, [open])
  const targets = useMemo(() => list.map((_, k) => {
    const n = Math.max(1, list.length - 1)
    const a = (-75 + (k / n) * 150) * Math.PI / 180
    const r = 1.55 + (k % 2) * .45
    return { x: Math.sin(a) * r * 1.55, y: top + .05 + Math.cos(a) * r * .5 - (k % 2) * .25, z: .35 - (k % 3) * .2, delay: k * .05 }
  }), [list, top])
  useFrame((_, dt) => {
    // Cap the step so a slow first frame (while the scene loads) doesn't skip the burst.
    t.current = Math.min(1, t.current + Math.min(dt, .05) / (reduced ? 1.2 : BURST_S))
    const time = t.current * BURST_S
    list.forEach((_, k) => {
      const g = groups.current[k]; const el = cards.current[k]; const tg = targets[k]
      if (!g || !el || !tg) return
      const out = easeOut(clamp((time - tg.delay) / .7))
      const fade = clamp((time - 2.3 - tg.delay * .5) / .7)
      const drift = clamp((time - .7) / 2.5) * .25
      g.position.set(tg.x * out, top + (tg.y - top) * out + drift + fade * .3, tg.z * out)
      el.style.opacity = t.current >= 1 ? '0' : String(Math.min(1, out * 1.6) * (1 - fade))
      el.style.transform = `scale(${(.35 + out * .65) * (1 - fade * .25)})`
    })
  })
  return <>{list.map((n, k) => <group key={n.label} ref={el => { groups.current[k] = el }} position={[0, top, 0]}>
    <Html center zIndexRange={[20, 0]} style={{ pointerEvents: 'none' }}>
      <div ref={el => { cards.current[k] = el }} className="t-float-note" style={{ opacity: 0 }}>
        <span style={{ background: n.tint }}>{n.src && <img src={n.src} alt="" />}</span>
        <em>{n.label}</em>
      </div>
    </Html>
  </group>)}</>
}

/* ---------- perfume + oil: glass bottle ---------- */
const MIST = 260
function GlassBottle({ kind, shape, liquid, open, actionKey, spin, reduced }: Omit<Props, 'notes'> & { reduced: boolean }) {
  const d = DIMS[shape]
  const isOil = kind === 'oil'
  const group = useRef<THREE.Group>(null)
  const flip = useRef<THREE.Group>(null)
  const cap = useRef<THREE.Group>(null)
  const mist = useRef<THREE.Points>(null)
  const mistMat = useRef<THREE.PointsMaterial>(null)
  const drop = useRef<THREE.Mesh>(null)
  const puddle = useRef<THREE.Mesh>(null)
  const capT = useRef(0)
  const actT = useRef(1)
  const label = useMemo(() => makeLabel(shape === 'roll'), [shape])
  useEffect(() => () => label.dispose(), [label])
  useEffect(() => { if (actionKey) actT.current = 0 }, [actionKey])
  const seeds = useMemo(() => Array.from({ length: MIST }, (_, i) => ({ a: (i * 137.5) % 360 * Math.PI / 180, s: .3 + ((i * 53) % 100) / 100, y: (((i * 29) % 100) / 100 - .5) * .5, delay: ((i * 17) % 100) / 400 })), [])
  const positions = useMemo(() => new Float32Array(MIST * 3), [])
  const top = d.h / 2 + d.neck
  const ballR = d.capR * .5
  const lift = top + .08 // raise the flipped bottle so the roller hangs just above the floor
  const ground = -1.28

  useFrame((_, dt) => {
    const k = reduced ? 1 : 1 - Math.exp(-dt * 6)
    capT.current += ((open ? 1 : 0) - capT.current) * k
    const c = capT.current
    if (cap.current) {
      cap.current.position.set(c * (d.r + d.capR + .25), top + d.capH / 2 + c * .1, c * .2)
      cap.current.rotation.z = -c * .35
    }
    if (group.current && spin && !reduced) group.current.rotation.y += dt * .9
    actT.current = Math.min(1, actT.current + Math.min(dt, .05) / (isOil ? 3.2 : 1.6))
    const t = actT.current
    if (!isOil && mist.current && mistMat.current) {
      mist.current.visible = t < 1 && c > .6
      mistMat.current.opacity = Math.sin(Math.min(1, t * 1.2) * Math.PI) * .8
      seeds.forEach((sd, i) => {
        const e = clamp((t - sd.delay) / (1 - sd.delay))
        const dist = easeOut(e) * 2.6 * sd.s
        positions[i * 3] = -(.1 + dist); positions[i * 3 + 1] = top + .14 + sd.y * dist * .7; positions[i * 3 + 2] = Math.sin(sd.a) * dist * .35
      })
      mist.current.geometry.attributes.position.needsUpdate = true
    }
    if (isOil && flip.current && drop.current && puddle.current) {
      // Turn the roll-on upside down, let one drop gather on the roller ball and fall into a small pool, then turn it back.
      const io = (x: number) => x < .5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2
      const f = t >= 1 ? 0 : io(clamp(t / .2)) - io(clamp((t - .82) / .18))
      flip.current.rotation.z = Math.PI * f
      flip.current.position.y = lift * f
      const tip = lift - top - .06 - ballR // world y just under the ball while upside down
      const grow = clamp((t - .2) / .18), fall = clamp((t - .38) / .2), spread = clamp((t - .58) / .2), gone = clamp((t - .8) / .15)
      const on = t < 1 && c > .6
      drop.current.visible = on && grow > 0 && fall < 1
      const sz = .02 + grow * .06
      drop.current.scale.set(sz, sz * (1.25 + fall * .6), sz)
      drop.current.position.set(0, tip - sz - fall * fall * (tip - ground), 0)
      puddle.current.visible = on && fall >= 1
      puddle.current.scale.setScalar(.05 + easeOut(spread) * .45)
      ;(puddle.current.material as THREE.MeshPhysicalMaterial).opacity = .9 * (1 - gone)
    }
  })

  const liquidH = d.h * (isOil ? .82 : .78)
  return <><group ref={group} position={[0, shape === 'squat' ? -.3 : 0, 0]}>
    <group ref={flip}>
    <mesh>
      <cylinderGeometry args={[d.r, d.r, d.h, 72, 1]} />
      <meshPhysicalMaterial color="#dfe6e8" roughness={0} transparent opacity={.16} clearcoat={1} envMapIntensity={3.2} depthWrite={false} side={THREE.DoubleSide} />
    </mesh>
    {[d.h / 2, -d.h / 2].map(y => <mesh key={y} position={[0, y, 0]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[d.r, .012, 8, 72]} /><meshStandardMaterial color="#b9c0c4" metalness={.6} roughness={.2} /></mesh>)}
    <mesh position={[0, -d.h / 2 + .09, 0]}>
      <cylinderGeometry args={[d.r * .97, d.r * .97, .18, 72]} />
      <meshPhysicalMaterial color="#d9e2e2" roughness={.02} transparent opacity={.5} envMapIntensity={2.5} />
    </mesh>
    <mesh position={[0, -d.h / 2 + .18 + liquidH / 2 - .05, 0]} renderOrder={-1}>
      <cylinderGeometry args={[d.r * .88, d.r * .88, liquidH - .1, 64]} />
      <meshPhysicalMaterial color={liquid} roughness={.1} transparent opacity={isOil ? .85 : .6} envMapIntensity={1.2} depthWrite={false} />
    </mesh>
    <mesh position={[0, shape === 'roll' ? 0 : -d.h * .34, 0]}>
      <cylinderGeometry args={[d.r + .002, d.r + .002, shape === 'roll' ? d.h * .55 : d.h * .09, 64, 1, true, shape === 'roll' ? -.5 : -.55, shape === 'roll' ? 1 : 1.1]} />
      <meshBasicMaterial map={label} transparent depthWrite={false} />
    </mesh>
    <mesh position={[0, d.h / 2 + d.neck / 2, 0]}>
      <cylinderGeometry args={[d.capR * .55, d.capR * .6, d.neck, 32]} />
      <meshStandardMaterial color="#c9cdd2" metalness={1} roughness={.25} />
    </mesh>
    {isOil
      ? <mesh position={[0, top + .06, 0]}><sphereGeometry args={[d.capR * .5, 32, 24]} /><meshPhysicalMaterial color="#f4f6f7" roughness={.05} clearcoat={1} envMapIntensity={2.5} /></mesh>
      : <mesh position={[0, top + .07, 0]}><cylinderGeometry args={[d.capR * .3, d.capR * .3, .14, 24]} /><meshStandardMaterial color="#e7e9ec" metalness={.9} roughness={.2} /></mesh>}
    </group>
    <group ref={cap} position={[0, top + d.capH / 2, 0]}>
      <mesh>
        <cylinderGeometry args={[d.capR, d.capR, d.capH, 64]} />
        <meshPhysicalMaterial color="#e6ebee" roughness={0} transparent opacity={.3} clearcoat={1} envMapIntensity={3} depthWrite={false} />
      </mesh>
      <mesh>
        <cylinderGeometry args={[d.capR * .62, d.capR * .62, d.capH * .9, 48]} />
        <meshStandardMaterial color="#eef0f2" metalness={.75} roughness={.28} />
      </mesh>
    </group>
    {!isOil && <points ref={mist} frustumCulled={false} visible={false}>
      <bufferGeometry><bufferAttribute attach="attributes-position" args={[positions, 3]} /></bufferGeometry>
      <pointsMaterial ref={mistMat} color="#7f8a92" size={.07} transparent opacity={0} depthWrite={false} />
    </points>}
  </group>
  {isOil && <>
    <mesh ref={drop} visible={false}><sphereGeometry args={[1, 24, 18]} /><meshPhysicalMaterial color={liquid} roughness={.02} clearcoat={1} transparent opacity={.92} envMapIntensity={2} /></mesh>
    <mesh ref={puddle} visible={false} rotation={[-Math.PI / 2, 0, 0]} position={[0, ground + .01, .15]}><circleGeometry args={[1, 40]} /><meshPhysicalMaterial color={liquid} roughness={.02} clearcoat={1} transparent opacity={.9} envMapIntensity={2} /></mesh>
  </>}
  </>
}

/* ---------- cream: squeeze tube ---------- */
const RIBBON = 70
function CreamTube({ open, actionKey, spin, reduced }: Omit<Props, 'notes' | 'kind' | 'shape' | 'liquid'> & { reduced: boolean }) {
  const group = useRef<THREE.Group>(null)
  const body = useRef<THREE.Mesh>(null)
  const cap = useRef<THREE.Group>(null)
  const ribbon = useRef<THREE.InstancedMesh>(null)
  const capT = useRef(0)
  const sq = useRef(1)
  const shown = useRef(0)
  const dummy = useMemo(() => new THREE.Object3D(), [])
  const label = useMemo(() => makeLabel(false), [])
  useEffect(() => () => label.dispose(), [label])
  useEffect(() => { if (actionKey) sq.current = 0 }, [actionKey])
  useEffect(() => { if (!open) shown.current = 0 }, [open])
  const H = 2.3, R = .52
  // Round at the cap end, pressed flat at the crimped end, like a real tube.
  const geo = useMemo(() => {
    const g = new THREE.CylinderGeometry(R, R, H, 64, 24, false)
    const p = g.attributes.position
    for (let i = 0; i < p.count; i++) {
      const y = p.getY(i); const t = 1 - (y + H / 2) / H // 0 at cap end (top), 1 at crimp (bottom)
      const flat = Math.pow(t, 1.6)
      p.setX(i, p.getX(i) * (1 + flat * .32)); p.setZ(i, p.getZ(i) * (1 - flat * .9))
    }
    g.computeVertexNormals(); return g
  }, [])
  useEffect(() => () => geo.dispose(), [geo])
  const top = H / 2

  useFrame((_, dt) => {
    const k = reduced ? 1 : 1 - Math.exp(-dt * 6)
    capT.current += ((open ? 1 : 0) - capT.current) * k
    const c = capT.current
    if (cap.current) { cap.current.position.set(c * 1.05, top + .2 + c * .15, c * .2); cap.current.rotation.z = -c * .4 }
    if (group.current && spin && !reduced) group.current.rotation.y += dt * .9
    sq.current = Math.min(1, sq.current + dt / 1.4)
    const pinch = Math.sin(Math.min(1, sq.current) * Math.PI)
    if (body.current) body.current.scale.set(1 + pinch * .04, 1, 1 - pinch * .16)
    if (sq.current < 1 && c > .6) shown.current = Math.max(shown.current, easeOut(sq.current))
    if (ribbon.current) {
      const n = Math.floor(shown.current * RIBBON)
      for (let i = 0; i < RIBBON; i++) {
        const u = i / RIBBON
        const a = u * Math.PI * 5
        const rr = .32 * (1 - u * .8)
        dummy.position.set(Math.cos(a) * rr, top + .26 + u * .5, Math.sin(a) * rr)
        dummy.scale.setScalar(i < n ? .13 * (1 - u * .45) : 0)
        dummy.updateMatrix(); ribbon.current.setMatrixAt(i, dummy.matrix)
      }
      ribbon.current.instanceMatrix.needsUpdate = true
    }
  })

  return <group ref={group} position={[0, -.15, 0]}>
    <mesh ref={body} geometry={geo}><meshPhysicalMaterial color="#fbfbfa" roughness={.35} clearcoat={.4} envMapIntensity={1.2} /></mesh>
    <mesh position={[0, -H / 2 - .06, 0]}><boxGeometry args={[R * 2 * 1.32, .14, .1]} /><meshStandardMaterial color="#f1f1ef" roughness={.5} /></mesh>
    <mesh position={[0, top - .55, 0]}>
      <cylinderGeometry args={[R + .003, R + .003, .22, 64, 1, true, -.6, 1.2]} />
      <meshBasicMaterial map={label} transparent depthWrite={false} />
    </mesh>
    <mesh position={[0, top + .1, 0]}><cylinderGeometry args={[.14, .2, .2, 32]} /><meshStandardMaterial color="#f4f4f2" roughness={.4} /></mesh>
    <group ref={cap} position={[0, top + .2, 0]}>
      <mesh position={[0, .15, 0]}><cylinderGeometry args={[.32, .32, .5, 48]} /><meshPhysicalMaterial color="#ffffff" roughness={.3} clearcoat={.6} /></mesh>
    </group>
    <instancedMesh ref={ribbon} args={[undefined, undefined, RIBBON]} frustumCulled={false}>
      <sphereGeometry args={[1, 18, 14]} />
      <meshPhysicalMaterial color="#fffdf7" roughness={.25} clearcoat={.8} sheen={.6} sheenColor="#fff" />
    </instancedMesh>
  </group>
}

export default function Bottle3D(props: Props) {
  const reduced = useMemo(() => typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches, [])
  const d = DIMS[props.shape]
  const top = props.kind === 'cream' ? 1.25 : d.h / 2 + d.neck - (props.shape === 'squat' ? .3 : 0)
  return <Canvas className="bottle3d" dpr={[1, 2]} camera={{ position: [0, 1.2, 10.4], fov: 30 }} gl={{ antialias: true, alpha: true }}>
    <ambientLight intensity={.6} />
    <directionalLight position={[3, 5, 4]} intensity={1.4} color="#fff3dc" />
    <Environment resolution={128}>
      <Lightformer position={[0, 5, -3]} intensity={3} scale={[6, 8, 1]} color="#ffe7b0" />
      <Lightformer position={[-4, 0, 2]} rotation={[0, Math.PI / 2, 0]} intensity={4} scale={[2, 7, 1]} />
      <Lightformer position={[4, 1, 3]} rotation={[0, -Math.PI / 3, 0]} intensity={4} scale={[1, 8, 1]} />
      <Lightformer position={[0, -3, 3]} intensity={1} scale={[6, 1, 1]} />
    </Environment>
    {props.kind === 'cream'
      ? <CreamTube open={props.open} actionKey={props.actionKey} spin={props.spin} reduced={reduced} />
      : <GlassBottle {...props} reduced={reduced} />}
    <NoteBurst notes={props.notes} open={props.open} top={top} reduced={reduced} />
    <ContactShadows position={[0, -1.3, 0]} opacity={.35} scale={6} blur={2.6} far={2} color="#7a5520" />
    <OrbitControls target={[0, .55, 0]} enablePan={false} enableZoom={false} minPolarAngle={Math.PI / 3} maxPolarAngle={Math.PI / 1.8} />
  </Canvas>
}
