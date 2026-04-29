<template>
  <div class="max-w-7xl mx-auto px-4 py-8">

    <!-- ── 頁首 ── -->
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold text-brand-dark">購物車</h1>
        <p class="text-sm text-gray-500 mt-0.5">共 {{ totalCount }} 件商品</p>
      </div>
      <router-link to="/products" class="flex items-center gap-1.5 text-brand-primary hover:text-brand-dark text-sm font-medium transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
        繼續購物
      </router-link>
    </div>

    <!-- ── 空購物車 ── -->
    <div v-if="totalCount === 0" class="flex flex-col items-center justify-center py-28 gap-5 text-center">
      <span class="text-8xl select-none">🛍️</span>
      <h2 class="text-xl font-bold text-gray-700">您的購物車是空的</h2>
      <p class="text-gray-400 text-sm">快去挑選您喜歡的有機好物吧！</p>
      <router-link to="/products" class="btn-primary px-8 py-3 text-base">去逛逛</router-link>
    </div>

    <div v-else class="space-y-6">

      <!-- ══ 溫層分區商品列表 ══ -->
      <div class="space-y-6">

        <!-- ── 溫層分開結帳說明 ── -->
        <div class="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-2xl px-4 py-3">
          <span class="text-xl flex-shrink-0 mt-0.5">ℹ️</span>
          <div class="text-sm text-amber-800">
            <p class="font-semibold mb-0.5">不同溫層需分開付款</p>
            <p class="leading-relaxed opacity-80">
              常溫、冷藏、冷凍、產地直送商品由不同配送車輛運送，
              各溫層需個別結帳。每個溫層下方均有獨立「前往結帳」按鈕。
            </p>
          </div>
        </div>

        <div class="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div class="border-b border-gray-100 px-3 py-3 sm:px-5">
            <div class="no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1 pb-1 snap-x snap-mandatory">
              <button
                v-for="zone in visibleZones"
                :key="zone.key"
                type="button"
                class="snap-start flex min-w-[10.5rem] flex-shrink-0 items-center justify-between gap-3 rounded-full border px-4 py-3 text-left transition-all sm:min-w-[11.5rem]"
                :class="activeZoneKey === zone.key
                  ? 'shadow-sm ring-2 ring-offset-2 ring-offset-white'
                  : 'border-gray-200 bg-white text-gray-500 hover:border-gray-300 hover:text-gray-700'"
                :style="activeZoneKey === zone.key ? {
                  borderColor: zone.color,
                  backgroundColor: `${zone.color}14`,
                  color: zone.color,
                  ringColor: `${zone.color}22`,
                } : {}"
                @click="activeZoneKey = zone.key"
              >
                <div class="min-w-0">
                  <div class="flex items-center gap-2">
                    <span class="text-base">{{ zone.icon }}</span>
                    <span class="text-sm font-bold whitespace-nowrap">{{ zone.label }}</span>
                  </div>
                  <p class="mt-1 text-[11px] font-medium opacity-70">
                    {{ zone.items.length }} 項商品
                  </p>
                </div>
                <span
                  class="inline-flex flex-shrink-0 items-center rounded-full px-3 py-1 text-xs font-bold"
                  :style="{
                    backgroundColor: activeZoneKey === zone.key ? '#FFFFFFCC' : `${zone.color}12`,
                    color: zone.color,
                  }"
                >
                  ${{ zoneSubtotal(zone).toLocaleString() }}
                </span>
              </button>
            </div>
          </div>

          <!-- ── 目前溫層區塊 ── -->
          <template v-if="activeZone">
          <!-- 溫層標題 -->
          <div
            class="flex items-center justify-between px-5 py-3"
            :style="{ backgroundColor: activeZone.color + '18', borderLeft: `4px solid ${activeZone.color}` }"
          >
            <div class="flex items-center gap-2">
              <span class="text-xl">{{ activeZone.icon }}</span>
              <span class="font-bold text-base" :style="{ color: activeZone.color }">{{ activeZone.label }}</span>
              <span class="text-xs text-gray-500 bg-white bg-opacity-70 px-2 py-0.5 rounded-full">
                {{ activeZone.items.length }} 項
              </span>
            </div>
            <div class="text-right">
              <p class="text-sm font-semibold text-gray-700">
                小計 <span class="text-base" :style="{ color: activeZone.color }">${{ zoneSubtotal(activeZone).toLocaleString() }}</span>
              </p>
              <p v-if="zoneOpPoints(activeZone) > 0" class="text-xs font-semibold text-brand-accent mt-0.5">
                此溫層 OP 換購 {{ zoneOpPoints(activeZone).toLocaleString() }} 點
              </p>
            </div>
          </div>

          <!-- 商品列表 -->
          <div class="divide-y divide-gray-50">
            <div
              v-for="item in activeZone.items"
              :key="item.product.id"
              class="flex items-center gap-3 px-5 py-4"
            >
              <!-- 商品圖 -->
              <div
                class="w-16 h-16 flex-shrink-0 rounded-xl flex items-center justify-center text-3xl select-none"
                :style="{ backgroundColor: activeZone.color + '15' }"
              >
                <img
                  v-if="isImageUrl(item.product.image)"
                  :src="item.product.image"
                  :alt="item.product.name"
                  class="w-full h-full object-cover rounded-xl"
                />
                <span v-else>{{ item.product.image }}</span>
              </div>

              <!-- 商品資訊 -->
              <div class="flex-1 min-w-0">
                <router-link
                  :to="`/products/${item.product.id}`"
                  class="text-sm font-semibold text-gray-800 hover:text-brand-primary transition-colors line-clamp-1"
                >{{ item.product.name }}</router-link>
                <p class="text-xs text-gray-400 mt-0.5">{{ item.product.unit }}・{{ item.product.origin }}</p>
                <div class="flex items-baseline gap-1.5 mt-1">
                  <span v-if="item.product.memberPrice" class="text-xs text-gray-400 line-through">
                    ${{ item.product.originalPrice }}
                  </span>
                  <span class="text-sm font-bold text-brand-primary">
                    ${{ displayPrice(item.product) }}
                  </span>
                  <span v-if="item.product.memberPrice" class="text-xs text-brand-accent">會員價</span>
                </div>
                <p
                  v-if="lineOpPoints(item) > 0"
                  class="mt-1 text-xs font-semibold text-brand-accent"
                >
                  OP 換購：{{ item.product.requiredOpPoints }} 點 / 件
                  <span class="text-gray-400">，本項共 {{ lineOpPoints(item).toLocaleString() }} 點</span>
                </p>
                <p
                  v-if="item.product.promotionMessage"
                  class="mt-1 text-xs font-semibold text-orange-500"
                >
                  {{ item.product.promotionMessage }}
                </p>
                <p
                  v-if="giftProgressText(item)"
                  class="mt-1 text-xs font-semibold text-brand-primary"
                >
                  {{ giftProgressText(item) }}
                </p>
              </div>

              <!-- 數量 +/- -->
              <div class="flex items-center border border-gray-200 rounded-xl overflow-hidden flex-shrink-0">
                <button
                  class="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors font-medium"
                  @click="decrement(item)"
                >−</button>
                <span class="w-9 text-center text-sm font-semibold text-gray-800 select-none">
                  {{ item.quantity }}
                </span>
                <button
                  class="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors font-medium"
                  @click="increment(item)"
                >+</button>
              </div>

              <!-- 小計 -->
              <div class="w-20 text-right flex-shrink-0">
                <p class="text-sm font-bold text-gray-800">
                  ${{ displayPrice(item.product) * item.quantity }}
                </p>
                <p v-if="lineOpPoints(item) > 0" class="mt-1 text-[11px] font-bold text-brand-accent">
                  + {{ lineOpPoints(item).toLocaleString() }} OP
                </p>
              </div>

              <!-- 刪除 -->
              <button
                class="w-7 h-7 flex-shrink-0 flex items-center justify-center rounded-full text-gray-300 hover:bg-red-50 hover:text-red-400 transition-colors"
                @click="removeItem(item.product.id)"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>

          <!-- 免運進度條 -->
          <div class="px-5 py-3 border-t border-gray-50" :style="{ backgroundColor: activeZone.color + '08' }">
            <div class="flex items-center justify-between text-xs mb-1.5">
              <span :style="{ color: activeZone.color }" class="font-medium">
                <template v-if="zoneRemaining(activeZone) > 0">
                  再買 <strong>${{ zoneRemaining(activeZone).toLocaleString() }}</strong> 享{{ activeZone.label }}免運
                </template>
                <template v-else>
                  🎉 已達{{ activeZone.label }}免運門檻！
                </template>
              </span>
              <span class="text-gray-400">門檻 ${{ activeZone.freeAt.toLocaleString() }}｜運費 ${{ activeZone.fee }}</span>
            </div>
            <div class="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                class="h-full rounded-full transition-all duration-500"
                :style="{ width: `${zoneProgress(activeZone)}%`, backgroundColor: activeZone.color }"
              />
            </div>
          </div>

          <div class="px-5 py-4 border-t border-gray-50 space-y-4">
            <div class="flex items-center gap-2">
              <span class="text-lg">🎟</span>
              <h3 class="text-sm font-bold text-gray-800">{{ activeZone.label }}折價券 / 折扣碼</h3>
            </div>

            <div class="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,16rem)]">
              <div>
                <p class="text-xs font-bold text-gray-400 mb-2">選擇折價券</p>
                <select
                  v-model.number="zoneCouponDrafts[activeZone.key].selectedCouponId"
                  class="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
                >
                  <option :value="null">不使用折價券</option>
                  <option
                    v-for="coupon in zoneSelectableCoupons(activeZone)"
                    :key="coupon.id"
                    :value="coupon.id"
                  >
                    {{ coupon.title }} - 折抵 ${{ coupon.amount }}
                  </option>
                </select>
                <p v-if="zoneSelectedCoupon(activeZone)" class="mt-2 text-xs text-gray-400">
                  {{ zoneSelectedCoupon(activeZone).scope }}｜{{ zoneSelectedCoupon(activeZone).expiryDate }} 到期｜折抵 NT.{{ zoneSelectedCouponDiscount(activeZone).toLocaleString() }}
                </p>
              </div>

              <div>
                <p class="text-xs font-bold text-gray-400 mb-2">輸入折價券 / 折扣碼</p>
                <input
                  v-model="zoneCouponDrafts[activeZone.key].couponCode"
                  type="text"
                  placeholder="輸入券號或折扣碼"
                  class="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm uppercase tracking-wider text-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
                />
                <p class="mt-2 text-xs text-gray-400">
                  折價券 / 折扣碼折抵 NT.{{ zoneCouponCodeDiscount(activeZone).toLocaleString() }}
                </p>
              </div>
            </div>

            <div v-if="zoneCouponDiscount(activeZone) > 0" class="rounded-xl bg-brand-surface px-4 py-3 text-sm font-semibold text-brand-primary">
              本溫層折抵：NT.{{ zoneCouponDiscount(activeZone).toLocaleString() }}
            </div>
          </div>

          <!-- 結帳按鈕 -->
          <div class="px-5 py-4 bg-gray-50 flex items-center justify-between">
            <div class="text-sm text-gray-600">
              <div>
                小計 ${{ zoneSubtotal(activeZone).toLocaleString() }}
                <span class="text-gray-400">
                  + 運費 <span :class="zoneRemaining(activeZone) <= 0 ? 'line-through text-gray-400' : ''">
                    ${{ activeZone.fee }}
                  </span>
                  <span v-if="zoneRemaining(activeZone) <= 0" class="text-brand-primary font-medium ml-1">免運</span>
                </span>
              </div>
              <p v-if="zoneOpPoints(activeZone) > 0" class="mt-1 text-xs font-semibold text-brand-accent">
                此溫層需 {{ zoneOpPoints(activeZone).toLocaleString() }} OP 點
              </p>
            </div>
            <button
              class="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm text-white transition-all active:scale-95 shadow-sm hover:shadow-md"
              :style="{ backgroundColor: activeZone.color }"
              @click="checkoutZone(activeZone.key)"
            >
              前往結帳
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
          </template>
        </div>

        <!-- ── 加價購區塊 ── -->
        <div v-if="unlockedAddOns.length > 0" class="bg-white rounded-2xl shadow-sm p-5">
          <div class="flex items-center gap-2 mb-4">
            <span class="text-xl">➕</span>
            <div>
              <h3 class="font-bold text-gray-800">加價購專區</h3>
              <p class="text-xs text-gray-400 mt-0.5">限量優惠，結帳後加入</p>
            </div>
          </div>
          <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div
              v-for="addon in unlockedAddOns"
              :key="addon.id"
              class="border border-gray-100 rounded-xl p-3 flex flex-col items-center text-center hover:border-brand-primary hover:shadow-sm transition-all"
            >
              <div class="text-4xl mb-2 select-none">{{ addon.image }}</div>
              <p class="text-xs font-semibold text-gray-800 leading-snug mb-1 line-clamp-2">{{ addon.name }}</p>
              <p class="text-xs text-gray-400 mb-2">{{ addon.unit }}</p>
              <div class="mb-2">
                <span class="text-xs text-gray-400 line-through block">${{ addon.originalPrice }}</span>
                <span class="text-sm font-bold text-brand-accent">加購 ${{ addon.addOnPrice }}</span>
              </div>
              <button
                class="w-full py-1.5 rounded-lg text-xs font-semibold bg-brand-accent bg-opacity-10 text-brand-accent hover:bg-opacity-20 transition-colors"
                @click="addAddOnToCart(addon)"
              >
                + 加入購物車
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { CartItem, Product, TempZone, AddOnItem, PromotionTier } from '@/types'
import { mockAddOnItems, mockPromotionTiers } from '@/mock/data'
import { getGiftProgressText, getGiftQuantity } from '@/utils/promotions'

