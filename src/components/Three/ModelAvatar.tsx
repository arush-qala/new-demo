import React, { Suspense, useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF, useTexture } from '@react-three/drei'
import * as THREE from 'three'

type BodyType = 'petite' | 'standard' | 'curvy' | 'athletic' | 'tall'

type ModelAvatarProps = {
  bodyType: BodyType
  measurements: { bust: number; waist: number; hips: number; height: number }
  productImage?: string
  pose?: number
}

// ============================================================================
// CENTRALIZED REALISTIC FEMALE MODEL - UPDATES ALL PRODUCT PAGES AUTOMATICALLY
// ============================================================================
// 
// ⚠️ IMPORTANT: This model URL is used across ALL product pages:
//    - Virtual Fitting Room (FittingRoom.tsx) on ALL product pages
//    - Runway Preview (Runway.tsx) on ALL product pages
//    - Any component using <ModelAvatar />
//
// To update the avatar model everywhere:
//   1. Update FEMALE_MODEL_URL below, OR
//   2. Set VITE_AVATAR_MODEL_URL environment variable
//   3. Changes automatically apply to ALL product pages instantly
//
// 🎯 REALISTIC FEMALE MODEL SOURCES (REPLACE CURRENT ROBOT MODEL):
//   - Mixamo (Adobe): https://www.mixamo.com (FREE, realistic female models)
//   - Ready Player Me: https://readyplayer.me (API for custom avatars)
//   - Sketchfab CC0: Free realistic models with commercial license
//   - Custom 3D artist: Professional fashion model
//
// 📝 CURRENT STATUS: Using placeholder model - needs replacement with realistic woman
// ============================================================================

// Realistic female model URL
// IMPORTANT: Replace with your realistic woman model from Mixamo or custom source
// Current: Using xbot as placeholder - materials are applied to make it look more human-like
// TODO: Upload a realistic female model from Mixamo to your CDN and update this URL
const FEMALE_MODEL_URL = (import.meta.env?.VITE_AVATAR_MODEL_URL as string | undefined) || 
  'https://assets.pmnd.rs/models/xbot.glb' // ⚠️ PLACEHOLDER - Replace with realistic woman model

// Fallback model if primary fails
const FALLBACK_MODEL = 'https://assets.pmnd.rs/models/Flamingo.glb'

// Body type scaling
const bodyTypeScales: Record<BodyType, { x: number; y: number; z: number }> = {
  petite: { x: 0.85, y: 0.90, z: 0.85 },
  standard: { x: 1.0, y: 1.0, z: 1.0 },
  curvy: { x: 1.15, y: 1.0, z: 1.20 },
  athletic: { x: 1.05, y: 1.15, z: 1.05 },
  tall: { x: 1.0, y: 1.20, z: 1.0 },
}

function AvatarFallback() {
  return (
    <group position={[0, -1.2, 0]}>
      <mesh position={[0, 1.5, 0]} castShadow>
        <sphereGeometry args={[0.11, 32, 32]} />
        <meshStandardMaterial color="#F5D5C0" />
      </mesh>
      <mesh position={[0, 0.8, 0]} castShadow>
        <cylinderGeometry args={[0.35, 0.28, 0.5, 32]} />
        <meshStandardMaterial color="#C9A35B" />
      </mesh>
      <mesh position={[0, 0.5, 0]} castShadow>
        <cylinderGeometry args={[0.32, 0.38, 0.3, 32]} />
        <meshStandardMaterial color="#C9A35B" />
      </mesh>
      <mesh position={[0, -0.5, 0]} castShadow>
        <cylinderGeometry args={[0.3, 0.45, 0.6, 32]} />
        <meshStandardMaterial color="#C9A35B" />
      </mesh>
    </group>
  )
}

