import React, { Suspense, useRef, useState, Component, ReactNode, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Environment, OrbitControls, Stage, Box } from '@react-three/drei'
import { RealisticAvatar } from './RealisticAvatar'
import { VideoRecorder } from './VideoRecorder'

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

// Runway animated avatar wrapper
function AnimatedRunwayAvatar({ 
  playing, 
  productImage,
  measurements 
}: { 
  playing: boolean
  productImage?: string
  measurements: { bust: number; waist: number; hips: number; height: number }
}) {
  const poseRef = useRef(0)
  
  useFrame((state) => {
    if (playing) {
      const t = state.clock.getElapsedTime()
      // Create realistic runway walk pose
      poseRef.current = t
    } else {
      poseRef.current = 0
    }
  })
  
  return (
    <RealisticAvatar
      bodyType="standard"
      measurements={measurements}
      productImage={productImage}
      pose={poseRef.current}
    />
  )
}

export const Runway: React.FC<RunwayProps> = ({ modelUrl, background, productImage }) => {
  // Dynamic background based on product colors
  const bg = background ?? '#1a1a1a'
  const [playing, setPlaying] = useState(false)
  const [recording, setRecording] = useState(false)
  const [videoBlob, setVideoBlob] = useState<Blob | null>(null)
  
  // Standard measurements for runway model
  const measurements = { bust: 90, waist: 72, hips: 96, height: 168 }
  
  const handleVideoStop = (blob: Blob) => {
    setVideoBlob(blob)
    setRecording(false)
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'runway-walk.webm'
    a.click()
    URL.revokeObjectURL(url)
  }
  
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
              <AnimatedRunwayAvatar 
                playing={playing} 
                productImage={productImage}
                measurements={measurements}
              />
            </Stage>
          </ErrorBoundary>
          <Environment preset="sunset" />
        </Suspense>
        <VideoRecorder isRecording={recording} onStop={handleVideoStop} />
        <CameraPath playing={playing} />
        <OrbitControls enablePan={false} minDistance={2} maxDistance={6} enabled={!playing} />
      </Canvas>
      <div className="absolute bottom-4 right-4 flex gap-2 flex-col">
        <button 
          onClick={()=>setPlaying(p=>!p)} 
          className="glass rounded-full px-5 py-2.5 text-sm font-medium hover:bg-white/10 transition"
        >
          {playing? '⏸ Pause' : '▶ Play Runway Walk'}
        </button>
        <button 
          onClick={()=>setRecording(true)} 
          disabled={recording || !playing}
          className="glass rounded-full px-5 py-2.5 text-sm font-medium hover:bg-white/10 transition disabled:opacity-50"
        >
          {recording ? '📹 Recording...' : '📹 Record Video'}
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

