import { Module } from 'vuex'
import { Product, Category } from '@/types'
import { mockProducts, mockCategories } from '@/mock/data'

export type SortOption = 'latest' | 'price_asc' | 'price_desc' | 'sales'

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

    categoryById: (state) => (id: string): Category | undefined =>
      state.categories.find(c => c.id === id),

    productById: (state) => (id: string): Product | undefined =>
      state.products.find(p => p.id === id),

    relatedProducts: (state) => (categoryId: string, excludeId: string): Product[] =>
      state.products.filter(p => p.categoryId === categoryId && p.id !== excludeId).slice(0, 4),

    filteredAndSorted: (state) =>
      (categoryId: string | null, sortBy: SortOption, searchQuery = ''): Product[] => {
        let list = categoryId
          ? state.products.filter(p => p.categoryId === categoryId)
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
