import { create } from 'zustand'

export type Brand = { slug: string; name: string; tagline?: string; tags?: string[] }
export type Collection = { slug: string; brandSlug: string; name: string; cover: string; tags?: string[] }
export type Product = { 
  slug: string
  brandSlug: string
  collectionSlug: string
  name: string
  price: number
  cover: string
  tags?: string[] // e.g., ['evening', 'dress', 'cotton', 'embroidery', 'blue', 'formal']
  material?: string[]
  colors?: string[]
  occasions?: string[]
  styles?: string[]
}

export type Address = {
  company: string
  contactName: string
  email: string
  phone: string
  line1: string
  city: string
  state: string
  country: string
  postalCode: string
}

export type SizeKey = 'XXS'|'XS'|'S'|'M'|'L'|'XL'|'XXL'

type KitItem = { productSlug: string }
type BulkItem = { productSlug: string; sizeQty: Partial<Record<SizeKey, number>> }

type StoreState = {
  brands: Brand[]
  collections: Collection[]
  products: Product[]

  // Brand Kit (max 3 items)
  kitItems: KitItem[]
  addKitItem: (productSlug: string) => void
  removeKitItem: (productSlug: string) => void
  clearKit: () => void

  // Bulk orders
  bulkOrders: BulkItem[]
  setBulkQty: (productSlug: string, size: SizeKey, qty: number) => void
  clearBulk: () => void

  // Checkout
  address?: Address
  setAddress: (addr: Address) => void
}

const demoBrands: Brand[] = [
  { slug: 'khara-kapas', name: 'Khara Kapas', tagline: 'Pure cotton, pure style', tags: ['cotton', 'sustainable', 'casual', 'comfort', 'indian', 'handcrafted'] },
  { slug: 'raw-mango', name: 'Raw Mango', tagline: 'Contemporary Indian design', tags: ['contemporary', 'indian', 'silk', 'artisan', 'traditional', 'modern'] },
  { slug: 'sabyasachi', name: 'Sabyasachi', tagline: 'Opulent couture and craftsmanship', tags: ['luxury', 'bridal', 'couture', 'embroidery', 'opulent', 'heritage', 'premium'] },
  { slug: 'anita-dongre', name: 'Anita Dongre', tagline: 'Sustainable luxury for the modern woman', tags: ['sustainable', 'luxury', 'resort', 'eco-friendly', 'modern', 'fashion-forward'] },
]

