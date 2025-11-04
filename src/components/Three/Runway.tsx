import React, { Suspense, useRef, useState, Component, ReactNode } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Environment, OrbitControls, Stage, Box, useTexture } from '@react-three/drei'
import { ModelAvatar } from './ModelAvatar'
import * as THREE from 'three'

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
  modelUrl?: string // Deprecated - kept for backward compatibility but not used
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

// Runway animated avatar wrapper with natural walk animation
function AnimatedRunwayAvatar({ 
  playing, 
  productImage,
  measurements 
}: { 
  playing: boolean
  productImage?: string
  measurements: { bust: number; waist: number; hips: number; height: number }
}) {
  const groupRef = useRef<THREE.Group>(null)
  const poseRef = useRef(0)
  
  useFrame((state) => {
    if (!groupRef.current) return
    
    if (playing) {
      const t = state.clock.getElapsedTime()
      const walkSpeed = 1.0
      const cycle = (t * walkSpeed) % 12 // 12 second cycle
      
      // Phase 1: Walking forward (0-4s)
      if (cycle < 4) {
        const phase = cycle / 4
        const forward = Math.sin(phase * Math.PI) * 2.0
        groupRef.current.position.z = forward
        groupRef.current.position.y = Math.abs(Math.sin(phase * Math.PI * 4)) * 0.04
        groupRef.current.rotation.y = Math.sin(phase * Math.PI * 4) * 0.06
        groupRef.current.rotation.x = Math.sin(phase * Math.PI * 2) * 0.01
        poseRef.current = cycle
      }
      // Phase 2: Twirl (4-6s)
      else if (cycle < 6) {
        const phase = (cycle - 4) / 2
        const twirl = phase * Math.PI * 2 // Full 360 degree twirl
        groupRef.current.position.z = 2.0 + Math.sin(phase * Math.PI) * 0.3
        groupRef.current.rotation.y = twirl
        groupRef.current.position.y = Math.sin(phase * Math.PI) * 0.08
        groupRef.current.rotation.x = Math.sin(phase * Math.PI * 2) * 0.05
        poseRef.current = 4 + phase * 2
      }
      // Phase 3: Posing (6-9s)
      else if (cycle < 9) {
        const phase = (cycle - 6) / 3
        groupRef.current.position.z = 2.3 - phase * 0.5
        groupRef.current.rotation.y = Math.sin(phase * Math.PI * 2) * 0.3
        groupRef.current.rotation.x = Math.sin(phase * Math.PI) * -0.02
        groupRef.current.position.y = Math.sin(phase * Math.PI * 4) * 0.02
        poseRef.current = 6 + phase * 2
      }
      // Phase 4: Walking back (9-12s)
      else {
        const phase = (cycle - 9) / 3
        const forward = 1.8 - Math.sin(phase * Math.PI) * 2.0
        groupRef.current.position.z = forward
        groupRef.current.position.y = Math.abs(Math.sin(phase * Math.PI * 4)) * 0.04
        groupRef.current.rotation.y = -Math.sin(phase * Math.PI * 4) * 0.06
        groupRef.current.rotation.x = Math.sin(phase * Math.PI * 2) * 0.01
        poseRef.current = 9 + phase * 2
      }
    } else {
      groupRef.current.position.set(0, 0, 0)
      groupRef.current.rotation.set(0, 0, 0)
      poseRef.current = 0
    }
  })
  
  return (
    <group ref={groupRef}>
      {/* Using ModelAvatar ensures consistency - same realistic woman model on all product pages */}
      <ModelAvatar
        bodyType="standard"
        measurements={measurements}
        productImage={productImage}
        pose={poseRef.current}
      />
    </group>
  )
}

