<template>
  <div class="bg-white min-h-screen">
    
    <!-- ── Slot 1: Hero (Large Banner Carousel) ── -->
    <section class="max-w-7xl mx-auto px-4 lg:px-8 py-8 lg:py-16">
      <div class="relative">
        <transition name="hero-fade" mode="out-in">
          <HomeBanner
            :key="currentHeroSlide.id"
            class="hero-banner"
            size="large"
            :tag="currentHeroSlide.tag"
            :title="currentHeroSlide.title"
            :subtitle="currentHeroSlide.subtitle"
            :image="currentHeroSlide.image"
            :cta="currentHeroSlide.cta"
            :to="currentHeroSlide.to"
          />
        </transition>

        <button
          type="button"
          aria-label="上一張"
          class="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white/90 text-brand-dark shadow-lg flex items-center justify-center hover:bg-white transition-colors"
          @click="prevHeroSlide"
        >
          <span class="text-xl leading-none">‹</span>
        </button>
        <button
          type="button"
          aria-label="下一張"
          class="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white/90 text-brand-dark shadow-lg flex items-center justify-center hover:bg-white transition-colors"
          @click="nextHeroSlide"
        >
          <span class="text-xl leading-none">›</span>
        </button>

        <div class="absolute bottom-4 left-0 right-0 z-20 flex justify-center gap-2">
          <button
            v-for="(slide, index) in heroSlides"
            :key="slide.id"
            type="button"
            class="h-2.5 rounded-full transition-all duration-300"
            :class="index === currentHeroIndex ? 'w-8 bg-white shadow-md' : 'w-2.5 bg-white/60 hover:bg-white/80'"
            :aria-label="`切換到第 ${index + 1} 張`"
            @click="goToHeroSlide(index)"
          />
        </div>
      </div>
    </section>

    <!-- ── 1. Quick Access (中文化與橫向捲動) ── -->
    <section class="max-w-7xl mx-auto px-4 lg:px-8 py-8 lg:py-16">
      <div class="flex overflow-x-auto gap-4 lg:gap-8 pb-4 scrollbar-hide lg:justify-between">
        <router-link
          v-for="cat in quickCategories"
          :key="cat.id"
          :to="`/category/${cat.id}`"
          class="flex flex-col items-center gap-3 flex-shrink-0 group min-w-[80px]"
        >
          <div class="w-16 h-16 lg:w-20 lg:h-20 rounded-full border border-gray-100 flex items-center justify-center group-hover:border-brand-primary transition-all duration-500 relative overflow-hidden bg-white shadow-sm">
            <img
              v-if="isImageUrl(cat.icon)"
              :src="cat.icon"
              :alt="cat.name"
              class="h-full w-full object-cover transition-all duration-500 group-hover:scale-110"
            />
            <span v-else class="text-3xl group-hover:scale-110 transition-all">{{ cat.icon }}</span>
          </div>
          <span class="text-sm font-black text-gray-700 group-hover:text-brand-primary tracking-widest transition-colors text-center whitespace-nowrap">{{ cat.name }}</span>
        </router-link>
      </div>
    </section>

    <!-- ── 2. 限時強檔 (背景米白) ── -->
    <section class="bg-[#F7F5F0] py-8 lg:py-16">
      <div class="max-w-7xl mx-auto px-4 lg:px-8">
        <div class="flex flex-col sm:flex-row sm:items-end justify-between mb-8 lg:mb-12 gap-6">
          <div class="space-y-2">
            <h2 class="text-2xl lg:text-3xl font-serif font-black text-gray-800 tracking-widest border-l-4 border-brand-primary pl-4">限時強檔</h2>
            <p class="text-[10px] lg:text-xs font-sans font-bold text-brand-primary tracking-[0.3em] opacity-80 pl-5">本週限時精選</p>
          </div>
          <div class="flex items-center gap-3 bg-white px-5 py-3 border border-gray-200 text-brand-dark font-mono text-sm tracking-widest rounded-sm shadow-sm w-fit">
            <span class="opacity-60 text-[10px] font-sans uppercase">Ends in</span> 12:45:30
          </div>
        </div>
        <div class="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4 lg:gap-6">
          <ProductCard
            v-for="product in products.slice(0, 5)"
            :key="'flash-'+product.id"
            :product="product"
          />
        </div>
      </div>
    </section>

    <!-- ── 新品上市專區 ── -->
    <section class="bg-white py-8 lg:py-16 border-t border-gray-100">
      <div class="max-w-7xl mx-auto px-4 lg:px-8">
        <div class="flex flex-col sm:flex-row sm:items-end justify-between mb-8 lg:mb-12 gap-6">
          <div class="space-y-2">
            <h2 class="text-2xl lg:text-3xl font-serif font-black text-gray-800 tracking-widest border-l-4 border-brand-primary pl-4">新品上市專區</h2>
          </div>
          <router-link to="/products" class="text-[10px] lg:text-xs font-black text-brand-dark hover:text-brand-primary tracking-widest border-b border-brand-dark pb-1">查看全部新品</router-link>
        </div>
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 lg:gap-6">
          <ProductCard
            v-for="product in newArrivalProducts"
            :key="'new-'+product.id"
            :product="product"
          />
        </div>
      </div>
    </section>

    <!-- ── Slot 2: Middle Transition (深綠背景) ── -->
    <section class="bg-brand-primary py-8 lg:py-16">
      <div class="max-w-7xl mx-auto px-4 lg:px-8 text-white">
        <HomeBanner 
          size="medium"
          tag="Craftsmanship"
          title="職人嚴選。安心無添加"
          subtitle="我們走入田野，與農友共耕。每一份包裝背後，都是對純粹美味的堅持與承諾。"
          image="https://picsum.photos/seed/organic-farm/1200/480"
          cta="查看品牌故事"
          to="/about"
          :overlay="false"
        />
      </div>
    </section>

    <!-- ── 3. 旬味排行 (背景淺綠) ── -->
    <section style="background-color: #E8F5E8" class="py-8 lg:py-16">
      <div class="max-w-7xl mx-auto px-4 lg:px-8">
        <div class="flex items-end justify-between mb-8 lg:mb-12 border-b border-brand-primary/20 pb-8">
          <div>
            <h2 class="text-2xl lg:text-3xl font-serif font-black text-gray-800 tracking-widest border-l-4 border-brand-primary pl-4">旬味排行</h2>
            <p class="text-[10px] lg:text-xs font-sans font-black text-brand-primary tracking-[0.4em] mt-2 pl-5">本月熱銷排行</p>
          </div>
          <router-link to="/products" class="text-[10px] lg:text-xs font-black text-brand-dark hover:text-brand-primary tracking-widest border-b border-brand-dark pb-1">查看全部商品</router-link>
        </div>
        <div class="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4 lg:gap-6">
          <ProductCard
            v-for="product in products.slice(0, 6)"
            :key="'hot-'+product.id"
            :product="product"
          />
        </div>
      </div>
    </section>

    <!-- ── Slot 3: Member Benefits (小 Banner) ── -->
    <section class="max-w-7xl mx-auto px-4 lg:px-8 py-8 lg:py-16 bg-white">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-10">
        <HomeBanner 
          size="small"
          tag="Membership"
          title="會員召集令<br />首購現折 $100"
          image="https://picsum.photos/seed/fresh-vegetable/800/400"
          cta="立即註冊"
          to="/register"
        />
        <HomeBanner 
          size="small"
          tag="Community"
          title="加入官方 LINE<br />領取免運券"
          image="https://picsum.photos/seed/harvest-field/800/400"
          cta="立即登入"
          to="/login"
        />
      </div>
    </section>

    <!-- ── 4. 組合購專區 ── -->
    <section class="bg-[#FFF9F1] py-8 lg:py-16 border-y border-brand-accent/10">
      <div class="max-w-7xl mx-auto px-4 lg:px-8">
        <div class="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-8 lg:mb-12">
          <div>
            <h2 class="text-2xl lg:text-3xl font-serif font-black text-gray-800 tracking-widest border-l-4 border-brand-accent pl-4">組合購專區</h2>
            <p class="text-[10px] lg:text-xs font-black text-brand-accent tracking-[0.35em] uppercase mt-2 pl-5">Bundle Picks</p>
          </div>
          <router-link to="/combo/FAMILY-SET" class="inline-block text-xs font-black text-brand-accent tracking-[0.3em] uppercase border-b border-brand-accent pb-1">
            前往組合商品
          </router-link>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-6 lg:gap-10 items-stretch">
          <HomeBanner
            size="medium"
            tag="Bundle Offer"
            title="家庭常備箱<br />一次備齊一週餐桌"
            subtitle="精選生鮮、雜糧與人氣商品，適合第一次選購或固定補貨。"
            image="https://picsum.photos/seed/family-bundle/1200/520"
            cta="查看組合方案"
            to="/combo/FAMILY-SET"
          />

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <router-link
              to="/combo/BREAKFAST-SET"
              class="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
            >
              <p class="text-[10px] font-black tracking-[0.3em] text-brand-primary mb-3">早餐組合</p>
              <h3 class="text-lg font-black text-gray-800 mb-2">早餐快速組</h3>
              <p class="text-sm text-gray-500 leading-relaxed">燕麥飲、堅果與輕食一次帶走，適合忙碌上班日。</p>
            </router-link>
            <router-link
              to="/combo/SENIOR-SET"
              class="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
            >
              <p class="text-[10px] font-black tracking-[0.3em] text-brand-primary mb-3">銀髮安心組</p>
              <h3 class="text-lg font-black text-gray-800 mb-2">銀髮安心組</h3>
              <p class="text-sm text-gray-500 leading-relaxed">針對銀髮族常備營養補給與好入口商品搭配。</p>
            </router-link>
          </div>
        </div>
      </div>
    </section>

    <!-- ── 5. 當季鮮採 (產地直送，卡片對齊) ── -->
    <section class="bg-white py-8 lg:py-16 border-t border-gray-100">
      <div class="max-w-7xl mx-auto px-4 lg:px-8">
        <div class="flex flex-col lg:flex-row gap-12 lg:gap-20 items-start">
          <div class="w-full lg:w-1/3 lg:sticky lg:top-32 space-y-6 lg:space-y-8">
            <h2 class="text-2xl lg:text-4xl font-serif font-black text-gray-800 leading-tight tracking-widest border-l-4 border-brand-primary pl-4">產地直送。<br />當季鮮採</h2>
            <p class="text-base font-serif text-gray-600 leading-loose tracking-widest pl-5">
              尋訪土地，帶回職人親手呵護的食材。這不只是一份清單，而是大自然對季節最誠摯的告白。
            </p>
            <router-link to="/category/fresh" class="inline-block text-xs font-black text-brand-primary tracking-[0.3em] border-b border-brand-primary pb-1 ml-5">前往產地直送商品</router-link>
          </div>
          <div class="flex-1 grid grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6 w-full">
            <ProductCard
              v-for="product in products.slice(2, 5)"
              :key="'seasonal-'+product.id"
              :product="product"
            />
          </div>
        </div>
      </div>
    </section>

    <!-- ── 6. OPENPOINT 換購 ── -->
    <section class="bg-gray-50 py-8 lg:py-16">
      <div class="max-w-7xl mx-auto px-4 lg:px-8">
        <div class="mb-8 lg:mb-12">
          <h2 class="text-2xl lg:text-3xl font-serif font-black text-gray-800 tracking-widest border-l-4 border-brand-primary pl-4">點數換購</h2>
        </div>
        <HomeBanner 
          size="medium"
          tag="Points Program"
          title="OPENPOINT<br />靈活換購計畫"
          subtitle="少量點數即可享受加購價優惠，讓每一點價值極大化。支援線上即時換購，安心配送到府。"
          :image="opBannerUrl"
          cta="前往換購專區"
          to="/op-exchange"
        />
      </div>
    </section>

    <!-- ── Tags ── -->
    <section class="max-w-7xl mx-auto px-4 lg:px-8 py-8 lg:py-16 border-t border-gray-100">
      <div class="flex flex-wrap items-center justify-center gap-6 lg:gap-10">
        <router-link
          v-for="tag in popularTags"
          :key="tag"
          :to="{ path: '/search', query: { q: tag } }"
          class="text-[10px] lg:text-xs font-black text-gray-400 hover:text-brand-primary cursor-pointer transition-colors tracking-[0.3em] uppercase bg-gray-50 px-4 py-2 rounded-sm"
        >
          # {{ tag }}
        </router-link>
      </div>
    </section>

    <div class="fixed bottom-4 left-4 z-50 flex flex-col items-start gap-3">
      <div class="rounded-2xl border border-[#2D6A2D]/10 bg-white/95 p-3 shadow-xl backdrop-blur">
        <p class="mb-2 text-[10px] font-black tracking-[0.25em] text-[#2D6A2D]">快速切換版型</p>
        <div class="flex flex-col gap-2">
          <button
            v-for="tab in layoutTabs"
            :key="'home-floating-' + tab.key"
            type="button"
            class="flex items-center gap-2 rounded-full border px-3 py-2 text-xs font-black tracking-[0.2em] transition-all"
            :class="tab.key === 'a' ? 'border-[#2D6A2D] bg-[#E8F5E8] text-[#2D6A2D] shadow-sm' : 'border-[#2D6A2D]/10 bg-white text-[#1F2937] hover:border-[#2D6A2D]/30 hover:bg-[#F7F5F0]'"
            @click="goToLayout(tab.key)"
          >
            <span
              class="flex h-7 w-7 items-center justify-center rounded-full text-[11px]"
              :class="tab.key === 'a' ? 'bg-[#2D6A2D] text-white' : 'bg-[#F7F5F0] text-[#2D6A2D]'"
            >
              {{ tab.key.toUpperCase() }}
            </span>
            <span>{{ tab.shortTitle }}</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { mockProducts } from '@/mock/data'
