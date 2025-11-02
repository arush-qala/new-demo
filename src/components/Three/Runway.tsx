import React, { Suspense, useMemo, useRef, useState, Component, ReactNode } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
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

type RunwayProps = {
  modelUrl: string
  background?: string
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

function SafeAvatar({ url, playing }: { url: string; playing: boolean }) {
  const group = useRef<any>()
  
  // Only use safe URLs - block readyplayer.me URLs
  const safeUrl = url && !url.includes('readyplayer.me') 
    ? url 
    : 'https://assets.pmnd.rs/models/Flamingo.glb'
  
  try {
    const { scene } = useGLTF(safeUrl)
    
    useFrame((state) => {
      if (!group.current) return
      const t = state.clock.getElapsedTime()
      if (playing) {
        // Gentle sway and forward/back micro-walk
        group.current.position.z = Math.sin(t * 0.5) * 0.5
        group.current.rotation.y = Math.sin(t * 0.8) * 0.1
      }
    })
    
    return <group ref={group} position={[0, -1.2, 0]}>
      <primitive object={scene} />
    </group>
  } catch (err) {
    console.error('Avatar error:', err)
    return <AvatarFallback />
  }
}

export const Runway: React.FC<RunwayProps> = ({ modelUrl, background }) => {
  const bg = background ?? '#0f0f10'
  const [playing, setPlaying] = useState(false)
  const safeUrl = modelUrl || 'https://assets.pmnd.rs/models/Flamingo.glb'
  
  return (
    <div className="relative rounded-xl overflow-hidden" style={{ height: 420 }}>
      <Canvas camera={{ position: [2.5, 1.6, 3.2], fov: 45 }}>
        <color attach="background" args={[bg]} />
        <Suspense fallback={<AvatarFallback />}>
          <ErrorBoundary fallback={<AvatarFallback />}>
            <Stage intensity={0.9} environment={null} shadows="contact">
              <SafeAvatar url={safeUrl} playing={playing} />
            </Stage>
          </ErrorBoundary>
          <Environment preset="studio" />
        </Suspense>
        <CameraPath playing={playing} />
        <OrbitControls enablePan={false} minDistance={2} maxDistance={6} enabled={!playing} />
      </Canvas>
      <div className="absolute bottom-3 right-3">
        <button onClick={()=>setPlaying(p=>!p)} className="glass rounded-full px-4 py-2 text-xs">
          {playing? 'Pause' : 'Play Runway'}
        </button>
      </div>
    </div>
  )
}

function CameraPath({ playing }: { playing: boolean }) {
  const api = useRef<any>(null)
  useFrame((state) => {
    if (!playing) return
    const t = state.clock.getElapsedTime()
    // Timeline phases in 3s blocks (total 12s loop)
    const phase = Math.floor((t % 12) / 3)
    const ease = (x:number)=> x*x*(3-2*x)
    const localT = (t % 3)
    const k = ease(localT / 3)

    const setCam = (x:number, y:number, z:number) => {
      state.camera.position.set(x, y, z)
      state.camera.lookAt(0, 0.4, 0)
    }

    const r = 3.2
    switch (phase) {
      case 0: // front dolly in
        setCam(0, 1.6, 2.6 - 0.4 * k)
        break
      case 1: // quarter left orbit
        setCam(Math.cos(0.4 + 0.5*k)*r, 1.6, Math.sin(0.4 + 0.5*k)*r)
        break
      case 2: // back dolly out
        setCam(0.2, 1.6, -2.6 - 0.3*k)
        break
      case 3: // quarter right orbit
      default:
        setCam(Math.cos(-0.4 - 0.5*k)*r, 1.6, Math.sin(-0.4 - 0.5*k)*r)
        break
    }
  })
  return null
}

// Preload removed - models will load on demand

