<template>
  <div class="bg-brand-bg min-h-screen">
    
    <!-- ── Slot 1: Hero (Large Banner Carousel) ── -->
    <section class="max-w-7xl mx-auto px-4 lg:px-8 py-4 lg:py-10">
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
          class="absolute left-3 top-1/2 -translate-y-1/2 z-20 hidden h-10 w-10 rounded-xl bg-white/90 text-brand-dark shadow-sm transition-colors hover:bg-white sm:flex items-center justify-center"
          @click="prevHeroSlide"
        >
          <span class="text-xl leading-none">‹</span>
        </button>
        <button
          type="button"
          aria-label="下一張"
          class="absolute right-3 top-1/2 -translate-y-1/2 z-20 hidden h-10 w-10 rounded-xl bg-white/90 text-brand-dark shadow-sm transition-colors hover:bg-white sm:flex items-center justify-center"
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
    <section class="bg-white border-y border-gray-100">
      <div class="max-w-7xl mx-auto px-4 lg:px-8 py-6 lg:py-8">
        <div class="flex overflow-x-auto gap-4 lg:gap-8 pb-2 scrollbar-hide lg:justify-between">
          <router-link
            v-for="cat in quickCategories"
            :key="cat.id"
            :to="buildQuickCategoryPath(cat.id)"
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
      </div>
    </section>

    <!-- ── 活動專區 ── -->
    <section class="bg-white py-8 lg:py-16 border-b border-gray-100">
      <div class="max-w-7xl mx-auto px-4 lg:px-8">
        <div class="grid gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-stretch">
          <router-link
            to="/event/SUMMER2026"
            class="group relative min-h-[22rem] overflow-hidden rounded-2xl bg-brand-dark text-white shadow-sm"
          >
            <img
              src="https://images.unsplash.com/photo-1505576399279-565b52d4ac71?w=1200&h=720&fit=crop"
              alt="夏季安心補給活動"
              class="absolute inset-0 h-full w-full object-cover opacity-60 transition-transform duration-700 group-hover:scale-105"
            />
            <div class="absolute inset-0 bg-gradient-to-r from-brand-dark via-brand-dark/75 to-brand-dark/20"></div>
            <div class="relative flex h-full min-h-[22rem] flex-col justify-between p-6 lg:p-10">
              <div>
                <p class="inline-flex rounded-full bg-white/15 px-3 py-1 text-[10px] font-black tracking-[0.32em] text-white">SEASON EVENT</p>
                <h2 class="mt-5 max-w-xl text-3xl font-black leading-tight lg:text-5xl">
                  夏季安心補給活動
                </h2>
                <p class="mt-5 max-w-xl text-sm leading-8 text-white/80 lg:text-base">
                  整理人氣商品、組合優惠與會員專屬內容，讓活動入口在首頁前段更容易被看見。
                </p>
              </div>
              <span class="mt-8 inline-flex w-fit rounded-xl bg-white px-5 py-3 text-xs font-black tracking-[0.24em] text-brand-dark transition-colors group-hover:bg-brand-primary group-hover:text-white">
                查看活動內容
              </span>
            </div>
          </router-link>

          <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
            <router-link
              v-for="item in eventHighlights"
              :key="item.key"
              :to="item.to"
              class="rounded-2xl border border-gray-100 bg-brand-bg p-5 shadow-sm transition-all hover:-translate-y-1 hover:bg-white hover:shadow-md"
            >
              <p class="text-[10px] font-black tracking-[0.28em] text-brand-primary">{{ item.eyebrow }}</p>
              <h3 class="mt-3 type-card-title">{{ item.title }}</h3>
              <p class="mt-3 type-body text-gray-500">{{ item.description }}</p>
            </router-link>
          </div>
        </div>
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
          <div class="flex items-center gap-3 bg-white px-5 py-3 border border-gray-200 text-brand-dark font-mono text-sm tracking-widest rounded-xl shadow-sm w-fit">
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

    <!-- ── 內容入口 ── -->
    <section class="bg-white py-8 lg:py-16 border-t border-gray-100">
      <div class="max-w-7xl mx-auto px-4 lg:px-8">
        <div class="flex flex-col gap-6 mb-8 lg:mb-12 sm:flex-row sm:items-end sm:justify-between">
          <div class="space-y-2">
            <h2 class="text-2xl lg:text-3xl font-serif font-black text-gray-800 tracking-widest border-l-4 border-brand-primary pl-4">安心內容</h2>
            <p class="text-[10px] lg:text-xs font-sans font-bold text-brand-primary tracking-[0.3em] opacity-80 pl-5">最新消息與 PDF 內容</p>
          </div>
          <router-link to="/content-center" class="text-[10px] lg:text-xs font-bold text-brand-dark hover:text-brand-primary tracking-widest border-b border-brand-dark pb-1">
            查看內容中心
          </router-link>
        </div>

        <div class="grid gap-5 md:grid-cols-3">
          <router-link
            v-for="item in contentEntries"
            :key="item.key"
            :to="item.to"
            class="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
          >
            <p class="text-[10px] font-black tracking-[0.28em] text-brand-primary">{{ item.eyebrow }}</p>
            <h3 class="mt-3 type-card-title">{{ item.title }}</h3>
            <p class="mt-3 type-body text-gray-500">{{ item.description }}</p>
          </router-link>
        </div>

        <div v-if="latestNews" class="mt-5">
          <router-link
            :to="`/news/${latestNews.id}`"
            class="flex flex-col gap-4 rounded-2xl border border-gray-100 bg-brand-bg p-5 shadow-sm transition-all hover:border-brand-primary/20 hover:bg-white sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <p class="text-[10px] font-black tracking-[0.28em] text-brand-primary">LATEST NEWS</p>
              <h3 class="mt-2 type-card-title">{{ latestNews.title }}</h3>
              <p class="mt-2 type-muted text-gray-500">{{ latestNews.summary }}</p>
            </div>
            <span class="inline-flex flex-shrink-0 rounded-xl bg-white px-4 py-2 text-xs font-bold text-brand-primary shadow-sm">
              閱讀消息
            </span>
          </router-link>
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
          <router-link to="/products" class="text-[10px] lg:text-xs font-bold text-brand-dark hover:text-brand-primary tracking-widest border-b border-brand-dark pb-1">查看全部新品</router-link>
        </div>
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 lg:gap-6">
          <ProductCard
            v-for="product in newArrivalProducts"
            :key="'new-'+product.id"
            :product="product"
            variant="editorial"
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
          <router-link to="/products" class="text-[10px] lg:text-xs font-bold text-brand-dark hover:text-brand-primary tracking-widest border-b border-brand-dark pb-1">查看全部商品</router-link>
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
          :to="lineLoginPath"
        />
      </div>
    </section>

    <!-- ── 4. 組合購專區 ── -->
    <section class="bg-[#F0F4F1] py-8 lg:py-16 border-y border-brand-primary/10">
      <div class="max-w-7xl mx-auto px-4 lg:px-8">
        <div class="grid grid-cols-1 lg:grid-cols-[0.88fr_1.12fr] gap-8 lg:gap-12 items-start">
          <div class="space-y-6 lg:sticky lg:top-32">
            <div class="space-y-2">
              <h2 class="text-2xl lg:text-4xl font-serif font-black text-gray-800 leading-tight tracking-[0.12em] border-l-4 border-brand-primary pl-4">
                組合購專區
              </h2>
              <p class="text-[10px] lg:text-xs font-black text-brand-primary tracking-[0.35em] uppercase pl-5">Bundle Picks</p>
            </div>
            <p class="text-sm lg:text-[15px] text-gray-600 leading-loose tracking-wide pl-5 max-w-[28rem]">
              把常備補貨、早餐提案與家庭囤貨整理成更容易理解的選擇。
              讓使用者先看懂組合，再快速完成購買。
            </p>
            <router-link
              to="/combo/FAMILY-SET"
              class="inline-flex items-center gap-2 text-xs font-bold text-brand-primary tracking-[0.28em] uppercase border-b border-brand-primary pb-1 pl-5 w-fit"
            >
              前往組合商品
            </router-link>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-[1.1fr_0.9fr] gap-4 lg:gap-5 items-stretch">
            <HomeBanner
              size="medium"
              tag="Bundle Offer"
              title="家庭常備箱<br />一次備齊一週餐桌"
              subtitle="精選生鮮、雜糧與人氣商品，適合第一次選購或固定補貨。"
              image="https://picsum.photos/seed/family-bundle/1200/520"
              cta="查看組合方案"
              to="/combo/FAMILY-SET"
              class="sm:row-span-2"
            />

            <div class="grid grid-cols-1 gap-4">
              <router-link
                to="/combo/BREAKFAST-SET"
                class="rounded-2xl border border-gray-100 bg-white/95 p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
              >
                <p class="text-[10px] font-black tracking-[0.3em] text-brand-primary mb-3">早餐組合</p>
                <h3 class="type-card-title mb-2 tracking-wide">早餐快速組</h3>
                <p class="type-body text-gray-500 tracking-wide">燕麥飲、堅果與輕食一次帶走，適合忙碌上班日。</p>
              </router-link>
              <router-link
                to="/combo/SENIOR-SET"
                class="rounded-2xl border border-gray-100 bg-white/95 p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md lg:translate-y-6"
              >
                <p class="text-[10px] font-black tracking-[0.3em] text-brand-primary mb-3">銀髮安心組</p>
                <h3 class="type-card-title mb-2 tracking-wide">銀髮安心組</h3>
                <p class="type-body text-gray-500 tracking-wide">針對銀髮族常備營養補給與好入口商品搭配。</p>
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ── 5. 當季鮮採 ── -->
    <section class="bg-[#F7F5F0] py-8 lg:py-16 border-t border-brand-primary/10">
      <div class="max-w-7xl mx-auto px-4 lg:px-8">
        <div class="mb-8 flex flex-col gap-6 lg:mb-12 lg:flex-row lg:items-end lg:justify-between">
          <div class="space-y-3">
            <h2 class="text-2xl lg:text-4xl font-serif font-black text-gray-800 leading-tight tracking-[0.12em] border-l-4 border-brand-primary pl-4">
              產地直送。<br class="sm:hidden" />當季鮮採
            </h2>
            <p class="text-[10px] lg:text-xs font-black text-brand-primary tracking-[0.35em] uppercase pl-5">Seasonal Harvest</p>
            <p class="max-w-2xl text-sm lg:text-[15px] text-gray-600 leading-loose tracking-wide pl-5">
              尋訪土地，帶回職人親手呵護的食材。這不只是一份清單，而是大自然對季節最誠摯的告白。
            </p>
          </div>
          <router-link to="/category/fresh" class="inline-flex w-fit rounded-xl border border-brand-primary bg-white px-5 py-3 text-xs font-black tracking-[0.24em] text-brand-primary shadow-sm transition-all hover:bg-brand-primary hover:text-white">
            前往產地直送商品
          </router-link>
        </div>

        <div class="grid grid-cols-1 gap-4 md:grid-cols-3 lg:gap-6">
          <ProductCard
            v-for="product in seasonalProducts"
            :key="'seasonal-'+product.id"
            :product="product"
            variant="editorial"
            fullWidth
          />
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
      <div class="flex flex-wrap items-center justify-center gap-3 lg:gap-4">
        <router-link
          v-for="tag in popularTags"
          :key="tag"
          :to="{ path: '/search', query: { q: tag } }"
          class="text-[10px] lg:text-xs font-black text-gray-400 hover:text-brand-primary cursor-pointer transition-colors tracking-[0.24em] uppercase bg-white px-4 py-2 rounded-xl border border-gray-100 shadow-sm"
        >
          # {{ tag }}
        </router-link>
      </div>
    </section>

  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { mockNewsArticles, mockProducts } from '@/mock/data'
