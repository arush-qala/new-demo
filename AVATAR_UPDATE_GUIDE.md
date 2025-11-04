# Avatar Update Guide - Centralized Model Management

## Overview
All 3D avatars in the Qala platform use a **centralized `ModelAvatar` component** to ensure consistency across all product pages. When you update the model, it automatically updates everywhere.

## Current Implementation

### Single Source of Truth
- **Component**: `src/components/Three/ModelAvatar.tsx`
- **Model URL**: Defined in `FEMALE_MODEL_URL` constant
- **Environment Variable**: `VITE_AVATAR_MODEL_URL` (optional)
- **Usage**: All product pages use the same `ModelAvatar` component

### Where Avatars Are Used
1. **Virtual Fitting Room** (`src/components/Three/FittingRoom.tsx`)
   - Uses: `<ModelAvatar />` component
   - Location: Product pages under "Virtual Fitting Room" section

2. **Runway Preview** (`src/components/Three/Runway.tsx`)
   - Uses: `<ModelAvatar />` component via `AnimatedRunwayAvatar`
   - Location: Product pages under "Runway Preview" section

**✅ Any changes to ModelAvatar automatically update BOTH locations on ALL product pages**

## How to Update the Avatar Model

### Option 1: Update Model URL (Quick)
1. Open `src/components/Three/ModelAvatar.tsx`
2. Find the `FEMALE_MODEL_URL` constant (around line 28)
3. Update the URL:
   ```typescript
   const FEMALE_MODEL_URL = 'https://your-new-realistic-model.glb'
   ```
4. Save and commit - changes automatically apply to ALL product pages

### Option 2: Use Environment Variable (Recommended for Production)
1. Add to `.env` or Vercel environment variables:
   ```
   VITE_AVATAR_MODEL_URL=https://your-model-url.glb
   ```
2. The code already supports this - no code changes needed!
3. Deploy - changes apply everywhere automatically

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
- ✅ Professional appearance suitable for luxury fashion

## Recommended Model Sources

### 1. Mixamo (Adobe) - **RECOMMENDED**
- **URL**: https://www.mixamo.com
- **Free**: Yes
- **Quality**: High-quality, realistic female models
- **Download**: GLB format, rigged, ready to use
- **Steps**:
  1. Sign up (free)
  2. Search for "female" models
  3. Download in GLB format
  4. Upload to your CDN
  5. Update `FEMALE_MODEL_URL`

### 2. Ready Player Me
- **URL**: https://readyplayer.me
- **API**: Yes, for custom avatar generation
- **Quality**: Realistic, customizable
- **Usage**: API integration (see `avatarAPI.ts`)

### 3. Sketchfab CC0
- **URL**: https://sketchfab.com
- **Free**: CC0 licensed models available
- **Quality**: Varies, many high-quality options
- **Download**: GLB format available

### 4. Custom 3D Artist
- Hire a 3D artist to create a professional fashion model
- Export as GLB
- Upload to CDN
- Update URL

## Testing Updates

1. Update model URL
2. Save file
3. Check Virtual Fitting Room on any product page
4. Check Runway Preview on any product page
5. Both should show the new model automatically

## Troubleshooting

### Model not loading?
- Check browser console for errors
- Verify GLB file is accessible (test URL in browser)
- Ensure file size is reasonable (< 10MB)
- Check CORS settings if hosting externally

### Model looks wrong?
- Verify it's a female model
- Check model scale (may need adjustment)
- Ensure textures are included in GLB
- Test with different body types

### Need to revert?
- Simply change `FEMALE_MODEL_URL` back to previous value
- Or use git to revert the change
- All pages update automatically

## Next Steps

1. **Get a realistic female model** from Mixamo or another source
2. **Upload to CDN** (Vercel, Cloudflare, or your hosting)
3. **Update `FEMALE_MODEL_URL`** in `ModelAvatar.tsx`
4. **Commit and deploy** - changes apply everywhere automatically!
