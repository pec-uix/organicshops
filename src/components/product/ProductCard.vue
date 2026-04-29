<template>
  <div
    class="h-full w-full min-w-0"
    :class="layout === 'grid' ? 'mx-auto max-w-[15.5rem] md:max-w-[16rem] xl:max-w-[15rem] 2xl:max-w-[15.5rem]' : ''"
  >
    <!-- ── 1. 商品卡主體 (統一標準規格) ── -->
    <div
      class="bg-white border border-gray-100 rounded-2xl transition-all duration-300 overflow-hidden relative flex h-full shadow-sm hover:shadow-md group"
      :class="[
        layout === 'list' ? 'w-full min-w-0 flex-row items-stretch' : 'flex-col min-h-[17.5rem] sm:min-h-[18rem]'
      ]"
    >
      <!-- 溫層標籤 (圖片左上角) -->
      <div class="absolute top-2 left-2 z-10 pointer-events-none">
        <span 
          class="text-[10px] font-bold px-2 py-0.5 rounded text-white shadow-sm"
          :style="{ backgroundColor: tempColor }"
        >
          {{ tempLabel }}
        </span>
      </div>

      <button
        v-if="showWishlistButton"
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
      <router-link 
        :to="`/products/${product.id}`"
        class="relative w-full bg-gray-50 flex items-center justify-center overflow-hidden flex-shrink-0"
        :class="layout === 'list'
          ? 'h-[9.25rem] w-[9.25rem] min-h-[9.25rem] min-w-[9.25rem] sm:h-44 sm:w-44 sm:min-h-[11rem] sm:min-w-[11rem] lg:h-52 lg:w-52 lg:min-h-[13rem] lg:min-w-[13rem]'
          : 'aspect-square'"
      >
        <img
          v-if="isImageUrl(product.image)"
          :src="product.image"
          :alt="product.name"
          class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <span
          v-else
          class="text-6xl sm:text-7xl leading-none transition-transform duration-700 group-hover:scale-105"
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
        class="flex-1 min-w-0 flex flex-col p-3.5 sm:p-4"
        :class="layout === 'list' ? 'overflow-hidden' : ''"
      >
        <!-- 商品名稱 (最多 2 行) -->
        <h3
          class="font-medium text-sm text-brand-dark leading-snug mb-2 tracking-tight line-clamp-2 overflow-hidden"
          :class="layout === 'list' ? 'h-auto' : 'min-h-[2.75rem]'"
        >
          {{ product.name }}
        </h3>

        <p v-if="layout === 'list'" class="mb-3 text-xs leading-relaxed text-gray-500 line-clamp-2 pr-2">
          {{ product.description }}
        </p>
        
        <!-- 價格區塊 -->
        <div class="mb-3 flex flex-col">
          <!-- 原售價 (刪除線) -->
          <p v-if="product.originalPrice && product.originalPrice > (product.memberPrice || product.price)" class="text-xs text-gray-400 line-through">
            ${{ Math.round(product.originalPrice).toLocaleString() }}
          </p>
          <p v-else class="text-xs h-4"></p>

          <!-- 會員價 / OP 點數 -->
          <div class="flex items-baseline gap-1 mt-0.5">
            <template v-if="product.requiredOpPoints">
              <span class="text-base font-bold text-brand-primary">
                {{ product.requiredOpPoints }} <span class="text-xs">OP 點</span>
              </span>
              <span v-if="product.memberPrice" class="text-xs font-bold text-brand-primary ml-1">+ ${{ product.memberPrice }}</span>
            </template>
            <template v-else>
              <span class="text-base font-bold text-brand-primary">
                {{ displayPriceLabel }}
              </span>
            </template>
          </div>
          <p v-if="product.requiredOpPoints" class="mt-1 text-[11px] font-bold" :class="opPointShortage > 0 ? 'text-red-500' : 'text-gray-400'">
            需 {{ product.requiredOpPoints.toLocaleString() }} OP 點
            <span v-if="opPointShortage > 0">，還差 {{ opPointShortage.toLocaleString() }} 點</span>
          </p>
        </div>

        <div class="mb-3 flex flex-wrap gap-2 overflow-hidden">
          <span class="rounded-full bg-brand-surface px-2.5 py-1 text-[10px] font-bold text-brand-primary">
            {{ tempLabel }}
          </span>
          <span v-if="product.isOrganic" class="rounded-full bg-green-50 px-2.5 py-1 text-[10px] font-bold text-green-700">
            有機認證
          </span>
          <span v-if="product.conveniencePickup" class="rounded-full bg-blue-50 px-2.5 py-1 text-[10px] font-bold text-blue-700">
            可超商取貨
          </span>
        </div>

        <!-- 底部主按鈕 (全寬) -->
        <div class="mt-auto pt-1">
          <button
            @click.stop="openSpecModal"
            :disabled="!canAddToCart"
            class="h-9 rounded bg-brand-primary text-white text-sm font-bold transition-all flex items-center justify-center gap-2 active:scale-95 disabled:bg-gray-300 disabled:cursor-not-allowed"
            :class="layout === 'list'
              ? 'w-full max-w-[9.5rem] sm:max-w-[10.5rem] lg:max-w-[11rem]'
              : 'w-full'"
          >
            <template v-if="canAddToCart">加入購物車</template>
            <template v-else>
              <span v-if="!product.inStock">已售完</span>
              <span v-else>點數不足</span>
            </template>
          </button>
        </div>
      </div>
    </div>

    <!-- ── 2. 規格選購彈窗 (維持原有精品互動) ── -->
    <transition name="modal">
      <div v-if="isModalOpen" class="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4">
        <div class="absolute inset-0 bg-brand-dark/60 backdrop-blur-md" @click="isModalOpen = false"></div>
        <div class="relative w-full max-w-[56rem] bg-white shadow-2xl animate-sheet-up sm:animate-zoom-in max-h-[85vh] sm:max-h-[90vh] overflow-y-auto rounded-t-[1.75rem] sm:rounded-[1.75rem]">
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
                <h2 class="pr-2 text-2xl sm:text-3xl font-black text-gray-900 leading-tight tracking-tight">
                  {{ product.name }}
                </h2>
                <button @click="isModalOpen = false" class="flex-shrink-0 text-gray-400 p-1">
                  <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
              <div class="space-y-5 flex-1 min-h-0">
                <div>
                  <p class="text-[10px] font-bold text-brand-primary tracking-widest uppercase mb-3">選擇規格</p>
                  <div class="grid grid-cols-2 gap-2">
                    <button 
                      v-for="spec in mockSpecs" 
                      :key="spec.label"
                      @click="handleSpecChange(spec)"
                      class="px-3 py-2 text-xs font-bold border rounded transition-all"
                      :class="selectedSpec === spec.label ? 'bg-brand-primary text-white border-brand-primary' : 'bg-white text-gray-400 border-gray-100'"
                    >
                      {{ spec.label }}
                    </button>
                  </div>
                </div>
                <div>
                  <p class="text-[10px] font-bold text-brand-primary tracking-widest uppercase mb-3">數量</p>
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
                    <p class="text-[10px] font-bold text-gray-400 uppercase mb-2">小計</p>
                    <span class="text-3xl sm:text-4xl font-black text-brand-primary">${{ Math.round(currentPrice * qty).toLocaleString() }}</span>
                  </div>
                  <button @click="confirmAdd" class="w-full sm:w-auto sm:min-w-[14rem] h-12 sm:h-14 bg-brand-primary text-white text-sm sm:text-base font-bold rounded-2xl shadow-lg hover:bg-brand-dark transition-all">確認加入</button>
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
import { Product, TEMP_ZONE_LABEL } from '@/types'
import { addToWishlist, isWishlisted as checkIsWishlisted, removeFromWishlist } from '@/utils/wishlist'

