<template>
  <div
    class="w-full min-w-0"
    :class="layout === 'grid' && !fullWidth ? 'mx-auto max-w-[15.5rem] md:max-w-[16rem] xl:max-w-[15rem] 2xl:max-w-[15.5rem] h-full' : ''"
  >
    <!-- ── 1. 商品卡主體 (統一標準規格) ── -->
    <div
      class="group/card bg-white border border-gray-100 rounded-2xl transition-all duration-300 overflow-hidden relative flex shadow-sm"
      :class="[cardClass, isMini ? 'h-[7.5rem]' : '', layout === 'list' ? 'w-full min-w-0 flex-row items-stretch h-[7.25rem] sm:h-[8rem] lg:h-[9rem]' : 'h-full flex-col min-h-[24.5rem] sm:min-h-[25rem]']"
      @mouseenter="onHoverEnter"
      @mouseleave="onHoverLeave"
    >
      <button
        v-if="showWishlistButton && !isMini && layout !== 'list'"
        class="absolute top-2 right-2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow-sm transition-all"
        :class="isWishlisted ? 'text-red-500' : 'text-gray-400 hover:text-red-400'"
        :title="isWishlisted ? '取消收藏' : '加入收藏'"
        @click.stop="toggleWishlist"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4.5 w-4.5" :fill="isWishlisted ? 'currentColor' : 'none'" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      </button>

      <!-- 圖片區 (嚴格 1:1, object-cover) -->
      <div v-if="isMini" class="relative h-[7.5rem] w-[7rem] flex-shrink-0 overflow-hidden rounded-lg bg-gray-50">
        <router-link :to="productDetailTo" class="block h-full w-full">
          <img
            v-if="isImageUrl(product.image)"
            :src="product.image"
            :alt="product.name"
            class="h-full w-full object-cover transition-transform duration-700 group-hover/card:scale-105"
          />
          <span
            v-else
            class="flex h-full w-full items-center justify-center text-6xl leading-none transition-transform duration-700 group-hover/card:scale-105"
          >
            {{ product.image }}
          </span>
        </router-link>
        <button
          v-if="showWishlistButton"
          class="absolute right-1 top-1 z-20 flex h-7 w-7 items-center justify-center rounded-full bg-white/90 shadow-sm transition-all"
          :class="isWishlisted ? 'text-red-500' : 'text-gray-400 hover:text-red-400'"
          :title="isWishlisted ? '取消收藏' : '加入收藏'"
          @click.stop="toggleWishlist"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" :fill="isWishlisted ? 'currentColor' : 'none'" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>
        <div v-if="!product.inStock" class="absolute inset-0 flex items-center justify-center bg-white/60 backdrop-blur-[1px]">
          <span class="rounded bg-gray-400 px-2.5 py-1 text-[10px] font-bold text-white">已售完</span>
        </div>
      </div>
      <div
        v-else-if="layout === 'list'"
        class="product-card-list-image relative self-center flex-shrink-0 overflow-hidden bg-gray-50"
      >
        <router-link :to="productDetailTo" class="block h-full w-full">
          <img
            v-if="isImageUrl(product.image)"
            :src="product.image"
            :alt="product.name"
            class="h-full w-full object-cover transition-transform duration-700 group-hover/card:scale-105"
          />
          <span
            v-else
            class="flex h-full w-full items-center justify-center text-5xl leading-none transition-transform duration-700 group-hover/card:scale-105"
          >
            {{ product.image }}
          </span>
          <div v-if="!product.inStock" class="absolute inset-0 flex items-center justify-center bg-white/60 backdrop-blur-[1px]">
            <span class="rounded bg-gray-400 px-2.5 py-1 text-[10px] font-bold text-white">已售完</span>
          </div>
        </router-link>
      </div>
      <button
        v-if="showWishlistButton && !isMini && layout === 'list'"
        class="absolute right-2 top-2 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-red-500 shadow-sm transition-all hover:bg-white"
        :title="isWishlisted ? '取消收藏' : '加入收藏'"
        @click.stop="toggleWishlist"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4.5 w-4.5" :fill="isWishlisted ? 'currentColor' : 'none'" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      </button>
      <router-link
        v-if="!isMini && layout !== 'list'"
        :to="productDetailTo"
        class="relative w-full bg-gray-50 flex items-center justify-center overflow-hidden flex-shrink-0"
        :class="'aspect-square'"
      >
        <img
          v-if="isImageUrl(product.image)"
          :src="product.image"
          :alt="product.name"
          class="w-full h-full object-cover transition-transform duration-700 group-hover/card:scale-105"
        />
        <span
          v-else
          class="text-6xl sm:text-7xl leading-none transition-transform duration-700 group-hover/card:scale-105"
        >
          {{ product.image }}
        </span>
        <!-- 售完狀態遮罩 -->
        <div v-if="!product.inStock" class="absolute inset-0 bg-white/60 flex items-center justify-center backdrop-blur-[1px]">
          <span class="bg-gray-400 text-white px-3 py-1 text-xs font-bold rounded">已售完</span>
        </div>
      </router-link>

        <!-- 資訊內容區 -->
        <div
          class="flex-1 min-w-0 flex flex-col"
          :class="[
            isMini ? 'p-0' : layout === 'list' ? 'p-2.5 sm:p-3' : 'p-3 sm:p-3.5 min-h-[11rem] sm:min-h-[11.25rem]',
            layout === 'list' && !isMini ? 'overflow-hidden' : ''
          ]"
        >
        <!-- 商品名稱 (最多 2 行) -->
        <div v-if="!isMini && layout !== 'list'">
          <h3
            :class="'line-clamp-2 h-[2.75rem] overflow-hidden text-sm font-bold leading-snug tracking-tight text-brand-dark'"
          >
            {{ product.name }}
          </h3>
        </div>

        <template v-if="isMini">
          <div class="grid h-[7.5rem] min-w-0 flex-1 grid-rows-[2rem_1.25rem_2rem] items-start gap-y-2 px-0 py-2 pl-3 pr-3 text-left">
            <h3 class="line-clamp-2 text-left text-xs font-bold leading-tight text-gray-800">
                {{ product.name }}
            </h3>

            <div class="flex min-w-0 flex-nowrap items-baseline gap-2 overflow-hidden text-left whitespace-nowrap">
                <div class="flex shrink-0 items-baseline gap-0.5 whitespace-nowrap">
                  <span class="text-xs font-medium leading-none text-gray-400">
                    售價
                  </span>
                  <span class="text-xs font-bold leading-none text-gray-400 line-through">
                    ${{ regularPrice.toLocaleString() }}
                  </span>
                </div>
                <div v-if="hasMemberPrice" class="flex shrink-0 items-baseline gap-0.5 whitespace-nowrap">
                  <span class="text-xs font-medium leading-none text-red-600">
                    會員價
                  </span>
                  <span class="text-sm font-black leading-none text-red-600">
                    ${{ basePrice.toLocaleString() }}
                  </span>
                </div>
                <div v-else class="flex shrink-0 items-baseline gap-0.5 whitespace-nowrap">
                  <span class="text-xs font-medium leading-none text-gray-400">
                    會員價
                  </span>
                  <span class="text-sm font-black leading-none text-gray-900">
                    ${{ basePrice.toLocaleString() }}
                  </span>
                </div>
            </div>

            <button
              type="button"
              class="block h-8 w-1/2 justify-self-end flex-shrink-0 whitespace-nowrap rounded-lg bg-[#76B82A] py-1.5 text-center text-[11px] font-medium tracking-wide text-white shadow-sm transition hover:bg-[#659e22]"
              :disabled="!canAddToCart"
              @click.stop="openSpecModal"
            >
              {{ actionLabel }}
            </button>
          </div>
        </template>
        <template v-else>
          <!-- 價格 / CTA -->
          <template v-if="layout === 'list'">
            <div class="flex min-h-full min-w-0 flex-1 flex-col justify-center gap-2 sm:gap-2.5">
              <div class="min-w-0 pr-1">
                <div class="flex min-w-0 flex-wrap items-start gap-2">
                  <h3 class="line-clamp-2 min-h-[2.25rem] min-w-0 flex-1 overflow-hidden text-sm font-bold leading-tight tracking-tight text-brand-dark sm:min-h-[2.5rem] sm:text-base">
                    {{ product.name }}
                  </h3>
                  <span v-if="isOpExchange" class="shrink-0 rounded-full bg-brand-surface px-2 py-0.5 text-[10px] font-black text-brand-primary">
                    OP 換購
                  </span>
                  <span
                    v-for="tag in promotionTags"
                    :key="`list-${tag}`"
                    class="shrink-0 rounded-full bg-brand-surface px-2 py-0.5 text-[10px] font-black text-brand-primary"
                  >
                    {{ displayPromotionTag(tag) }}
                  </span>
                </div>
                <p v-if="product.requiredOpPoints || hasMemberPrice" class="mt-1 text-xs font-bold leading-none text-gray-400 line-through">
                  售價 ${{ regularPrice.toLocaleString() }}
                </p>
              </div>

              <div :class="[ctaRevealClass, 'flex min-w-0 items-center justify-between gap-3 lg:gap-8']">
                <div v-if="isOpExchange" class="min-w-0 whitespace-nowrap">
                  <p class="flex items-baseline gap-1 text-sm font-black leading-none text-brand-primary sm:text-base">
                    <span>{{ product.requiredOpPoints.toLocaleString() }} OP 點</span>
                    <span v-if="basePrice > 0">+ ${{ basePrice.toLocaleString() }}</span>
                  </p>
                </div>
                <div v-else class="flex min-w-0 items-center gap-2 whitespace-nowrap">
                  <span class="text-xs font-bold leading-none text-gray-400">會員價</span>
                  <span class="text-base font-black leading-none text-brand-primary">$</span>
                  <span class="text-base font-black leading-none text-brand-primary">{{ basePrice.toLocaleString() }}</span>
                </div>
                <button
                  @click.stop="openSpecModal"
                  :disabled="!canAddToCart"
                  class="flex h-9 w-[5.75rem] shrink-0 items-center justify-center gap-1 rounded-full bg-[#76B82A] px-2 text-[11px] font-bold text-white transition-all hover:bg-[#659e22] active:scale-95 disabled:cursor-not-allowed disabled:bg-gray-300 sm:w-[8.5rem] sm:text-xs lg:h-11 lg:w-[12rem] lg:text-sm"
                >
                  <template v-if="canAddToCart">
                    <span>{{ actionLabel }}</span>
                  </template>
                  <template v-else>
                    <span v-if="!product.inStock">已售完</span>
                    <span v-else>點數不足</span>
                  </template>
                </button>
              </div>
            </div>
          </template>
          <div v-else class="mt-auto flex h-[6.5rem] flex-col justify-end">
            <div class="flex h-[3.75rem] flex-col justify-end">
              <div v-if="product.requiredOpPoints">
                <p class="text-xs font-bold text-gray-400">
                  售價 ${{ regularPrice.toLocaleString() }}
                </p>
                <div class="mt-0.5 flex flex-wrap items-baseline gap-1.5 text-sm font-black text-brand-primary">
                  <span>
                    {{ product.requiredOpPoints.toLocaleString() }} OP 點
                  </span>
                  <span v-if="basePrice > 0">
                    + ${{ basePrice.toLocaleString() }}
                  </span>
                </div>
              </div>

              <div v-else>
                <p v-if="hasMemberPrice" class="text-xs font-bold text-gray-400 line-through">
                  售價 ${{ regularPrice.toLocaleString() }}
                </p>
                <p v-else class="text-xs font-bold text-gray-400">售價</p>
                <p class="mt-0.5 flex items-baseline gap-1 text-base font-black text-brand-primary">
                  <span class="text-xs">會員價</span>
                  <span class="text-xs">$</span>{{ basePrice.toLocaleString() }}
                </p>
              </div>
            </div>

            <div class="pt-2" :class="ctaRevealClass">
              <button
                @click.stop="openSpecModal"
                :disabled="!canAddToCart"
                class="h-9 w-full rounded-xl bg-[#76B82A] text-white text-sm font-bold transition-all flex items-center justify-center gap-2 active:scale-95 hover:bg-[#659e22] disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                <template v-if="canAddToCart">{{ actionLabel }}</template>
                <template v-else>
                  <span v-if="!product.inStock">已售完</span>
                  <span v-else>點數不足</span>
                </template>
              </button>
            </div>
          </div>

        </template>
      </div>
    </div>

    <!-- ── 2. 規格選購彈窗 (維持原有精品互動) ── -->
    <transition name="modal">
      <div v-if="isModalOpen" class="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4">
        <div class="absolute inset-0 bg-brand-dark/60 backdrop-blur-md" @click="isModalOpen = false"></div>
        <div class="relative w-full max-w-[56rem] bg-white shadow-xl animate-sheet-up sm:animate-zoom-in max-h-[85vh] sm:max-h-[90vh] overflow-y-auto rounded-t-[1.75rem] sm:rounded-2xl">
          <div class="flex min-h-0 flex-col lg:flex-row">
            <div class="w-full lg:w-[45%] bg-gray-50 flex items-center justify-center p-4 sm:p-6 lg:p-8 border-b border-gray-100 lg:border-b-0 lg:border-r lg:border-gray-100">
              <div class="aspect-square w-full max-w-[17rem] sm:max-w-[20rem] lg:max-w-none">
                <img
                  v-if="isImageUrl(product.image)"
                  :src="product.image"
                  :alt="product.name"
                  class="w-full h-full object-cover rounded-2xl drop-shadow-xl"
                />
                <div
                  v-else
                  class="flex h-full w-full items-center justify-center rounded-2xl bg-white text-[5rem] sm:text-[6.5rem] shadow-inner"
                >
                  {{ product.image }}
                </div>
              </div>
            </div>
            <div class="flex-1 min-h-0 flex flex-col">
              <div class="flex-1 overflow-y-auto p-5 sm:p-6 lg:p-8 flex flex-col min-h-0">
              <div class="mb-4 flex items-start justify-between gap-4">
                <div class="pr-2">
                  <p v-if="isBundleMode" class="mb-2 text-xs font-black tracking-[0.2em] text-brand-primary">加入組合購</p>
                  <h2 class="type-page-title text-gray-900 tracking-tight">
                    {{ product.name }}
                  </h2>
                  <p v-if="isBundleMode" class="mt-3 text-sm font-bold leading-6 text-gray-500">
                    {{ bundleRuleText }}
                  </p>
                </div>
                <button @click="isModalOpen = false" class="flex-shrink-0 text-gray-400 p-1">
                  <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
              <div class="space-y-5 flex-1 min-h-0">
                <div v-if="!isBundleMode">
                  <p class="text-[10px] font-bold text-brand-primary tracking-widest uppercase mb-3">{{ isBundleMode ? '選擇組合規格' : '選擇規格' }}</p>
                  <div class="grid grid-cols-2 gap-2">
                    <button 
                      v-for="spec in productVariants" 
                      :key="spec.label"
                      @click="handleSpecChange(spec)"
                      class="min-h-[3.5rem] px-3 py-2 text-left text-xs font-bold border rounded-xl transition-all"
                      :class="selectedSpec === spec.label ? 'bg-brand-primary text-white border-brand-primary' : 'bg-white text-gray-400 border-gray-100'"
                    >
                      <span class="block">{{ spec.label }}</span>
                      <span class="mt-1 block text-[10px] font-medium opacity-80">{{ spec.unit }}</span>
                    </button>
                  </div>
                </div>
                <div>
                  <p class="text-[10px] font-bold text-brand-primary tracking-widest uppercase mb-3">{{ isBundleMode ? '選擇數量' : '數量' }}</p>
                  <div class="flex items-center justify-between bg-gray-50 p-2 rounded-2xl">
                    <button @click="qty > 1 && qty--" class="w-12 h-12 flex items-center justify-center text-2xl text-gray-400">－</button>
                    <span class="font-bold text-2xl text-brand-dark">{{ qty }}</span>
                    <button @click="qty++" class="w-12 h-12 flex items-center justify-center text-2xl text-gray-400">＋</button>
                  </div>
                </div>
              </div>
              </div>
              <div class="sticky bottom-0 z-10 border-t border-gray-100 bg-white/95 backdrop-blur px-5 sm:px-6 lg:px-8 pt-5 sm:pt-6 pb-5 sm:pb-6">
                <div class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                  <div class="leading-none">
                    <template v-if="isBundleMode">
                      <p class="text-[10px] font-bold text-gray-400 uppercase mb-2">已選 {{ bundleSelectedCount }} / {{ bundleRequiredCount }} 件</p>
                      <span class="text-3xl sm:text-4xl font-black text-brand-primary"><span class="text-base">$</span>{{ bundlePrice.toLocaleString() }}</span>
                      <p class="mt-2 text-xs font-bold text-gray-400">需選滿 {{ bundleRequiredCount }} 件，組合價</p>
                    </template>
                    <template v-else>
                      <p class="text-[10px] font-bold text-gray-400 uppercase mb-2">小計</p>
                      <span class="text-3xl sm:text-4xl font-black text-brand-primary"><span class="text-base">$</span>{{ Math.round(currentPrice * qty).toLocaleString() }}</span>
                    </template>
                  </div>
                  <button @click="confirmAdd" class="w-full sm:w-auto sm:min-w-[14rem] h-12 sm:h-14 bg-brand-primary text-white text-sm sm:text-base font-bold rounded-2xl shadow-sm hover:bg-brand-dark transition-all">{{ confirmActionLabel }}</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { Product, ProductVariant } from '@/types'
