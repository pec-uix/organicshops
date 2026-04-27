<template>
  <div class="min-h-screen bg-brand-bg pb-20">
    <!-- ══ 活動 Banner (Carousel) ══ -->
    <div class="relative w-full h-[240px] lg:h-[400px] overflow-hidden bg-[#F2F7ED]">
      <transition name="banner-fade" mode="out-in">
        <div
          :key="currentBanner.id"
          class="absolute inset-0 flex items-center justify-center text-brand-dark text-center p-8"
          :style="{ background: currentBanner.bg }"
        >
          <div class="max-w-4xl animate-fade-in relative z-10">
            <p class="text-brand-primary font-sans font-black tracking-[0.4em] uppercase mb-4 text-xs lg:text-sm">{{ currentBanner.tag }}</p>
            <h2 class="text-4xl lg:text-6xl font-serif font-black mb-6 leading-tight tracking-widest text-brand-dark">
              {{ currentBanner.title }}
            </h2>
            <p class="text-brand-accent text-sm lg:text-lg font-serif italic tracking-widest bg-white/60 inline-block px-6 py-2 rounded-full shadow-sm border border-brand-accent/20">
              {{ currentBanner.subtitle }}
            </p>
          </div>
          <div class="absolute -right-20 top-0 w-64 h-full bg-brand-primary opacity-5"></div>
          <div class="absolute -left-20 bottom-0 w-40 h-full bg-brand-accent opacity-5"></div>
        </div>
      </transition>

      <button
        type="button"
        aria-label="上一張活動 Banner"
        class="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white/90 text-brand-dark shadow-lg flex items-center justify-center hover:bg-white transition-colors"
        @click="prevBanner"
      >
        <span class="text-xl leading-none">‹</span>
      </button>
      <button
        type="button"
        aria-label="下一張活動 Banner"
        class="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white/90 text-brand-dark shadow-lg flex items-center justify-center hover:bg-white transition-colors"
        @click="nextBanner"
      >
        <span class="text-xl leading-none">›</span>
      </button>

      <div class="absolute bottom-4 left-0 right-0 z-20 flex justify-center gap-2">
        <button
          v-for="(banner, index) in banners"
          :key="banner.id"
          type="button"
          class="h-2.5 rounded-full transition-all duration-300"
          :class="index === currentBannerIndex ? 'w-8 bg-white shadow-md' : 'w-2.5 bg-white/60 hover:bg-white/80'"
          :aria-label="`切換到第 ${index + 1} 張活動 Banner`"
          @click="goToBanner(index)"
        />
      </div>
    </div>

    <!-- ══ 活動分類 Tab ══ -->
    <div class="bg-white border-b border-gray-100 sticky top-0 z-20 shadow-sm">
      <div class="max-w-7xl mx-auto px-4 flex overflow-x-auto scrollbar-hide justify-center">
        <button 
          v-for="tab in eventTabs" 
          :key="tab.id"
          @click="activeTab = tab.id"
          class="flex-shrink-0 px-8 py-5 text-sm font-sans font-black transition-all relative whitespace-nowrap tracking-widest"
          :class="activeTab === tab.id ? 'text-brand-primary' : 'text-gray-400 hover:text-brand-primary'"
        >
          {{ tab.label }}
          <div v-if="activeTab === tab.id" class="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-1 bg-brand-primary rounded-t-md"></div>
        </button>
      </div>
    </div>

    <div class="max-w-6xl mx-auto px-8 lg:px-12 pt-12">
      <!-- 限時倒數 -->
      <div v-if="activeTab === 'flash'" class="mb-12 flex flex-col sm:flex-row items-center justify-between bg-white rounded-2xl p-8 shadow-sm border border-gray-50 gap-6 relative overflow-hidden">
        <div class="flex items-center gap-4 z-10">
          <div class="w-12 h-12 rounded-full bg-brand-surface text-brand-primary flex items-center justify-center text-xl shadow-inner border border-brand-primary/10">
            <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
          <div>
            <h3 class="font-serif font-black text-xl text-gray-800 tracking-widest">限時旬味快閃</h3>
            <p class="text-[10px] font-sans font-black text-brand-primary tracking-[0.2em] uppercase mt-1">Limited Time Offer</p>
          </div>
        </div>
        
        <div class="flex items-center gap-4 z-10">
          <div v-for="(val, unit) in countdown" :key="unit" class="flex flex-col items-center">
            <div class="w-12 h-12 bg-brand-surface rounded-xl flex items-center justify-center text-xl font-serif font-black text-brand-primary border border-brand-primary/10">
              {{ String(val).padStart(2, '0') }}
            </div>
            <span class="text-[9px] font-sans font-black text-gray-400 mt-2 uppercase tracking-widest">{{ unit }}</span>
          </div>
        </div>
      </div>

      <!-- 商品列表 (統一 3欄/2欄) -->
      <div class="grid grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
        <product-card 
          v-for="product in filteredProducts" 
          :key="product.id"
          :product="product"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import ProductCard from '@/components/product/ProductCard.vue'
import { Product } from '@/types'

