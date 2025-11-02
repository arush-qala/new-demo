import { Brand, Product } from '@/store/useStore'

// Semantic keyword mappings for natural language understanding
const semanticMappings: Record<string, string[]> = {
  // Materials
  'cotton': ['cotton', 'natural', 'breathable', 'organic'],
  'silk': ['silk', 'luxury', 'smooth', 'satin'],
  'linen': ['linen', 'natural', 'breathable'],
  
  // Colors
  'blue': ['blue', 'navy', 'azure', 'cobalt', 'sapphire'],
  'red': ['red', 'maroon', 'burgundy', 'crimson', 'scarlet'],
  'green': ['green', 'emerald', 'olive', 'mint'],
  'gold': ['gold', 'golden', 'amber', 'yellow'],
  'white': ['white', 'ivory', 'cream', 'beige', 'off-white'],
  'black': ['black', 'ebony', 'charcoal'],
  
  // Styles
  'dress': ['dress', 'gown', 'frock'],
  'kurta': ['kurta', 'tunic', 'top'],
  'sari': ['sari', 'saree'],
  'lehenga': ['lehenga', 'skirt'],
  'embroidery': ['embroidery', 'embroidered', 'stitching', 'threadwork'],
  
  // Occasions
  'evening': ['evening', 'night', 'dinner', 'formal', 'gala'],
  'casual': ['casual', 'everyday', 'comfortable', 'daywear'],
  'bridal': ['bridal', 'wedding', 'bridalwear', 'marriage'],
  'resort': ['resort', 'vacation', 'beach', 'holiday'],
  'formal': ['formal', 'professional', 'business'],
  
  // General terms
  'elegant': ['elegant', 'sophisticated', 'refined'],
  'luxury': ['luxury', 'premium', 'high-end', 'opulent'],
  'sustainable': ['sustainable', 'eco-friendly', 'organic', 'eco'],
}

// Extract keywords from natural language query
function extractKeywords(query: string): string[] {
  const lowerQuery = query.toLowerCase()
  const words = lowerQuery.split(/\s+/)
  const keywords: Set<string> = new Set()
  
  // Add direct words
  words.forEach(word => {
    if (word.length > 2) { // Filter out very short words
      keywords.add(word)
    }
  })
  
  // Add semantic matches
  Object.entries(semanticMappings).forEach(([key, synonyms]) => {
    if (synonyms.some(syn => lowerQuery.includes(syn))) {
      keywords.add(key)
    }
  })
  
  return Array.from(keywords)
}

// Calculate relevance score for a product
function calculateProductScore(product: Product, keywords: string[]): number {
  let score = 0
  
  // Check product name
  const productNameLower = product.name.toLowerCase()
  keywords.forEach(keyword => {
    if (productNameLower.includes(keyword)) {
      score += 3
    }
  })
  
  // Check tags
  if (product.tags) {
    keywords.forEach(keyword => {
      if (product.tags!.some(tag => tag.includes(keyword) || keyword.includes(tag))) {
        score += 2
      }
    })
  }
  
  // Check specific attributes with higher weights
  keywords.forEach(keyword => {
    // Material match
    if (product.material?.some(m => m.includes(keyword) || keyword.includes(m))) {
      score += 4
    }
    
    // Color match
    if (product.colors?.some(c => c.includes(keyword) || keyword.includes(c))) {
      score += 4
    }
    
    // Occasion match
    if (product.occasions?.some(o => o.includes(keyword) || keyword.includes(o))) {
      score += 3
    }
    
    // Style match
    if (product.styles?.some(s => s.includes(keyword) || keyword.includes(s))) {
      score += 3
    }
  })
  
  return score
}

// Calculate relevance score for a brand
function calculateBrandScore(brand: Brand, keywords: string[]): number {
  let score = 0
  
  // Check brand name
  const brandNameLower = brand.name.toLowerCase()
  keywords.forEach(keyword => {
    if (brandNameLower.includes(keyword)) {
      score += 3
    }
  })
  
  // Check tagline
  if (brand.tagline) {
    const taglineLower = brand.tagline.toLowerCase()
    keywords.forEach(keyword => {
      if (taglineLower.includes(keyword)) {
        score += 2
      }
    })
  }
  
  // Check tags
  if (brand.tags) {
    keywords.forEach(keyword => {
      if (brand.tags!.some(tag => tag.includes(keyword) || keyword.includes(tag))) {
        score += 2
      }
    })
  }
  
  return score
}

// AI-powered semantic search
export function aiSearch(
  query: string,
  products: Product[],
  brands: Brand[]
): { products: Product[]; brands: Brand[] } {
  if (!query.trim()) {
    return { products: [], brands: [] }
  }
  
  const keywords = extractKeywords(query)
  
  if (keywords.length === 0) {
    return { products: [], brands: [] }
  }
  
  // Score and rank products
  const productScores = products.map(product => ({
    product,
    score: calculateProductScore(product, keywords),
  }))
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .map(item => item.product)
  
  // Score and rank brands
  const brandScores = brands.map(brand => ({
    brand,
    score: calculateBrandScore(brand, keywords),
  }))
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .map(item => item.brand)
  
  return {
    products: productScores,
    brands: brandScores,
  }
}