import { buildCategoryPathFromCategory } from '@/utils/category-path'
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
    contentEntries: Array<{
      key: string
      eyebrow: string
      title: string
      description: string
      to: string
    }>
    eventHighlights: Array<{
      key: string
      eyebrow: string
      title: string
      description: string
      to: string
    }>
  } {
    return {
      products: mockProducts as Product[],
      heroSlides: [
        {
          id: 'hero-1',
          tag: 'Season Event',
          title: '夏季安心補給<br />活動開跑',
          subtitle: '人氣商品、組合優惠與會員專屬內容，首頁即可快速前往。',
          image: 'https://images.unsplash.com/photo-1505576399279-565b52d4ac71?w=1440&h=600&fit=crop',
          cta: '查看活動內容',
          to: '/event/SUMMER2026'
        },
        {
          id: 'hero-2',
          tag: 'Season Pick',
          title: '新鮮。有機。<br />在地的選擇',
          subtitle: '尋訪土地，帶回職人親手呵護的食材。找回身體的原始脈動。',
          image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=1440&h=600&fit=crop',
          cta: '立即探索商品',
          to: '/products'
        },
        {
          id: 'hero-3',
          tag: 'Bundle Offer',
          title: '組合購。<br />一次備齊一週餐桌',
          subtitle: '人氣商品與家庭常備箱，幫你快速完成日常補貨。',
          image: 'https://images.unsplash.com/photo-1543353071-873f17a7a088?w=1440&h=600&fit=crop',
          cta: '查看組合商品',
          to: '/combo/FAMILY-SET'
        },
        {
          id: 'hero-4',
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
      popularTags: ['產地直送', '有機認證', '無添加', '銀髮友善', '低溫配送', '安心購'],
      opBannerUrl: 'https://picsum.photos/seed/op-exchange-green/1200/480',
      contentEntries: [
        {
          key: 'health',
          eyebrow: 'HEALTH JOURNAL',
          title: '健康誌',
          description: '每月有機生活提案與健康主題 PDF。',
          to: '/health-journal',
        },
        {
          key: 'gift',
          eyebrow: 'GIFT CATALOG',
          title: '禮盒型錄',
          description: '節慶、企業贈禮與年度型錄集中瀏覽。',
          to: '/gift-catalog',
        },
        {
          key: 'inspection',
          eyebrow: 'INSPECTION',
          title: '檢驗報告',
          description: '依商品與檢驗類型查找安心報告。',
          to: '/inspections',
        },
      ],
      eventHighlights: [
        {
          key: 'flash',
          eyebrow: 'LIMITED PICKS',
          title: '限時強檔',
          description: '活動期間主打商品與本週精選快速瀏覽。',
          to: '/products',
        },
        {
          key: 'bundle',
          eyebrow: 'BUNDLE OFFER',
          title: '組合購方案',
          description: '家庭常備、早餐與銀髮安心組合集中選購。',
          to: '/combo/FAMILY-SET',
        },
        {
          key: 'member',
          eyebrow: 'MEMBER BENEFITS',
          title: '會員專屬優惠',
          description: '登入後可查看折價券、購物金與會員活動。',
          to: '/login?redirect=/account/coupons',
        },
      ],
    }
  },
  computed: {
    quickCategories(): Category[] {
      return this.$store.getters['products/rootCategories'].slice(0, 7)
    },
    currentHeroSlide(): any {
      const state = this as any
      return state.heroSlides[state.currentHeroIndex]
    },
    newArrivalProducts(): Product[] {
      return this.products.slice(0, 5)
    },
    seasonalProducts(): Product[] {
      return this.products.slice(2, 5)
    },
    latestNews(): any {
      return mockNewsArticles[0] || null
    },
    lineLoginPath(): string {
      return this.$store.getters['auth/isAuthenticated'] ? '/account/coupons' : '/login?redirect=/account/coupons'
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
    buildQuickCategoryPath(categoryId: string): string {
      return buildCategoryPathFromCategory(this.$store.getters['products/allCategories'], categoryId)
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
