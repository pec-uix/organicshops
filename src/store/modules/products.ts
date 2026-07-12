import { Module } from 'vuex'
import { Product, Category, TempZone } from '@/types'
import scrapedProducts from '@/data/products.json'
import categoryBlueprints from '@/data/categories.json'

export type SortOption = 'latest' | 'price_asc' | 'price_desc' | 'sales'

function normalizeProductId(value: string): string {
  const raw = String(value || '').trim()
  const withoutQuery = raw.split('?')[0].split('#')[0]
  try {
    return decodeURIComponent(withoutQuery).toLowerCase()
  } catch (_error) {
    return withoutQuery.toLowerCase()
  }
}

interface ProductsState {
  products: Product[]
  categories: Category[]
}

interface ImportedProduct {
  oldProductId: string
  productNo?: string
  productName: string
  categoryName?: string
  subcategoryName?: string
  shortDescription?: string
  listPrice?: number | null
  memberPrice?: number | null
  mainImageUrl?: string
  galleryImageUrls?: string[]
  productDescription?: string
  specification?: string
  shippingType?: string
}

interface CategoryBlueprint {
  name: string
  bannerImage?: string
  bannerImages?: string[]
  thumbnailImage?: string
}

const fallbackImage = '/site-assets/logo.gif'
const categoryBlueprintMap = new Map<string, CategoryBlueprint>(
  (categoryBlueprints as CategoryBlueprint[]).map((category) => [category.name, category]),
)

function slugifyCategory(value: string, fallback: string): string {
  const normalized = value.trim().toLowerCase()
  if (!normalized) return fallback
  return normalized
    .replace(/\s+/g, '-')
    .replace(/[^\w\u4e00-\u9fa5-]/g, '')
}

function numericPrice(value: number | null | undefined): number | undefined {
  return typeof value === 'number' && Number.isFinite(value) && value > 0 ? value : undefined
}

