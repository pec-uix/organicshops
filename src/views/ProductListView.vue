<template>
  <div class="bg-white min-h-screen">
    <div class="max-w-7xl mx-auto px-4 py-8">
      <!-- ── Breadcrumb ── -->
      <nav class="flex items-center gap-1.5 text-[11px] text-gray-400 mb-6 font-bold uppercase tracking-wider">
        <router-link to="/" class="hover:text-brand-primary">首頁</router-link>
        <span>›</span>
        <span class="text-gray-800">{{ breadcrumbLabel }}</span>
      </nav>

      <!-- ── Header & Switcher ── -->
      <div class="flex flex-wrap items-center justify-between gap-4 mb-8 pb-4 border-b border-gray-100">
        <div>
          <h1 class="text-2xl font-black text-brand-dark tracking-tight">
            {{ pageTitle }}
          </h1>
          <p class="text-[10px] text-gray-400 font-bold uppercase mt-1">
            {{ activeSummary }}
          </p>
        </div>

        <div v-if="totalCount > 0" class="flex items-center gap-6">
          <!-- View Switcher -->
          <div class="flex items-center bg-gray-100 p-1 rounded-md shadow-inner">
            <button
              @click="viewMode = 'grid'"
              class="p-1.5 rounded transition-all"
              :class="viewMode === 'grid' ? 'bg-white shadow-sm text-brand-primary' : 'text-gray-400 hover:text-gray-600'"
            >
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2z" />
              </svg>
            </button>
            <button
              @click="viewMode = 'list'"
              class="p-1.5 rounded transition-all"
              :class="viewMode === 'list' ? 'bg-white shadow-sm text-brand-primary' : 'text-gray-400 hover:text-gray-600'"
            >
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>

          <!-- Sort -->
          <div class="flex items-center gap-2">
            <label class="text-[10px] font-black text-gray-400 tracking-tighter">排序方式</label>
            <select
              v-model="sortBy"
              class="text-xs border-0 bg-transparent font-black text-brand-primary focus:ring-0 cursor-pointer"
            >
              <option v-for="opt in sortOptions" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
            </select>
          </div>
        </div>
      </div>

      <!-- ── Filter Toggle ── -->
      <div class="mb-8 rounded-2xl border border-gray-100 bg-brand-bg/40 p-4">
        <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div class="flex flex-wrap items-center gap-3">
            <button
              class="inline-flex items-center gap-2 rounded-xl border border-brand-primary/20 bg-white px-4 py-2.5 text-sm font-black text-brand-primary transition-all hover:bg-brand-surface"
              @click="filtersOpen = !filtersOpen"
            >
              <span>{{ filtersOpen ? '收合篩選' : '展開篩選' }}</span>
              <span v-if="activeFilterCount > 0" class="rounded-full bg-brand-primary px-2 py-0.5 text-[10px] font-black text-white">
                {{ activeFilterCount }}
              </span>
            </button>
            <button
              v-if="searchQuery || activeFilterCount > 0"
              class="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-xs font-black text-gray-500 transition-all hover:border-brand-primary hover:text-brand-primary"
              @click="clearAllFilters"
            >
              清除全部條件
            </button>
          </div>
          <p class="text-sm text-gray-400">
            {{ activeFilterSummary }}
          </p>
        </div>

        <div v-if="activeFilterChips.length" class="mt-4 flex flex-wrap gap-2">
          <span
            v-for="chip in activeFilterChips"
            :key="chip.key"
            class="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-[11px] font-bold text-brand-primary border border-brand-primary/10"
          >
            <span>{{ chip.label }}</span>
            <button
              type="button"
              class="flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-black text-gray-400 hover:bg-gray-100 hover:text-gray-700"
              :aria-label="`移除 ${chip.label}`"
              @click="removeFilter(chip.type)"
            >
              ×
            </button>
          </span>
        </div>

        <div v-if="filtersOpen" class="mt-4 space-y-4 border-t border-gray-100 pt-4">
          <div class="flex flex-wrap gap-2">
            <button
              class="px-4 py-2 rounded-full text-xs font-black transition-all"
              :class="!selectedCategoryId ? 'bg-brand-primary text-white' : 'bg-white text-gray-500 border border-gray-200 hover:border-brand-primary hover:text-brand-primary'"
              @click="selectCategory(null)"
            >
              全部分類
            </button>
            <button
              v-for="cat in categories"
              :key="cat.id"
              class="px-4 py-2 rounded-full text-xs font-black transition-all"
              :class="selectedCategoryId === cat.id ? 'bg-brand-primary text-white' : 'bg-white text-gray-500 border border-gray-200 hover:border-brand-primary hover:text-brand-primary'"
              @click="selectCategory(cat.id)"
            >
              {{ cat.name }}
            </button>
          </div>

          <div class="grid grid-cols-1 gap-4 lg:grid-cols-[2fr_1fr_1fr]">
            <div>
              <p class="mb-2 text-[10px] font-black tracking-[0.25em] text-gray-400">搜尋與標籤</p>
              <div class="flex flex-wrap gap-2">
                <input
                  v-model.trim="localSearch"
                  type="text"
                  placeholder="搜尋商品名稱、產地、標籤"
                  class="min-w-[220px] flex-1 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm focus:border-brand-primary focus:outline-none"
                  @keyup.enter="applySearch"
                />
                <button
                  class="rounded-xl bg-brand-primary px-4 py-2.5 text-xs font-black text-white transition-all hover:bg-brand-dark"
                  @click="applySearch"
                >
                  套用搜尋
                </button>
                <button
                  v-if="searchQuery"
                  class="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-xs font-black text-gray-500 transition-all hover:border-brand-primary hover:text-brand-primary"
                  @click="clearSearch"
                >
                  清除搜尋
                </button>
              </div>
              <div class="mt-3 flex flex-wrap gap-2">
                <button
                  class="px-3 py-1.5 rounded-full text-[11px] font-bold transition-all"
                  :class="!selectedTag ? 'bg-brand-surface text-brand-primary' : 'bg-white text-gray-500 border border-gray-200 hover:border-brand-primary hover:text-brand-primary'"
                  @click="toggleTag('')"
                >
                  全部標籤
                </button>
                <button
                  v-for="tag in availableTags"
                  :key="tag"
                  class="px-3 py-1.5 rounded-full text-[11px] font-bold transition-all"
                  :class="selectedTag === tag ? 'bg-brand-surface text-brand-primary' : 'bg-white text-gray-500 border border-gray-200 hover:border-brand-primary hover:text-brand-primary'"
                  @click="toggleTag(tag)"
                >
                  # {{ tag }}
                </button>
              </div>
            </div>

            <div>
              <p class="mb-2 text-[10px] font-black tracking-[0.25em] text-gray-400">價格篩選</p>
              <select
                v-model="selectedPriceRange"
                class="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm focus:border-brand-primary focus:outline-none"
              >
                <option value="">全部價格</option>
                <option value="0-99">$0 - $99</option>
                <option value="100-299">$100 - $299</option>
                <option value="300-599">$300 - $599</option>
                <option value="600+">$600 以上</option>
              </select>

              <div class="mt-3 flex flex-wrap gap-2">
                <button
                  v-for="zone in tempZones"
                  :key="zone.value"
                  class="px-3 py-1.5 rounded-full text-[11px] font-bold transition-all"
                  :class="selectedTempZone === zone.value ? 'bg-brand-primary text-white' : 'bg-white text-gray-500 border border-gray-200 hover:border-brand-primary hover:text-brand-primary'"
                  @click="toggleTempZone(zone.value)"
                >
                  {{ zone.label }}
                </button>
              </div>
            </div>

            <div>
              <p class="mb-2 text-[10px] font-black tracking-[0.25em] text-gray-400">商品條件</p>
              <div class="space-y-2">
                <label class="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-600">
                  <input v-model="organicOnly" type="checkbox" class="accent-brand-primary" />
                  僅顯示有機認證
                </label>
                <label class="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-600">
                  <input v-model="pickupOnly" type="checkbox" class="accent-brand-primary" />
                  僅顯示可超商取貨
                </label>
                <button
                  class="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-xs font-black text-gray-500 transition-all hover:border-brand-primary hover:text-brand-primary"
                  @click="resetFilters"
                >
                  重設篩選
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ── Product Grid/List ── -->
      <div v-if="totalCount > 0">
        <div
          :class="viewMode === 'grid' ? 'grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4 md:gap-5 xl:gap-6 justify-items-center' : 'flex flex-col gap-4 w-full'"
        >
          <ProductCard
            v-for="product in pagedProducts"
            :key="product.id"
            :product="product"
            :layout="viewMode"
          />
        </div>

        <!-- ── Pagination ── -->
        <div v-if="totalPages > 1" class="flex items-center justify-center gap-2 mt-16">
          <button
            @click="currentPage--"
            :disabled="currentPage === 1"
            class="w-9 h-9 rounded-md border border-gray-100 flex items-center justify-center text-gray-400 hover:text-brand-primary disabled:opacity-30"
          >‹</button>
          <div class="flex items-center gap-1">
            <button
              v-for="page in pageNumbers"
              :key="page"
              class="w-9 h-9 rounded-md text-xs font-black transition-all"
              :class="page === currentPage ? 'bg-brand-primary text-white shadow-md shadow-brand-primary/20' : 'text-gray-400 hover:bg-gray-50'"
              @click="typeof page === 'number' && (currentPage = page)"
            >{{ page }}</button>
          </div>
          <button
            @click="currentPage++"
            :disabled="currentPage === totalPages"
            class="w-9 h-9 rounded-md border border-gray-100 flex items-center justify-center text-gray-400 hover:text-brand-primary disabled:opacity-30"
          >›</button>
        </div>
      </div>

      <!-- ── Search Empty State ── -->
      <div v-else class="text-center py-24 flex flex-col items-center">
        <div class="w-32 h-32 bg-gray-50 rounded-full flex items-center justify-center text-6xl mb-8 grayscale opacity-30 shadow-inner">🔍</div>
        <h2 class="text-2xl font-black text-gray-800 mb-2">抱歉，找不到相關商品</h2>
        <p class="text-sm text-gray-400 mb-12 max-w-xl mx-auto font-medium leading-relaxed">
          請嘗試更換關鍵字搜尋，或瀏覽下方的為您推薦商品。
        </p>
        
        <div class="w-full border-t border-gray-100 pt-16">
          <h3 class="text-lg font-black text-brand-primary mb-8">為您推薦的商品</h3>
          <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            <ProductCard
              v-for="product in recommendedProducts"
              :key="'rec-'+product.id"
              :product="product"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Category, Product, TempZone } from '@/types'