// Runway background component
function RunwayBackground() {
  // Use a professional runway image or create a realistic runway scene
  // For now, create a realistic runway environment
  return (
    <>
      {/* Runway floor - polished wood look */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.6, 0]} receiveShadow>
        <planeGeometry args={[25, 40]} />
        <meshStandardMaterial 
          color="#1a1714" 
          roughness={0.3}
          metalness={0.1}
        />
      </mesh>
      
      {/* Runway edges/stripes */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.59, 0]} receiveShadow>
        <planeGeometry args={[2, 40]} />
        <meshStandardMaterial color="#0a0806" roughness={0.2} />
      </mesh>
      
      {/* Background wall - dark neutral */}
      <mesh position={[0, 2, -10]} receiveShadow>
        <planeGeometry args={[30, 15]} />
        <meshStandardMaterial color="#0f0e0d" />
      </mesh>
      
      {/* Ambient runway lighting */}
      <ambientLight intensity={0.4} color="#fff8f0" />
      
      {/* Main spotlight - like fashion show lighting */}
      <spotLight
        position={[0, 8, 5]}
        angle={0.5}
        penumbra={0.3}
        intensity={2}
        castShadow
        color="#fffef8"
      />
      
      {/* Side lights */}
      <spotLight position={[-8, 6, 2]} angle={0.4} penumbra={0.5} intensity={0.8} color="#fff8f0" />
      <spotLight position={[8, 6, 2]} angle={0.4} penumbra={0.5} intensity={0.8} color="#fff8f0" />
      
      {/* Back lighting for silhouette */}
      <directionalLight position={[0, 4, -8]} intensity={0.6} color="#fff8f0" />
    </>
  )
}

export const Runway: React.FC<RunwayProps> = ({ modelUrl, background, productImage }) => {
  // Professional runway background - dark neutral
  const bg = background ?? '#0a0806'
  const [playing, setPlaying] = useState(false)
  
  // Standard measurements for runway model (realistic woman proportions)
  // Note: modelUrl prop is deprecated - we now use ModelAvatar component for consistency
  const measurements = { bust: 90, waist: 72, hips: 96, height: 168 }
  
  return (
    <div className="relative rounded-xl overflow-hidden" style={{ height: 500 }}>
      <Canvas camera={{ position: [2.5, 1.8, 4], fov: 50 }} shadows>
        <color attach="background" args={[bg]} />
        
        {/* Realistic runway environment */}
        <RunwayBackground />
        
        <Suspense fallback={<AvatarFallback />}>
          <ErrorBoundary fallback={<AvatarFallback />}>
            <Stage intensity={1.6} environment="city" shadows="contact" adjustCamera={false}>
              <AnimatedRunwayAvatar 
                playing={playing} 
                productImage={productImage}
                measurements={measurements}
              />
            </Stage>
          </ErrorBoundary>
          <Environment preset="city" />
        </Suspense>
        
        <CameraPath playing={playing} />
        <OrbitControls enablePan={false} minDistance={2.5} maxDistance={7} enabled={!playing} />
      </Canvas>
      <div className="absolute bottom-4 right-4">
        <button 
          onClick={()=>setPlaying(p=>!p)} 
          className="glass rounded-full px-5 py-2.5 text-sm font-medium hover:bg-white/10 transition backdrop-blur-sm"
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
    const walkSpeed = 1.2
    
    // Model position (forward/back on runway)
    const modelZ = Math.sin(t * walkSpeed) * 1.5
    
    // Camera follows model - professional fashion show angles
    const cameraDistance = 4.2
    const cameraHeight = 1.8
    
    // Gentle side-to-side movement for dynamic shots
    const sideOffset = Math.sin(t * walkSpeed * 0.5) * 0.3
    
    // Camera position - follows model
    state.camera.position.set(
      sideOffset,
      cameraHeight,
      modelZ + cameraDistance
    )
    
    // Look at model (slightly ahead for leading shot)
    state.camera.lookAt(sideOffset * 0.5, 0.2 + modelZ * 0.05, modelZ - 0.3)
  })
  return null
}

// Preload removed - models will load on demand