export default Vue.extend({
  name: 'ProductCard',
  props: {
    product: { type: Object as PropType<Product>, required: true },
    layout:  { type: String as PropType<'grid' | 'list'>, default: 'grid' },
    availableOpPoints: { type: Number, default: null },
    showWishlistButton: { type: Boolean, default: true },
  },
  data() {
    return {
      isModalOpen: false,
      isWishlisted: false,
      selectedSpec: '',
      currentPrice: 0,
      qty: 1,
      mockSpecs: [
        { label: '單品試吃裝', price: Math.round(this.product.memberPrice ?? this.product.price) },
        { label: '3入超值組',  price: Math.round((this.product.memberPrice ?? this.product.price) * 2.8) },
      ]
    }
  },
  computed: {
    isLoggedIn(): boolean { return this.$store.getters['auth/isLoggedIn'] },
    isOpExchange(): boolean { return !!this.product.requiredOpPoints },
    tempLabel(): string { return TEMP_ZONE_LABEL[this.product.tempZone] || '常溫' },
    opPointShortage(): number {
      if (!this.product.requiredOpPoints || this.availableOpPoints === null || this.availableOpPoints === undefined) return 0
      return Math.max(0, this.product.requiredOpPoints - this.availableOpPoints)
    },
    canAddToCart(): boolean {
      return this.product.inStock && this.opPointShortage === 0
    },
    displayPriceLabel(): string {
      const prices = this.mockSpecs.map(spec => spec.price)
      const min = Math.min(...prices)
      const max = Math.max(...prices)
      if (min === max) return `$${min.toLocaleString()}`
      return `$${min.toLocaleString()} ~ $${max.toLocaleString()}`
    },
    tempColor(): string {
      const colors: Record<string, string> = {
        ambient: '#8BC34A',
        chilled: '#29B6F6',
        frozen:  '#5C6BC0',
        fresh:   '#E8A020'
      }
      return colors[this.product.tempZone] || '#8BC34A'
    }
  },
  methods: {
    isImageUrl(image: string) {
      return /^https?:\/\//.test(image) || image.startsWith('/')
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
    handleSpecChange(spec: any) {
      this.selectedSpec = spec.label
      this.currentPrice = Math.round(spec.price)
    },
    confirmAdd() {
      this.$store.dispatch('cart/addItem', { 
        ...this.product, 
        name: `${this.product.name} (${this.selectedSpec})`,
        price: Math.round(this.currentPrice),
        quantity: this.qty 
      })
      this.$store.dispatch('ui/openCartDrawer')
      this.isModalOpen = false
    }
  },
  created() {
    this.isWishlisted = checkIsWishlisted(this.product.id)
    this.selectedSpec = this.mockSpecs[0].label
    this.currentPrice = Math.round(this.mockSpecs[0].price)
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
</style>
