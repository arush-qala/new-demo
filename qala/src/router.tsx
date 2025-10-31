import React from 'react'
import { createBrowserRouter } from 'react-router-dom'
import { RootLayout } from './templates/RootLayout'
import { HomePage } from './views/HomePage'
import { SearchPage } from './views/SearchPage'
import { DesignerStorefront } from './views/DesignerStorefront'
import { CollectionPage } from './views/CollectionPage'
import { ProductPage } from './views/ProductPage'
import { OrderTrackingPage } from './views/OrderTrackingPage'
import { BrandKitPage } from './views/brandkit/BrandKitPage'
import { CheckoutPage } from './views/checkout/CheckoutPage'
import { BulkOrderPage } from './views/BulkOrderPage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'search', element: <SearchPage /> },
      { path: 'brand/:brandSlug', element: <DesignerStorefront /> },
      { path: 'brand/:brandSlug/collections/:collectionSlug', element: <CollectionPage /> },
      { path: 'product/:productSlug', element: <ProductPage /> },
      { path: 'order/:orderId/track', element: <OrderTrackingPage /> },
      { path: 'kit', element: <BrandKitPage /> },
      { path: 'checkout', element: <CheckoutPage /> },
      { path: 'bulk-order/:productSlug', element: <BulkOrderPage /> },
    ],
  },
])