import { addToWishlist, isWishlisted as checkIsWishlisted, removeFromWishlist } from '@/utils/wishlist'

export default Vue.extend({
  name: 'ProductCard',
  props: {
    product: { type: Object as PropType<Product>, required: true },
    layout:  { type: String as PropType<'grid' | 'list'>, default: 'grid' },
    variant: { type: String as PropType<'default' | 'editorial' | 'promo'>, default: 'default' },
    fullWidth: { type: Boolean, default: false },
    availableOpPoints: { type: Number, default: null },
    showWishlistButton: { type: Boolean, default: true },
    isMini: { type: Boolean, default: false },
    actionLabel: { type: String, default: '加入購物車' },
    confirmActionLabel: { type: String, default: '確認加入' },
    bundleRuleText: { type: String, default: '' },
    bundleSelectedCount: { type: Number, default: 1 },
    bundleRequiredCount: { type: Number, default: 2 },
    bundlePrice: { type: Number, default: 390 },
  },
  data() {
    return {
      isModalOpen: false,
      isWishlisted: false,
      selectedSpec: '',
      currentPrice: 0,
      qty: 1,
    }
  },
  computed: {
    isLoggedIn(): boolean { return this.$store.getters['auth/isLoggedIn'] },
    isBundleMode(): boolean {
      return this.actionLabel === '加入組合購'
    },
    productDetailTo(): { path: string; query?: Record<string, string> } {
      const from = this.$route.fullPath
      const query = from && from !== '/' ? { from } : undefined
      return { path: `/products/${this.product.id}`, query }
    },
    isOpExchange(): boolean { return !!this.product.requiredOpPoints },
    opPointShortage(): number {
      if (!this.product.requiredOpPoints || this.availableOpPoints === null || this.availableOpPoints === undefined) return 0
      return Math.max(0, this.product.requiredOpPoints - this.availableOpPoints)
    },
    canAddToCart(): boolean {
      return this.product.inStock && this.opPointShortage === 0
    },
    basePrice(): number {
      const variant = this.productVariants[0]
      return Math.round(variant.memberPrice ?? variant.price)
    },
    regularPrice(): number {
      const variant = this.productVariants[0]
      return Math.round(variant.originalPrice ?? variant.price)
    },
    hasMemberPrice(): boolean {
      return !!this.product.memberPrice && this.regularPrice > this.basePrice
    },
    qualityTags(): string[] {
      const tags = new Set<string>()
      if (this.product.isOrganic) tags.add('有機認證')
      if ((this.product.tags || []).includes('產地直送') || this.product.tempZone === 'fresh') tags.add('產地直送')
      if ((this.product.tags || []).includes('檢驗通過')) tags.add('檢驗通過')
      return Array.from(tags)
    },
    utilityTags(): string[] {
      const tags: string[] = []
      if (this.product.conveniencePickup) tags.push('可超商取貨')
      if ((this.product.tags || []).includes('買1送1')) tags.push('買1送1')
      if ((this.product.tags || []).includes('限時優惠')) tags.push('限時優惠')
      return tags
    },
    promotionTags(): string[] {
      const promoTags = ['買1送1', '買2送1', '買2送2', '買A送B', '限時優惠']
      return (this.product.tags || []).filter((tag) => promoTags.includes(tag))
    },
    cardClass(): string[] {
      const classes: string[] = []
      if (this.layout === 'grid') {
        classes.push('hover:-translate-y-1 hover:shadow-md')
      }
      if (this.variant === 'editorial') {
        classes.push('border-gray-100 bg-white/95')
      }
      if (this.variant === 'promo') {
        classes.push('border-gray-100 bg-white')
      }
      return classes
    },
    ctaRevealClass(): string[] {
      if (this.variant !== 'editorial') return []
      return [
        'transition-all duration-300',
        'md:opacity-0 md:translate-y-2 md:pointer-events-none md:group-hover/card:opacity-100 md:group-hover/card:translate-y-0 md:group-hover/card:pointer-events-auto',
        'opacity-100 translate-y-0 pointer-events-auto',
      ]
    },
    productVariants(): ProductVariant[] {
      if (this.product.variants?.length) return this.product.variants
      return [{
        id: 'default',
        label: this.product.unit,
        unit: this.product.unit,
        price: this.product.price,
        originalPrice: this.product.originalPrice,
        memberPrice: this.product.memberPrice,
        requiredOpPoints: this.product.requiredOpPoints,
      }]
    },
    selectedVariant(): ProductVariant {
      return this.productVariants.find((variant) => variant.label === this.selectedSpec) || this.productVariants[0]
    },
  },
  methods: {
    isImageUrl(image: string) {
      return /^https?:\/\//.test(image) || image.startsWith('/')
    },
    onHoverEnter() {
      // reserved for future analytics / micro-interactions
    },
    onHoverLeave() {
      // reserved for future analytics / micro-interactions
    },
    toggleWishlist() {
      this.isWishlisted = !this.isWishlisted
      if (this.isWishlisted) {
        addToWishlist(this.product)
        return
      }
      removeFromWishlist(this.product.id)
    },

    openSpecModal() {
      if (!this.product.inStock) return
      if (this.isOpExchange && !this.isLoggedIn) {
        this.$router.push({ name: 'login', query: { redirect: this.$route.fullPath } })
        return
      }
      this.isModalOpen = true
    },
    handleSpecChange(spec: ProductVariant) {
      this.selectedSpec = spec.label
      this.currentPrice = Math.round(spec.memberPrice ?? spec.price)
    },
    displayPromotionTag(tag: string): string {
      const labels: Record<string, string> = {
        '買1送1': '買 1 送 1',
        '買2送1': '買 2 送 1',
        '買2送2': '買 2 送 2',
        '買A送B': '買 A 送 B',
      }
      return labels[tag] || tag
    },
    confirmAdd() {
      const variant = this.selectedVariant
      this.$store.dispatch('cart/addItem', { 
        ...this.product, 
        id: `${this.product.id}-${variant.id}`,
        name: `${this.product.name} (${variant.label})`,
        unit: variant.unit,
        price: Math.round(variant.price),
        originalPrice: variant.originalPrice,
        memberPrice: variant.memberPrice,
        requiredOpPoints: variant.requiredOpPoints ?? this.product.requiredOpPoints,
        quantity: this.qty 
      })
      this.$store.dispatch('ui/openCartDrawer')
      this.isModalOpen = false
    }
  },
  created() {
    this.isWishlisted = checkIsWishlisted(this.product.id)
    this.selectedSpec = this.productVariants[0].label
    this.currentPrice = Math.round(this.productVariants[0].memberPrice ?? this.productVariants[0].price)
  }
})
</script>

<style scoped>
.animate-fade-in { animation: fadeIn 0.4s ease-out forwards; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }
.modal-enter-active, .modal-leave-active { transition: opacity 0.3s ease; }
.modal-enter, .modal-leave-to { opacity: 0; }
.animate-zoom-in { animation: zoomIn 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
@keyframes zoomIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
.animate-sheet-up { animation: sheetUp 0.28s cubic-bezier(0.16, 1, 0.3, 1); }
@keyframes sheetUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }

.product-card-list-image {
  width: 90px;
  min-width: 90px;
  height: 90px;
  min-height: 90px;
}

@media (min-width: 576px) {
  .product-card-list-image {
    width: 7.5rem;
    min-width: 7.5rem;
    height: 7.5rem;
    min-height: 7.5rem;
  }
}

@media (min-width: 992px) {
  .product-card-list-image {
    width: 9rem;
    min-width: 9rem;
    height: 9rem;
    min-height: 9rem;
  }
}
</style>
