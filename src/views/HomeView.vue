<template>
  <div class="bg-brand-bg min-h-screen">

    <!-- ── Hero Carousel ── -->
    <section class="max-w-7xl mx-auto px-4 lg:px-8 py-4 lg:py-8">
      <div class="relative">
        <transition name="hero-fade" mode="out-in">
          <HomeBanner
            :key="currentHeroSlide.id"
            class="hero-banner home-banner-shell home-banner-hero"
            size="large"
            :tag="currentHeroSlide.tag"
            :title="currentHeroSlide.title"
            :subtitle="currentHeroSlide.subtitle"
            :image="currentHeroSlide.image"
            :cta="currentHeroSlide.cta"
            :to="currentHeroSlide.to"
            image-position="center center"
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

    <!-- ── 人氣商品排行 ── -->
    <section class="bg-white border-y border-gray-100">
      <div class="max-w-7xl mx-auto px-4 lg:px-8 py-4 lg:py-6">
        <div class="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div class="space-y-1">
            <h2 class="home-section-title home-section-title-compact">人氣商品排行</h2>
          </div>
          <router-link
            to="/products"
            class="home-section-cta inline-flex w-fit items-center gap-2 rounded-xl border border-brand-primary px-5 py-3 text-[10px] font-black tracking-[0.24em] text-brand-primary transition-all hover:bg-brand-primary hover:text-white"
          >
            看更多
          </router-link>
        </div>
        <div class="mt-5 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 lg:gap-4">
          <ProductCard v-for="product in hotProducts.slice(0, 6)" :key="'rank-'+product.id" class="home-product-shell" :product="product" always-show-action compact />
        </div>
      </div>
    </section>

    <!-- ── 新品 banner ── -->
    <section class="bg-brand-bg py-4 lg:py-6">
      <div class="max-w-7xl mx-auto px-4 lg:px-8">
        <div class="grid gap-4 lg:grid-cols-2">
          <div class="home-promo-tile aspect-[2.9/1] overflow-hidden rounded-2xl bg-white shadow-sm">
            <img
              src="/home-banners/new-arrival-banner-01.png"
              alt="超值加價購"
              class="block h-full w-full object-cover"
            />
          </div>
          <div class="home-promo-tile aspect-[2.9/1] overflow-hidden rounded-2xl bg-white shadow-sm">
            <img
              src="/home-banners/new-arrival-banner-02.png"
              alt="OPENPOINT 好康換一波"
              class="block h-full w-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>

    <!-- ── 新品上市 ── -->
    <section class="bg-white py-10 lg:py-16 border-t border-gray-100">
      <div class="max-w-7xl mx-auto px-4 lg:px-8">
        <div class="flex flex-col sm:flex-row sm:items-end justify-between mb-8 lg:mb-12 gap-4">
          <div class="space-y-2">
            <h2 class="home-section-title">新品上市</h2>
            <p class="home-section-subtitle">本月最新商品</p>
          </div>
          <router-link
            to="/products"
            class="home-section-cta text-[10px] lg:text-xs font-bold text-brand-dark hover:text-brand-primary tracking-widest border-b border-brand-dark pb-1 w-fit"
          >
            看更多
          </router-link>
        </div>
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 lg:gap-4">
          <ProductCard v-for="product in newArrivalProducts.slice(0, 12)" :key="'new-'+product.id" class="home-product-shell" :product="product" variant="editorial" always-show-action compact />
        </div>
      </div>
    </section>

    <!-- ── 當季鮮採 ── -->
    <section class="bg-[#F7F5F0] py-8 lg:py-12 border-t border-brand-primary/10">
      <div class="max-w-7xl mx-auto px-4 lg:px-8">
        <div class="mb-6 flex flex-col gap-4 lg:mb-8 lg:flex-row lg:items-end lg:justify-between">
          <div class="space-y-3">
            <h2 class="home-section-title home-section-title-xl">
              產地直送。<br class="sm:hidden" />當季鮮採
            </h2>
            <p class="home-section-subtitle mt-2">Seasonal Harvest</p>
          </div>
          <router-link to="/category/生鮮直送"
            class="home-section-cta inline-flex w-fit rounded-xl border border-brand-primary bg-white px-5 py-3 text-xs font-black tracking-[0.24em] text-brand-primary shadow-sm transition-all hover:bg-brand-primary hover:text-white"
          >
            前往產地直送商品
          </router-link>
        </div>
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 lg:gap-4">
          <ProductCard v-for="product in seasonalProducts" :key="'seasonal-'+product.id" class="home-product-shell" :product="product" variant="editorial" always-show-action compact />
        </div>
      </div>
    </section>

    <!-- ── 新品 banner ── -->
    <section class="bg-brand-bg py-4 lg:py-6">
      <div class="max-w-7xl mx-auto px-4 lg:px-8">
        <div class="grid gap-4 lg:grid-cols-2">
          <div class="home-promo-tile aspect-[2.2/1] overflow-hidden rounded-2xl bg-white shadow-sm">
            <img
              src="/home-banners/new-product-banner-01.png"
              alt="OPENPOINT 好康換一波"
              class="block h-full w-full object-cover"
            />
          </div>
          <div class="home-promo-tile aspect-[2.2/1] overflow-hidden rounded-2xl bg-white shadow-sm">
            <img
              src="/home-banners/new-product-banner-02.png"
              alt="有機鮮採椰菜"
              class="block h-full w-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>

    <!-- ── 熱賣商品 ── -->
    <section class="bg-[#F7F5F0] py-10 lg:py-16 border-t border-brand-primary/10">
      <div class="max-w-7xl mx-auto px-4 lg:px-8">
        <div class="flex flex-col sm:flex-row sm:items-end justify-between mb-8 lg:mb-12 gap-4">
          <div class="space-y-2">
            <h2 class="home-section-title">熱賣商品</h2>
          </div>
          <a
            href="http://172.20.10.5:8080/event/SUMMER2026?group=flash&item=flash-ghost"
            target="_blank"
            rel="noopener noreferrer"
            class="home-section-cta text-[10px] lg:text-xs font-bold text-brand-dark hover:text-brand-primary tracking-widest border-b border-brand-dark pb-1 w-fit"
          >
            查看更多
          </a>
        </div>
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 lg:gap-4">
          <ProductCard v-for="product in hotProducts.slice(0, 18)" :key="'hot-sale-'+product.id" class="home-product-shell" :product="product" always-show-action compact />
        </div>
      </div>
    </section>

    <!-- ── 活動專區 ── -->
    <section class="bg-white py-6 lg:py-8 border-t border-gray-100">
      <div class="max-w-7xl mx-auto px-4 lg:px-8">
        <div class="mb-5 lg:mb-6">
          <h2 class="home-section-title">活動專區</h2>
        </div>
        <div class="grid gap-4 lg:grid-cols-2 lg:items-stretch">
          <router-link to="/event/SUMMER2026"
            class="home-promo-tile group relative min-h-[16rem] overflow-hidden rounded-2xl bg-brand-dark text-white shadow-sm"
          >
            <img :src="eventBannerImage" alt="夏季安心補給活動"
              class="absolute inset-0 h-full w-full object-cover opacity-90 transition-transform duration-700 group-hover:scale-105" />
            <div class="absolute inset-0 bg-gradient-to-r from-brand-dark/55 via-brand-dark/25 to-transparent"></div>
            <div class="relative flex h-full min-h-[16rem] flex-col justify-between p-5 lg:p-6">
              <div>
                <p class="inline-flex rounded-full bg-white/15 px-3 py-1 text-[10px] font-black tracking-[0.28em] text-white">SEASON EVENT</p>
                <h2 class="mt-4 max-w-xl text-2xl font-black leading-tight lg:text-3xl">夏季安心補給活動</h2>
                <p class="mt-3 max-w-xl text-xs leading-6 text-white/80 lg:text-sm">人氣商品、組合優惠與會員專屬內容，活動期間限定優惠。</p>
              </div>
              <span class="mt-6 inline-flex w-fit rounded-xl bg-white px-4 py-2 text-[10px] font-black tracking-[0.24em] text-brand-dark transition-colors group-hover:bg-brand-primary group-hover:text-white">
                查看活動內容
              </span>
            </div>
          </router-link>

          <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
            <router-link v-for="item in eventHighlights" :key="item.key" :to="item.to"
              class="home-promo-tile rounded-2xl border border-gray-100 bg-brand-bg p-4 shadow-sm transition-all hover:-translate-y-1 hover:bg-white hover:shadow-md"
            >
              <p class="text-[10px] font-black tracking-[0.28em] text-brand-primary">{{ item.eyebrow }}</p>
              <h3 class="mt-2 type-card-title">{{ item.title }}</h3>
              <p class="mt-2 type-body text-gray-500">{{ item.description }}</p>
            </router-link>
          </div>
        </div>
      </div>
    </section>

    <!-- ── 會員 Banner ── -->
    <section class="max-w-7xl mx-auto px-4 lg:px-8 py-6 lg:py-8">
      <div class="grid gap-4 lg:grid-cols-2 lg:items-stretch">
        <HomeBanner size="small" class="home-banner-shell" tag="Membership" title="會員召集令<br />首購現折 $100"
          :image="memberBannerImage" cta="立即註冊" to="/register" image-position="center center" />
        <router-link
          :to="lineLoginPath"
          class="home-promo-tile group relative min-h-[220px] overflow-hidden rounded-2xl bg-brand-dark text-white shadow-sm"
        >
          <img :src="communityBannerImage" alt="加入官方 LINE 領取免運券"
            class="absolute inset-0 h-full w-full object-cover opacity-95 transition-transform duration-700 group-hover:scale-105"
            style="object-position: center top; filter: brightness(1.1) saturate(1.08);" />
          <div class="absolute inset-0 bg-gradient-to-b from-transparent via-brand-dark/20 to-brand-dark/45"></div>
          <div class="relative flex h-full min-h-[220px] flex-col justify-between p-5 lg:p-6">
            <div>
              <p class="inline-flex rounded-full bg-white/15 px-3 py-1 text-[10px] font-black tracking-[0.28em] text-white">Community</p>
              <h2 class="mt-3 text-2xl font-black leading-tight lg:text-3xl">加入官方 LINE<br />領取免運券</h2>
              <p class="mt-3 max-w-sm text-xs leading-6 text-white/80">第一手掌握新品、優惠與活動訊息，日常補貨更即時。</p>
            </div>
            <span class="inline-flex w-fit items-center gap-2 text-[10px] font-black tracking-[0.24em] text-white/90 transition-colors group-hover:text-white">
              立即登入 <span aria-hidden="true">→</span>
            </span>
          </div>
        </router-link>
      </div>
    </section>

    <!-- ── Tags ── -->
    <section class="max-w-7xl mx-auto px-4 lg:px-8 py-6 lg:py-10 border-t border-gray-100">
      <div class="flex flex-wrap items-center justify-center gap-3 lg:gap-4">
        <router-link
          v-for="tag in popularTags" :key="tag"
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
import { buildCategoryPathFromCategory } from '@/utils/category-path'
import { Category, Product } from '@/types'
import scrapedProducts from '@/data/products.json'
import categoryBannerLookup from '@/data/category-banners.json'
import ProductCard from '@/components/product/ProductCard.vue'
import HomeBanner from '@/components/layout/HomeBanner.vue'