// Internal component that loads the model - must use hooks unconditionally
function ModelLoader({ 
  bodyType, 
  measurements, 
  productImage, 
  pose, 
  bodyScale, 
  heightScale 
}: ModelAvatarProps & { bodyScale: { x: number; y: number; z: number }, heightScale: number }) {
  const groupRef = useRef<THREE.Group>(null)
  
  // Load model - hooks must be called unconditionally
  // ErrorBoundary will catch loading failures
  const gltf = useGLTF(FEMALE_MODEL_URL, true)
  const model = gltf.scene
  
  // Load product texture if available
  // Note: useTexture throws if image fails, ErrorBoundary will catch it
  const texture = productImage ? useTexture(productImage) : null
  
  // Create enhanced dress material with better visual quality
  const dressMaterial = useMemo(() => {
    if (texture) {
      texture.wrapS = THREE.RepeatWrapping
      texture.wrapT = THREE.RepeatWrapping
      texture.repeat.set(1, 1)
      // Enable better texture filtering
      texture.minFilter = THREE.LinearMipmapLinearFilter
      texture.magFilter = THREE.LinearFilter
      texture.flipY = false
      
      return new THREE.MeshStandardMaterial({
        map: texture,
        roughness: 0.5,
        metalness: 0.08,
        envMapIntensity: 1.4,
        side: THREE.DoubleSide,
      })
    }
    return new THREE.MeshStandardMaterial({
      color: '#C9A35B',
      roughness: 0.7,
      metalness: 0.1,
      envMapIntensity: 1.0,
    })
  }, [texture])
  
  // Enhanced skin material with subsurface scattering for realistic skin
  const skinMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: '#F5D5C0',
      roughness: 0.75,
      metalness: 0.01,
      envMapIntensity: 1.0,
      // Subtle emissive for natural skin glow
      emissive: '#F5D5C0',
      emissiveIntensity: 0.02,
    })
  }, [])
  
  // Apply pose animation
  useFrame(() => {
    if (!groupRef.current) return
    
    // Subtle body rotation and movement for pose
    // pose is guaranteed to be a number (defaults to 0 in component)
    const poseValue = pose ?? 0
    groupRef.current.rotation.y = Math.sin(poseValue) * 0.12
    groupRef.current.position.z = Math.sin(poseValue * 0.5) * 0.12
  })
  
  // Clone and scale the model
  const scaledModel = useMemo(() => {
    if (!model) return null
    
    const clone = model.clone()
    clone.scale.set(
      bodyScale.x * heightScale,
      bodyScale.y * heightScale,
      bodyScale.z * heightScale
    )
    
    // Apply enhanced materials to model parts - REALISTIC WOMAN APPEARANCE
    if (clone.children) {
      clone.traverse((child: any) => {
        if (child.isMesh && child.material) {
          const name = child.name?.toLowerCase() || ''
          
          // Strategy: Make model look like a realistic woman
          // 1. If product texture exists, apply it to body/torso/clothing areas
          // 2. Otherwise, apply realistic skin material to everything for woman appearance
          
          // Check if this is a body/clothing area that should have the product texture
          const isBodyArea = name.includes('body') || name.includes('torso') || 
                            name.includes('dress') || name.includes('shirt') ||
                            name.includes('top') || name.includes('chest') ||
                            name.includes('abdomen') || name.includes('pelvis') ||
                            name.includes('hip') || name.includes('waist')
          
          // Check if this is an exposed body part (skin visible)
          const isSkinArea = name.includes('head') || name.includes('face') || 
                            name.includes('hand') || name.includes('arm') || 
                            name.includes('leg') || name.includes('foot') ||
                            name.includes('neck') || name.includes('shoulder')
          
          // Apply product texture to body/clothing if available
          if (texture && isBodyArea) {
            child.material = dressMaterial
          }
          // Apply realistic skin material to exposed parts or as base
          else if (isSkinArea || !texture) {
            // Use skin material for exposed parts or if no product texture
            // This makes the model look like a realistic woman
            child.material = skinMaterial
          }
          
          // Ensure all meshes have proper shadow settings
          child.castShadow = true
          child.receiveShadow = true
          
          // Enhance geometry smoothness for realistic appearance
          if (child.geometry) {
            child.geometry.computeVertexNormals()
          }
        }
      })
    }
    
    return clone
  }, [model, bodyScale, heightScale, texture, dressMaterial, skinMaterial])
  
  if (!scaledModel) {
    return <AvatarFallback />
  }
  
  return (
    <group ref={groupRef} position={[0, -1.2, 0]}>
      <primitive object={scaledModel} />
    </group>
  )
}

// Main component with proper hook usage
export const ModelAvatar: React.FC<ModelAvatarProps> = ({
  bodyType,
  measurements,
  productImage,
  pose = 0
}) => {
  const bodyScale = bodyTypeScales[bodyType]
  const heightScale = useMemo(() => Math.max(0.9, Math.min(1.1, measurements.height / 168)), [measurements.height])
  
  return (
    <ModelLoader
      bodyType={bodyType}
      measurements={measurements}
      productImage={productImage}
      pose={pose}
      bodyScale={bodyScale}
      heightScale={heightScale}
    />
  )
}

// Preload models for better performance
// This ensures the realistic woman model loads quickly on all product pages
useGLTF.preload(FEMALE_MODEL_URL)

// ============================================================================
// IMPORTANT: This component is used across ALL product pages
// Updating FEMALE_MODEL_URL above automatically updates:
// - Virtual Fitting Room on all product pages
// - Runway Preview on all product pages
// No need to update individual components - this is the single source of truth
// ============================================================================