const demoCollections: Collection[] = [
  { slug: 'evening-elegance', brandSlug: 'khara-kapas', name: 'Evening Elegance', cover: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?q=80&w=1600&auto=format&fit=crop' },
  { slug: 'daylight-cotton', brandSlug: 'khara-kapas', name: 'Daylight Cotton', cover: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=1600&auto=format&fit=crop' },
  { slug: 'couture-bridal', brandSlug: 'sabyasachi', name: 'Couture Bridal', cover: 'https://images.unsplash.com/photo-1520975964732-35dd22c45588?q=80&w=1600&auto=format&fit=crop' },
  { slug: 'eco-resort', brandSlug: 'anita-dongre', name: 'Eco Resort', cover: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1600&auto=format&fit=crop' },
  { slug: 'heritage-embroideries', brandSlug: 'sabyasachi', name: 'Heritage Embroideries', cover: 'https://images.unsplash.com/photo-1601600576336-c1bf4b0b0b97?q=80&w=1600&auto=format&fit=crop' },
  { slug: 'silk-conservatory', brandSlug: 'raw-mango', name: 'Silk Conservatory', cover: 'https://images.unsplash.com/photo-1535905496755-26ae35d0ae54?q=80&w=1600&auto=format&fit=crop' },
  { slug: 'cotton-essentials', brandSlug: 'khara-kapas', name: 'Cotton Essentials', cover: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1600&auto=format&fit=crop' },
  { slug: 'garden-fete', brandSlug: 'anita-dongre', name: 'Garden Fête', cover: 'https://images.unsplash.com/photo-1520975940202-b4643f3c02df?q=80&w=1600&auto=format&fit=crop' },
]

const demoProducts: Product[] = [
  { slug: 'evening-dress-aurum', brandSlug: 'khara-kapas', collectionSlug: 'evening-elegance', name: 'Aurum Evening Dress', price: 28000, cover: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=1600&auto=format&fit=crop', tags: ['evening', 'dress', 'cotton', 'embroidery', 'blue', 'formal', 'elegant'], material: ['cotton'], colors: ['blue'], occasions: ['evening', 'formal'], styles: ['dress', 'embroidery'] },
  { slug: 'cotton-kurta-elara', brandSlug: 'khara-kapas', collectionSlug: 'daylight-cotton', name: 'Elara Cotton Kurta', price: 14000, cover: 'https://images.unsplash.com/photo-1483985973882-3ef63f6f7f8e?q=80&w=1600&auto=format&fit=crop', tags: ['kurta', 'cotton', 'casual', 'daywear', 'comfortable'], material: ['cotton'], colors: ['white', 'beige'], occasions: ['casual', 'day'], styles: ['kurta'] },
  { slug: 'bridal-lehenga-noor', brandSlug: 'sabyasachi', collectionSlug: 'couture-bridal', name: 'Noor Bridal Lehenga', price: 220000, cover: 'https://images.unsplash.com/photo-1610030469975-09a309f2d1a3?q=80&w=1600&auto=format&fit=crop', tags: ['bridal', 'lehenga', 'embroidery', 'red', 'gold', 'luxury'], material: ['silk'], colors: ['red', 'gold'], occasions: ['bridal', 'wedding'], styles: ['lehenga', 'embroidery'] },
  { slug: 'resort-maxi-vana', brandSlug: 'anita-dongre', collectionSlug: 'eco-resort', name: 'Vana Resort Maxi', price: 38000, cover: 'https://images.unsplash.com/photo-1542060748-10c28b62716f?q=80&w=1600&auto=format&fit=crop', tags: ['resort', 'maxi', 'dress', 'sustainable', 'casual'], material: ['cotton', 'linen'], colors: ['white', 'cream'], occasions: ['resort', 'vacation'], styles: ['maxi', 'dress'] },
  { slug: 'silk-sari-nila', brandSlug: 'raw-mango', collectionSlug: 'silk-conservatory', name: 'Nila Silk Sari', price: 56000, cover: 'https://images.unsplash.com/photo-1617035730005-0b2dac54b2ea?q=80&w=1600&auto=format&fit=crop', tags: ['sari', 'silk', 'traditional', 'elegant', 'formal'], material: ['silk'], colors: ['blue', 'navy'], occasions: ['formal', 'traditional'], styles: ['sari'] },
  { slug: 'embroidered-blouse-aarohi', brandSlug: 'sabyasachi', collectionSlug: 'heritage-embroideries', name: 'Aarohi Embroidered Blouse', price: 42000, cover: 'https://images.unsplash.com/photo-1503342217505-b0a15cf70489?q=80&w=1600&auto=format&fit=crop', tags: ['blouse', 'embroidery', 'gold', 'traditional'], material: ['silk'], colors: ['gold', 'cream'], occasions: ['formal', 'traditional'], styles: ['blouse', 'embroidery'] },
  { slug: 'cotton-dress-mira', brandSlug: 'khara-kapas', collectionSlug: 'cotton-essentials', name: 'Mira Cotton Dress', price: 18000, cover: 'https://images.unsplash.com/photo-1518131678677-a9b7df0f2b52?q=80&w=1600&auto=format&fit=crop', tags: ['dress', 'cotton', 'casual', 'daywear'], material: ['cotton'], colors: ['blue', 'green'], occasions: ['casual', 'day'], styles: ['dress'] },
  { slug: 'kurta-set-isha', brandSlug: 'khara-kapas', collectionSlug: 'cotton-essentials', name: 'Isha Kurta Set', price: 19000, cover: 'https://images.unsplash.com/photo-1520975802034-7bfe3a0d34d5?q=80&w=1600&auto=format&fit=crop', tags: ['kurta', 'set', 'cotton', 'casual'], material: ['cotton'], colors: ['beige', 'brown'], occasions: ['casual'], styles: ['kurta', 'set'] },
  { slug: 'lehenga-raadha', brandSlug: 'sabyasachi', collectionSlug: 'couture-bridal', name: 'Raadha Lehenga', price: 260000, cover: 'https://images.unsplash.com/photo-1547963185-7f2e4e7132b2?q=80&w=1600&auto=format&fit=crop', tags: ['bridal', 'lehenga', 'embroidery', 'luxury', 'red'], material: ['silk'], colors: ['red', 'maroon'], occasions: ['bridal', 'wedding'], styles: ['lehenga', 'embroidery'] },
  { slug: 'silk-dress-arya', brandSlug: 'raw-mango', collectionSlug: 'silk-conservatory', name: 'Arya Silk Dress', price: 62000, cover: 'https://images.unsplash.com/photo-1508243771214-6e95d137426b?q=80&w=1600&auto=format&fit=crop', tags: ['dress', 'silk', 'formal', 'elegant'], material: ['silk'], colors: ['black', 'navy'], occasions: ['formal', 'evening'], styles: ['dress'] },
  { slug: 'resort-kaftan-zoya', brandSlug: 'anita-dongre', collectionSlug: 'eco-resort', name: 'Zoya Resort Kaftan', price: 29000, cover: 'https://images.unsplash.com/photo-1503342394124-4803f6f1473f?q=80&w=1600&auto=format&fit=crop', tags: ['kaftan', 'resort', 'sustainable', 'casual'], material: ['cotton', 'linen'], colors: ['white', 'beige'], occasions: ['resort', 'vacation'], styles: ['kaftan'] },
  { slug: 'embroidered-sari-devika', brandSlug: 'sabyasachi', collectionSlug: 'heritage-embroideries', name: 'Devika Embroidered Sari', price: 89000, cover: 'https://images.unsplash.com/photo-1617035730054-92bd9c0d7a35?q=80&w=1600&auto=format&fit=crop', tags: ['sari', 'embroidery', 'traditional', 'luxury'], material: ['silk'], colors: ['green', 'gold'], occasions: ['formal', 'traditional'], styles: ['sari', 'embroidery'] },
  { slug: 'cotton-set-reya', brandSlug: 'khara-kapas', collectionSlug: 'daylight-cotton', name: 'Reya Cotton Set', price: 16000, cover: 'https://images.unsplash.com/photo-1520975949216-77b8ab6526be?q=80&w=1600&auto=format&fit=crop', tags: ['cotton', 'set', 'casual', 'daywear'], material: ['cotton'], colors: ['white', 'cream'], occasions: ['casual', 'day'], styles: ['set'] },
  { slug: 'lehenga-meera', brandSlug: 'sabyasachi', collectionSlug: 'heritage-embroideries', name: 'Meera Lehenga', price: 240000, cover: 'https://images.unsplash.com/photo-1601600581750-7c158d80693b?q=80&w=1600&auto=format&fit=crop', tags: ['lehenga', 'embroidery', 'bridal', 'luxury'], material: ['silk'], colors: ['pink', 'gold'], occasions: ['bridal', 'wedding'], styles: ['lehenga', 'embroidery'] },
  { slug: 'silk-kurta-neel', brandSlug: 'raw-mango', collectionSlug: 'silk-conservatory', name: 'Neel Silk Kurta', price: 45000, cover: 'https://images.unsplash.com/photo-1539533113208-f6dfc67f7f6a?q=80&w=1600&auto=format&fit=crop', tags: ['kurta', 'silk', 'formal', 'traditional'], material: ['silk'], colors: ['blue', 'navy'], occasions: ['formal', 'traditional'], styles: ['kurta'] },
  { slug: 'garden-dress-ahana', brandSlug: 'anita-dongre', collectionSlug: 'garden-fete', name: 'Ahana Garden Dress', price: 34000, cover: 'https://images.unsplash.com/photo-1518131678611-03f9d79dc2f9?q=80&w=1600&auto=format&fit=crop', tags: ['dress', 'garden', 'casual', 'floral'], material: ['cotton'], colors: ['floral', 'pastel'], occasions: ['casual', 'garden'], styles: ['dress', 'floral'] },
  { slug: 'garden-set-kaya', brandSlug: 'anita-dongre', collectionSlug: 'garden-fete', name: 'Kaya Garden Set', price: 36000, cover: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1600&auto=format&fit=crop', tags: ['set', 'garden', 'casual', 'floral'], material: ['cotton'], colors: ['floral', 'pastel'], occasions: ['casual', 'garden'], styles: ['set', 'floral'] },
  { slug: 'silk-sari-ira', brandSlug: 'raw-mango', collectionSlug: 'silk-conservatory', name: 'Ira Silk Sari', price: 58000, cover: 'https://images.unsplash.com/photo-1542060748-10c28b62716f?q=80&w=1600&auto=format&fit=crop', tags: ['sari', 'silk', 'traditional', 'formal'], material: ['silk'], colors: ['blue', 'green'], occasions: ['formal', 'traditional'], styles: ['sari'] },
  { slug: 'cotton-dress-aisha', brandSlug: 'khara-kapas', collectionSlug: 'cotton-essentials', name: 'Aisha Cotton Dress', price: 17000, cover: 'https://images.unsplash.com/photo-1519741498642-9971f1f05d40?q=80&w=1600&auto=format&fit=crop', tags: ['dress', 'cotton', 'casual'], material: ['cotton'], colors: ['blue', 'green'], occasions: ['casual'], styles: ['dress'] },
  { slug: 'bridal-sari-rani', brandSlug: 'sabyasachi', collectionSlug: 'couture-bridal', name: 'Rani Bridal Sari', price: 180000, cover: 'https://images.unsplash.com/photo-1547963181-351a4d4f71df?q=80&w=1600&auto=format&fit=crop', tags: ['bridal', 'sari', 'embroidery', 'luxury', 'red'], material: ['silk'], colors: ['red', 'gold'], occasions: ['bridal', 'wedding'], styles: ['sari', 'embroidery'] },
  { slug: 'eco-top-isha', brandSlug: 'anita-dongre', collectionSlug: 'eco-resort', name: 'Isha Eco Top', price: 22000, cover: 'https://images.unsplash.com/photo-1503342395041-3a4f2f32c1ea?q=80&w=1600&auto=format&fit=crop', tags: ['top', 'eco', 'sustainable', 'casual'], material: ['cotton', 'organic'], colors: ['white', 'beige'], occasions: ['casual'], styles: ['top'] },
  { slug: 'silk-dress-leya', brandSlug: 'raw-mango', collectionSlug: 'silk-conservatory', name: 'Leya Silk Dress', price: 64000, cover: 'https://images.unsplash.com/photo-1520975943339-0f7a0f8ec52a?q=80&w=1600&auto=format&fit=crop', tags: ['dress', 'silk', 'formal', 'evening'], material: ['silk'], colors: ['black', 'navy'], occasions: ['formal', 'evening'], styles: ['dress'] },
]

export const useStore = create<StoreState>((set, get) => ({
  brands: demoBrands,
  collections: demoCollections,
  products: demoProducts,

  kitItems: [],
  addKitItem: (productSlug) => set((s) => {
    if (s.kitItems.find(k => k.productSlug === productSlug)) return s
    if (s.kitItems.length >= 3) return s
    return { kitItems: [...s.kitItems, { productSlug }] }
  }),
  removeKitItem: (productSlug) => set((s) => ({ kitItems: s.kitItems.filter(k => k.productSlug !== productSlug) })),
  clearKit: () => set({ kitItems: [] }),

  bulkOrders: [],
  setBulkQty: (productSlug, size, qty) => set((s) => {
    const orders = [...s.bulkOrders]
    let item = orders.find(o => o.productSlug === productSlug)
    if (!item) {
      item = { productSlug, sizeQty: {} }
      orders.push(item)
    }
    item.sizeQty[size] = qty
    return { bulkOrders: orders }
  }),
  clearBulk: () => set({ bulkOrders: [] }),

  setAddress: (addr) => set({ address: addr }),
}))

export const allSizes: SizeKey[] = ['XXS','XS','S','M','L','XL','XXL']