interface HomeHeroSlide {
  id: string
  tag: string
  title: string
  subtitle: string
  image: string
  cta: string
  to: string
}

interface CategoryBannerRecord {
  bannerImage?: string
  bannerImages?: string[]
  sourceUrl?: string
}

interface ImportedHomeProduct {
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
  capturedAt?: string
  sourceCategoryNames?: string[]
  sourceCategories?: string[]
}

const categoryBannerMap = new Map<string, CategoryBannerRecord>(
  Object.entries(categoryBannerLookup as Record<string, CategoryBannerRecord>),
)

const importedHomeProducts = scrapedProducts as ImportedHomeProduct[]
const importedHomeProductMap = new Map<string, ImportedHomeProduct>(
  importedHomeProducts.map((product) => [String(product.oldProductId), product]),
)
const FLASH_CATEGORY_NAMES = new Set(['限時優惠快閃區', '特惠專區'])

function resolveCategoryBanner(category: Category): string {
  const record = categoryBannerMap.get(category.id)
  return record?.bannerImage || record?.bannerImages?.[0] || category.bannerImage || category.bannerImages?.[0] || category.icon
}

function parseCapturedAt(raw?: string): number {
  if (!raw) return 0
  const time = new Date(raw).getTime()
  return Number.isFinite(time) ? time : 0
}

