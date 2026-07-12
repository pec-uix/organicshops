<template>
  <div>
    <!-- ── 半透明遮罩 ── -->
    <transition name="mask-fade">
      <div
        v-if="isOpen"
        class="fixed inset-0 z-40 bg-brand-dark/40 backdrop-blur-sm"
        @click="close"
      />
    </transition>

    <!-- ── Drawer 本體 ── -->
    <transition name="drawer-slide">
      <div
        v-if="isOpen"
        class="fixed top-0 right-0 z-50 h-full w-full max-w-md bg-white shadow-xl flex flex-col"
      >

        <!-- ── Header ── -->
        <div class="flex items-center justify-between px-6 py-5 border-b border-gray-100 flex-shrink-0 bg-brand-surface/20">
          <div class="flex items-center gap-3">
            <h2 class="text-lg font-bold text-brand-dark tracking-widest">我的購物籃</h2>
          </div>
          <button
            class="w-10 h-10 flex items-center justify-center rounded-full text-gray-400 hover:text-brand-primary transition-all active:scale-90"
            @click="close"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- ── 統一空狀態 (Empty State Pattern) ── -->
        <div v-if="totalCount === 0" class="flex-1 flex flex-col items-center p-8 text-center animate-fade-in overflow-y-auto custom-scrollbar">
          <div class="mt-10 mb-7 flex h-24 w-24 flex-shrink-0 items-center justify-center rounded-full bg-brand-surface text-5xl grayscale opacity-30 shadow-inner">🛒</div>
          <h3 class="mb-3 text-xl font-bold tracking-tight text-brand-dark">您的購物籃是空的</h3>
          <p class="mb-6 text-sm font-medium leading-relaxed text-gray-400">
            挑選一些新鮮有機食材，<br />開啟您的健康美味之旅吧！
          </p>
          <button
            class="w-full py-3 rounded-xl bg-[#76B82A] text-white font-medium text-sm shadow-sm hover:bg-[#659e22] transition tracking-wide active:scale-[0.98] mb-10 flex-shrink-0"
            @click="goShopping"
          >
            立即去逛逛
          </button>

          <div class="border-b border-gray-100 my-6 mx-4"></div>

          <!-- 推薦區塊 (優化為單欄橫排以適應狹窄空間) -->
          <div class="w-full pt-4">
            <h3 class="text-sm font-bold text-gray-800 border-l-4 border-[#76B82A] pl-3 mb-4 mt-2 block text-left ml-4">為您推薦的商品</h3>
            <div class="space-y-4">
              <ProductCard
                v-for="product in recommendedProducts"
                :key="'cart-rec-'+product.id"
                :product="product"
                layout="list"
                variant="editorial"
                full-width
                :is-mini="true"
              />
            </div>
          </div>
        </div>

        <!-- ── 商品列表 (已入袋) ── -->
        <div v-else class="flex-1 overflow-y-auto custom-scrollbar">
          <div
            v-for="zone in visibleZones"
            :key="zone.key"
            class="mb-6"
          >
            <div class="flex items-center gap-3 px-6 py-3 sticky top-0 z-10 bg-white/90 backdrop-blur-md border-y border-gray-50">
              <div class="w-2 h-2 rounded-full shadow-sm" :style="{ backgroundColor: zone.color }" />
              <span class="text-xs font-bold tracking-widest" :style="{ color: zone.color }">{{ zone.label }}</span>
              <span class="text-xs font-bold text-gray-700 ml-auto">{{ zone.items.length }} 件商品</span>
            </div>

            <div class="px-6 space-y-4 pt-4 text-left">
              <div v-for="item in zone.items" :key="item.product.id" class="flex items-center gap-4 group">
                <div class="w-20 h-20 flex-shrink-0 bg-gray-50 rounded-md border border-gray-100 flex items-center justify-center relative overflow-hidden">
                  <img :src="item.product.image" class="w-full h-full object-contain p-2" />
                </div>
                <div class="flex-1 min-w-0">
                  <p class="line-clamp-2 text-sm font-bold leading-snug text-gray-800 group-hover:text-brand-primary transition-colors cursor-pointer">{{ item.product.name }}</p>
                  <div class="mt-1 grid gap-y-1">
                    <p class="text-sm font-black tracking-tight text-red-600">${{ itemDisplayPrice(item.product).toLocaleString() }}</p>
                    <p v-if="item.product.requiredOpPoints" class="text-xs font-bold text-brand-primary">
                      加價換購{{ item.product.requiredOpPoints.toLocaleString() }} OP 點 / 件
                    </p>
                  </div>
                </div>
                <div class="flex flex-col items-center gap-2">
                  <div class="flex items-center border border-gray-100 rounded-md overflow-hidden bg-white shadow-sm">
                    <button class="w-7 h-7 flex items-center justify-center text-gray-400 hover:bg-gray-50 transition-colors" @click="decrement(item)">−</button>
                    <span class="w-8 text-center text-xs font-bold text-gray-800">{{ item.quantity }}</span>
                    <button class="w-7 h-7 flex items-center justify-center text-gray-400 hover:bg-gray-50 transition-colors" @click="increment(item)">+</button>
                  </div>
                  <button class="text-xs font-bold text-gray-300 hover:text-red-400 transition-colors" @click="removeItem(item.product.id)">移除</button>
                </div>
              </div>
            </div>

            <div class="mx-6 mb-4 mt-6 rounded-md p-4 bg-gray-50 border border-gray-100 text-left">
              <div class="mb-2 flex items-center justify-between gap-3 text-xs font-bold">
                <span :style="{ color: zone.color }">{{ zoneProgressTitle(zone) }}</span>
                <span class="flex-shrink-0 text-gray-400">門檻 ${{ zoneProgressThreshold(zone).toLocaleString() }}</span>
              </div>
              <div class="h-1 bg-gray-200 rounded-full overflow-hidden">
                <div class="h-full rounded-full transition-all duration-1000" :style="{ width: `${zoneProgress(zone)}%`, backgroundColor: zone.color }" />
              </div>
              <div class="mt-3 grid gap-y-1 border-l-2 border-brand-primary/20 pl-3 text-xs font-bold leading-6">
                <p
                  v-for="note in zoneShippingNotes(zone)"
                  :key="note"
                  class="text-gray-500"
                >
                  {{ note }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- ── 底部結帳區 ── -->
        <div v-if="totalCount > 0" class="border-t border-gray-100 flex-shrink-0 px-6 py-6 space-y-4 bg-white shadow-[0_-4px_20px_rgba(0,0,0,0.03)] text-left">
          <div class="space-y-2">
            <div class="flex justify-between text-xs font-bold text-gray-400 tracking-widest"><span>商品小計</span><span>${{ totalPrice.toLocaleString() }}</span></div>
            <div class="flex justify-between text-xs font-bold text-gray-400 tracking-widest"><span>預估運費</span><span :class="shippingFee === 0 ? 'text-brand-primary' : ''">{{ shippingFee === 0 ? '免運' : `$${shippingFee}` }}</span></div>
            <div class="flex justify-between items-baseline pt-4"><span class="text-sm font-bold text-brand-dark tracking-widest">總計</span><span class="text-3xl font-black text-brand-primary"><span class="mr-1 text-sm">$</span>{{ (totalPrice + shippingFee).toLocaleString() }}</span></div>
          </div>
          <button class="w-full bg-brand-primary text-white py-4 rounded-xl font-black text-sm tracking-[0.12em] shadow-sm hover:bg-brand-dark transition-all active:scale-[0.98]" @click="checkout">查看購物車並結帳</button>
          <button class="w-full text-xs font-bold text-gray-300 hover:text-gray-500 tracking-widest transition-colors py-1" @click="clearCart">清空購物車</button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { CartItem, Product, TempZone } from '@/types'
import { mockProducts } from '@/mock/data'
import ProductCard from '@/components/product/ProductCard.vue'

interface DrawerZone {
  key: TempZone
  label: string
  color: string
  fee: number
  items: CartItem[]
}

interface DrawerDeliveryRule {
  label: string
  threshold: number
  fee: number
}

const DRAWER_DELIVERY_RULES: Record<TempZone, DrawerDeliveryRule[]> = {
  ambient: [
    { label: '宅配', threshold: 1200, fee: 120 },
    { label: '超商取貨', threshold: 599, fee: 60 },
  ],
  chilled: [
    { label: '宅配', threshold: 1500, fee: 100 },
  ],
  frozen: [
    { label: '宅配', threshold: 800, fee: 120 },
    { label: '超商取貨', threshold: 800, fee: 100 },
  ],
  fresh: [
    { label: '宅配', threshold: 800, fee: 120 },
  ],
}

export default Vue.extend({
  name: 'CartDrawer',
  components: { ProductCard },
  computed: {
    isOpen(): boolean { return this.$store.getters['ui/cartDrawerOpen'] },
    totalCount(): number { return this.$store.getters['cart/totalCount'] },
    totalPrice(): number { return this.$store.getters['cart/totalPrice'] },
    shippingFee(): number { return this.$store.getters['cart/shippingFee'] },
    itemsByZone(): Record<TempZone, CartItem[]> { return this.$store.getters['cart/itemsByZone'] },
    recommendedProducts(): Product[] { return mockProducts.slice(0, 4) },
    visibleZones(): DrawerZone[] {
      const allZones: DrawerZone[] = [
        { key: 'fresh', label: '產地直送', color: '#78B43F', fee: 120, items: this.itemsByZone.fresh },
        { key: 'chilled', label: '冷藏', color: '#29B6F6', fee: 100, items: this.itemsByZone.chilled },
        { key: 'frozen', label: '冷凍', color: '#5C6BC0', fee: 150, items: this.itemsByZone.frozen },
        { key: 'ambient', label: '常溫', color: '#8B572A', fee: 60, items: this.itemsByZone.ambient },
      ]
      return allZones.filter(z => z.items.length > 0)
    },
  },
  watch: { isOpen(val) { document.body.style.overflow = val ? 'hidden' : '' } },
  methods: {
    close() { this.$store.dispatch('ui/closeCartDrawer') },
    goShopping() { this.close(); this.$router.push('/products').catch(() => {}) },
    checkout() { this.close(); this.$router.push('/cart').catch(() => {}) },
    itemDisplayPrice(p: Product) { return Math.round(p.memberPrice ?? p.originalPrice ?? p.price) },
    itemRegularPrice(p: Product) { return Math.round(p.originalPrice ?? p.price) },
    hasMemberPrice(p: Product) { return !!p.memberPrice && this.itemRegularPrice(p) > this.itemDisplayPrice(p) },
    itemSavingLabel(p: Product) {
      const saving = Math.max(0, this.itemRegularPrice(p) - this.itemDisplayPrice(p))
      return saving > 0 ? `省 $${saving.toLocaleString()}` : ''
    },
    itemPriceBadge(p: Product) {
      if (p.requiredOpPoints) return 'OP 換購'
      if (this.hasMemberPrice(p)) return '會員專屬價'
      return ''
    },
    zoneSubtotal(zone: DrawerZone): number {
      return zone.items.reduce((sum, item) => sum + this.itemDisplayPrice(item.product) * item.quantity, 0)
    },
    zoneDeliveryRules(zone: DrawerZone): DrawerDeliveryRule[] {
      return DRAWER_DELIVERY_RULES[zone.key]
    },
    zonePrimaryRule(zone: DrawerZone): DrawerDeliveryRule {
      return this.zoneDeliveryRules(zone)[0]
    },
    zoneProgressThreshold(zone: DrawerZone): number {
      return this.zonePrimaryRule(zone).threshold
    },
    zoneRemaining(zone: DrawerZone): number {
      return Math.max(0, this.zoneProgressThreshold(zone) - this.zoneSubtotal(zone))
    },
    zoneProgress(zone: DrawerZone): number {
      return Math.min(100, Math.round((this.zoneSubtotal(zone) / this.zoneProgressThreshold(zone)) * 100))
    },
    zoneProgressTitle(zone: DrawerZone): string {
      const remaining = this.zoneRemaining(zone)
      if (remaining === 0) return `已達${zone.label}${this.zonePrimaryRule(zone).label}免運門檻`
      return `再買 $${remaining.toLocaleString()} 享${zone.label}${this.zonePrimaryRule(zone).label}免運`
    },
    zoneShippingNotes(zone: DrawerZone): string[] {
      const subtotal = this.zoneSubtotal(zone)
      return this.zoneDeliveryRules(zone).map((rule) => {
        const remaining = Math.max(0, rule.threshold - subtotal)
        if (remaining === 0) return `${rule.label}：已達免運門檻`
        return `${rule.label}：還差 ${remaining.toLocaleString()} 元免運費（未滿需加收 ${rule.fee} 元運費）`
      })
    },
    increment(i: CartItem) { this.$store.dispatch('cart/setQuantity', { productId: i.product.id, quantity: i.quantity + 1 }) },
    decrement(i: CartItem) { this.$store.dispatch('cart/setQuantity', { productId: i.product.id, quantity: i.quantity - 1 }) },
    removeItem(id: string) { this.$store.dispatch('cart/removeItem', id) },
    clearCart() { if (confirm('確定要清空購物車嗎？')) { this.$store.dispatch('cart/clearCart') } },
  },
})
</script>

<style scoped>
.drawer-slide-enter-active, .drawer-slide-leave-active { transition: transform 0.4s cubic-bezier(0.25, 0.8, 0.25, 1); }
.drawer-slide-enter, .drawer-slide-leave-to { transform: translateX(100%); }
.mask-fade-enter-active, .mask-fade-leave-active { transition: opacity 0.4s ease; }
.mask-fade-enter, .mask-fade-leave-to { opacity: 0; }
.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #E5E7EB; border-radius: 10px; }
</style>