const CART_COUPON_DRAFT_KEY = 'organicshops:cart-coupon-draft'

interface ZoneConfig {
  key: TempZone
  label: string
  icon: string
  color: string
  fee: number
  freeAt: number
  items: CartItem[]
}

interface CartCouponOption {
  id: number
  title: string
  amount: number
  minTotal: number
  scope: string
  expiryDate: string
}

interface ZoneCouponDraft {
  selectedCouponId: number | null
  couponCode: string
}

export default Vue.extend({
  name: 'CartView',

  data() {
    return {
      addOns:        mockAddOnItems as AddOnItem[],
      promotionTiers: mockPromotionTiers as PromotionTier[],
      activeZoneKey: 'fresh' as TempZone,
      zoneCouponDrafts: {
        fresh: { selectedCouponId: null, couponCode: '' },
        chilled: { selectedCouponId: null, couponCode: '' },
        frozen: { selectedCouponId: null, couponCode: '' },
        ambient: { selectedCouponId: null, couponCode: '' },
      } as Record<TempZone, ZoneCouponDraft>,
      availableCoupons: [
        { id: 1, title: '新會員專屬禮金', amount: 100, minTotal: 1000, scope: '全館商品', expiryDate: '2026-04-29' },
        { id: 2, title: '端午佳節慶祝券', amount: 50, minTotal: 500, scope: '冷凍/冷藏商品', expiryDate: '2026-05-13' },
        { id: 3, title: '綠色生活節', amount: 200, minTotal: 1500, scope: '有機蔬菜、在地水果', expiryDate: '2026-05-28' },
        { id: 4, title: '會員首購禮', amount: 80, minTotal: 0, scope: '全館商品', expiryDate: '2026-06-12' },
      ] as CartCouponOption[],
      couponCodeOffers: {
        ORGANIC100: 100,
        GREEN50: 50,
      } as Record<string, number>,

      ZONE_META: [
        { key: 'fresh'   as TempZone, label: '產地直送', icon: '🌱', color: '#E8A020', fee: 120, freeAt: 800  },
        { key: 'chilled' as TempZone, label: '冷藏',     icon: '❄️', color: '#29B6F6', fee: 100, freeAt: 1500 },
        { key: 'frozen'  as TempZone, label: '冷凍',     icon: '🧊', color: '#5C6BC0', fee: 150, freeAt: 2000 },
        { key: 'ambient' as TempZone, label: '常溫',     icon: '☀️', color: '#8BC34A', fee: 60,  freeAt: 990  },
      ],
    }
  },

  computed: {
    totalCount(): number {
      return this.$store.getters['cart/totalCount']
    },

    totalPrice(): number {
      return this.$store.getters['cart/totalPrice']
    },
    itemsByZone(): Record<TempZone, CartItem[]> {
      return this.$store.getters['cart/itemsByZone']
    },

    visibleZones(): ZoneConfig[] {
      return (this as any).ZONE_META
        .map((meta: any) => ({ ...meta, items: this.itemsByZone[meta.key as TempZone] }))
        .filter((z: ZoneConfig) => z.items.length > 0)
    },
    activeZone(): ZoneConfig | null {
      return this.visibleZones.find((zone) => zone.key === this.activeZoneKey) || this.visibleZones[0] || null
    },

    // 加價購：依購物車總額解鎖
    unlockedAddOns(): AddOnItem[] {
      return this.addOns.filter(a => this.totalPrice >= a.unlockAt)
    },

    // 滿額活動
    currentTier(): PromotionTier | null {
      const tiers = [...this.promotionTiers].sort((a, b) => b.minTotal - a.minTotal)
      return tiers.find(t => this.totalPrice >= t.minTotal) || null
    },

    nextTier(): PromotionTier | null {
      return this.promotionTiers.find(t => this.totalPrice < t.minTotal) || null
    },

    tierDiscount(): number {
      if (!this.currentTier) return 0
      const discount = 1 - this.currentTier.discountPercent / 100
      return Math.round(this.totalPrice * discount)
    },
  },

  methods: {
    isImageUrl(image: string) {
      return /^https?:\/\//.test(image) || image.startsWith('/')
    },

    // ── 商品顯示價格 ──
    displayPrice(product: Product): number {
      return product.memberPrice ?? product.originalPrice ?? product.price
    },

    // ── 溫層運算 ──
    zoneSubtotal(zone: ZoneConfig): number {
      return zone.items.reduce((sum, i) => sum + this.displayPrice(i.product) * i.quantity, 0)
    },

    lineOpPoints(item: CartItem): number {
      return (item.product.requiredOpPoints || 0) * item.quantity
    },
    lineGiftQuantity(item: CartItem): number {
      return getGiftQuantity(item.product.id, item.quantity)
    },
    giftProgressText(item: CartItem): string {
      return getGiftProgressText(item.product, item.quantity)
    },

    zoneOpPoints(zone: ZoneConfig): number {
      return zone.items.reduce((sum, item) => sum + this.lineOpPoints(item), 0)
    },

    zoneRemaining(zone: ZoneConfig): number {
      return Math.max(0, zone.freeAt - this.zoneSubtotal(zone))
    },

    zoneProgress(zone: ZoneConfig): number {
      return Math.min(100, Math.round((this.zoneSubtotal(zone) / zone.freeAt) * 100))
    },
    couponMatchesZone(coupon: CartCouponOption, zoneKey: TempZone): boolean {
      if (coupon.scope.includes('全館')) return true
      if (coupon.scope.includes('冷凍/冷藏')) return ['chilled', 'frozen'].includes(zoneKey)
      if (coupon.scope.includes('有機蔬菜、在地水果')) return ['fresh', 'ambient'].includes(zoneKey)
      return true
    },

    zoneDraft(zoneKey: TempZone): ZoneCouponDraft {
      return this.zoneCouponDrafts[zoneKey]
    },

    zoneSelectableCoupons(zone: ZoneConfig): CartCouponOption[] {
      return this.availableCoupons.filter((coupon) => {
        return this.zoneSubtotal(zone) >= coupon.minTotal && this.couponMatchesZone(coupon, zone.key)
      })
    },

    zoneSelectedCoupon(zone: ZoneConfig): CartCouponOption | null {
      return this.availableCoupons.find((coupon) => coupon.id === this.zoneDraft(zone.key).selectedCouponId) || null
    },

    zoneSelectedCouponDiscount(zone: ZoneConfig): number {
      const selectedCoupon = this.zoneSelectedCoupon(zone)
      if (!selectedCoupon) return 0
      const canUseCoupon = this.zoneSubtotal(zone) >= selectedCoupon.minTotal && this.couponMatchesZone(selectedCoupon, zone.key)
      return canUseCoupon ? selectedCoupon.amount : 0
    },

    zoneCouponCodeDiscount(zone: ZoneConfig): number {
      const code = this.zoneDraft(zone.key).couponCode.trim().toUpperCase()
      if (!code) return 0
      return this.zoneSubtotal(zone) > 0 ? (this.couponCodeOffers[code] || 0) : 0
    },

    zoneCouponDiscount(zone: ZoneConfig): number {
      return this.zoneSelectedCouponDiscount(zone) + this.zoneCouponCodeDiscount(zone)
    },

    syncSelectedCoupon(zoneKey: TempZone) {
      const zone = this.visibleZones.find((item) => item.key === zoneKey)
      if (!zone) return

      const selectedCoupon = this.availableCoupons.find((coupon) => coupon.id === this.zoneDraft(zoneKey).selectedCouponId)
      if (!selectedCoupon) return

      const canUseCoupon = this.zoneSubtotal(zone) >= selectedCoupon.minTotal && this.couponMatchesZone(selectedCoupon, zoneKey)
      if (canUseCoupon) return

      this.zoneDraft(zoneKey).selectedCouponId = null
    },

    syncAllZoneCoupons() {
      ;(['fresh', 'chilled', 'frozen', 'ambient'] as TempZone[]).forEach((zoneKey) => this.syncSelectedCoupon(zoneKey))
    },
    persistCouponDraft() {
      if (typeof window === 'undefined') return
      window.localStorage.setItem(CART_COUPON_DRAFT_KEY, JSON.stringify(this.zoneCouponDrafts))
    },
    restoreCouponDraft() {
      if (typeof window === 'undefined') return
      const rawDraft = window.localStorage.getItem(CART_COUPON_DRAFT_KEY)
      if (!rawDraft) return

      try {
        const draft = JSON.parse(rawDraft) as Partial<Record<TempZone, Partial<ZoneCouponDraft>>> & {
          selectedCouponId?: number | null
          couponCode?: string
        }

        ;(['fresh', 'chilled', 'frozen', 'ambient'] as TempZone[]).forEach((zoneKey) => {
          const zoneDraft = draft[zoneKey]
          if (zoneDraft) {
            this.zoneCouponDrafts[zoneKey].selectedCouponId = zoneDraft.selectedCouponId ?? null
            this.zoneCouponDrafts[zoneKey].couponCode = zoneDraft.couponCode ?? ''
          }
        })

        // backward compatibility for the old single-draft format
        if (draft.selectedCouponId !== undefined || draft.couponCode !== undefined) {
          this.zoneCouponDrafts.ambient.selectedCouponId = draft.selectedCouponId ?? null
          this.zoneCouponDrafts.ambient.couponCode = draft.couponCode ?? ''
        }

        this.syncAllZoneCoupons()
      } catch (_error) {
        window.localStorage.removeItem(CART_COUPON_DRAFT_KEY)
      }
    },

    // ── 購物車操作 ──
    increment(item: CartItem) {
      this.$store.dispatch('cart/setQuantity', {
        productId: item.product.id,
        quantity:  item.quantity + 1,
      })
    },

    decrement(item: CartItem) {
      this.$store.dispatch('cart/setQuantity', {
        productId: item.product.id,
        quantity:  item.quantity - 1,
      })
    },

    removeItem(productId: string) {
      this.$store.dispatch('cart/removeItem', productId)
    },

    clearCart() {
      if (confirm('確定要清空購物車嗎？')) {
        this.$store.dispatch('cart/clearCart')
      }
    },

    // ── 加價購 ──
    addAddOnToCart(addon: AddOnItem) {
      const product: Product = {
        id:           `addon-${addon.id}`,
        name:         `[加價購] ${addon.name}`,
        description:  '',
        price:        addon.addOnPrice,
        originalPrice: addon.originalPrice,
        memberPrice:  addon.addOnPrice,
        unit:         addon.unit,
        categoryId:   'pantry',
        tempZone:     addon.tempZone,
        image:        addon.image,
        inStock:      true,
        isOrganic:    false,
        origin:       '台灣',
        tags:         ['加價購'],
      }
      this.$store.dispatch('cart/addItem', product)
    },

    // ── 結帳 ──
    checkoutZone(zoneKey: TempZone) {
      this.$router.push(`/checkout?zone=${zoneKey}`).catch(() => {/* ignore */})
    },
    syncActiveZone() {
      if (!this.visibleZones.length) return
      if (this.visibleZones.some((zone) => zone.key === this.activeZoneKey)) return
      this.activeZoneKey = this.visibleZones[0].key
    },
  },
  created() {
    this.restoreCouponDraft()
    this.syncActiveZone()
  },
  watch: {
    visibleZones: {
      immediate: true,
      handler() {
        this.syncActiveZone()
      },
    },
    totalPrice() {
      this.syncAllZoneCoupons()
      this.persistCouponDraft()
    },
    zoneCouponDrafts: {
      deep: true,
      handler() {
        this.persistCouponDraft()
      },
    },
  },
})
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}

.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
