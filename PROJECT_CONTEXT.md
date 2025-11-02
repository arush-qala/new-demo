# Qala B2B Platform - Project Context Summary

## Project Overview
B2B platform for luxury multi-designer boutiques and retail stores to discover and order products from top Indian designer brands. Built with Vite + React + TypeScript + Tailwind.

## Key Features Implemented

### 1. AI-Powered Search
- Search bar for products and brands
- Results display both products and designer brands

### 2. Designer Storefronts
- Brand details, designer's journey/story
- Manufacturing videos, achievements, publications
- Breadcrumbs, info blocks, accent dividers
- Collections gallery with product listings

### 3. Product Pages
- Product image gallery (using local images from `/public/images/products/`)
- Close-up detail shots
- 360-degree product view capability
- Virtual Fitting Room
- Runway Preview

### 4. Virtual Fitting Room
- Uses `ModelAvatar` component with @pmndrs/assets library
- 5 body types: petite, standard, curvy, athletic, tall
- Customizable measurements (bust, waist, hips, height)
- Product texture mapping onto avatar
- Animated pose when playing

### 5. Runway Preview
- Playful 4-phase animation: walk forward → twirl → pose → walk back
- Professional runway environment with fashion show lighting
- Camera follows model with professional angles
- Uses same `ModelAvatar` component

### 6. Brand Kit Overlay
- Opens when clicking "Order Brand Kit" button
- Brand goodies/keepsakes selection (wooden blocks, fabric swatches, etc.)
- Select up to 3 products from same brand
- Shipping address form (company, contact name, phone, full address)
- Form validation before submission

### 7. Bulk Ordering
- Size matrix with quantity selection
- Checkout flow

### 8. Order Tracking
- Mocked DHL/FedEx timeline

## Technical Stack

### Dependencies
- React 18.3.1
- React Router DOM 6.28.0
- Zustand 4.5.5 (state management)
- Three.js 0.170.0
- @react-three/fiber 8.15.19
- @react-three/drei 9.88.13
- Framer Motion 11.0.0
- @pmndrs/assets (for 3D models)

### Key Components
- `src/components/Three/ModelAvatar.tsx` - Main 3D avatar component using @pmndrs/assets
- `src/components/Three/FittingRoom.tsx` - Virtual fitting room interface
- `src/components/Three/Runway.tsx` - Runway preview with animations
- `src/components/BrandKitOverlay.tsx` - Brand kit order overlay
- `src/views/ProductPage.tsx` - Main product page

### Store Structure
- `src/store/useStore.ts` - Zustand store with brands, collections, products, kit items, bulk orders

## Product Images
- Location: `/public/images/products/`
- Current product: `evening-dress-aurum` (Khara Kapas)
- 5 images stored locally

## Current Avatar Implementation
- Uses `@pmndrs/assets` library
- Model URL: `https://assets.pmnd.rs/models/xbot.glb`
- Fallback: `https://assets.pmnd.rs/models/Flamingo.glb`
- ErrorBoundary handles loading failures
- Supports body type scaling and product texture mapping

## Deployment
- Platform: Vercel
- Build command: `npm run build`
- Output directory: `dist`
- SPA routing configured in `vercel.json`

## Git Repository
- Remote: `https://github.com/arush-qala/new-demo.git`
- Branch: `main`
- Always sync with: `git fetch --all --prune && git pull --rebase && git push origin main`

## Known Issues/Notes
- Realistic female body models: Currently using xbot model as base. For production, recommend downloading actual female body models from Mixamo or Sketchfab CC0.
- Avatar has facial features (eyes, nose, mouth, hair) but could be enhanced further.
- Runway walk includes twirl and posing phases.
- Brand Kit overlay fully functional with form validation.

