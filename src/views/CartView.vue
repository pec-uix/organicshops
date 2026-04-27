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

    <div v-else class="grid grid-cols-1 xl:grid-cols-3 gap-8">

      <!-- ══ 左側：溫層分區商品列表 ══ -->
      <div class="xl:col-span-2 space-y-6">

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

        <!-- ── 各溫層區塊 ── -->
        <div
          v-for="zone in visibleZones"
          :key="zone.key"
          class="bg-white rounded-2xl shadow-sm overflow-hidden"
        >
          <!-- 溫層標題 -->
          <div
            class="flex items-center justify-between px-5 py-3"
            :style="{ backgroundColor: zone.color + '18', borderLeft: `4px solid ${zone.color}` }"
          >
            <div class="flex items-center gap-2">
              <span class="text-xl">{{ zone.icon }}</span>
              <span class="font-bold text-base" :style="{ color: zone.color }">{{ zone.label }}</span>
              <span class="text-xs text-gray-500 bg-white bg-opacity-70 px-2 py-0.5 rounded-full">
                {{ zone.items.length }} 項
              </span>
            </div>
            <span class="text-sm font-semibold text-gray-700">
              小計 <span class="text-base" :style="{ color: zone.color }">${{ zoneSubtotal(zone) }}</span>
            </span>
          </div>

          <!-- 商品列表 -->
          <div class="divide-y divide-gray-50">
            <div
              v-for="item in zone.items"
              :key="item.product.id"
              class="flex items-center gap-3 px-5 py-4"
            >
              <!-- 商品圖 -->
              <div
                class="w-16 h-16 flex-shrink-0 rounded-xl flex items-center justify-center text-3xl select-none"
                :style="{ backgroundColor: zone.color + '15' }"
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
          <div class="px-5 py-3 border-t border-gray-50" :style="{ backgroundColor: zone.color + '08' }">
            <div class="flex items-center justify-between text-xs mb-1.5">
              <span :style="{ color: zone.color }" class="font-medium">
                <template v-if="zoneRemaining(zone) > 0">
                  再買 <strong>${{ zoneRemaining(zone) }}</strong> 享{{ zone.label }}免運
                </template>
                <template v-else>
                  🎉 已達{{ zone.label }}免運門檻！
                </template>
              </span>
              <span class="text-gray-400">門檻 ${{ zone.freeAt.toLocaleString() }}｜運費 ${{ zone.fee }}</span>
            </div>
            <div class="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                class="h-full rounded-full transition-all duration-500"
                :style="{ width: `${zoneProgress(zone)}%`, backgroundColor: zone.color }"
              />
            </div>
          </div>

          <!-- 結帳按鈕 -->
          <div class="px-5 py-4 bg-gray-50 flex items-center justify-between">
            <div class="text-sm text-gray-600">
              小計 ${{ zoneSubtotal(zone) }}
              <span class="text-gray-400">
                + 運費 <span :class="zoneRemaining(zone) <= 0 ? 'line-through text-gray-400' : ''">
                  ${{ zone.fee }}
                </span>
                <span v-if="zoneRemaining(zone) <= 0" class="text-brand-primary font-medium ml-1">免運</span>
              </span>
            </div>
            <button
              class="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm text-white transition-all active:scale-95 shadow-sm hover:shadow-md"
              :style="{ backgroundColor: zone.color }"
              @click="checkoutZone(zone.key)"
            >
              前往結帳
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        <!-- ── 活動滿額提示 ── -->
        <div class="bg-white rounded-2xl shadow-sm p-5">
          <div class="flex items-center gap-2 mb-4">
            <span class="text-xl">🎊</span>
            <h3 class="font-bold text-gray-800">滿額活動</h3>
          </div>
          <div class="space-y-3">
            <div
              v-for="(tier, idx) in promotionTiers"
              :key="idx"
              class="flex items-center gap-3 rounded-xl px-4 py-3 border transition-all"
              :class="totalPrice >= tier.minTotal
                ? 'border-brand-primary bg-brand-surface'
                : 'border-gray-100 bg-gray-50'"
            >
              <span
                class="w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold"
                :class="totalPrice >= tier.minTotal ? 'bg-brand-primary text-white' : 'bg-gray-200 text-gray-400'"
              >
                {{ totalPrice >= tier.minTotal ? '✓' : idx + 1 }}
              </span>
              <span
                class="text-sm flex-1"
                :class="totalPrice >= tier.minTotal ? 'text-brand-primary font-semibold' : 'text-gray-500'"
              >{{ tier.label }}</span>
              <template v-if="totalPrice < tier.minTotal">
                <span class="text-xs text-gray-400">
                  再買 ${{ (tier.minTotal - totalPrice).toLocaleString() }}
                </span>
              </template>
              <template v-else>
                <span class="text-xs font-bold text-brand-primary">已達成 ✨</span>
              </template>
            </div>
          </div>

          <!-- 當前最高折扣提示 -->
          <div v-if="currentTier" class="mt-4 bg-brand-accent bg-opacity-10 rounded-xl px-4 py-2.5 flex items-center gap-2">
            <span class="text-brand-accent text-base">🏆</span>
            <p class="text-sm text-gray-700">
              目前享有 <strong class="text-brand-accent">{{ currentTier.label }}</strong> 優惠！
            </p>
          </div>
          <div v-else-if="nextTier" class="mt-4 bg-gray-50 rounded-xl px-4 py-2.5 flex items-center gap-2">
            <span class="text-base">💡</span>
            <p class="text-sm text-gray-600">
              再消費 <strong class="text-brand-primary">${{ (nextTier.minTotal - totalPrice).toLocaleString() }}</strong>，
              即享 <strong>{{ nextTier.discountPercent }} 折</strong>
            </p>
          </div>
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

      <!-- ══ 右側：優惠券 + 結帳摘要 ══ -->
      <div class="space-y-4">

        <!-- ── 優惠券 / 折扣碼 ── -->
        <div class="bg-white rounded-2xl shadow-sm p-5">
          <div class="flex items-center gap-2 mb-4">
            <span class="text-xl">🎫</span>
            <h3 class="font-bold text-gray-800">優惠券 / 折扣碼</h3>
          </div>

          <div class="flex gap-2 mb-3">
            <input
              v-model="couponInput"
              type="text"
              placeholder="輸入折扣碼"
              class="flex-1 border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary uppercase tracking-wider"
              @keyup.enter="applyCoupon"
            />
            <button
              class="px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors flex-shrink-0"
              :class="couponInput.trim()
                ? 'bg-brand-primary text-white hover:bg-brand-dark'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'"
              :disabled="!couponInput.trim()"
              @click="applyCoupon"
            >套用</button>
          </div>

          <!-- 套用成功 -->
          <div v-if="appliedCoupon" class="flex items-center justify-between bg-brand-surface rounded-xl px-3 py-2.5 text-sm">
            <div class="flex items-center gap-2">
              <span class="text-brand-primary text-base">✅</span>
              <div>
                <p class="font-semibold text-brand-primary">{{ appliedCoupon.code }}</p>
                <p class="text-xs text-gray-500">{{ appliedCoupon.label }}</p>
              </div>
            </div>
            <button
              class="text-xs text-gray-400 hover:text-red-400 transition-colors ml-2"
              @click="removeCoupon"
            >移除</button>
          </div>

          <!-- 錯誤訊息 -->
          <p v-else-if="couponError" class="text-xs text-red-500 mt-1 flex items-center gap-1">
            <span>❌</span>{{ couponError }}
          </p>

          <!-- 折扣碼提示 -->
          <div class="mt-3 space-y-1">
            <p class="text-xs text-gray-400 font-medium mb-1">可用折扣碼：</p>
            <button
              v-for="hint in couponHints"
              :key="hint.code"
              class="block w-full text-left text-xs text-gray-500 hover:text-brand-primary transition-colors py-0.5"
              @click="couponInput = hint.code"
            >
              <span class="font-mono bg-gray-100 px-1.5 py-0.5 rounded text-xs">{{ hint.code }}</span>
              <span class="ml-1.5">{{ hint.label }}</span>
            </button>
          </div>
        </div>

        <!-- ── 訂單摘要 ── -->
        <div class="bg-white rounded-2xl shadow-sm p-5 sticky top-24">
          <h3 class="font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span class="text-xl">🧾</span>訂單摘要
          </h3>

          <!-- 各溫層費用 -->
          <div class="space-y-2 pb-3 border-b border-gray-100">
            <div
              v-for="zone in visibleZones"
              :key="zone.key"
              class="flex items-center justify-between text-sm"
            >
              <div class="flex items-center gap-1.5">
                <span class="w-2 h-2 rounded-full" :style="{ backgroundColor: zone.color }" />
                <span class="text-gray-600">{{ zone.label }}小計</span>
              </div>
              <span class="text-gray-800">${{ zoneSubtotal(zone) }}</span>
            </div>
          </div>

          <!-- 運費 -->
          <div class="py-3 border-b border-gray-100 space-y-1.5">
            <div
              v-for="zone in visibleZones"
              :key="`fee-${zone.key}`"
              class="flex items-center justify-between text-sm"
            >
              <span class="text-gray-500">{{ zone.label }}運費</span>
              <span :class="zoneRemaining(zone) <= 0 ? 'text-brand-primary font-medium' : 'text-gray-700'">
                {{ zoneRemaining(zone) <= 0 ? '免運 🎉' : `$${zone.fee}` }}
              </span>
            </div>
          </div>

          <!-- 折扣 -->
          <div v-if="couponDiscount > 0 || tierDiscount > 0" class="py-3 border-b border-gray-100 space-y-1.5">
            <div v-if="couponDiscount > 0" class="flex items-center justify-between text-sm">
              <span class="text-gray-500">優惠券折扣</span>
              <span class="text-brand-primary font-medium">-${{ couponDiscount }}</span>
            </div>
            <div v-if="tierDiscount > 0" class="flex items-center justify-between text-sm">
              <span class="text-gray-500">滿額折扣（{{ currentTier && currentTier.discountPercent }}折）</span>
              <span class="text-brand-primary font-medium">-${{ tierDiscount }}</span>
            </div>
          </div>

          <!-- 總計 -->
          <div class="flex items-center justify-between pt-3 mb-4">
            <span class="font-bold text-gray-800">合計（含運）</span>
            <span class="text-xl font-bold text-brand-primary">${{ grandTotal }}</span>
          </div>

          <!-- 清空購物車 -->
          <button
            class="w-full text-xs text-gray-400 hover:text-red-400 transition-colors py-2 mb-2"
            @click="clearCart"
          >清空購物車</button>
        </div>

      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { CartItem, Product, TempZone, AddOnItem, Coupon, PromotionTier } from '@/types'
