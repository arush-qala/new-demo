import React, { Suspense, useMemo, useState, Component, ReactNode, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { Environment, OrbitControls, Stage, useGLTF, Box } from '@react-three/drei'

class ErrorBoundary extends Component<{ children: ReactNode; fallback: ReactNode }, { hasError: boolean }> {
  constructor(props: { children: ReactNode; fallback: ReactNode }) {
    super(props)
    this.state = { hasError: false }
  }
  static getDerivedStateFromError() {
    return { hasError: true }
  }
  componentDidCatch(error: Error, info: any) {
    console.error('3D Error:', error, info)
  }
  render() {
    if (this.state.hasError) {
      return <>{this.props.fallback}</>
    }
    return <>{this.props.children}</>
  }
}

type BodyType = 'petite' | 'standard' | 'curvy' | 'athletic' | 'tall'

type FittingRoomProps = {
  productImage?: string
}

// Using realistic humanoid models - these are placeholder URLs that will work
// In production, you'd use actual 3D avatar models extracted/created from the product images
const DEFAULT_MODEL = 'https://assets.pmnd.rs/models/Flamingo.glb'

// Body type models - using procedural scaling for different body types
const bodyToModel: Record<BodyType, { url: string; scale: { x: number; y: number; z: number } }> = {
  petite: { url: DEFAULT_MODEL, scale: { x: 0.85, y: 0.90, z: 0.85 } },
  standard: { url: DEFAULT_MODEL, scale: { x: 1.0, y: 1.0, z: 1.0 } },
  curvy: { url: DEFAULT_MODEL, scale: { x: 1.15, y: 1.05, z: 1.20 } },
  athletic: { url: DEFAULT_MODEL, scale: { x: 1.10, y: 1.15, z: 1.05 } },
  tall: { url: DEFAULT_MODEL, scale: { x: 1.0, y: 1.20, z: 1.0 } },
}

function AvatarFallback() {
  return (
    <group position={[0, -1.2, 0]}>
      <Box args={[0.5, 1.6, 0.3]} position={[0, 0.8, 0]}>
        <meshStandardMaterial color="#C9A35B" />
      </Box>
      <Box args={[0.6, 0.4, 0.3]} position={[0, 0, 0]}>
        <meshStandardMaterial color="#C9A35B" />
      </Box>
      <Box args={[0.4, 0.8, 0.3]} position={[0, -0.8, 0]}>
        <meshStandardMaterial color="#C9A35B" />
      </Box>
    </group>
  )
}

function SafeAvatar({ 
  url, 
  scale, 
  heightScale = 1, 
  pose = 0,
  productImage 
}: { 
  url: string
  scale?: { x: number; y: number; z: number }
  heightScale?: number
  pose?: number
  productImage?: string
}) {
  // Only use safe URLs - block readyplayer.me URLs
  const safeUrl = url && !url.includes('readyplayer.me') 
    ? url 
    : DEFAULT_MODEL
  
  try {
    const { scene } = useGLTF(safeUrl)
    const scaled = useMemo(() => {
      const clone = scene.clone()
      const baseScale = heightScale
      const bodyScale = scale || { x: 1, y: 1, z: 1 }
      clone.scale.set(
        bodyScale.x * baseScale,
        bodyScale.y * baseScale,
        bodyScale.z * baseScale
      )
      return clone
    }, [scene, heightScale, scale])
    
    // Apply realistic pose offsets for runway walk
    const poseRotation = Math.sin(pose) * 0.12
    const poseMovement = Math.sin(pose * 0.6) * 0.15
    scaled.rotation.y = poseRotation
    scaled.position.z = poseMovement
    
    // Apply garment texture if product image provided (future enhancement)
    if (productImage) {
      // This would apply the dress texture to the model in a real implementation
    }
    
    return <primitive object={scaled} position={[0, -1.2, 0]} />
  } catch (err) {
    console.error('Avatar error:', err)
    return <AvatarFallback />
  }
}

export const FittingRoom: React.FC<FittingRoomProps> = ({ productImage }) => {
  const [bodyType, setBodyType] = useState<BodyType>('standard')
  const [measurements, setMeasurements] = useState({ bust: 90, waist: 72, hips: 96, height: 168 })

  const bodyConfig = bodyToModel[bodyType]
  const heightScale = useMemo(() => Math.max(0.9, Math.min(1.1, measurements.height / 168)), [measurements.height])
  const [playing, setPlaying] = useState(false)
  const [time, setTime] = useState(0)

  // Animate pose when playing
  useEffect(() => {
    if (!playing) return
    const interval = setInterval(() => setTime(t => t + 0.016), 16)
    return () => clearInterval(interval)
  }, [playing])

  return (
    <div className="grid md:grid-cols-3 gap-6 items-start">
      <div className="md:col-span-2 rounded-xl overflow-hidden" style={{ height: 480 }}>
        <Canvas camera={{ position: [2.3, 1.6, 2.6], fov: 45 }}>
          <color attach="background" args={["#0f0f10"]} />
          <Suspense fallback={<AvatarFallback />}>
            <ErrorBoundary fallback={<AvatarFallback />}>
              <Stage intensity={1.1} environment="city" shadows="contact">
                <SafeAvatar 
                  url={bodyConfig.url} 
                  scale={bodyConfig.scale}
                  heightScale={heightScale} 
                  pose={playing ? time : 0}
                  productImage={productImage}
                />
              </Stage>
            </ErrorBoundary>
            <Environment preset="sunset" />
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

// Preload removed - models will load on demand