function isFlashSourceProduct(raw: ImportedHomeProduct): boolean {
  const text = `${raw.categoryName || ''} ${raw.subcategoryName || ''} ${raw.productName || ''} ${raw.shortDescription || ''} ${raw.productDescription || ''}`
  if ([raw.categoryName, raw.subcategoryName].some((value) => FLASH_CATEGORY_NAMES.has(String(value || '').trim()))) return true
  if ((raw.sourceCategoryNames || []).some((value) => FLASH_CATEGORY_NAMES.has(String(value || '').trim()))) return true
  if ((raw.sourceCategories || []).some((value) => FLASH_CATEGORY_NAMES.has(String(value || '').trim()))) return true
  return /(限時|快閃|特惠)/.test(text)
}

function resolveProductsByIds(products: Product[], ids: string[]): Product[] {
  const byId = new Map(products.map((product) => [product.id, product]))
  return ids.map((id) => byId.get(id)).filter((product): product is Product => Boolean(product))
}

function appendUniqueProducts(base: Product[], candidates: Product[], limit: number): Product[] {
  const seen = new Set(base.map((product) => product.id))
  const result = [...base]

  for (const product of candidates) {
    if (result.length >= limit) break
    if (seen.has(product.id)) continue
    seen.add(product.id)
    result.push(product)
  }

  return result
}

