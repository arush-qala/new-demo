import React, { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useTexture } from '@react-three/drei'
import * as THREE from 'three'

type BodyType = 'petite' | 'standard' | 'curvy' | 'athletic' | 'tall'

type RealisticAvatarProps = {
  bodyType: BodyType
  measurements: { bust: number; waist: number; hips: number; height: number }
  productImage?: string
  pose?: number
}

// Body proportions based on body type
const bodyProportions: Record<BodyType, {
  bust: number
  waist: number
  hips: number
  shoulders: number
  height: number
}> = {
  petite: { bust: 0.85, waist: 0.75, hips: 0.90, shoulders: 0.80, height: 0.90 },
  standard: { bust: 1.0, waist: 1.0, hips: 1.0, shoulders: 1.0, height: 1.0 },
  curvy: { bust: 1.15, waist: 0.95, hips: 1.20, shoulders: 1.05, height: 1.0 },
  athletic: { bust: 1.05, waist: 0.90, hips: 0.95, shoulders: 1.15, height: 1.15 },
  tall: { bust: 1.0, waist: 0.95, hips: 1.0, shoulders: 1.05, height: 1.20 },
}

export const RealisticAvatar: React.FC<RealisticAvatarProps> = ({
  bodyType,
  measurements,
  productImage,
  pose = 0
}) => {
  const groupRef = useRef<THREE.Group>(null)
  const baseProportions = bodyProportions[bodyType]
  
  // Calculate scaled measurements
  const bustScale = (measurements.bust / 90) * baseProportions.bust
  const waistScale = (measurements.waist / 72) * baseProportions.waist
  const hipsScale = (measurements.hips / 96) * baseProportions.hips
  const heightScale = (measurements.height / 168) * baseProportions.height
  
  // Load product texture if available
  const texture = productImage ? useTexture(productImage) : null
  
  // Create dress material from product image
  const dressMaterial = useMemo(() => {
    if (texture) {
      texture.wrapS = THREE.RepeatWrapping
      texture.wrapT = THREE.RepeatWrapping
      texture.repeat.set(1, 1)
      return new THREE.MeshStandardMaterial({
        map: texture,
        roughness: 0.7,
        metalness: 0.1,
      })
    }
    // Default dress color
    return new THREE.MeshStandardMaterial({
      color: '#C9A35B',
      roughness: 0.8,
      metalness: 0.1,
    })
  }, [texture])
  
  // Skin material
  const skinMaterial = useMemo(() => 
    new THREE.MeshStandardMaterial({
      color: '#F4DCC1',
      roughness: 0.9,
      metalness: 0.05,
    }), [])
  
  // Apply pose animation
  useFrame(() => {
    if (!groupRef.current) return
    
    // Subtle body rotation for pose
    groupRef.current.rotation.y = Math.sin(pose) * 0.1
    groupRef.current.position.z = Math.sin(pose * 0.5) * 0.1
  })
  
  return (
    <group ref={groupRef} position={[0, -1.2, 0]}>
      {/* Head */}
      <mesh position={[0, 1.5 * heightScale, 0]} castShadow>
        <sphereGeometry args={[0.12 * heightScale, 32, 32]} />
        <primitive object={skinMaterial} attach="material" />
      </mesh>
      
      {/* Neck */}
      <mesh position={[0, 1.35 * heightScale, 0]} castShadow>
        <cylinderGeometry args={[0.05 * heightScale, 0.06 * heightScale, 0.15 * heightScale, 16]} />
        <primitive object={skinMaterial} attach="material" />
      </mesh>
      
      {/* Torso/Upper body */}
      <mesh position={[0, 1.0 * heightScale, 0]} castShadow>
        <boxGeometry args={[bustScale * 0.35, heightScale * 0.5, bustScale * 0.25]} />
        <primitive object={dressMaterial} attach="material" />
      </mesh>
      
      {/* Waist */}
      <mesh position={[0, 0.75 * heightScale, 0]} castShadow>
        <boxGeometry args={[waistScale * 0.28, heightScale * 0.15, waistScale * 0.20]} />
        <primitive object={dressMaterial} attach="material" />
      </mesh>
      
      {/* Hips */}
      <mesh position={[0, 0.55 * heightScale, 0]} castShadow>
        <boxGeometry args={[hipsScale * 0.38, heightScale * 0.2, hipsScale * 0.28]} />
        <primitive object={dressMaterial} attach="material" />
      </mesh>
      
      {/* Dress skirt - flowing down */}
      <mesh position={[0, 0.15 * heightScale, 0]} castShadow>
        <cylinderGeometry args={[hipsScale * 0.30, hipsScale * 0.45, heightScale * 0.6, 32]} />
        <primitive object={dressMaterial} attach="material" />
      </mesh>
      
      {/* Left arm */}
      <mesh position={[-bustScale * 0.20, 1.0 * heightScale, 0]} rotation={[0, 0, 0.3]} castShadow>
        <cylinderGeometry args={[0.05 * heightScale, 0.05 * heightScale, 0.35 * heightScale, 16]} />
        <primitive object={skinMaterial} attach="material" />
      </mesh>
      
      {/* Right arm */}
      <mesh position={[bustScale * 0.20, 1.0 * heightScale, 0]} rotation={[0, 0, -0.3]} castShadow>
        <cylinderGeometry args={[0.05 * heightScale, 0.05 * heightScale, 0.35 * heightScale, 16]} />
        <primitive object={skinMaterial} attach="material" />
      </mesh>
      
      {/* Left leg */}
      <mesh position={[-hipsScale * 0.10, 0.1 * heightScale, 0]} castShadow>
        <cylinderGeometry args={[0.08 * heightScale, 0.08 * heightScale, 0.6 * heightScale, 16]} />
        <primitive object={skinMaterial} attach="material" />
      </mesh>
      
      {/* Right leg */}
      <mesh position={[hipsScale * 0.10, 0.1 * heightScale, 0]} castShadow>
        <cylinderGeometry args={[0.08 * heightScale, 0.08 * heightScale, 0.6 * heightScale, 16]} />
        <primitive object={skinMaterial} attach="material" />
      </mesh>
    </group>
  )
}

