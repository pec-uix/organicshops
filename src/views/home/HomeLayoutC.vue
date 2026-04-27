<template>
  <div class="home-layout-c bg-white min-h-screen flex flex-col">
    <main class="flex-1 max-w-[1440px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8 flex flex-col md:flex-row gap-6 md:gap-8">
      <div class="md:hidden overflow-x-auto flex space-x-2 py-3 scrollbar-hide border-b border-gray-100 sticky top-0 bg-white z-20">
        <button
          v-for="cat in navCategories"
          :key="'mob-' + cat.id"
          type="button"
          @click="handleCategoryClick(cat.id)"
          class="flex items-center px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-colors"
          :class="activeCategory === cat.id ? 'bg-[#E8F5E8] text-[#5B8E3D] border border-[#5B8E3D]' : 'bg-gray-50 text-gray-600 border border-gray-200'"
        >
          <span class="mr-1 text-lg">{{ categoryEmoji(cat.id) }}</span>
          {{ cat.name }}
        </button>
      </div>

      <aside class="hidden md:block w-64 shrink-0 self-start sticky top-24 bg-white border border-gray-100 shadow-sm rounded-xl p-4">
        <h3 class="text-[#5B8E3D] font-bold text-lg mb-4 px-2 tracking-wide">分類導覽</h3>
        <nav class="flex flex-col space-y-1">
          <button
            v-for="cat in navCategories"
            :key="'desk-' + cat.id"
            type="button"
            @click="handleCategoryClick(cat.id)"
            class="flex items-center w-full px-4 py-3 rounded-lg text-left font-medium transition-all duration-200"
            :class="activeCategory === cat.id ? 'bg-[#E8F5E8] text-[#5B8E3D] border-l-4 border-[#5B8E3D]' : 'text-gray-700 border-l-4 border-transparent hover:bg-gray-50'"
          >
            <span class="text-xl w-8">{{ categoryEmoji(cat.id) }}</span>
            <span class="text-[15px]">{{ cat.name }}</span>
          </button>
        </nav>
      </aside>

      <div class="flex-1 min-w-0 flex flex-col gap-12 pb-12">
        <section class="relative w-full rounded-2xl overflow-hidden aspect-[16/8] md:aspect-[16/7] bg-[#E8F5E8] shadow-sm group">
          <transition name="hero-fade" mode="out-in">
            <div :key="currentHero.id" class="absolute inset-0">
              <img :src="currentHeroVisual" :alt="currentHero.title" class="absolute inset-0 w-full h-full object-cover mix-blend-multiply opacity-90" />
              <div class="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent"></div>

              <div class="absolute inset-0 p-6 md:p-8 lg:p-12 flex flex-col justify-center w-full md:w-2/3">
                <div class="inline-flex items-center rounded-full bg-white/20 backdrop-blur px-4 py-1 text-white text-xs font-bold tracking-[0.24em] w-fit mb-4">
                  {{ currentHero.tag }}
                </div>
                <h2 class="text-white text-3xl md:text-[44px] font-extrabold leading-snug drop-shadow-md mb-4" v-html="formatHeroTitle(currentHero.title)"></h2>
                <p class="text-white text-base md:text-xl drop-shadow mb-8">{{ currentHero.subtitle }}</p>
                <router-link
                  :to="currentHero.to"
                  class="w-fit bg-[#5B8E3D] hover:bg-[#4A7532] text-white font-bold py-3 px-8 rounded-full flex items-center shadow-lg transition-transform hover:scale-105"
                >
                  {{ currentHero.cta }}
                  <svg class="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                  </svg>
                </router-link>
              </div>
            </div>
          </transition>

          <div class="absolute bottom-4 right-6 flex space-x-2 z-10">
            <button
              v-for="(slide, index) in heroSlides"
              :key="slide.id"
              type="button"
              class="w-3 h-3 rounded-full shadow-sm transition-colors"
              :class="index === currentHeroIndex ? 'bg-white' : 'bg-white/50 hover:bg-white/80'"
              @click="goToHeroSlide(index)"
            ></button>
          </div>
        </section>

        <section class="rounded-xl overflow-hidden border border-gray-200 shadow-sm">
          <div class="bg-[#2D6A2D] flex flex-col md:flex-row justify-between items-start md:items-center p-4 md:px-6">
            <div class="flex items-center gap-3 mb-3 md:mb-0">
              <span class="text-white font-bold text-xl md:text-2xl tracking-wider">TODAY DEAL</span>
              <span class="text-green-100 text-sm">今日限時搶購</span>
            </div>
            <div class="flex items-center">
              <span class="text-white text-sm mr-3 font-medium">倒數中</span>
              <div class="flex items-center text-[#E8A020] font-mono font-bold text-[36px] md:text-[52px] leading-none">
                <div class="bg-gray-900 px-2 py-1 md:py-2 rounded-md mx-0.5 shadow-inner">{{ timer.h1 }}</div>
                <div class="bg-gray-900 px-2 py-1 md:py-2 rounded-md mx-0.5 shadow-inner">{{ timer.h2 }}</div>
                <span class="text-white text-2xl mx-1 animate-pulse pb-2">:</span>
                <div class="bg-gray-900 px-2 py-1 md:py-2 rounded-md mx-0.5 shadow-inner">{{ timer.m1 }}</div>
                <div class="bg-gray-900 px-2 py-1 md:py-2 rounded-md mx-0.5 shadow-inner">{{ timer.m2 }}</div>
                <span class="text-white text-2xl mx-1 animate-pulse pb-2">:</span>
                <div class="bg-gray-900 px-2 py-1 md:py-2 rounded-md mx-0.5 shadow-inner">{{ timer.s1 }}</div>
                <div class="bg-gray-900 px-2 py-1 md:py-2 rounded-md mx-0.5 shadow-inner text-red-400">{{ timer.s2 }}</div>
              </div>
            </div>
          </div>
          <div class="bg-white p-4 md:p-6 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            <MiniProductCard v-for="product in flashSales" :key="'flash-' + product.id" :product="product" :is-flash="true" />
          </div>
        </section>

        <section class="rounded-2xl p-4 md:p-8 bg-[#F7F5F0] border border-[#E8F5E8] shadow-sm">
          <div class="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6">
            <div class="flex items-center">
              <div class="w-1 h-8 bg-[#5B8E3D] rounded-full mr-3"></div>
              <div>
                <h3 class="text-2xl font-bold text-gray-800">先逛商品，再進分類</h3>
                <p class="text-sm text-gray-500 mt-1">
                  目前預覽：
                  <span class="font-bold text-[#5B8E3D]">{{ activeCategorySection ? activeCategorySection.title : '精選商品' }}</span>
                </p>
              </div>
            </div>
            <router-link
              v-if="activeCategorySection"
              :to="`/category/${activeCategorySection.id}`"
              class="group px-4 py-2 rounded-full border border-[#5B8E3D] text-[#5B8E3D] hover:bg-[#5B8E3D] hover:text-white transition-all text-sm font-medium flex items-center w-fit"
            >
              進入這個分類
              <svg class="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
              </svg>
            </router-link>
          </div>

          <div class="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            <MiniProductCard
              v-for="product in previewProducts"
              :key="'preview-' + product.id"
              :product="product"
            />
          </div>
        </section>

        <hr class="border-gray-100">

        <section
          v-for="(section, index) in categorySections"
          :id="`section-${section.id}`"
          :key="'sec-' + section.id"
          class="rounded-2xl p-4 md:p-8 scroll-mt-28"
          :class="index % 2 === 0 ? 'bg-white border border-gray-100 shadow-sm' : 'bg-[#F7F5F0]'"
        >
          <div class="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)] lg:items-start">
            <div class="rounded-2xl border border-[#5B8E3D]/10 bg-white/80 p-5 md:p-6">
              <div class="flex items-center">
                <div class="w-1 h-8 bg-[#5B8E3D] rounded-full mr-3"></div>
                <div>
                  <h3 class="text-2xl font-bold text-gray-800">{{ section.title }}</h3>
                  <p class="text-sm text-gray-500 mt-1">{{ section.subtitle }}</p>
                </div>
              </div>
              <p class="mt-5 text-sm leading-7 text-gray-500">
                精選 {{ section.title }} 人氣品項，讓使用者在進入完整分類前先快速看到代表商品。
              </p>
              <router-link
                :to="`/category/${section.id}`"
                class="group mt-6 inline-flex px-4 py-2 rounded-full border border-[#5B8E3D] text-[#5B8E3D] hover:bg-[#5B8E3D] hover:text-white transition-all text-sm font-medium items-center"
              >
                查看全部
                <svg class="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
                </svg>
              </router-link>
            </div>

            <div class="rounded-2xl border border-gray-100 bg-white p-4 md:p-5 shadow-sm">
              <div class="mb-5">
                <p class="text-xs font-bold tracking-[0.2em] text-[#5B8E3D]">CATEGORY PICKS</p>
              </div>

              <div class="grid grid-cols-1 xl:grid-cols-2 gap-4">
                <router-link
                  v-for="product in section.products.slice(0, 3)"
                  :key="'prod-inline-' + section.id + '-' + product.id"
                  :to="'/products/' + product.id"
                  class="group flex items-start gap-4 rounded-2xl border border-gray-100 bg-[#FCFCFA] p-4 transition-all duration-300 hover:-translate-y-1 hover:border-[#5B8E3D]/30 hover:shadow-md"
                >
                  <div class="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-white">
                    <img :src="product.image" :alt="product.name" class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    <div class="absolute left-2 top-2 flex flex-wrap gap-1">
                      <span class="rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-bold text-[#5B8E3D]">{{ tempZoneLabel(product.tempZone) }}</span>
                    </div>
                  </div>

                  <div class="min-w-0 flex-1">
                    <h4 class="line-clamp-2 text-base font-bold leading-6 text-gray-800 group-hover:text-[#5B8E3D]">
                      {{ product.name }}
                    </h4>
                    <p class="mt-1 line-clamp-2 text-xs leading-5 text-gray-500">
                      {{ product.description }}
                    </p>
                    <div class="mt-3 flex items-end justify-between gap-3">
                      <div class="min-w-0">
                        <div class="text-xs text-gray-400 line-through">
                          NT$ {{ Math.round(product.originalPrice || product.price).toLocaleString() }}
                        </div>
                        <div class="text-lg font-black text-[#5B8E3D]">
                          NT$ {{ Math.round(product.memberPrice || product.price).toLocaleString() }}
                        </div>
                      </div>
                      <span class="shrink-0 rounded-full bg-[#E8F5E8] px-3 py-2 text-xs font-bold text-[#5B8E3D] transition-colors group-hover:bg-[#5B8E3D] group-hover:text-white">
                        加入購物車
                      </span>
                    </div>
                  </div>
                </router-link>
              </div>
            </div>
          </div>
        </section>

        <hr class="border-gray-100">

        <section class="py-4">
          <h3 class="text-xl font-bold text-gray-800 mb-6 flex items-center">
            <svg class="w-6 h-6 mr-2 text-[#5B8E3D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
            熱門搜尋關鍵字
          </h3>
          <div class="flex flex-wrap gap-3">
            <router-link
              v-for="(keyword, idx) in hotSearches"
              :key="'kw-' + idx"
              :to="{ path: '/search', query: { q: keyword } }"
              class="px-5 py-2 rounded-full bg-[#E8F5E8] text-[#5B8E3D] font-medium transition-colors duration-200 hover:bg-[#5B8E3D] hover:text-white text-sm"
            >
              # {{ keyword }}
            </router-link>
          </div>
        </section>
      </div>
    </main>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { mockCategories, mockHomeLayouts, mockProducts } from '@/mock/data'
