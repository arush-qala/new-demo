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
  productImage?: string
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

function SafeAvatar({ url, playing, productImage }: { url: string; playing: boolean; productImage?: string }) {
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
        // Realistic runway walk animation
        // Forward movement with slight bounce
        const walkSpeed = 0.3
        const bounce = Math.sin(t * 4) * 0.03
        group.current.position.z = Math.sin(t * walkSpeed) * 1.2 // Walking forward/back
        group.current.position.y = -1.2 + bounce // Subtle bounce in walk
        
        // Hip sway for natural walk
        group.current.rotation.y = Math.sin(t * 0.6) * 0.08
        
        // Subtle shoulder movement
        group.current.rotation.x = Math.sin(t * 2) * 0.02
        
        // Arm swing simulation (if model has arms)
        if (group.current.children) {
          group.current.children.forEach((child: any, idx: number) => {
            if (child.name?.includes('arm') || idx % 2 === 0) {
              child.rotation.z = Math.sin(t * 2 + idx) * 0.15
            }
          })
        }
      } else {
        // Reset position when not playing
        group.current.position.set(0, -1.2, 0)
        group.current.rotation.set(0, 0, 0)
      }
    })
    
    // Apply product texture if available (future enhancement)
    if (productImage) {
      // This would map the dress texture onto the model
    }
    
    return <group ref={group} position={[0, -1.2, 0]}>
      <primitive object={scene} />
    </group>
  } catch (err) {
    console.error('Avatar error:', err)
    return <AvatarFallback />
  }
}

export const Runway: React.FC<RunwayProps> = ({ modelUrl, background, productImage }) => {
  // Dynamic background based on product colors
  const bg = background ?? '#1a1a1a'
  const [playing, setPlaying] = useState(false)
  const safeUrl = modelUrl || 'https://assets.pmnd.rs/models/Flamingo.glb'
  
  return (
    <div className="relative rounded-xl overflow-hidden" style={{ height: 480 }}>
      <Canvas camera={{ position: [2.5, 1.6, 3.2], fov: 45 }}>
        <color attach="background" args={[bg]} />
        {/* Runway floor */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.5, 0]} receiveShadow>
          <planeGeometry args={[20, 30]} />
          <meshStandardMaterial color="#2a2a2a" roughness={0.8} />
        </mesh>
        
        {/* Runway lights */}
        <ambientLight intensity={0.3} />
        <directionalLight position={[5, 8, 5]} intensity={1.2} castShadow />
        <spotLight position={[0, 6, 8]} angle={0.4} penumbra={0.5} intensity={1} castShadow />
        
        <Suspense fallback={<AvatarFallback />}>
          <ErrorBoundary fallback={<AvatarFallback />}>
            <Stage intensity={1.2} environment="sunset" shadows="contact">
              <SafeAvatar url={safeUrl} playing={playing} productImage={productImage} />
            </Stage>
          </ErrorBoundary>
          <Environment preset="sunset" />
        </Suspense>
        <CameraPath playing={playing} />
        <OrbitControls enablePan={false} minDistance={2} maxDistance={6} enabled={!playing} />
      </Canvas>
      <div className="absolute bottom-4 right-4 flex gap-2">
        <button 
          onClick={()=>setPlaying(p=>!p)} 
          className="glass rounded-full px-5 py-2.5 text-sm font-medium hover:bg-white/10 transition"
        >
          {playing? '⏸ Pause' : '▶ Play Runway Walk'}
        </button>
      </div>
    </div>
  )
}

function CameraPath({ playing }: { playing: boolean }) {
  useFrame((state) => {
    if (!playing) return
    const t = state.clock.getElapsedTime()
    // Smooth runway camera movement - follows model down runway
    const walkProgress = (t * 0.3) % 8 // 8 second loop
    
    // Camera follows model with slight lead
    const modelZ = Math.sin(walkProgress) * 1.2
    const camZ = modelZ + 2.8
    
    // Smooth camera movement
    const ease = (x: number) => x * x * (3 - 2 * x)
    const smoothProgress = ease((walkProgress % 1))
    
    // Camera orbits slightly around the model
    const angle = smoothProgress * Math.PI * 0.3 - Math.PI * 0.15
    const radius = 3.0
    const x = Math.sin(angle) * radius * 0.3
    const y = 1.6 + Math.sin(walkProgress * 2) * 0.1
    
    state.camera.position.set(x, y, camZ)
    state.camera.lookAt(0, -0.5 + modelZ * 0.2, modelZ)
  })
  return null
}

// Preload removed - models will load on demand

