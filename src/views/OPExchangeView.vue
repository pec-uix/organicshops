<template>
  <div class="min-h-screen bg-brand-bg pb-24 text-gray-800">
    <div class="mx-auto max-w-7xl px-4 py-8 lg:px-8">

      <!-- Breadcrumb -->
      <nav class="mb-6 flex flex-wrap items-center gap-x-1.5 gap-y-1 text-sm text-gray-500">
        <router-link to="/" class="inline-flex items-center gap-1 whitespace-nowrap transition-colors hover:text-brand-primary">
          <svg class="h-4 w-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 11.5L12 4l9 7.5M5.5 10.5V20h13v-9.5M9.5 20v-5.5h5V20" />
          </svg>
          <span>首頁</span>
        </router-link>
        <span class="inline-flex items-center gap-1.5 whitespace-nowrap">
          <span>›</span>
          <router-link to="/events" class="transition-colors hover:text-brand-primary">活動專區</router-link>
        </span>
        <span class="inline-flex items-center gap-1.5 whitespace-nowrap">
          <span>›</span>
          <span class="text-gray-800">主題企劃</span>
        </span>
        <span class="inline-flex items-center gap-1.5 whitespace-nowrap text-gray-800">
          <span>›</span>
          <span>OP 點數加價購</span>
        </span>
      </nav>

      <!-- Banner -->
      <section class="mb-6 overflow-hidden rounded-[28px] bg-white shadow-sm">
        <div class="relative h-[320px] overflow-hidden sm:h-[380px] lg:h-[420px]">
          <img src="/site-assets/goji.png" alt="OP 點數加價購" class="absolute inset-0 h-full w-full object-cover object-center" />
          <div class="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-black/15"></div>
          <div class="absolute inset-0 flex items-end p-6 sm:p-8 lg:p-12">
            <div class="max-w-2xl text-white">
              <p class="inline-flex rounded-none bg-brand-primary px-4 py-1 text-sm font-bold tracking-[0.2em] uppercase text-white">
                主題企劃
              </p>
              <h1 class="mt-5 text-[clamp(2.5rem,5vw,4.8rem)] font-black leading-[0.95] tracking-[-0.02em] text-white">
                OP 點數加價購
              </h1>
              <p class="mt-5 max-w-3xl text-lg font-semibold leading-8 text-white/92 sm:text-2xl sm:leading-9">
                使用指定 OP 點數搭配加購價，換購統一生機精選商品。
              </p>
              <p class="mt-4 max-w-3xl text-base font-semibold leading-7 text-white/88 sm:text-lg">
                登入會員後可查看可用點數，並將商品加入購物車。
              </p>
              <div class="mt-6 flex flex-wrap gap-2">
                <span class="rounded-full bg-white/20 px-3 py-1.5 text-sm font-bold text-white backdrop-blur-sm ring-1 ring-white/30">點數 + 加購價</span>
                <span class="rounded-full bg-white/20 px-3 py-1.5 text-sm font-bold text-white backdrop-blur-sm ring-1 ring-white/30">指定商品適用</span>
                <span class="rounded-full bg-white/20 px-3 py-1.5 text-sm font-bold text-white backdrop-blur-sm ring-1 ring-white/30">可加入購物車結帳</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Points widget + Steps -->
      <div class="mb-6 grid gap-4 lg:grid-cols-[1fr_22rem]">
        <section class="grid gap-4 md:grid-cols-3">
          <div class="rounded-2xl border-2 border-brand-primary/30 bg-brand-surface/40 p-5">
            <p class="type-eyebrow text-brand-primary">STEP 1</p>
            <h2 class="mt-2 type-card-title text-brand-dark">選擇換購商品</h2>
            <p class="mt-2 type-muted text-brand-dark/60">每項商品會標示所需 OP 點數與加購金額。</p>
          </div>
          <div class="rounded-2xl border-2 border-brand-primary/30 bg-brand-surface/40 p-5">
            <p class="type-eyebrow text-brand-primary">STEP 2</p>
            <h2 class="mt-2 type-card-title text-brand-dark">加入購物車</h2>
            <p class="mt-2 type-muted text-brand-dark/60">點數需求會在購物車與結帳摘要中分開呈現。</p>
          </div>
          <div class="rounded-2xl border-2 border-brand-primary/30 bg-brand-surface/40 p-5">
            <p class="type-eyebrow text-brand-primary">STEP 3</p>
            <h2 class="mt-2 type-card-title text-brand-dark">完成結帳</h2>
            <p class="mt-2 type-muted text-brand-dark/60">依商品溫層與配送方式完成訂單。</p>
          </div>
        </section>

        <aside class="rounded-2xl border border-gray-100 bg-brand-surface p-6 shadow-sm">
          <p class="type-eyebrow text-brand-primary">OPENPOINT</p>
          <template v-if="isLoggedIn">
            <p class="mt-4 text-sm font-bold text-gray-500">目前可用點數</p>
            <div class="mt-2 flex items-baseline gap-2 text-brand-primary">
              <span class="text-4xl font-black leading-none">{{ userPoints.toLocaleString() }}</span>
              <span class="text-sm font-bold">點</span>
            </div>
            <p class="mt-3 type-muted text-gray-500">點數效期至 2026-12-31</p>
          </template>
          <template v-else>
            <h2 class="mt-4 type-section-title">登入後查看點數</h2>
            <p class="mt-3 type-body text-gray-600">登入會員即可確認可用點數，並使用點數加價購指定商品。</p>
            <router-link
              :to="{ name: 'login', query: { redirect: $route.fullPath } }"
              class="mt-5 inline-flex rounded-xl bg-brand-primary px-5 py-3 type-action text-white transition-colors hover:bg-brand-dark"
            >立即登入</router-link>
          </template>
        </aside>
      </div>

    </div>

    <main class="mx-auto max-w-7xl px-4 lg:px-8">
      <div class="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p class="type-eyebrow text-brand-primary">Exchange Items</p>
          <h2 class="mt-2 type-section-title">可換購商品</h2>
        </div>
        <p class="text-sm font-bold text-gray-400">共 {{ exchangeItems.length }} 件商品</p>
      </div>

      <!-- ── Product Grid ── -->
      <div class="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-5 xl:grid-cols-4 xl:gap-6">
        <article
          v-for="item in exchangeItems"
          :key="item.id"
          class="group flex cursor-pointer flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
          @click="goToProductDetail(item)"
        >
          <div class="relative aspect-square overflow-hidden bg-gray-50">
            <img :src="item.image" :alt="item.name" class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
          </div>
          <div class="flex flex-1 flex-col p-3">
            <h3 class="line-clamp-2 h-[2.75rem] text-sm font-bold leading-snug text-brand-dark">{{ item.name }}</h3>
            <div class="mt-auto pt-3">
              <p v-if="item.originalPrice" class="text-xs font-bold text-gray-400 line-through">售價 ${{ item.originalPrice.toLocaleString() }}</p>
              <p class="mt-0.5 flex flex-wrap items-baseline gap-1 text-sm font-black text-brand-primary">
                <span>{{ item.requiredOpPoints }} OP 點</span>
                <span v-if="item.memberPrice">+ ${{ item.memberPrice.toLocaleString() }}</span>
              </p>
              <button
                type="button"
                class="mt-2 h-9 w-full rounded-xl bg-brand-primary text-sm font-bold text-white transition-all hover:bg-brand-dark active:scale-95"
                @click.stop="addExchangeItemToCart(item)"
              >
                加入購物車
              </button>
            </div>
          </div>
        </article>
      </div>
    </main>

    <!-- ── Product Detail Modal ── -->
    <transition name="modal-fade">
      <div
        v-if="detailProduct"
        class="fixed inset-0 z-50 flex items-end justify-center bg-black/50 sm:items-center sm:p-4"
        @click.self="closeDetail"
      >
        <div class="flex w-full max-w-4xl flex-col overflow-hidden rounded-t-3xl bg-white shadow-xl sm:h-[640px] sm:rounded-3xl">

          <!-- Top section -->
          <div class="flex flex-shrink-0 flex-col sm:h-[300px] sm:flex-row">

            <!-- Left: image gallery -->
            <div class="relative w-full flex-shrink-0 bg-gray-50 sm:h-full sm:w-[44%]">
              <button
                class="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-gray-500 shadow-sm backdrop-blur-sm hover:text-gray-800 sm:hidden"
                @click="closeDetail"
              >
                <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
              <img
                :src="detailGallery[detailImageIndex]"
                :alt="detailProduct.name"
                class="h-48 w-full object-cover sm:h-full"
              />
            </div>

            <!-- Right: info -->
            <div class="flex min-h-0 flex-1 flex-col overflow-hidden p-4 sm:p-6">
              <div class="flex items-start justify-between gap-2">
                <h2 class="text-lg font-black leading-tight text-brand-dark sm:text-xl">{{ detailProduct.name }}</h2>
                <button
                  class="hidden flex-shrink-0 sm:flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200"
                  @click="closeDetail"
                >
                  <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12"/></svg>
                </button>
              </div>
              <div class="mt-1 h-px bg-gray-100"></div>
              <p class="mt-3 line-clamp-3 text-sm font-semibold leading-6 text-gray-500">{{ detailProduct.description }}</p>

              <!-- Variant selector -->
              <div v-if="detailVariants.length > 1" class="mt-3">
                <p class="mb-1.5 text-xs font-bold text-gray-400">規格選擇</p>
                <div class="flex flex-wrap gap-2">
                  <button
                    v-for="v in detailVariants"
                    :key="v.id"
                    type="button"
                    class="rounded-full border px-3 py-1 text-xs font-bold transition-colors"
                    :class="detailVariantId === v.id
                      ? 'border-brand-primary bg-brand-surface text-brand-primary'
                      : 'border-gray-200 text-gray-500 hover:border-brand-primary/50'"
                    @click="detailVariantId = v.id"
                  >
                    {{ v.label }}
                  </button>
                </div>
              </div>

              <!-- Price -->
              <div class="mt-auto overflow-hidden pt-3">
                <dl class="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1.5 text-sm">
                  <dt class="font-bold text-gray-400">售價</dt>
                  <dd class="font-bold text-gray-400 line-through">${{ (detailSelectedVariant.originalPrice || detailSelectedVariant.price).toLocaleString() }}</dd>
                  <dt class="font-black text-brand-primary">OP 換購</dt>
                  <dd class="font-black text-brand-primary">
                    {{ (detailSelectedVariant.requiredOpPoints || detailProduct.requiredOpPoints) }} OP 點
                    <span v-if="detailSelectedVariant.memberPrice"> + ${{ detailSelectedVariant.memberPrice.toLocaleString() }}</span>
                  </dd>
                  <dt class="font-bold text-gray-400">規格</dt>
                  <dd class="font-bold text-gray-600">{{ detailSelectedVariant.unit || detailProduct.unit }}</dd>
                </dl>
              </div>
            </div>
          </div>

          <!-- Thumbnail strip -->
          <div v-if="detailGallery.length > 1" class="flex flex-shrink-0 gap-2 border-t border-gray-100 bg-gray-50 px-4 py-2">
            <button
              v-for="(img, i) in detailGallery"
              :key="i"
              type="button"
              class="h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg border-2 transition-colors"
              :class="detailImageIndex === i ? 'border-brand-primary' : 'border-transparent'"
              @click="detailImageIndex = i"
            >
              <img :src="img" :alt="`圖片 ${i + 1}`" class="h-full w-full object-cover" />
            </button>
          </div>

          <!-- Tab nav -->
          <div class="flex flex-shrink-0 border-b border-gray-100">
            <button
              v-for="tab in detailTabs"
              :key="tab.key"
              type="button"
              class="flex-1 py-3 text-xs font-black transition-colors sm:text-sm"
              :class="detailTab === tab.key ? 'border-b-2 border-brand-primary text-brand-primary' : 'text-gray-400 hover:text-gray-600'"
              @click="detailTab = tab.key"
            >
              {{ tab.label }}
            </button>
          </div>

          <!-- Tab content -->
          <div class="flex-1 overflow-y-auto p-4 sm:p-6">
            <template v-if="detailTab === 'features'">
              <ul class="space-y-2.5">
                <li
                  v-for="(feat, i) in detailFeatures"
                  :key="i"
                  class="flex items-start gap-2.5"
                >
                  <span class="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-brand-surface text-brand-primary">
                    <svg class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/></svg>
                  </span>
                  <span class="text-sm font-semibold leading-5 text-gray-600">{{ feat }}</span>
                </li>
              </ul>
            </template>
            <template v-else-if="detailTab === 'intro'">
              <p class="text-sm font-semibold leading-7 text-gray-600">{{ detailProduct.introduction || detailProduct.description }}</p>
            </template>
            <template v-else>
              <dl class="divide-y divide-gray-50">
                <div class="flex gap-4 py-2.5">
                  <dt class="w-20 flex-shrink-0 text-xs font-bold text-gray-400">產地</dt>
                  <dd class="text-sm font-semibold text-gray-700">{{ detailProduct.origin || '依商品標示' }}</dd>
                </div>
                <div class="flex gap-4 py-2.5">
                  <dt class="w-20 flex-shrink-0 text-xs font-bold text-gray-400">保存方式</dt>
                  <dd class="text-sm font-semibold text-gray-700">{{ tempZoneLabel }}</dd>
                </div>
                <div v-if="detailSelectedVariant.unit || detailProduct.unit" class="flex gap-4 py-2.5">
                  <dt class="w-20 flex-shrink-0 text-xs font-bold text-gray-400">規格</dt>
                  <dd class="text-sm font-semibold text-gray-700">{{ detailSelectedVariant.unit || detailProduct.unit }}</dd>
                </div>
                <div v-if="detailProduct.isOrganic" class="flex gap-4 py-2.5">
                  <dt class="w-20 flex-shrink-0 text-xs font-bold text-gray-400">認證</dt>
                  <dd class="text-sm font-semibold text-gray-700">有機認證</dd>
                </div>
                <div class="flex gap-4 py-2.5">
                  <dt class="w-20 flex-shrink-0 text-xs font-bold text-gray-400">換購需求</dt>
                  <dd class="text-sm font-semibold text-brand-primary">{{ (detailSelectedVariant.requiredOpPoints || detailProduct.requiredOpPoints) }} OPENPOINT 點數</dd>
                </div>
              </dl>
            </template>
          </div>

          <!-- Fixed bottom CTA -->
          <div class="flex-shrink-0 border-t border-gray-100 bg-white p-4">
            <button
              type="button"
              class="h-12 w-full rounded-2xl text-sm font-black transition-all active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-gray-300"
              :class="detailCanAdd ? 'bg-brand-primary text-white hover:bg-brand-dark' : 'bg-gray-300 text-white'"
              :disabled="!detailCanAdd"
              @click="addDetailToCart"
            >
              <template v-if="!isLoggedIn">請先登入</template>
              <template v-else-if="!detailCanAdd">點數不足（需 {{ detailSelectedVariant.requiredOpPoints || detailProduct.requiredOpPoints }} 點）</template>
              <template v-else>加入購物車</template>
            </button>
          </div>

        </div>
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Product, ProductVariant } from '@/types'
import { mockProducts } from '@/mock/data'