import { Product, TEMP_ZONE_LABEL, TempZone } from '@/types'

const MiniProductCard = Vue.extend({
  name: 'MiniProductCard',
  props: {
    product: { type: Object, required: true },
    isFlash: { type: Boolean, default: false },
  },
  methods: {
    tempZoneLabel(zone: TempZone) {
      return TEMP_ZONE_LABEL[zone]
    },
    currentPrice(product: Product) {
      return product.memberPrice || product.price
    },
  },
  template: `
    <router-link
      :to="'/products/' + product.id"
      class="group bg-white rounded-xl overflow-hidden border border-gray-100 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg relative flex flex-col h-full cursor-pointer"
    >
      <div v-if="isFlash" class="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-bl-xl rounded-tr-xl z-10 shadow-sm">
        🔥 省很大
      </div>
      <div class="absolute top-2 left-2 flex gap-1 z-10">
        <span class="text-[10px] px-1.5 py-0.5 rounded bg-green-100 text-green-700">{{ tempZoneLabel(product.tempZone) }}</span>
        <span v-if="product.isOrganic" class="text-[10px] px-1.5 py-0.5 rounded bg-white/90 text-[#5B8E3D]">有機</span>
      </div>
      <div class="aspect-square bg-gray-50 overflow-hidden relative">
        <img :src="product.image" :alt="product.name" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
      </div>
      <div class="p-4 flex flex-col flex-1">
        <h4 class="text-[15px] text-gray-800 mb-1 line-clamp-2 leading-tight flex-1">{{ product.name }}</h4>
        <div class="mt-2 flex items-baseline gap-2">
          <span class="text-xs text-gray-400 line-through">NT$ {{ Math.round(product.originalPrice || product.price).toLocaleString() }}</span>
          <span class="text-lg font-bold text-red-500">NT$ {{ Math.round(currentPrice(product)).toLocaleString() }}</span>
        </div>
        <span class="mt-3 w-full bg-[#E8F5E8] text-[#5B8E3D] group-hover:bg-[#5B8E3D] group-hover:text-white py-2 rounded-lg text-sm font-bold transition-colors text-center">
          加入購物車
        </span>
      </div>
    </router-link>
  `,
})

