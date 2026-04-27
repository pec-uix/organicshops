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
        class="fixed top-0 right-0 z-50 h-full w-full max-w-md bg-white shadow-2xl flex flex-col"
      >

        <!-- ── Header ── -->
        <div class="flex items-center justify-between px-6 py-5 border-b border-gray-100 flex-shrink-0 bg-brand-surface/20">
          <div class="flex items-center gap-3">
            <h2 class="text-lg font-black text-brand-dark tracking-widest italic">我的購物籃</h2>
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
          <div class="w-24 h-24 bg-brand-surface rounded-full flex items-center justify-center text-5xl grayscale opacity-30 mb-8 shadow-inner flex-shrink-0 mt-12">🛒</div>
          <h3 class="text-xl font-black text-brand-dark mb-2 tracking-tight">您的購物籃是空的</h3>
          <p class="text-sm text-gray-400 mb-8 leading-loose font-medium">
            挑選一些新鮮有機食材，<br />開啟您的健康美味之旅吧！
          </p>
          <button
            class="w-full bg-brand-primary text-white py-4 rounded-md font-black text-sm uppercase tracking-widest shadow-lg shadow-brand-primary/20 hover:bg-brand-dark transition-all active:scale-95 mb-12 flex-shrink-0"
            @click="goShopping"
          >
            立即去逛逛
          </button>

          <!-- 推薦區塊 (優化為單欄橫排以適應狹窄空間) -->
          <div class="w-full border-t border-gray-100 pt-10">
            <h3 class="mb-8 text-center text-base font-black text-brand-primary">為您推薦的商品</h3>
            <div class="space-y-4">
              <ProductCard
                v-for="product in recommendedProducts"
                :key="'cart-rec-'+product.id"
                :product="product"
                layout="list"
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
              <span class="text-xs font-black tracking-widest" :style="{ color: zone.color }">{{ zone.label }}</span>
              <span class="text-[10px] font-black text-gray-300 ml-auto tracking-tighter">{{ zone.items.length }} 件商品</span>
            </div>

            <div class="px-6 space-y-4 pt-4 text-left">
              <div v-for="item in zone.items" :key="item.product.id" class="flex items-center gap-4 group">
                <div class="w-20 h-20 flex-shrink-0 bg-gray-50 rounded-md border border-gray-100 flex items-center justify-center relative overflow-hidden">
                  <img :src="item.product.image" class="w-full h-full object-contain p-2" />
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-black text-gray-800 truncate group-hover:text-brand-primary transition-colors cursor-pointer">{{ item.product.name }}</p>
                  <p class="text-[10px] text-gray-400 mt-1 font-bold">{{ item.product.unit }}</p>
                  <p class="text-sm font-black mt-2 tracking-tight" :style="{ color: zone.color }">${{ itemDisplayPrice(item.product).toLocaleString() }}</p>
                </div>
                <div class="flex flex-col items-center gap-2">
                  <div class="flex items-center border border-gray-100 rounded-md overflow-hidden bg-white shadow-sm">
                    <button class="w-7 h-7 flex items-center justify-center text-gray-400 hover:bg-gray-50 transition-colors" @click="decrement(item)">−</button>
                    <span class="w-8 text-center text-xs font-black text-gray-800">{{ item.quantity }}</span>
                    <button class="w-7 h-7 flex items-center justify-center text-gray-400 hover:bg-gray-50 transition-colors" @click="increment(item)">+</button>
                  </div>
                  <button class="text-[10px] font-black text-gray-300 hover:text-red-400 tracking-tighter transition-colors" @click="removeItem(item.product.id)">移除</button>
                </div>
              </div>
            </div>

            <div class="mx-6 mb-4 mt-6 rounded-md p-4 bg-gray-50 border border-gray-100 text-left">
              <template v-if="zone.key === 'ambient'">
                <div class="flex items-center justify-between text-[10px] font-black mb-2">
                  <span :style="{ color: zone.color }">{{ ambientRemaining > 0 ? `再買 $${ambientRemaining} 即可享常溫免運` : '已達常溫免運門檻' }}</span>
                </div>
                <div class="h-1 bg-gray-200 rounded-full overflow-hidden">
                  <div class="h-full rounded-full transition-all duration-1000" :style="{ width: `${ambientProgress}%`, backgroundColor: zone.color }" />
                </div>
              </template>
              <template v-else>
                <div class="flex items-center justify-between text-[10px] font-black"><span class="text-gray-400">{{ zone.label }}運費</span><span :style="{ color: zone.color }">+${{ zone.fee }}</span></div>
              </template>
            </div>
          </div>
        </div>

        <!-- ── 底部結帳區 ── -->
        <div v-if="totalCount > 0" class="border-t border-gray-100 flex-shrink-0 px-6 py-6 space-y-4 bg-white shadow-[0_-4px_20px_rgba(0,0,0,0.03)] text-left">
          <div class="space-y-2">
            <div class="flex justify-between text-xs font-bold text-gray-400 tracking-widest"><span>商品小計</span><span>${{ totalPrice.toLocaleString() }}</span></div>
            <div class="flex justify-between text-xs font-bold text-gray-400 tracking-widest"><span>運費</span><span :class="shippingFee === 0 ? 'text-brand-primary' : ''">{{ shippingFee === 0 ? '免運' : `$${shippingFee}` }}</span></div>
            <div class="flex justify-between items-baseline pt-4"><span class="text-sm font-black text-brand-dark tracking-widest">總計</span><span class="text-3xl font-black text-brand-primary tracking-tighter italic"><span class="text-sm not-italic">$</span>{{ (totalPrice + shippingFee).toLocaleString() }}</span></div>
          </div>
          <button class="w-full bg-brand-primary text-white py-4 rounded-md font-black text-sm tracking-[0.12em] shadow-xl shadow-brand-primary/20 hover:bg-brand-dark transition-all active:scale-[0.98]" @click="checkout">結帳</button>
          <button class="w-full text-[10px] font-black text-gray-300 hover:text-gray-500 tracking-widest transition-colors py-1" @click="clearCart">清空購物車</button>
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

export default Vue.extend({
  name: 'CartDrawer',
  components: { ProductCard },
  computed: {
    isOpen(): boolean { return this.$store.getters['ui/cartDrawerOpen'] },
    totalCount(): number { return this.$store.getters['cart/totalCount'] },
    totalPrice(): number { return this.$store.getters['cart/totalPrice'] },
    shippingFee(): number { return this.$store.getters['cart/shippingFee'] },
    itemsByZone(): Record<TempZone, CartItem[]> { return this.$store.getters['cart/itemsByZone'] },
    ambientSubtotal(): number { return this.$store.getters['cart/ambientSubtotal'] },
    ambientRemaining(): number { return Math.max(0, 1200 - this.ambientSubtotal) },
    ambientProgress(): number { return Math.min(100, Math.round((this.ambientSubtotal / 1200) * 100)) },
    recommendedProducts(): Product[] { return mockProducts.slice(0, 4) },
    visibleZones(): any[] {
      const allZones = [
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
    itemDisplayPrice(p: Product) { return p.memberPrice ?? p.originalPrice ?? p.price },
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
