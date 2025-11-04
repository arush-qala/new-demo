/**
 * Avatar API Service for SMPL-X Integration
 * 
 * This service provides an interface to generate realistic 3D avatars
 * using SMPL-X, AMASS, and GenMotion (via backend API).
 * 
 * Architecture:
 * - Frontend calls this API
 * - Backend service generates SMPL-X models
 * - Returns GLB URLs for React Three Fiber
 */

export type BodyMeasurements = {
  bust: number
  waist: number
  hips: number
  height: number
}

export type BodyType = 'petite' | 'standard' | 'curvy' | 'athletic' | 'tall'

export type AvatarGenerationRequest = {
  measurements: BodyMeasurements
  bodyType: BodyType
  productImage?: string
}

export type MotionType = 'walk' | 'pose' | 'twirl' | 'runway'

export type AnimationGenerationRequest = {
  motionType: MotionType
  measurements?: BodyMeasurements
  bodyType?: BodyType
}

/**
 * Generate avatar using SMPL-X via backend API
 * 
 * @param request Avatar generation parameters
 * @returns Promise resolving to GLB model URL or blob
 */
export async function generateAvatar(
  request: AvatarGenerationRequest
): Promise<string | Blob> {
  // TODO: Replace with actual backend API endpoint
  const API_BASE_URL = process.env.VITE_AVATAR_API_URL || 'https://api.qala.ai/avatars'
  
  try {
    const response = await fetch(`${API_BASE_URL}/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        bust: request.measurements.bust,
        waist: request.measurements.waist,
        hips: request.measurements.hips,
        height: request.measurements.height,
        body_type: request.bodyType,
        // Convert SMPL-X parameters to GLB
        export_format: 'glb',
      }),
    })

    if (!response.ok) {
      throw new Error(`Avatar generation failed: ${response.statusText}`)
    }

    // Return GLB blob or URL
    const contentType = response.headers.get('content-type')
    if (contentType?.includes('model/gltf-binary')) {
      return await response.blob()
    } else {
      const data = await response.json()
      return data.model_url || data.url
    }
  } catch (error) {
    console.error('Error generating avatar:', error)
    throw error
  }
}

/**
 * Generate animation sequence using AMASS motion data
 * 
 * @param request Animation generation parameters
 * @returns Promise resolving to animated GLB URL or blob
 */
export async function generateAnimation(
  request: AnimationGenerationRequest
): Promise<string | Blob> {
  const API_BASE_URL = process.env.VITE_AVATAR_API_URL || 'https://api.qala.ai/avatars'
  
  try {
    const response = await fetch(`${API_BASE_URL}/animate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        motion_type: request.motionType,
        measurements: request.measurements,
        body_type: request.bodyType,
        // Use AMASS motion dataset
        motion_source: 'amass',
        export_format: 'glb',
      }),
    })

    if (!response.ok) {
      throw new Error(`Animation generation failed: ${response.statusText}`)
    }

    const contentType = response.headers.get('content-type')
    if (contentType?.includes('model/gltf-binary')) {
      return await response.blob()
    } else {
      const data = await response.json()
      return data.animation_url || data.url
    }
  } catch (error) {
    console.error('Error generating animation:', error)
    throw error
  }
}

/**
 * Get pre-generated avatar (fallback for faster loading)
 * 
 * @param bodyType Body type to get model for
 * @returns Promise resolving to GLB URL
 */
export async function getPreGeneratedAvatar(
  bodyType: BodyType
): Promise<string> {
  // Use CDN-hosted pre-generated models as fallback
  const CDN_BASE_URL = 'https://cdn.qala.ai/models'
  return `${CDN_BASE_URL}/smplx-${bodyType}.glb`
}

/**
 * Check if backend API is available
 */
export async function checkAPIAvailability(): Promise<boolean> {
  const API_BASE_URL = process.env.VITE_AVATAR_API_URL || 'https://api.qala.ai/avatars'
  
  try {
    const response = await fetch(`${API_BASE_URL}/health`, {
      method: 'GET',
      signal: AbortSignal.timeout(3000), // 3 second timeout
    })
    return response.ok
  } catch {
    return false
  }
}