type LayoutHero = {
  id: string
  tag: string
  title: string
  subtitle: string
  image: string
  cta: string
  to: string
}

type CategorySection = {
  id: string
  title: string
  subtitle: string
  products: Product[]
}

export default Vue.extend({
  name: 'HomeLayoutC',
  components: { MiniProductCard },
  data() {
    return {
      activeCategory: 'fresh',
      currentHeroIndex: 0,
      heroTimer: null as number | null,
      countdownInterval: null as number | null,
      timeLeft: 0,
      timer: { h1: '0', h2: '0', m1: '0', m2: '0', s1: '0', s2: '0' },
    }
  },
  computed: {
    navCategories() {
      return mockHomeLayouts.c.sideCategoryIds
        .map((id) => mockCategories.find((category) => category.id === id))
        .filter(Boolean)
    },
    heroSlides(): LayoutHero[] {
      return mockHomeLayouts.c.heroSlides as LayoutHero[]
    },
    currentHero(): LayoutHero {
      return this.heroSlides[this.currentHeroIndex]
    },
    currentHeroVisual(): string {
      return this.heroVisual(this.currentHero.id)
    },
    flashSales(): Product[] {
      return mockHomeLayouts.c.flashSaleProductIds
        .map((id) => mockProducts.find((product) => product.id === id))
        .filter(Boolean) as Product[]
    },
    categorySections(): CategorySection[] {
      return mockHomeLayouts.c.sections.map((section) => ({
        id: section.id,
        title: section.title,
        subtitle: section.subtitle,
        products: section.productIds
          .map((id) => mockProducts.find((product) => product.id === id))
          .filter(Boolean) as Product[],
      }))
    },
    activeCategorySection(): CategorySection | null {
      return this.categorySections.find((section) => section.id === this.activeCategory) || this.categorySections[0] || null
    },
    previewProducts(): Product[] {
      return this.activeCategorySection?.products || this.flashSales
    },
    hotSearches(): string[] {
      return mockHomeLayouts.c.hotKeywords
    },
  },
  mounted() {
    this.timeLeft = this.parseCountdown(mockHomeLayouts.c.countdown)
    this.updateTimerDisplay()
    this.startCountdown()
    this.startHeroTimer()
  },
  beforeDestroy() {
    if (this.countdownInterval) window.clearInterval(this.countdownInterval)
    if (this.heroTimer) window.clearInterval(this.heroTimer)
  },
  methods: {
    tempZoneLabel(zone: TempZone) {
      return TEMP_ZONE_LABEL[zone]
    },
    categoryEmoji(categoryId: string): string {
      const emojiMap: Record<string, string> = {
        fresh: '🥦',
        frozen: '❄️',
        nuts: '🥜',
        grains: '🍚',
        pantry: '🍳',
        elderly: '👵',
        beverage: '🥤',
      }
      return emojiMap[categoryId] || '🛒'
    },
    heroVisual(heroId: string): string {
      if (heroId === 'layout-c-hero-1') return mockCategories.find((category) => category.id === 'fresh')?.icon || this.currentHero.image
      if (heroId === 'layout-c-hero-2') return mockCategories.find((category) => category.id === 'nuts')?.icon || this.currentHero.image
      if (heroId === 'layout-c-hero-3') return mockCategories.find((category) => category.id === 'beverage')?.icon || this.currentHero.image
      return this.currentHero.image
    },
    formatHeroTitle(title: string): string {
      return title.replace(/\n/g, '<br>')
    },
    handleCategoryClick(categoryId: string) {
      this.activeCategory = categoryId
      const target = this.$el.querySelector(`#section-${categoryId}`) as HTMLElement | null
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    },
    parseCountdown(value: string): number {
      const [hours, minutes, seconds] = value.split(':').map(Number)
      return (hours || 0) * 3600 + (minutes || 0) * 60 + (seconds || 0)
    },
    updateTimerDisplay() {
      const hours = Math.floor(this.timeLeft / 3600).toString().padStart(2, '0')
      const minutes = Math.floor((this.timeLeft % 3600) / 60).toString().padStart(2, '0')
      const seconds = (this.timeLeft % 60).toString().padStart(2, '0')
      this.timer = {
        h1: hours[0],
        h2: hours[1],
        m1: minutes[0],
        m2: minutes[1],
        s1: seconds[0],
        s2: seconds[1],
      }
    },
    startCountdown() {
      this.countdownInterval = window.setInterval(() => {
        if (this.timeLeft > 0) {
          this.timeLeft -= 1
          this.updateTimerDisplay()
        }
      }, 1000)
    },
    startHeroTimer() {
      if (this.heroTimer) window.clearInterval(this.heroTimer)
      this.heroTimer = window.setInterval(() => {
        this.nextHeroSlide()
      }, 5000)
    },
    nextHeroSlide() {
      this.currentHeroIndex = (this.currentHeroIndex + 1) % this.heroSlides.length
      this.startHeroTimer()
    },
    goToHeroSlide(index: number) {
      this.currentHeroIndex = index
      this.startHeroTimer()
    },
  },
})
</script>

<style scoped>
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.hero-fade-enter-active,
.hero-fade-leave-active {
  transition: opacity 0.35s ease, transform 0.35s ease;
}

.hero-fade-enter,
.hero-fade-leave-to {
  opacity: 0;
  transform: scale(0.985);
}
</style>