import { Category, Product } from '@/types'
import ProductCard from '@/components/product/ProductCard.vue'
import HomeBanner from '@/components/layout/HomeBanner.vue'

export default Vue.extend({
  name: 'HomeView',
  components: { ProductCard, HomeBanner },
  data(): {
    products: Product[]
    heroSlides: Array<{
      id: string
      tag: string
      title: string
      subtitle: string
      image: string
      cta: string
      to: string
    }>
    currentHeroIndex: number
    heroTimer: number | null
    popularTags: string[]
    opBannerUrl: string
    layoutTabs: Array<{
      key: 'a' | 'b' | 'c' | 'd'
      shortTitle: string
    }>
  } {
    return {
      products: mockProducts as Product[],
      heroSlides: [
        {
          id: 'hero-1',
          tag: 'Season Pick',
          title: '新鮮。有機。<br />在地的選擇',
          subtitle: '尋訪土地，帶回職人親手呵護的食材。找回身體的原始脈動。',
          image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=1440&h=600&fit=crop',
          cta: '立即探索商品',
          to: '/products'
        },
        {
          id: 'hero-2',
          tag: 'Bundle Offer',
          title: '組合購。<br />一次備齊一週餐桌',
          subtitle: '人氣商品與家庭常備箱，幫你快速完成日常補貨。',
          image: 'https://images.unsplash.com/photo-1543353071-873f17a7a088?w=1440&h=600&fit=crop',
          cta: '查看組合商品',
          to: '/combo/FAMILY-SET'
        },
        {
          id: 'hero-3',
          tag: 'Points Program',
          title: 'OPENPOINT<br />靈活換購計畫',
          subtitle: '少量點數即可折抵加購，讓每一點價值極大化。',
          image: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=1440&h=600&fit=crop',
          cta: '前往換購專區',
          to: '/op-exchange'
        }
      ],
      currentHeroIndex: 0,
      heroTimer: null as number | null,
      popularTags: ['產地直送', '有機認證', '無添加', '銀髮友友', '低溫配送', '健康誌', '安心購'],
      opBannerUrl: 'https://picsum.photos/seed/op-exchange-green/1200/480',
      layoutTabs: [
        { key: 'a', shortTitle: '有機質感' },
        { key: 'b', shortTitle: '促銷導向' },
        { key: 'c', shortTitle: '功能電商' },
        { key: 'd', shortTitle: '生鮮市集' }
      ]
    }
  },
  computed: {
    quickCategories(): Category[] {
      return this.$store.getters['products/allCategories'].slice(0, 7)
    },
    currentHeroSlide(): any {
      const state = this as any
      return state.heroSlides[state.currentHeroIndex]
    },
    newArrivalProducts(): Product[] {
      return this.products.slice(0, 5)
    }
  },
  mounted() {
    this.startHeroTimer()
  },
  beforeDestroy() {
    const state = this as any
    if (state.heroTimer) window.clearInterval(state.heroTimer)
  },
  methods: {
    isImageUrl(value: string) {
      return /^https?:\/\//.test(value) || value.startsWith('/')
    },
    startHeroTimer() {
      const state = this as any
      if (state.heroTimer) window.clearInterval(state.heroTimer)
      state.heroTimer = window.setInterval(() => {
        this.nextHeroSlide()
      }, 5000)
    },
    nextHeroSlide() {
      const state = this as any
      state.currentHeroIndex = (state.currentHeroIndex + 1) % state.heroSlides.length
      this.startHeroTimer()
    },
    prevHeroSlide() {
      const state = this as any
      state.currentHeroIndex = (state.currentHeroIndex - 1 + state.heroSlides.length) % state.heroSlides.length
      this.startHeroTimer()
    },
    goToHeroSlide(index: number) {
      const state = this as any
      state.currentHeroIndex = index
      this.startHeroTimer()
    },
    goToLayout(key: 'a' | 'b' | 'c' | 'd') {
      if (key === 'a') {
        window.scrollTo({ top: 0, behavior: 'smooth' })
        return
      }
      this.$router.push({ name: 'layout-preview', query: { layout: key } }).catch(() => undefined)
    }
  }
})
</script>

<style scoped>
.scrollbar-hide::-webkit-scrollbar { display: none; }
.scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
.hero-fade-enter-active, .hero-fade-leave-active { transition: opacity 0.45s ease, transform 0.45s ease; }
.hero-fade-enter, .hero-fade-leave-to { opacity: 0; transform: scale(0.99); }
.hero-banner::v-deep img {
  background-color: #E8F5E8;
  object-fit: cover;
  object-position: center;
}
</style>