const TEMP_ZONE_LABELS: Record<string, string> = {
  frozen: '冷凍（-18°C 以下）',
  chilled: '冷藏（0–7°C）',
  fresh: '新鮮配送，請盡速食用',
  ambient: '常溫陰涼乾燥處',
}

const PRODUCT_FEATURES: Record<string, string[]> = {
  op201: [
    '100% 有機枸杞鮮榨，無添加防腐劑',
    '通過有機認證，從源頭把關品質',
    '富含花青素與多醣體，適合日常保養',
    '方便隨身攜帶，隨時補充活力',
    'OP 點數換購專屬優惠，限量供應',
  ],
  op202: [
    '智利純淨海域嚴選鮭魚，肉質鮮嫩',
    '急速鎖鮮冷凍，最大程度保留營養',
    '富含 Omega-3 脂肪酸，有益心血管健康',
    '無添加防腐劑，安心享用',
    '可超商取貨，購物更便利',
  ],
}

export default Vue.extend({
  name: 'OPExchangeView',
  data() {
    return {
      userPoints: 1250,
      detailProduct: null as Product | null,
      detailVariantId: '' as string,
      detailTab: 'features' as string,
      detailImageIndex: 0 as number,
      detailTabs: [
        { key: 'features', label: '產品特色' },
        { key: 'intro', label: '產品介紹' },
        { key: 'specs', label: '成分規格' },
      ],
    }
  },
  computed: {
    isLoggedIn(): boolean { return this.$store.getters['auth/isLoggedIn'] },
    exchangeItems(): Product[] {
      return mockProducts.filter((product) => product.requiredOpPoints && product.inStock)
    },
    detailVariants(): ProductVariant[] {
      if (!this.detailProduct) return []
      if (this.detailProduct.variants?.length) return this.detailProduct.variants
      return [{
        id: 'default',
        label: this.detailProduct.unit,
        unit: this.detailProduct.unit,
        price: this.detailProduct.price,
        originalPrice: this.detailProduct.originalPrice,
        memberPrice: this.detailProduct.memberPrice,
        requiredOpPoints: this.detailProduct.requiredOpPoints,
      }]
    },
    detailSelectedVariant(): ProductVariant {
      return this.detailVariants.find((v) => v.id === this.detailVariantId)
        || this.detailVariants[0]
        || { id: 'default', label: '', unit: '', price: 0 }
    },
    detailGallery(): string[] {
      if (!this.detailProduct) return []
      const imgs = this.detailProduct.images?.length ? this.detailProduct.images : [this.detailProduct.image]
      return [...new Set(imgs.filter(Boolean))]
    },
    detailFeatures(): string[] {
      if (!this.detailProduct) return []
      const preset = PRODUCT_FEATURES[this.detailProduct.id]
      if (preset) return preset
      const sentences = (this.detailProduct.description || '')
        .split(/[。！？\n]/)
        .map((s) => s.trim())
        .filter((s) => s.length > 4)
      return sentences.length ? sentences : [this.detailProduct.description]
    },
    detailCanAdd(): boolean {
      if (!this.detailProduct || !this.isLoggedIn) return false
      const needed = (this.detailSelectedVariant as any).requiredOpPoints ?? this.detailProduct.requiredOpPoints ?? 0
      return this.detailProduct.inStock && this.userPoints >= needed
    },
    tempZoneLabel(): string {
      if (!this.detailProduct) return ''
      return TEMP_ZONE_LABELS[this.detailProduct.tempZone] || '常溫陰涼乾燥處'
    },
  },
  methods: {
    productDetailTo(product: Product) {
      return {
        name: 'product-detail',
        params: { id: product.id },
        query: { from: this.$route.fullPath },
      }
    },
    goToProductDetail(product: Product) {
      this.$router.push(this.productDetailTo(product))
    },
    addExchangeItemToCart(product: Product) {
      const variant = product.variants?.[0] || {
        id: 'default',
        label: product.unit,
        unit: product.unit,
        price: product.price,
        originalPrice: product.originalPrice,
        memberPrice: product.memberPrice,
        requiredOpPoints: product.requiredOpPoints,
      }

      this.$store.dispatch('cart/addItem', {
        ...product,
        id: `${product.id}-${variant.id}`,
        name: variant.label ? `${product.name} (${variant.label})` : product.name,
        unit: variant.unit,
        price: Math.round(variant.price),
        originalPrice: variant.originalPrice,
        memberPrice: variant.memberPrice,
        requiredOpPoints: variant.requiredOpPoints ?? product.requiredOpPoints,
        quantity: 1,
      })
      this.$store.dispatch('ui/openCartDrawer')
    },
    openDetail(product: Product) {
      this.detailProduct = product
      this.detailVariantId = this.detailVariants[0]?.id || ''
      this.detailTab = 'features'
      this.detailImageIndex = 0
      document.body.style.overflow = 'hidden'
    },
    closeDetail() {
      this.detailProduct = null
      document.body.style.overflow = ''
    },
    addDetailToCart() {
      if (!this.detailCanAdd || !this.detailProduct) return
      const v = this.detailSelectedVariant
      this.$store.dispatch('cart/addItem', {
        ...this.detailProduct,
        id: `${this.detailProduct.id}-${v.id}`,
        unit: v.unit,
        price: Math.round(v.memberPrice ?? v.price),
        originalPrice: v.originalPrice,
        memberPrice: v.memberPrice,
        requiredOpPoints: (v as any).requiredOpPoints ?? this.detailProduct.requiredOpPoints,
        quantity: 1,
      })
      this.$store.dispatch('ui/openCartDrawer')
      this.closeDetail()
    },
  },
  beforeDestroy() {
    document.body.style.overflow = ''
  },
})
</script>

<style scoped>
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.2s ease;
}
.modal-fade-enter,
.modal-fade-leave-to {
  opacity: 0;
}
.modal-fade-enter-active > div,
.modal-fade-leave-active > div {
  transition: transform 0.25s ease;
}
.modal-fade-enter > div,
.modal-fade-leave-to > div {
  transform: translateY(2rem);
}
</style>
