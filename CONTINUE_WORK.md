# How to Continue Work on Qala Platform

## When Context Window is Full

If the AI context window is getting full (95%+), you have these options:

### Option 1: Start New Conversation (Recommended)
1. Start a fresh conversation with me
2. Share this context file (`PROJECT_CONTEXT.md`) or key points you need
3. I'll quickly understand the project structure

### Option 2: Reference Files Directly
- Tell me which files you want to work on
- I can read them fresh and continue from there
- Key files to mention:
  - `src/components/Three/ModelAvatar.tsx`
  - `src/components/Three/FittingRoom.tsx`
  - `src/components/Three/Runway.tsx`
  - `src/components/BrandKitOverlay.tsx`
  - `src/views/ProductPage.tsx`
  - `src/store/useStore.ts`

### Option 3: Work on Specific Features
- Focus on one feature at a time
- I'll read only relevant files
- Keeps context manageable

## Quick Project Status

### ✅ Completed
- Virtual Fitting Room with realistic avatars
- Runway Preview with playful animations
- Brand Kit Overlay with goodies and address form
- Product pages with image galleries
- Designer storefronts

### 🔄 Current Implementation
- Using `@pmndrs/assets` library for 3D models
- `ModelAvatar` component handles all 3D rendering
- Body types and measurements supported
- Product texture mapping working

### 💡 Future Enhancements
- Replace xbot model with actual female body model (Mixamo/Sketchfab)
- Enhance facial features
- Improve cloth simulation/draping
- Add more realistic animations

## Key Commands to Remember

```bash
# Always sync with GitHub before/after changes
git fetch --all --prune
git pull --rebase
git push origin main

# Development
npm run dev

# Build
npm run build
```

## Important Notes
- Always sync with GitHub when committing (fetch → pull → push)
- Vercel auto-deploys on push to main
- Product images are in `/public/images/products/`
- Avatar models use @pmndrs/assets library

