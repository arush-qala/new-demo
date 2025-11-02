# Qala B2B Platform

Luxury B2B platform for multi-designer boutiques and retail stores to discover and order from top Indian designer brands.

## Features

- **AI-Powered Search**: Discover brands and products through intelligent search
- **Designer Storefronts**: Immersive brand pages with story, production videos, and collections
- **Virtual Fitting Room**: 3D avatars with customizable body types and measurements
- **Runway Preview**: Animated runway walks showcasing garments
- **Brand Kit**: Request sample kits (up to 3 products) for physical inspection
- **Bulk Ordering**: Size matrix with quantity selection
- **Order Tracking**: Mocked DHL/FedEx integration

## Product Images

Product images should be added to the `public/images/products/` directory or referenced via URL in `src/views/ProductPage.tsx`.

For the `evening-dress-aurum` product, update the `productImages` object with the actual image URLs from the deployed site.

## Development

```bash
npm install
npm run dev
```

## Deployment

Configured for Vercel deployment. The project is set up with:
- `vercel.json` for SPA routing
- Build output: `dist/`
- Framework: Vite + React + TypeScript
