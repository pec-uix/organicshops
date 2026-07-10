import { Module } from 'vuex'
import { Product, Category } from '@/types'
import { mockProducts, mockCategories } from '@/mock/data'

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

const productsModule: Module<ProductsState, any> = {
  namespaced: true,

  state: (): ProductsState => ({
    products:   mockProducts,
    categories: mockCategories,
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
            p.origin.toLowerCase().includes(query) ||
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
