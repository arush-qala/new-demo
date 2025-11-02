import React, { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useTexture } from '@react-three/drei'
import * as THREE from 'three'

// Helper function to create smooth body curves using lathe geometry
function createOrganicShape(points: number[][], segments: number = 32): THREE.LatheGeometry {
  const shape = new THREE.Shape()
  if (points.length > 0) {
    shape.moveTo(points[0][0], points[0][1])
    for (let i = 1; i < points.length; i++) {
      shape.lineTo(points[i][0], points[i][1])
    }
    shape.lineTo(points[0][0], points[0][1])
  }
  return new THREE.LatheGeometry(shape.getPoints(), segments)
}

// Create realistic torso with smooth curves using tapered cylinders
function createTorso(bust: number, waist: number, height: number): THREE.CylinderGeometry {
  // Use a more sophisticated approach with multiple segments
  const topRadius = bust * 0.18
  const midRadius = waist * 0.15  
  const bottomRadius = bust * 0.16
  
  // Create a smooth tapered cylinder for upper torso
  return new THREE.CylinderGeometry(
    midRadius, // top radius (smaller - waist)
    topRadius, // bottom radius (larger - chest)
    height * 0.5, // height
    32, // radial segments
    1 // height segments
  )
}

// Create hips with smooth curves
function createHips(hips: number, height: number): THREE.CylinderGeometry {
  const topRadius = hips * 0.18
  const bottomRadius = hips * 0.22
  
  // Smooth curved hips
  return new THREE.CylinderGeometry(
    topRadius,
    bottomRadius,
    height * 0.25,
    32,
    1
  )
}

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
  
  // Skin material - more realistic with subtle variations
  const skinMaterial = useMemo(() => 
    new THREE.MeshStandardMaterial({
      color: '#F4DCC1',
      roughness: 0.95,
      metalness: 0.02,
      emissive: new THREE.Color(0x000000),
      emissiveIntensity: 0,
    }), [])
  
  // Apply pose animation
  useFrame(() => {
    if (!groupRef.current) return
    
    // Subtle body rotation for pose
    groupRef.current.rotation.y = Math.sin(pose) * 0.1
    groupRef.current.position.z = Math.sin(pose * 0.5) * 0.1
  })
  
  // Create realistic body geometries
  const torsoGeometry = useMemo(() => 
    createTorso(bustScale * 0.4, waistScale * 0.3, heightScale * 0.55), 
    [bustScale, waistScale, heightScale]
  )
  
  const hipsGeometry = useMemo(() => 
    createHips(hipsScale * 0.4, heightScale * 0.25), 
    [hipsScale, heightScale]
  )
  
  // Create smooth arms and legs with tapered ends
  const leftArmGeometry = useMemo(() => 
    new THREE.CylinderGeometry(0.045 * heightScale, 0.035 * heightScale, 0.36 * heightScale, 16, 1),
    [heightScale]
  )
  
  const rightArmGeometry = useMemo(() => 
    new THREE.CylinderGeometry(0.045 * heightScale, 0.035 * heightScale, 0.36 * heightScale, 16, 1),
    [heightScale]
  )
  
  const leftLegGeometry = useMemo(() => 
    new THREE.CylinderGeometry(0.065 * heightScale, 0.055 * heightScale, 0.65 * heightScale, 16, 1),
    [heightScale]
  )
  
  const rightLegGeometry = useMemo(() => 
    new THREE.CylinderGeometry(0.065 * heightScale, 0.055 * heightScale, 0.65 * heightScale, 16, 1),
    [heightScale]
  )
  
  return (
    <group ref={groupRef} position={[0, -1.2, 0]}>
      {/* Head - smooth sphere */}
      <mesh position={[0, 1.52 * heightScale, 0]} castShadow>
        <sphereGeometry args={[0.11 * heightScale, 32, 32]} />
        <primitive object={skinMaterial} attach="material" />
      </mesh>
      
      {/* Neck - smooth cylinder with taper */}
      <mesh position={[0, 1.38 * heightScale, 0]} castShadow>
        <cylinderGeometry args={[0.055 * heightScale, 0.065 * heightScale, 0.14 * heightScale, 16]} />
        <primitive object={skinMaterial} attach="material" />
      </mesh>
      
      {/* Upper torso with natural curves - covered by dress */}
      <mesh 
        position={[0, 1.15 * heightScale, 0]} 
        geometry={torsoGeometry}
        castShadow
      >
        <primitive object={dressMaterial} attach="material" />
      </mesh>
      
      {/* Hips area with natural curve */}
      <mesh 
        position={[0, 0.5 * heightScale, 0]} 
        geometry={hipsGeometry}
        castShadow
      >
        <primitive object={dressMaterial} attach="material" />
      </mesh>
      
      {/* Dress skirt - flowing with smooth taper */}
      <mesh position={[0, 0.1 * heightScale, 0]} castShadow>
        <cylinderGeometry args={[hipsScale * 0.32, hipsScale * 0.48, heightScale * 0.65, 32]} />
        <primitive object={dressMaterial} attach="material" />
      </mesh>
      
      {/* Left arm - smooth tapered */}
      <mesh 
        position={[-bustScale * 0.19, 1.05 * heightScale, 0]} 
        rotation={[0, 0, 0.25]} 
        geometry={leftArmGeometry}
        castShadow
      >
        <primitive object={skinMaterial} attach="material" />
      </mesh>
      
      {/* Right arm - smooth tapered */}
      <mesh 
        position={[bustScale * 0.19, 1.05 * heightScale, 0]} 
        rotation={[0, 0, -0.25]} 
        geometry={rightArmGeometry}
        castShadow
      >
        <primitive object={skinMaterial} attach="material" />
      </mesh>
      
      {/* Left leg - smooth tapered */}
      <mesh 
        position={[-hipsScale * 0.08, -0.15 * heightScale, 0]} 
        geometry={leftLegGeometry}
        castShadow
      >
        <primitive object={skinMaterial} attach="material" />
      </mesh>
      
      {/* Right leg - smooth tapered */}
      <mesh 
        position={[hipsScale * 0.08, -0.15 * heightScale, 0]} 
        geometry={rightLegGeometry}
        castShadow
      >
        <primitive object={skinMaterial} attach="material" />
      </mesh>
    </group>
  )
}