export default Vue.extend({
  name: 'EventView',
  components: { ProductCard },
  data() {
    return {
      banners: [
        {
          id: 'banner-1',
          tag: 'Organic Life Special Event',
          title: '當季旬味。獨家鉅獻',
          subtitle: '綁定 OPENPOINT 享專屬統一生機會員點數回饋',
          bg: 'linear-gradient(135deg, #F2F7ED 0%, #ECF6E4 100%)',
        },
        {
          id: 'banner-2',
          tag: 'Flash Deal',
          title: '限時快閃。今晚截止',
          subtitle: '精選商品與組合優惠，錯過就要等下次',
          bg: 'linear-gradient(135deg, #FFF9F1 0%, #F4EFE5 100%)',
        },
        {
          id: 'banner-3',
          tag: 'Member Exclusive',
          title: '會員專屬。加碼回饋',
          subtitle: '登入會員再享專屬折扣與點數累積',
          bg: 'linear-gradient(135deg, #EEF7F7 0%, #F6FCFB 100%)',
        },
      ],
      currentBannerIndex: 0,
      bannerTimer: null as any,
      activeTab: 'flash',
      eventTabs: [
        { id: 'flash',    label: '限時快閃' },
        { id: 'member',   label: '會員尊享' },
        { id: 'buyN',     label: '量販精選' },
        { id: 'optional', label: '任選組合' },
      ],
      countdown: { hr: 12, min: 45, sec: 30 },
      timer: null as any,
      products: [
        { id: 'P01', name: '有機鮮採花椰菜', price: 59, originalPrice: 120, image: '🥦', origin: '桃園', unit: '250g', inStock: true, isOrganic: true, tempZone: 'fresh', categoryId: 'c1', tags: ['flash'], memberPrice: 49 },
        { id: 'P02', name: '紐西蘭奇異果', price: 99, originalPrice: 150, image: '🥝', origin: '紐西蘭', unit: '6入', inStock: true, isOrganic: false, tempZone: 'chilled', categoryId: 'c2', tags: ['flash'], memberPrice: 89 },
        { id: 'P03', name: '放牧土雞蛋', price: 158, originalPrice: 199, image: '🥚', origin: '屏東', unit: '10入', inStock: true, isOrganic: false, tempZone: 'ambient', categoryId: 'c3', tags: ['member'], memberPrice: 139 },
        { id: 'P04', name: '智利鮭魚切片', price: 299, originalPrice: 380, image: '🐟', origin: '智利', unit: '300g', inStock: true, isOrganic: false, tempZone: 'frozen', categoryId: 'c4', tags: ['buyN'] },
        { id: 'P05', name: '有機帶殼玉米筍', price: 65, originalPrice: 85, image: '🌽', origin: '雲林', unit: '200g', inStock: true, isOrganic: true, tempZone: 'fresh', categoryId: 'c1', tags: ['optional'] },
        { id: 'P06', name: '統一生機有機豆乳', price: 35, originalPrice: 45, image: '🥛', origin: '產地', unit: '300g', inStock: true, isOrganic: true, tempZone: 'chilled', categoryId: 'c5', tags: ['flash'], memberPrice: 29 },
        { id: 'P07', name: '澳洲特選和牛', price: 588, originalPrice: 750, image: '🥩', origin: '澳洲', unit: '250g', inStock: true, isOrganic: false, tempZone: 'frozen', categoryId: 'c4', tags: ['member'], memberPrice: 499 },
        { id: 'P08', name: '有機大白菜', price: 85, originalPrice: 110, image: '🥬', origin: '彰化', unit: '800g', inStock: false, isOrganic: true, tempZone: 'fresh', categoryId: 'c1', tags: ['flash'] },
      ] as Product[],
    }
  },
  computed: {
    filteredProducts(): Product[] { return this.products.filter(p => p.tags.includes(this.activeTab)) },
    currentBanner(): any {
      const state = this as any
      return state.banners[state.currentBannerIndex]
    }
  },
  mounted() {
    this.startCountdown()
    this.startBannerTimer()
  },
  beforeDestroy() {
    if (this.timer) clearInterval(this.timer)
    const state = this as any
    if (state.bannerTimer) clearInterval(state.bannerTimer)
  },
  methods: {
    startCountdown() {
      this.timer = setInterval(() => {
        if (this.countdown.sec > 0) this.countdown.sec--
        else { this.countdown.min > 0 ? (this.countdown.min--, this.countdown.sec = 59) : (this.countdown.hr > 0 ? (this.countdown.hr--, this.countdown.min = 59, this.countdown.sec = 59) : clearInterval(this.timer)) }
      }, 1000)
    },
    startBannerTimer() {
      const state = this as any
      if (state.bannerTimer) clearInterval(state.bannerTimer)
      state.bannerTimer = setInterval(() => {
        this.nextBanner()
      }, 5000)
    },
    nextBanner() {
      const state = this as any
      state.currentBannerIndex = (state.currentBannerIndex + 1) % state.banners.length
      this.startBannerTimer()
    },
    prevBanner() {
      const state = this as any
      state.currentBannerIndex = (state.currentBannerIndex - 1 + state.banners.length) % state.banners.length
      this.startBannerTimer()
    },
    goToBanner(index: number) {
      const state = this as any
      state.currentBannerIndex = index
      this.startBannerTimer()
    }
  }
})
</script>

<style scoped>
.animate-fade-in { animation: fadeIn 0.4s ease-out forwards; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }
.banner-fade-enter-active, .banner-fade-leave-active { transition: opacity 0.45s ease, transform 0.45s ease; }
.banner-fade-enter, .banner-fade-leave-to { opacity: 0; transform: scale(0.99); }
</style>