import { mockAddOnItems, mockCoupons, mockPromotionTiers } from '@/mock/data'

interface ZoneConfig {
  key: TempZone
  label: string
  icon: string
  color: string
  fee: number
  freeAt: number
  items: CartItem[]
}

export default Vue.extend({
  name: 'CartView',

  data() {
    return {
      couponInput:   '' as string,
      appliedCoupon: null as Coupon | null,
      couponError:   '' as string,
      addOns:        mockAddOnItems as AddOnItem[],
      promotionTiers: mockPromotionTiers as PromotionTier[],
      couponHints:   mockCoupons as Coupon[],

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

    shippingFee(): number {
      return this.$store.getters['cart/shippingFee']
    },

    itemsByZone(): Record<TempZone, CartItem[]> {
      return this.$store.getters['cart/itemsByZone']
    },

    visibleZones(): ZoneConfig[] {
      return (this as any).ZONE_META
        .map((meta: any) => ({ ...meta, items: this.itemsByZone[meta.key as TempZone] }))
        .filter((z: ZoneConfig) => z.items.length > 0)
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

    couponDiscount(): number {
      if (!this.appliedCoupon) return 0
      const base = this.totalPrice - this.tierDiscount
      if (this.appliedCoupon.type === 'percent') {
        return Math.round(base * (this.appliedCoupon.value / 100))
      }
      return Math.min(this.appliedCoupon.value, base)
    },

    grandTotal(): number {
      const total = this.totalPrice + this.shippingFee - this.tierDiscount - this.couponDiscount
      return Math.max(0, total)
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

    zoneRemaining(zone: ZoneConfig): number {
      return Math.max(0, zone.freeAt - this.zoneSubtotal(zone))
    },

    zoneProgress(zone: ZoneConfig): number {
      return Math.min(100, Math.round((this.zoneSubtotal(zone) / zone.freeAt) * 100))
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

    // ── 優惠券 ──
    applyCoupon() {
      this.couponError = ''
      const code = this.couponInput.trim().toUpperCase()
      const coupon = mockCoupons.find(c => c.code === code)

      if (!coupon) {
        this.couponError = '此折扣碼不存在或已過期'
        return
      }
      if (this.totalPrice < coupon.minTotal) {
        this.couponError = `此折扣碼需滿 $${coupon.minTotal} 才可使用`
        return
      }
      this.appliedCoupon = coupon
      this.couponInput   = ''
    },

    removeCoupon() {
      this.appliedCoupon = null
      this.couponError   = ''
    },

    // ── 結帳 ──
    checkoutZone(zoneKey: TempZone) {
      this.$router.push(`/checkout?zone=${zoneKey}`).catch(() => {/* ignore */})
    },
  },
})
</script>