function stripHtml(value = ''): string {
  return value
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/\r/g, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

function inferTempZone(shippingType = ''): TempZone {
  if (shippingType.includes('冷凍')) return 'frozen'
  if (shippingType.includes('冷藏')) return 'chilled'
  if (shippingType.includes('產地')) return 'fresh'
  return 'ambient'
}

// Virtual middle categories: rootId → [{name, leafSlugs}]
// Leaf slugs must match slugifyCategory(subcategoryName) from products.json
const VIRTUAL_MIDDLE_CATEGORIES: Record<string, Array<{ name: string; leafSlugs: string[] }>> = {
  '生鮮直送': [
    { name: '新鮮蔬果', leafSlugs: ['新鮮水果', '蛋品根莖蔬果套餐'] },
    { name: '有機糕點', leafSlugs: ['優選蛋糕'] },
  ],
  '冷凍食材': [
    { name: '海鮮肉品', leafSlugs: ['安心水產', '安心肉品'] },
    { name: '即食調理', leafSlugs: ['即食調理', '快速料理'] },
    { name: '蔬食早餐', leafSlugs: ['蔬食', '營養早餐'] },
  ],
  '堅果果乾': [
    { name: '堅果點心', leafSlugs: ['堅果', '果乾'] },
  ],
  '主食雜糧': [
    { name: '米麵雜糧', leafSlugs: ['米', '麵條', '雜糧', '豆類'] },
  ],
  '廚房料理品': [
    { name: '油品調味', leafSlugs: ['油品', '調味品'] },
    { name: '乾貨廚具', leafSlugs: ['乾貨', '鍋具用品'] },
  ],
  '銀髮專區': [
    { name: '銀髮餐食', leafSlugs: ['方便早餐', '晚餐食材', '滋補湯品'] },
    { name: '保健補養', leafSlugs: ['休閒點心', '喝的保養', '保健食品'] },
  ],
}

function findMiddleParentId(rootId: string, leafSlug: string): string {
  const defs = VIRTUAL_MIDDLE_CATEGORIES[rootId]
  if (!defs) return rootId
  for (const def of defs) {
    if (def.leafSlugs.includes(leafSlug)) {
      return `${rootId}-${slugifyCategory(def.name, def.name)}`
    }
  }
  return rootId
}

function buildImportedCategories(products: ImportedProduct[]): Category[] {
  const categories: Category[] = []
  const byId = new Set<string>()
  const rootIcons = new Map<string, string>()

  // Pass 1: root categories + their virtual middle children
  products.forEach((product, index) => {
    const categoryName = product.categoryName || '全部商品'
    const categoryId = slugifyCategory(categoryName, `category-${index + 1}`)
    if (byId.has(categoryId)) return
    byId.add(categoryId)
    const icon = product.mainImageUrl || fallbackImage
    const blueprint = categoryBlueprintMap.get(categoryName)
    rootIcons.set(categoryId, icon)
    categories.push({
      id: categoryId, name: categoryName, slug: categoryId,
      parentId: null,
      sortOrder: (categories.length + 1) * 10,
      icon,
      bannerImage: blueprint?.bannerImage,
      bannerImages: blueprint?.bannerImages,
      thumbnailImage: blueprint?.thumbnailImage,
    })
    const defs = VIRTUAL_MIDDLE_CATEGORIES[categoryId]
    if (!defs) return
    for (const def of defs) {
      const midSlug = slugifyCategory(def.name, def.name)
      const midId = `${categoryId}-${midSlug}`
      if (byId.has(midId)) continue
      byId.add(midId)
      categories.push({
        id: midId, name: def.name, slug: midSlug,
        parentId: categoryId,
        sortOrder: (categories.length + 1) * 10,
        icon,
        bannerImage: blueprint?.bannerImage,
        bannerImages: blueprint?.bannerImages,
        thumbnailImage: blueprint?.thumbnailImage,
      })
    }
  })

  // Pass 2: leaf subcategories, reparented to middle if defined
  products.forEach((product, index) => {
    const categoryName = product.categoryName || '全部商品'
    const categoryId = slugifyCategory(categoryName, `category-${index + 1}`)
    const subcategoryName = product.subcategoryName && product.subcategoryName !== categoryName
      ? product.subcategoryName : ''
    if (!subcategoryName) return
    const bareSlug = slugifyCategory(subcategoryName, `subcategory-${index + 1}`)
    const parentId = findMiddleParentId(categoryId, bareSlug)
    const subcategoryId = `${parentId}-${bareSlug}`
    if (byId.has(subcategoryId)) return
    byId.add(subcategoryId)
    const blueprint = categoryBlueprintMap.get(subcategoryName)
    categories.push({
      id: subcategoryId, name: subcategoryName, slug: bareSlug,
      parentId, sortOrder: (categories.length + 1) * 10,
      icon: product.mainImageUrl || fallbackImage,
      bannerImage: blueprint?.bannerImage,
      bannerImages: blueprint?.bannerImages,
      thumbnailImage: blueprint?.thumbnailImage,
    })
  })

  return categories
}

function categoryIdFor(product: ImportedProduct): string {
  const categoryName = product.categoryName || '全部商品'
  const categoryId = slugifyCategory(categoryName, 'category')
  const subcategoryName = product.subcategoryName && product.subcategoryName !== categoryName
    ? product.subcategoryName : ''
  if (!subcategoryName) return categoryId
  const bareSlug = slugifyCategory(subcategoryName, 'subcategory')
  const parentId = findMiddleParentId(categoryId, bareSlug)
  return `${parentId}-${bareSlug}`
}

function mapImportedProduct(product: ImportedProduct, index: number): Product {
  const originalPrice = numericPrice(product.listPrice)
  const memberPrice = numericPrice(product.memberPrice)
  const price = memberPrice || originalPrice || 0
  const description = stripHtml(product.shortDescription || product.productDescription || '')
  const images = [
    product.mainImageUrl || fallbackImage,
    ...(product.galleryImageUrls || []),
  ].filter(Boolean)

  return {
    id: product.oldProductId,
    productNo: product.productNo,
    name: product.productName,
    description,
    price,
    originalPrice,
    memberPrice,
    unit: '',
    categoryId: categoryIdFor(product),
    tempZone: inferTempZone(product.shippingType),
    image: product.mainImageUrl || fallbackImage,
    images,
    inStock: true,
    isOrganic: /有機/.test(`${product.productName} ${description}`),
    origin: '依商品標示',
    tags: [],
    salesCount: Math.max(0, scrapedProducts.length - index),
    conveniencePickup: Boolean(product.shippingType?.includes('超商')),
    introduction: stripHtml(product.productDescription || ''),
    specs: stripHtml(product.specification || ''),
    productDescriptionHtml: product.productDescription || '',
    specificationHtml: product.specification || '',
  }
}

const importedRawProducts = scrapedProducts as ImportedProduct[]
const importedProducts = importedRawProducts.map(mapImportedProduct)
const importedCategories = buildImportedCategories(importedRawProducts)

const productsModule: Module<ProductsState, any> = {
  namespaced: true,

  state: (): ProductsState => ({
    products:   importedProducts,
    categories: importedCategories,
  }),

  getters: {
    allProducts: (state) => state.products,
    allCategories: (state) => state.categories,

    rootCategories: (state): Category[] =>
      state.categories
        .filter(c => !c.parentId && c.isVisible !== false)
        .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0)),

    categoryById: (state) => (id: string): Category | undefined =>
      state.categories.find(c => c.id === id),

    childrenByCategoryId: (state) => (id: string): Category[] =>
      state.categories
        .filter(c => c.parentId === id && c.isVisible !== false)
        .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0)),

    categoryAncestors: (state) => (id: string): Category[] => {
      const result: Category[] = []
      let current = state.categories.find(c => c.id === id)
      while (current) {
        result.unshift(current)
        current = current.parentId
          ? state.categories.find(c => c.id === current?.parentId)
          : undefined
      }
      return result
    },

    descendantCategoryIds: (state) => (id: string): string[] => {
      const result = new Set<string>([id])
      const collect = (parentId: string) => {
        state.categories
          .filter(c => c.parentId === parentId)
          .forEach((child) => {
            result.add(child.id)
            collect(child.id)
          })
      }
      collect(id)
      return Array.from(result)
    },

    productById: (state) => (id: string): Product | undefined => {
      const normalized = normalizeProductId(id)
      return state.products.find((p) => normalizeProductId(p.id) === normalized)
    },

    relatedProducts: (state) => (categoryId: string, excludeId: string): Product[] =>
      state.products.filter(p => p.categoryId === categoryId && p.id !== excludeId).slice(0, 4),

    filteredAndSorted: (state) =>
      (categoryId: string | null, sortBy: SortOption, searchQuery = ''): Product[] => {
        const collectCategoryIds = (id: string): string[] => {
          const result = new Set<string>([id])
          const collect = (parentId: string) => {
            state.categories
              .filter(c => c.parentId === parentId)
              .forEach((child) => {
                result.add(child.id)
                collect(child.id)
              })
          }
          collect(id)
          return Array.from(result)
        }

        let list = categoryId
          ? state.products.filter(p => collectCategoryIds(categoryId).includes(p.categoryId))
          : [...state.products]

        const query = searchQuery.trim().toLowerCase()
        if (query) {
          list = list.filter((p) =>
            p.name.toLowerCase().includes(query) ||
            p.description.toLowerCase().includes(query) ||
            (p.origin || '').toLowerCase().includes(query) ||
            p.tags.some((tag) => tag.toLowerCase().includes(query))
          )
        }

        switch (sortBy) {
          case 'price_asc':
            list.sort((a, b) => (a.memberPrice ?? a.originalPrice ?? a.price)
                              - (b.memberPrice ?? b.originalPrice ?? b.price))
            break
          case 'price_desc':
            list.sort((a, b) => (b.memberPrice ?? b.originalPrice ?? b.price)
                              - (a.memberPrice ?? a.originalPrice ?? a.price))
            break
          case 'sales':
            list.sort((a, b) => (b.salesCount ?? 0) - (a.salesCount ?? 0))
            break
          case 'latest':
          default:
            // mock 資料以 id 反序模擬最新上架
            list.sort((a, b) => b.id.localeCompare(a.id))
            break
        }
        return list
      },
  },
}

export default productsModule
