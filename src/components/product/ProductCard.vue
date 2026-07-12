<template>
  <div
    class="w-full min-w-0"
    :class="layout === 'grid' && !fullWidth ? 'h-full' : ''"
  >
    <!-- ── 1. 商品卡主體 (統一標準規格) ── -->
    <div
      class="group/card bg-white border border-gray-100 rounded-2xl transition-all duration-300 overflow-hidden relative flex shadow-sm"
      :class="[cardClass, isMini ? 'h-[7.5rem]' : '', cardLayoutClass]"
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
            v-if="shouldShowImage(product.image)"
            :src="product.image"
            :alt="product.name"
            class="h-full w-full object-cover transition-transform duration-700 group-hover/card:scale-105"
            @error="markImageFailed(product.image)"
          />
          <span
            v-else
            class="flex h-full w-full items-center justify-center text-6xl leading-none transition-transform duration-700 group-hover/card:scale-105"
          >
            {{ placeholderText }}
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
            v-if="shouldShowImage(product.image)"
            :src="product.image"
            :alt="product.name"
            class="h-full w-full object-cover transition-transform duration-700 group-hover/card:scale-105"
            @error="markImageFailed(product.image)"
          />
          <span
            v-else
            class="flex h-full w-full items-center justify-center text-5xl leading-none transition-transform duration-700 group-hover/card:scale-105"
          >
            {{ placeholderText }}
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
          v-if="shouldShowImage(product.image)"
          :src="product.image"
          :alt="product.name"
          class="w-full h-full object-cover transition-transform duration-700 group-hover/card:scale-105"
          @error="markImageFailed(product.image)"
        />
        <span
          v-else
          class="text-6xl sm:text-7xl leading-none transition-transform duration-700 group-hover/card:scale-105"
        >
          {{ placeholderText }}
        </span>
        <!-- 買1送1 badge -->
        <div v-if="onePlusOneMode" class="absolute top-2 left-2 z-10">
          <span class="rounded-full bg-brand-primary px-2.5 py-1 text-[10px] font-black text-white shadow-sm">買 1 送 1</span>
        </div>
        <!-- 售完狀態遮罩 -->
        <div v-if="!product.inStock" class="absolute inset-0 bg-white/60 flex items-center justify-center backdrop-blur-[1px]">
          <span class="bg-gray-400 text-white px-3 py-1 text-xs font-bold rounded">已售完</span>
        </div>
      </router-link>

        <!-- 資訊內容區 -->
        <div
          class="flex-1 min-w-0 flex flex-col"
          :class="[
            contentClass,
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

        <!-- 買1送1 贈品說明 -->
        <div v-if="!isMini && layout !== 'list' && onePlusOneMode" class="mt-2 rounded-xl border border-brand-primary/15 bg-brand-surface/50 px-2.5 py-2">
          <div class="flex items-center gap-2">
            <span class="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-brand-primary text-[9px] font-black text-white">贈</span>
            <p class="flex-1 text-xs font-black text-brand-dark">買 1 件贈同品項</p>
            <span class="text-xs font-black text-brand-primary">$0</span>
          </div>
        </div>

        <template v-if="isMini">
          <div class="grid h-[7.5rem] min-w-0 flex-1 grid-rows-[2rem_1.25rem_2rem] items-start gap-y-2 px-0 py-2 pl-3 pr-3 text-left">
            <h3 class="line-clamp-2 text-left text-xs font-bold leading-tight text-gray-800">
                {{ product.name }}
            </h3>

            <div class="flex min-w-0 flex-nowrap items-baseline gap-2 overflow-hidden text-left whitespace-nowrap">
                <div v-if="hasRegularPrice" class="flex shrink-0 items-baseline gap-0.5 whitespace-nowrap">
                  <span class="text-xs font-medium leading-none text-gray-400">
                    售價
                  </span>
                  <span class="text-xs font-bold leading-none text-gray-400 line-through">
                    ${{ regularPrice.toLocaleString() }}
                  </span>
                </div>
                <div v-if="hasMemberPrice && hasBasePrice" class="flex shrink-0 items-baseline gap-0.5 whitespace-nowrap">
                  <span class="text-xs font-medium leading-none text-red-600">
                    會員價
                  </span>
                  <span class="text-sm font-black leading-none text-red-600">
                    ${{ basePrice.toLocaleString() }}
                  </span>
                </div>
                <div v-else-if="hasBasePrice" class="flex shrink-0 items-baseline gap-0.5 whitespace-nowrap">
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
                <p v-if="hasRegularPrice && (product.requiredOpPoints || hasMemberPrice)" class="mt-1 text-xs font-bold leading-none text-gray-400 line-through">
                  售價 ${{ regularPrice.toLocaleString() }}
                </p>
              </div>

              <div :class="[ctaRevealClass, 'flex min-w-0 items-center justify-between gap-3 lg:gap-8']">
                <div v-if="isOpExchange" class="min-w-0 whitespace-nowrap">
                  <p class="flex items-baseline gap-1 text-sm font-black leading-none text-brand-primary sm:text-base">
                    <span>{{ product.requiredOpPoints.toLocaleString() }} OP 點</span>
                    <span v-if="hasBasePrice">+ ${{ basePrice.toLocaleString() }}</span>
                  </p>
                </div>
                <div v-else-if="hasBasePrice" class="flex min-w-0 items-center gap-2 whitespace-nowrap">
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
          <div v-else :class="compact ? 'mt-4 flex h-[6.35rem] flex-col justify-between' : 'mt-auto flex h-[6.5rem] flex-col justify-end'">
            <div :class="compact ? 'flex min-h-[3.15rem] flex-col justify-start' : 'flex h-[3.75rem] flex-col justify-end'">
              <div v-if="product.requiredOpPoints">
                <p v-if="hasRegularPrice" class="text-xs font-bold text-gray-400">
                  售價 ${{ regularPrice.toLocaleString() }}
                </p>
                <div :class="compact ? 'mt-1.5 flex flex-wrap items-baseline gap-1.5 text-sm font-black text-brand-primary' : 'mt-0.5 flex flex-wrap items-baseline gap-1.5 text-sm font-black text-brand-primary'">
                  <span>
                    {{ product.requiredOpPoints.toLocaleString() }} OP 點
                  </span>
                  <span v-if="hasBasePrice">
                    + ${{ basePrice.toLocaleString() }}
                  </span>
                </div>
              </div>

              <div v-else-if="hasBasePrice">
                <p v-if="hasMemberPrice && hasRegularPrice" class="text-xs font-bold text-gray-400 line-through">
                  售價 ${{ regularPrice.toLocaleString() }}
                </p>
                <p v-else class="text-xs font-bold text-gray-400">售價</p>
                <p :class="compact ? 'mt-1.5 flex items-baseline gap-1 text-base font-black text-brand-primary' : 'mt-0.5 flex items-baseline gap-1 text-base font-black text-brand-primary'">
                  <span class="text-xs">會員價</span>
                  <span class="text-xs">$</span>{{ basePrice.toLocaleString() }}
                </p>
              </div>
            </div>

            <div :class="[compact ? 'pt-0' : 'pt-2', ctaRevealClass]">
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
    onePlusOneMode: { type: Boolean, default: false },
    alwaysShowAction: { type: Boolean, default: false },
    compact: { type: Boolean, default: false },
  },
  data() {
    return {
      isWishlisted: false,
      failedImageUrls: {} as Record<string, boolean>,
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
    hasBasePrice(): boolean {
      return Number.isFinite(this.basePrice) && this.basePrice > 0
    },
    regularPrice(): number {
      const variant = this.productVariants[0]
      return Math.round(variant.originalPrice ?? variant.price)
    },
    hasRegularPrice(): boolean {
      return Number.isFinite(this.regularPrice) && this.regularPrice > 0
    },
    hasMemberPrice(): boolean {
      return !!this.product.memberPrice && this.hasRegularPrice && this.hasBasePrice && this.regularPrice > this.basePrice
    },
    placeholderText(): string {
      return '🌿'
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
    cardLayoutClass(): string {
      if (this.layout === 'list') return 'w-full min-w-0 flex-row items-stretch h-[7.25rem] sm:h-[8rem] lg:h-[9rem]'
      if (this.compact) return 'h-[22.75rem] flex-col sm:h-[23rem] md:h-[25rem] lg:h-[22.75rem]'
      return 'h-full flex-col min-h-[24.5rem] sm:min-h-[25rem]'
    },
    contentClass(): string {
      if (this.isMini) return 'p-0'
      if (this.layout === 'list') return 'p-2.5 sm:p-3'
      if (this.compact) return 'p-4 min-h-[10rem] sm:min-h-[10.25rem]'
      return 'p-3 sm:p-3.5 min-h-[11rem] sm:min-h-[11.25rem]'
    },
    ctaRevealClass(): string[] {
      if (this.alwaysShowAction) return []
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
  },
  methods: {
    isImageUrl(image: string) {
      return /^https?:\/\//.test(image) || image.startsWith('/')
    },
    shouldShowImage(image: string) {
      return this.isImageUrl(image) && !this.failedImageUrls[image]
    },
    markImageFailed(image: string) {
      this.$set(this.failedImageUrls, image, true)
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
      if (this.isBundleMode || this.productVariants.length > 1) {
        this.$router.push(this.productDetailTo)
        return
      }
      const variant = this.productVariants[0]
      this.$store.dispatch('cart/addItem', {
        ...this.product,
        id: `${this.product.id}-${variant.id}`,
        unit: variant.unit,
        price: Math.round(variant.price),
        originalPrice: variant.originalPrice,
        memberPrice: variant.memberPrice,
        requiredOpPoints: variant.requiredOpPoints ?? this.product.requiredOpPoints,
        quantity: 1,
      })
      if (this.onePlusOneMode) {
        this.$store.dispatch('cart/addItem', {
          ...this.product,
          id: `${this.product.id}-${variant.id}-gift`,
          name: `${this.product.name}（贈品）`,
          unit: variant.unit,
          price: 0,
          originalPrice: Math.round(variant.price),
          memberPrice: 0,
          requiredOpPoints: undefined,
          quantity: 1,
          tags: [...(this.product.tags || []), '贈品'],
          promotionMessage: '買 1 送 1 贈品',
        })
      }
      this.$store.dispatch('ui/openCartDrawer')
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
  },
  created() {
    this.isWishlisted = checkIsWishlisted(this.product.id)
  }
})
</script>

<style scoped>

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
