# Avatar Update Guide

## Overview
All 3D avatars in the Qala platform use a centralized `ModelAvatar` component to ensure consistency across all product pages.

## Current Implementation

### Single Source of Truth
- **Component**: `src/components/Three/ModelAvatar.tsx`
- **Model URL**: Defined in `FEMALE_MODEL_URL` constant
- **Usage**: All product pages use the same `ModelAvatar` component

### Where Avatars Are Used
1. **Virtual Fitting Room** (`src/components/Three/FittingRoom.tsx`)
   - Uses: `<ModelAvatar />` component
   - Location: Product pages under "Virtual Fitting Room" section

2. **Runway Preview** (`src/components/Three/Runway.tsx`)
   - Uses: `<ModelAvatar />` component via `AnimatedRunwayAvatar`
   - Location: Product pages under "Runway Preview" section

## How to Update the Avatar Model

### Option 1: Update Model URL (Quick)
1. Open `src/components/Three/ModelAvatar.tsx`
2. Update the `FEMALE_MODEL_URL` constant:
   ```typescript
   const FEMALE_MODEL_URL = 'https://your-new-model-url.glb'
   ```
3. Save and commit - changes will automatically apply to ALL product pages

### Option 2: Use Environment Variable (Recommended for Production)
1. Add to `.env`:
   ```
   VITE_AVATAR_MODEL_URL=https://your-model-url.glb
   ```
2. Update `ModelAvatar.tsx`:
   ```typescript
   const FEMALE_MODEL_URL = import.meta.env.VITE_AVATAR_MODEL_URL || 'https://fallback-url.glb'
   ```

### Option 3: Use SMPL-X API (Future)
1. Set `VITE_AVATAR_API_URL` environment variable
2. Use `ModelAvatarSMPLX` component instead
3. Avatar will be generated based on measurements

## Model Requirements

### Format
- **File Format**: GLB (preferred) or GLTF
- **Size**: Optimized for web (< 5MB recommended)
- **Rigging**: Should be rigged for animation
- **Textures**: Supports texture mapping for clothing

### Quality Standards
- ✅ Realistic human female proportions
- ✅ Proper anatomical accuracy
- ✅ High-quality textures
- ✅ Smooth animations
- ✅ Fashion model aesthetic

## Testing
After updating the model URL:
1. Check Virtual Fitting Room on any product page
2. Check Runway Preview on any product page
3. Verify both use the same model
4. Test with different body types and measurements

## Notes
- Changes to `ModelAvatar.tsx` automatically apply to ALL product pages
- No need to update individual product pages
- Model is cached by browser for performance
- Use `useGLTF.preload()` to preload models