export default Vue.extend({
  name: 'HomeView',
  components: { ProductCard, HomeBanner },
  data(): {
    heroSlides: HomeHeroSlide[]
    currentHeroIndex: number
    heroTimer: number | null
    popularTags: string[]
    eventHighlights: Array<{ key: string; eyebrow: string; title: string; description: string; to: string }>
  } {
    return {
      heroSlides: [
        {
          id: 'hero-fresh-1',
          tag: 'Season Pick',
          title: '生鮮直送<br />新鮮出發',
          subtitle: '嚴選安心食材，讓每日餐桌更自然新鮮。',
          image: '/home-banners/banner-01.png',
          cta: '前往生鮮直送',
          to: '/category/fresh',
        },
        {
          id: 'hero-fresh-2',
          tag: 'Fresh Market',
          title: '當季蔬果<br />每日補給',
          subtitle: '把握產地風味，把季節的好滋味帶回家。',
          image: '/home-banners/banner-02.png',
          cta: '探索當季鮮採',
          to: '/category/fresh',
        },
        {
          id: 'hero-pantry-1',
          tag: 'Kitchen Choice',
          title: '廚房料理品<br />備料更完整',
          subtitle: '油品、調味、穀物與常備食材一次看齊。',
          image: '/home-banners/banner-03.png',
          cta: '前往廚房料理品',
          to: '/category/pantry',
        },
      ],
      currentHeroIndex: 0,
      heroTimer: null as number | null,
      popularTags: ['產地直送', '有機認證', '無添加', '銀髮友善', '低溫配送', '安心購'],
      eventHighlights: [
        {
          key: 'flash',
          eyebrow: 'LIMITED PICKS',
          title: '限時強檔',
          description: '活動期間主打商品與本週精選快速瀏覽。',
          to: '/products',
        },
        {
          key: 'new',
          eyebrow: 'NEW ARRIVALS',
          title: '新品上市',
          description: '本月最新商品，搶先探索當季精選好物。',
          to: '/products',
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
    products(): Product[] {
      return this.$store.getters['products/allProducts']
    },
    categories(): Category[] {
      return this.$store.getters['products/allCategories']
    },
    currentHeroSlide(): HomeHeroSlide {
      const slides = this.heroSlides
      if (!slides.length) {
        return {
          id: 'hero-fallback',
          tag: 'Season Pick',
          title: '安心食材<br />新鮮上架',
          subtitle: '瀏覽最新分類與商品，快速找到需要的日常選品。',
          image: '/site-assets/logo.gif',
          cta: '前往商品列表',
          to: '/products',
        }
      }
      return slides[this.currentHeroIndex % slides.length] || slides[0]
    },
    newArrivalProducts(): Product[] {
      const latestRaw = importedHomeProducts
        .filter((raw) => !isFlashSourceProduct(raw))
        .sort((a, b) =>
          parseCapturedAt(b.capturedAt) - parseCapturedAt(a.capturedAt) ||
          Number(b.oldProductId) - Number(a.oldProductId),
        )
      const latestProducts = resolveProductsByIds(this.products, latestRaw.map((raw) => raw.oldProductId))
      const fallbackProducts = this.products
        .filter((product) => {
          const raw = importedHomeProductMap.get(product.id)
          return raw ? !isFlashSourceProduct(raw) : true
        })
        .sort((a, b) => {
          const rawA = importedHomeProductMap.get(a.id)
          const rawB = importedHomeProductMap.get(b.id)
          return parseCapturedAt(rawB?.capturedAt) - parseCapturedAt(rawA?.capturedAt) ||
            Number(b.id) - Number(a.id) ||
            b.id.localeCompare(a.id)
        })

      return appendUniqueProducts(latestProducts, fallbackProducts, 12)
    },
    hotProducts(): Product[] {
      const seasonalIds = new Set<string>([
        ...this.$store.getters['products/descendantCategoryIds']('fresh'),
        ...this.$store.getters['products/descendantCategoryIds']('生鮮直送'),
      ])
      return this.products
        .filter((product) => {
          if (seasonalIds.has(product.categoryId)) return false
          const raw = importedHomeProductMap.get(product.id)
          return raw ? !isFlashSourceProduct(raw) : true
        })
        .sort((a, b) => (b.salesCount ?? 0) - (a.salesCount ?? 0) || b.id.localeCompare(a.id))
        .slice(0, 18)
    },
    seasonalProducts(): Product[] {
      const freshDescendants: string[] = [
        ...this.$store.getters['products/descendantCategoryIds']('fresh'),
        ...this.$store.getters['products/descendantCategoryIds']('生鮮直送'),
      ]
      const seasonal = this.products
        .filter((product) => freshDescendants.includes(product.categoryId))
        .sort((a, b) => {
          const rawA = importedHomeProductMap.get(a.id)
          const rawB = importedHomeProductMap.get(b.id)
          return parseCapturedAt(rawB?.capturedAt) - parseCapturedAt(rawA?.capturedAt) ||
            (b.salesCount ?? 0) - (a.salesCount ?? 0) ||
            b.id.localeCompare(a.id)
        })

      return seasonal.slice(0, 6)
    },
    eventBannerImage(): string {
      return '/home-banners/event-banner.png'
    },
    memberBannerImage(): string {
      return '/home-banners/membership-banner.png'
    },
    communityBannerImage(): string {
      return '/home-banners/community-banner.png'
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
    buildQuickCategoryPath(categoryId: string): string {
      return buildCategoryPathFromCategory(this.categories, categoryId)
    },
    startHeroTimer() {
      const state = this as any
      if (state.heroTimer) window.clearInterval(state.heroTimer)
      if (this.heroSlides.length <= 1) return
      state.heroTimer = window.setInterval(() => { this.nextHeroSlide() }, 4500)
    },
    nextHeroSlide() {
      const state = this as any
      if (!this.heroSlides.length) return
      state.currentHeroIndex = (state.currentHeroIndex + 1) % this.heroSlides.length
      this.startHeroTimer()
    },
    prevHeroSlide() {
      const state = this as any
      if (!this.heroSlides.length) return
      state.currentHeroIndex = (state.currentHeroIndex - 1 + this.heroSlides.length) % this.heroSlides.length
      this.startHeroTimer()
    },
    goToHeroSlide(index: number) {
      const state = this as any
      if (!this.heroSlides.length) return
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
.home-section-title {
  display: inline-block;
  border-left: 4px solid #76B82A;
  padding-left: 1rem;
  font-size: 1.5rem;
  font-weight: 900;
  line-height: 1.15;
  letter-spacing: 0.12em;
  color: #1f2937;
}
.home-section-title-compact {
  font-size: 1.25rem;
}
.home-section-title-xl {
  font-size: 1.5rem;
}
.home-section-subtitle {
  padding-left: 1.25rem;
  font-size: 0.75rem;
  font-weight: 800;
  line-height: 1.4;
  letter-spacing: 0.3em;
  color: #76B82A;
  opacity: 0.8;
}
.home-section-copy {
  margin-top: 0.5rem;
}
.home-section-cta {
  letter-spacing: 0.24em;
}
:deep(.home-banner-shell) {
  border-radius: 1.25rem !important;
  box-shadow: 0 16px 36px rgba(15, 23, 42, 0.08) !important;
  overflow: hidden;
}
:deep(.home-banner-hero) {
  box-shadow: 0 20px 48px rgba(15, 23, 42, 0.12) !important;
}
:deep(.home-product-shell) {
  border-radius: 1.125rem !important;
  box-shadow: 0 10px 28px rgba(15, 23, 42, 0.06) !important;
}
:deep(.home-promo-tile) {
  border-radius: 1.125rem !important;
  box-shadow: 0 12px 32px rgba(15, 23, 42, 0.08) !important;
}
.hero-banner::v-deep img {
  background-color: #E8F5E8;
  object-fit: cover;
  object-position: center;
}
</style>
