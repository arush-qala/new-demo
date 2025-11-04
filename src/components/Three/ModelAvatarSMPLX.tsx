/**
 * Enhanced ModelAvatar with SMPL-X Integration
 * 
 * This component uses SMPL-X API for generating realistic 3D avatars
 * with proper body proportions based on actual measurements.
 * 
 * Falls back to static model if API is unavailable.
 */

import React, { Suspense, useRef, useMemo, useState, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF, useTexture } from '@react-three/drei'
import * as THREE from 'three'
import { generateAvatar, getPreGeneratedAvatar, checkAPIAvailability, type BodyMeasurements, type BodyType } from '@/utils/avatarAPI'

type ModelAvatarSMPLXProps = {
  bodyType: BodyType
  measurements: BodyMeasurements
  productImage?: string
  pose?: number
  useSMPLX?: boolean // Toggle SMPL-X generation
}

// Fallback to static model
const STATIC_MODEL_URL = 'https://assets.pmnd.rs/models/xbot.glb'

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

function ModelLoaderSMPLX({
  modelUrl,
  productImage,
  pose,
  measurements,
}: {
  modelUrl: string
  productImage?: string
  pose?: number
  measurements: BodyMeasurements
}) {
  const groupRef = useRef<THREE.Group>(null)
  
  // Load model
  const gltf = useGLTF(modelUrl, true)
  const model = gltf.scene
  
  // Load product texture
  const texture = productImage ? useTexture(productImage) : null
  
  // Enhanced materials
  const dressMaterial = useMemo(() => {
    if (texture) {
      texture.wrapS = THREE.RepeatWrapping
      texture.wrapT = THREE.RepeatWrapping
      texture.repeat.set(1, 1)
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
  
  const skinMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: '#F5D5C0',
      roughness: 0.75,
      metalness: 0.01,
      envMapIntensity: 1.0,
      emissive: '#F5D5C0',
      emissiveIntensity: 0.02,
    })
  }, [])
  
  // Pose animation
  useFrame(() => {
    if (!groupRef.current) return
    groupRef.current.rotation.y = Math.sin(pose || 0) * 0.12
    groupRef.current.position.z = Math.sin((pose || 0) * 0.5) * 0.12
  })
  
  // Process model
  const processedModel = useMemo(() => {
    if (!model) return null
    
    const clone = model.clone()
    
    // Apply materials
    clone.traverse((child: any) => {
      if (child.isMesh && child.material) {
        const name = child.name?.toLowerCase() || ''
        
        if (texture && (name.includes('body') || name.includes('torso') || 
            name.includes('dress') || name.includes('shirt') ||
            name.includes('top') || name.includes('chest'))) {
          child.material = dressMaterial
          child.castShadow = true
          child.receiveShadow = true
        }
        else if (name.includes('head') || name.includes('face') || 
                 name.includes('hand') || name.includes('arm') || 
                 name.includes('leg') || name.includes('foot')) {
          child.material = skinMaterial
          child.castShadow = true
          child.receiveShadow = true
        }
        
        if (child.geometry) {
          child.geometry.computeVertexNormals()
        }
      }
    })
    
    return clone
  }, [model, texture, dressMaterial, skinMaterial])
  
  if (!processedModel) {
    return <AvatarFallback />
  }
  
  return (
    <group ref={groupRef} position={[0, -1.2, 0]}>
      <primitive object={processedModel} />
    </group>
  )
}

export const ModelAvatarSMPLX: React.FC<ModelAvatarSMPLXProps> = ({
  bodyType,
  measurements,
  productImage,
  pose = 0,
  useSMPLX = false,
}) => {
  const [modelUrl, setModelUrl] = useState<string>(STATIC_MODEL_URL)
  const [isLoading, setIsLoading] = useState(false)
  const [apiAvailable, setApiAvailable] = useState(false)
  
  // Check API availability
  useEffect(() => {
    if (useSMPLX) {
      checkAPIAvailability().then(setApiAvailable)
    }
  }, [useSMPLX])
  
  // Generate SMPL-X model when measurements change
  useEffect(() => {
    if (useSMPLX && apiAvailable) {
      setIsLoading(true)
      
      generateAvatar({
        measurements,
        bodyType,
        productImage,
      })
        .then((result) => {
          if (typeof result === 'string') {
            setModelUrl(result)
          } else {
            // Create blob URL if it's a Blob
            const url = URL.createObjectURL(result)
            setModelUrl(url)
          }
        })
        .catch((error) => {
          console.error('Failed to generate SMPL-X avatar, using fallback:', error)
          // Fallback to pre-generated or static model
          getPreGeneratedAvatar(bodyType).then(setModelUrl).catch(() => {
            setModelUrl(STATIC_MODEL_URL)
          })
        })
        .finally(() => {
          setIsLoading(false)
        })
    } else if (useSMPLX && !apiAvailable) {
      // Try pre-generated models
      getPreGeneratedAvatar(bodyType).then(setModelUrl).catch(() => {
        setModelUrl(STATIC_MODEL_URL)
      })
    }
  }, [measurements, bodyType, productImage, useSMPLX, apiAvailable])
  
  if (isLoading) {
    return <AvatarFallback />
  }
  
  return (
    <Suspense fallback={<AvatarFallback />}>
      <ModelLoaderSMPLX
        modelUrl={modelUrl}
        productImage={productImage}
        pose={pose}
        measurements={measurements}
      />
    </Suspense>
  )
}

// Preload static model
useGLTF.preload(STATIC_MODEL_URL)