import { SortOption } from '@/store/modules/products'
import ProductCard from '@/components/product/ProductCard.vue'
import { mockProducts } from '@/mock/data'

export default Vue.extend({
  name: 'ProductListView',
  components: { ProductCard },
  data() {
    const routeCategoryId = (this.$route.params.categoryId as string) || ''
    return {
      sortBy: 'latest' as SortOption,
      viewMode: 'grid' as 'grid' | 'list',
      currentPage: 1,
      pageSize: 12,
      localSearch: '',
      filtersOpen: false,
      selectedCategoryId: routeCategoryId,
      selectedTag: '',
      selectedPriceRange: '',
      selectedTempZone: '' as TempZone | '',
      organicOnly: false,
      pickupOnly: false,
      sortOptions: [
        { value: 'latest',     label: '最新上架' },
        { value: 'price_asc',  label: '價格：低到高' },
        { value: 'price_desc', label: '價格：高到低' },
        { value: 'sales',      label: '熱銷排行' },
      ],
      tempZones: [
        { value: 'ambient', label: '常溫' },
        { value: 'chilled', label: '冷藏' },
        { value: 'frozen',  label: '冷凍' },
        { value: 'fresh',   label: '產地直送' },
      ] as { value: TempZone; label: string }[],
    }
  },
  computed: {
    routeCategoryId(): string | null { return (this.$route.params.categoryId as string) || null },
    searchQuery(): string { return (this.$route.query.q as string) || '' },
    categories(): Category[] {
      return this.$store.getters['products/allCategories']
    },
    currentCategory(): Category | undefined {
      return this.selectedCategoryId
        ? this.$store.getters['products/categoryById'](this.selectedCategoryId)
        : undefined
    },
    pageTitle(): string {
      if (this.searchQuery) return `搜尋「${this.searchQuery}」`
      if (this.currentCategory) return this.currentCategory.name
      return '全部商品'
    },
    breadcrumbLabel(): string {
      if (this.searchQuery) return '搜尋結果'
      if (this.currentCategory) return this.currentCategory.name
      return '全部商品'
    },
    activeSummary(): string {
      const parts = [`共 ${this.totalCount} 件商品`]
      if (this.searchQuery) parts.push(`關鍵字：${this.searchQuery}`)
      if (this.selectedTag) parts.push(`標籤：#${this.selectedTag}`)
      if (this.selectedTempZone) {
        const zone = this.tempZones.find((item) => item.value === this.selectedTempZone)
        if (zone) parts.push(`溫層：${zone.label}`)
      }
      return parts.join(' ｜ ')
    },
    activeFilterCount(): number {
      return [
        !!this.selectedCategoryId,
        !!this.searchQuery,
        !!this.selectedTag,
        !!this.selectedPriceRange,
        !!this.selectedTempZone,
        this.organicOnly,
        this.pickupOnly,
      ].filter(Boolean).length
    },
    activeFilterChips(): Array<{ key: string; label: string; type: string }> {
      const chips: Array<{ key: string; label: string; type: string }> = []
      if (this.currentCategory) chips.push({ key: 'category', label: `分類：${this.currentCategory.name}`, type: 'category' })
      if (this.searchQuery) chips.push({ key: 'search', label: `搜尋：${this.searchQuery}`, type: 'search' })
      if (this.selectedTag) chips.push({ key: 'tag', label: `標籤：#${this.selectedTag}`, type: 'tag' })
      if (this.selectedPriceRange) chips.push({ key: 'price', label: `價格：${this.selectedPriceRange}`, type: 'price' })
      if (this.selectedTempZone) {
        const zone = this.tempZones.find((item) => item.value === this.selectedTempZone)
        if (zone) chips.push({ key: 'temp', label: `溫層：${zone.label}`, type: 'temp' })
      }
      if (this.organicOnly) chips.push({ key: 'organic', label: '有機認證', type: 'organic' })
      if (this.pickupOnly) chips.push({ key: 'pickup', label: '可超商取貨', type: 'pickup' })
      return chips
    },
    activeFilterSummary(): string {
      if (!this.searchQuery && this.activeFilterCount === 0) return '需要時再展開篩選即可'
      return `目前已套用 ${this.activeFilterCount + (this.searchQuery ? 0 : 0)} 個條件`
    },
    baseFiltered(): Product[] {
      return this.$store.getters['products/filteredAndSorted'](this.selectedCategoryId, this.sortBy, this.searchQuery)
    },
    availableTags(): string[] {
      return Array.from(new Set(this.baseFiltered.flatMap((product: Product) => product.tags))).slice(0, 8)
    },
    allFiltered(): Product[] {
      return this.baseFiltered.filter((product: Product) => {
        if (this.selectedTag && !product.tags.includes(this.selectedTag)) return false
        if (this.selectedTempZone && product.tempZone !== this.selectedTempZone) return false
        if (this.organicOnly && !product.isOrganic) return false
        if (this.pickupOnly && !product.conveniencePickup) return false

        const price = product.memberPrice ?? product.originalPrice ?? product.price
        if (this.selectedPriceRange === '0-99' && !(price <= 99)) return false
        if (this.selectedPriceRange === '100-299' && !(price >= 100 && price <= 299)) return false
        if (this.selectedPriceRange === '300-599' && !(price >= 300 && price <= 599)) return false
        if (this.selectedPriceRange === '600+' && !(price >= 600)) return false

        return true
      })
    },
    totalCount(): number { return this.allFiltered.length },
    totalPages(): number { return Math.max(1, Math.ceil(this.totalCount / this.pageSize)) },
    pagedProducts(): Product[] { return this.allFiltered.slice((this.currentPage - 1) * this.pageSize, this.currentPage * this.pageSize) },
    recommendedProducts(): Product[] { return mockProducts.slice(0, 6) },
    pageNumbers(): (number | '…')[] {
      const total = this.totalPages; const cur = this.currentPage
      if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
      const pages: (number | '…')[] = [1]
      if (cur > 3) pages.push('…')
      for (let p = Math.max(2, cur - 1); p <= Math.min(total - 1, cur + 1); p++) pages.push(p)
      if (cur < total - 2) pages.push('…')
      pages.push(total)
      return pages
    },
  },
  watch: {
    routeCategoryId(newVal: string | null) {
      this.selectedCategoryId = newVal || ''
      this.currentPage = 1
    },
    sortBy() { this.currentPage = 1 },
    searchQuery() { this.localSearch = this.searchQuery; this.currentPage = 1 },
    selectedTag() { this.currentPage = 1 },
    selectedPriceRange() { this.currentPage = 1 },
    selectedTempZone() { this.currentPage = 1 },
    organicOnly() { this.currentPage = 1 },
    pickupOnly() { this.currentPage = 1 },
    '$route'() { this.currentPage = 1 }
  },
  created() {
    this.localSearch = this.searchQuery
    this.filtersOpen = this.$route.name === 'search' || !!this.searchQuery
    this.selectedCategoryId = this.routeCategoryId || ''
  },
  methods: {
    selectCategory(categoryId: string | null) {
      const nextCategoryId = categoryId && this.selectedCategoryId === categoryId ? '' : (categoryId || '')
      this.selectedCategoryId = nextCategoryId
      const path = nextCategoryId ? `/category/${nextCategoryId}` : '/products'
      this.$router.push({ path, query: this.searchQuery ? { q: this.searchQuery } : undefined }).catch(() => {})
    },
    applySearch() {
      const trimmed = this.localSearch.trim()
      const targetPath = this.selectedCategoryId ? `/category/${this.selectedCategoryId}` : '/products'
      this.$router.push({ path: targetPath, query: trimmed ? { q: trimmed } : undefined }).catch(() => {})
    },
    clearSearch() {
      this.localSearch = ''
      const targetPath = this.selectedCategoryId ? `/category/${this.selectedCategoryId}` : '/products'
      this.$router.push({ path: targetPath }).catch(() => {})
    },
    toggleTag(tag: string) {
      this.selectedTag = this.selectedTag === tag ? '' : tag
    },
    toggleTempZone(zone: TempZone) {
      this.selectedTempZone = this.selectedTempZone === zone ? '' : zone
    },
    removeFilter(type: string) {
      if (type === 'category') {
        this.selectCategory(null)
        return
      }
      if (type === 'search') {
        this.clearSearch()
        return
      }
      if (type === 'tag') {
        this.selectedTag = ''
        return
      }
      if (type === 'price') {
        this.selectedPriceRange = ''
        return
      }
      if (type === 'temp') {
        this.selectedTempZone = ''
        return
      }
      if (type === 'organic') {
        this.organicOnly = false
        return
      }
      if (type === 'pickup') {
        this.pickupOnly = false
      }
    },
    resetFilters() {
      this.selectedCategoryId = ''
      this.selectedTag = ''
      this.selectedPriceRange = ''
      this.selectedTempZone = ''
      this.organicOnly = false
      this.pickupOnly = false
    },
    clearAllFilters() {
      this.localSearch = ''
      this.resetFilters()
      this.$router.push({ path: '/products' }).catch(() => {})
    }
  },
})
</script>
