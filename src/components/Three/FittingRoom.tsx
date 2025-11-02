import React, { Suspense, useMemo, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { Environment, OrbitControls, Stage, useGLTF } from '@react-three/drei'

type BodyType = 'petite' | 'standard' | 'curvy' | 'athletic' | 'tall'

const bodyToModel: Record<BodyType, string> = {
  petite: 'https://models.readyplayer.me/6615b7e0834cb1a3ea5f9c95.glb',
  standard: 'https://models.readyplayer.me/6615b7e0834cb1a3ea5f9c95.glb',
  curvy: 'https://models.readyplayer.me/6615b7e0834cb1a3ea5f9c95.glb',
  athletic: 'https://models.readyplayer.me/6615b7e0834cb1a3ea5f9c95.glb',
  tall: 'https://models.readyplayer.me/6615b7e0834cb1a3ea5f9c95.glb',
}

function Avatar({ url, heightScale = 1, pose = 0 }: { url: string; heightScale?: number; pose?: number }) {
  const { scene } = useGLTF(url)
  const scaled = useMemo(() => {
    const clone = scene.clone()
    clone.scale.setScalar(heightScale)
    return clone
  }, [scene, heightScale])
  // Apply simple pose offsets
  scaled.rotation.y = Math.sin(pose) * 0.15
  scaled.position.z = Math.sin(pose * 0.5) * 0.1
  return <primitive object={scaled} position={[0, -1.2, 0]} />
}

export const FittingRoom: React.FC = () => {
  const [bodyType, setBodyType] = useState<BodyType>('standard')
  const [measurements, setMeasurements] = useState({ bust: 90, waist: 72, hips: 96, height: 168 })

  const heightScale = useMemo(() => Math.max(0.9, Math.min(1.1, measurements.height / 168)), [measurements.height])
  const [playing, setPlaying] = useState(false)

  return (
    <div className="grid md:grid-cols-3 gap-6 items-start">
      <div className="md:col-span-2 rounded-xl overflow-hidden" style={{ height: 480 }}>
        <Canvas camera={{ position: [2.3, 1.6, 2.6], fov: 45 }}>
          <color attach="background" args={["#0f0f10"]} />
          <Suspense fallback={null}>
            <Stage intensity={0.9} environment={null} shadows="contact">
              <Avatar url={bodyToModel[bodyType]} heightScale={heightScale} pose={playing ? 1 : 0} />
            </Stage>
            <Environment preset="studio" />
          </Suspense>
          <OrbitControls enablePan={false} />
        </Canvas>
      </div>
      <div className="space-y-6">
        <div>
          <div className="text-sm mb-2">Body Type</div>
          <div className="flex flex-wrap gap-2">
            {(['petite','standard','curvy','athletic','tall'] as BodyType[]).map(bt => (
              <button key={bt} onClick={() => setBodyType(bt)} className={`px-3 py-1 rounded-full text-xs border ${bodyType===bt?'border-gold text-gold':'border-white/10 text-neutral-300'}`}>{bt}</button>
            ))}
          </div>
        </div>
        <div className="space-y-4">
          {(['bust','waist','hips','height'] as (keyof typeof measurements)[]).map((k) => (
            <div key={k}>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="uppercase tracking-wide text-neutral-400">{k}</span>
                <span className="text-neutral-200">{measurements[k]} {k==='height'?'cm':'cm'}</span>
              </div>
              <input type="range" min={k==='height'?150:70} max={k==='height'?190:110} value={measurements[k]}
                onChange={(e)=>setMeasurements({...measurements,[k]: Number(e.target.value)})}
                className="w-full" />
            </div>
          ))}
        </div>
        <button onClick={()=>setPlaying(p=>!p)} className="w-full glass rounded-lg py-3 text-sm">{playing? 'Pause' : 'Play'} Runway Walk</button>
      </div>
    </div>
  )
}

useGLTF.preload('https://models.readyplayer.me/6615b7e0834cb1a3ea5f9c95.glb')

