<template>
  <div class="bg-brand-bg min-h-screen">

    <!-- ── 找不到商品 ── -->
    <div v-if="!product" class="max-w-7xl mx-auto px-4 py-24 text-center">
      <p class="text-5xl mb-4">🔍</p>
      <h2 class="text-xl font-bold text-gray-700 mb-2">找不到此商品</h2>
      <router-link to="/products" class="text-brand-primary hover:underline text-sm">返回商品列表</router-link>
    </div>

    <template v-else>

      <!-- ── 麵包屑 ── -->
      <div class="max-w-7xl mx-auto px-4 pt-6 pb-2">
        <nav class="flex items-center gap-1.5 text-sm text-gray-500">
          <router-link to="/" class="hover:text-brand-primary transition-colors">首頁</router-link>
          <span>›</span>
          <router-link to="/products" class="hover:text-brand-primary transition-colors">全部商品</router-link>
          <template v-if="category">
            <span>›</span>
            <router-link :to="`/category/${category.id}`" class="hover:text-brand-primary transition-colors">
              {{ category.name }}
            </router-link>
          </template>
          <span>›</span>
          <span class="text-gray-800 truncate max-w-[160px]">{{ product.name }}</span>
        </nav>
      </div>

      <!-- ── 主內容區 ── -->
      <div class="max-w-7xl mx-auto px-4 py-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">

          <!-- ── 左欄：商品圖 ── -->
          <div>
            <div
              class="bg-brand-surface rounded-3xl flex items-center justify-center cursor-zoom-in select-none relative overflow-hidden"
              style="aspect-ratio: 1/1; max-height: 480px;"
              @click="lightboxOpen = true"
              @touchstart="onGalleryTouchStart"
              @touchend="onGalleryTouchEnd"
            >
              <img
                v-if="selectedGalleryImage && isImageUrl(selectedGalleryImage.src)"
                :src="selectedGalleryImage.src"
                :alt="product.name"
                class="w-full h-full object-cover"
                :style="{ objectPosition: selectedGalleryImage.objectPosition || 'center' }"
              />
              <span v-else class="text-[120px] md:text-[160px]">{{ selectedGalleryImage ? selectedGalleryImage.src : product.image }}</span>

              <!-- Temp badge -->
              <span :class="tempBadgeClass" class="absolute top-4 left-4 text-white text-sm px-3 py-1 rounded-full font-medium shadow">
                {{ tempLabel }}
              </span>
              <!-- Organic badge -->
              <span v-if="product.isOrganic" class="absolute top-4 right-4 bg-brand-primary text-white text-sm px-3 py-1 rounded-full shadow">
                有機認證
              </span>
              <!-- Zoom hint -->
              <span class="absolute bottom-3 right-3 text-xs text-gray-400 bg-white bg-opacity-70 px-2 py-1 rounded-full">
                點擊放大
              </span>
            </div>

            <div v-if="galleryImages.length > 1" class="mt-4 flex items-center gap-3 overflow-x-auto pb-1">
              <button
                v-for="(image, index) in galleryImages"
                :key="`${image.src}-${index}`"
                :aria-label="`查看第 ${index + 1} 張商品圖`"
                class="w-24 flex-shrink-0 overflow-hidden rounded-sm border bg-white transition-all"
                :class="selectedImageIndex === index ? 'border-brand-primary shadow-sm' : 'border-gray-200 hover:border-brand-primary/40'"
                @click="selectedImageIndex = index"
              >
                <img
                  v-if="isImageUrl(image.src)"
                  :src="image.src"
                  :alt="`${product.name}-${index + 1}`"
                  class="h-16 w-full object-cover"
                  :style="{ objectPosition: image.objectPosition || 'center' }"
                />
                <span v-else class="flex h-16 w-full items-center justify-center text-3xl">{{ image.src }}</span>
              </button>
            </div>
          </div>

          <!-- ── 右欄：商品資訊 ── -->
          <div class="flex flex-col gap-4">

            <!-- 限時標籤 -->
            <div v-if="product.promotionLabel" class="flex items-center gap-2">
              <span class="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full animate-pulse">
                🔥 {{ product.promotionLabel }}
              </span>
            </div>

            <!-- 商品名稱 + 編號 -->
            <div>
              <h1 class="text-2xl font-bold text-brand-dark leading-snug">{{ product.name }}</h1>
              <p class="text-xs text-gray-400 mt-1">商品編號：{{ product.id.toUpperCase() }}・{{ product.unit }}</p>
              <p class="text-xs text-gray-500 mt-0.5">📍 產地：{{ product.origin }}</p>
            </div>

            <!-- 庫存狀態 badge -->
            <div v-if="stockStatus !== 'in-stock'" class="flex">
              <span :class="stockBadgeClass" class="text-sm font-semibold px-3 py-1 rounded-full">
                {{ stockLabel }}
              </span>
            </div>

            <!-- 標籤列 -->
            <div class="flex flex-wrap gap-1.5">
              <span v-for="tag in product.tags" :key="tag"
                class="bg-brand-surface text-brand-primary text-xs px-2.5 py-0.5 rounded-full border border-brand-surface">
                {{ tag }}
              </span>
            </div>

            <!-- 價格區 -->
            <div class="bg-white rounded-2xl p-4 border border-gray-100">
              <div class="flex items-end gap-3">
                <div>
                  <p v-if="product.memberPrice" class="text-gray-400 text-sm line-through leading-none mb-1">
                    原售價 ${{ product.originalPrice }}
                  </p>
                  <p class="text-brand-primary text-3xl font-bold leading-none">
                    ${{ product.memberPrice ?? product.originalPrice }}
                  </p>
                  <p v-if="product.memberPrice" class="text-brand-accent text-sm font-semibold mt-1">
                    會員專屬價
                  </p>
                </div>
                <div v-if="product.memberPrice" class="text-xs text-gray-500 mb-1">
                  非會員 ${{ product.originalPrice }}
                </div>
              </div>

              <!-- 促銷訊息 -->
              <div v-if="product.promotionMessage" class="mt-3 flex items-start gap-2 bg-brand-accent bg-opacity-10 rounded-xl px-3 py-2">
                <span class="text-brand-accent text-base flex-shrink-0">🎁</span>
                <div class="min-w-0">
                  <p class="text-sm text-gray-700">{{ product.promotionMessage }}</p>
                  <p v-if="giftProgressText" class="mt-1 text-xs font-semibold text-brand-accent">
                    {{ giftProgressText }}
                  </p>
                </div>
              </div>
            </div>

            <!-- 運送方式 -->
            <div class="flex flex-wrap gap-2">
              <div class="flex items-center gap-1.5 bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm">
                <span class="text-lg">🚚</span>
                <div>
                  <p class="font-medium text-gray-700">宅配到府</p>
                  <p class="text-xs text-gray-400">全台配送</p>
                </div>
              </div>
              <div v-if="product.conveniencePickup" class="flex items-center gap-1.5 bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm">
                <span class="text-lg">🏪</span>
                <div>
                  <p class="font-medium text-gray-700">超商取貨</p>
                  <p class="text-xs text-gray-400">7-11 / 全家</p>
                </div>
              </div>
              <div :class="tempBadgeClass" class="flex items-center gap-1.5 text-white rounded-xl px-3 py-2 text-sm">
                <span class="text-base">❄️</span>
                <div>
                  <p class="font-medium">{{ tempLabel }}配送</p>
                  <p class="text-xs opacity-80">{{ tempShippingFee }}</p>
                </div>
              </div>
            </div>

            <!-- 滿額免運進度條 -->
            <div class="bg-white rounded-2xl p-3 border border-gray-100">
              <div class="flex items-center justify-between text-sm mb-2">
                <span class="text-gray-600">
                  <template v-if="freeShippingRemaining > 0">
                    🛒 再買 <strong class="text-brand-primary">${{ freeShippingRemaining }}</strong> 享{{ zoneRule.label }}免運
                  </template>
                  <template v-else>
                    🎉 已達 {{ zoneRule.label }} 免運門檻！
                  </template>
                </span>
                <span class="text-xs text-gray-400">門檻 ${{ zoneRule.freeAt }}</span>
              </div>
              <div class="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  class="h-full bg-brand-primary rounded-full transition-all duration-500"
                  :style="{ width: `${freeShippingProgress}%` }"
                />
              </div>
            </div>

            <!-- 數量選擇 -->
            <div class="flex items-center gap-4">
              <label class="text-sm font-medium text-gray-700 whitespace-nowrap">購買數量</label>
              <div class="flex items-center border border-gray-300 rounded-xl overflow-hidden">
                <button
                  class="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors text-lg font-medium"
                  :disabled="quantity <= 1"
                  :class="quantity <= 1 ? 'opacity-40 cursor-not-allowed' : ''"
                  @click="quantity > 1 && quantity--"
                >−</button>
                <span class="w-12 text-center font-semibold text-gray-800 text-base">{{ quantity }}</span>
                <button
                  class="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors text-lg font-medium"
                  @click="quantity++"
                >+</button>
              </div>
              <span class="text-sm text-gray-500">小計 <strong class="text-brand-primary">${{ subtotal }}</strong></span>
            </div>

            <!-- 加入購物車 + 收藏 -->
            <div class="flex gap-3">
              <button
                class="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl font-bold text-base transition-all shadow-sm"
                :class="canAddToCart
                  ? 'bg-brand-primary text-white hover:bg-brand-dark active:scale-95'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'"
                :disabled="!canAddToCart"
                @click="addToCart"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.6 8H19M7 13H5.4M10 21a1 1 0 100-2 1 1 0 000 2zm8 0a1 1 0 100-2 1 1 0 000 2z" />
                </svg>
                {{ addToCartLabel }}
              </button>

              <!-- 收藏 -->
              <button
                class="w-14 h-14 flex items-center justify-center rounded-2xl border-2 transition-all active:scale-95"
                :class="isWishlisted
                  ? 'border-red-400 bg-red-50 text-red-500'
                  : 'border-gray-300 bg-white text-gray-400 hover:border-red-300 hover:text-red-400'"
                @click="isWishlisted = !isWishlisted"
                :title="isWishlisted ? '取消收藏' : '加入收藏'"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" :fill="isWishlisted ? 'currentColor' : 'none'" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>
            </div>

            <!-- 加入購物車成功提示 -->
            <transition name="fade">
              <div v-if="addedNotice" class="flex items-center gap-2 bg-brand-surface border border-brand-primary text-brand-primary text-sm px-4 py-2.5 rounded-xl">
                <span class="text-lg">✅</span>
                已加入 {{ quantity }} 件到購物車！
              </div>
            </transition>

            <!-- 社群分享 -->
            <div class="rounded-2xl border border-gray-100 bg-white p-4">
              <div class="mb-3 flex items-center justify-between gap-3">
                <div>
                  <h3 class="text-sm font-bold text-gray-800">分享商品</h3>
                  <p class="text-xs text-gray-400">將這項商品分享給 LINE 或 Facebook</p>
                </div>
                <button
                  class="text-xs font-bold text-brand-primary hover:text-brand-dark transition-colors"
                  @click="copyLink"
                >
                  複製連結
                </button>
              </div>
              <div class="flex flex-wrap gap-3">
                <button
                  class="inline-flex items-center gap-2 rounded-xl bg-[#06C755] px-4 py-2.5 text-xs font-black text-white transition-all hover:opacity-90"
                  @click="shareTo('line')"
                >
                  <span>LINE</span>
                  <span>分享</span>
                </button>
                <button
                  class="inline-flex items-center gap-2 rounded-xl bg-[#1877F2] px-4 py-2.5 text-xs font-black text-white transition-all hover:opacity-90"
                  @click="shareTo('facebook')"
                >
                  <span>Facebook</span>
                  <span>分享</span>
                </button>
              </div>
              <p v-if="shareNotice" class="mt-3 text-xs font-bold text-brand-primary">{{ shareNotice }}</p>
            </div>

            <!-- 商品簡述 -->
            <div class="text-sm text-gray-600 leading-relaxed border-t border-gray-100 pt-4">
              {{ product.description }}
            </div>

          </div>
        </div>

        <!-- ── 詳細 Tab ── -->
        <div class="mt-12">
          <!-- Tab 標題列 -->
          <div class="flex border-b-2 border-gray-200 gap-0">
            <button
              v-for="tab in tabs"
              :key="tab.key"
              class="px-6 py-3 text-sm font-medium transition-colors relative"
              :class="activeTab === tab.key
                ? 'text-brand-primary'
                : 'text-gray-500 hover:text-gray-700'"
              @click="activeTab = tab.key"
            >
              {{ tab.label }}
              <div
                v-if="activeTab === tab.key"
                class="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-primary"
              />
            </button>
          </div>

          <!-- Tab 內容 -->
          <div class="bg-white rounded-b-2xl rounded-tr-2xl p-6 min-h-[200px]">

            <!-- 產品特色 -->
            <div v-if="activeTab === 'features'">
              <ul v-if="displayFeatures.length" class="space-y-3">
                <li
                  v-for="(f, i) in displayFeatures"
                  :key="i"
                  class="flex items-start gap-3 text-gray-700"
                >
                  <span class="mt-0.5 w-6 h-6 flex-shrink-0 rounded-full bg-brand-surface text-brand-primary flex items-center justify-center text-xs font-bold">
                    {{ i + 1 }}
                  </span>
                  <span class="text-sm leading-relaxed">{{ f }}</span>
                </li>
              </ul>
            </div>

            <!-- 產品介紹 -->
            <div v-else-if="activeTab === 'introduction'">
              <p class="text-sm text-gray-700 leading-8 whitespace-pre-line">{{ displayIntroduction }}</p>
            </div>

            <!-- 成分規格 -->
            <div v-else-if="activeTab === 'specs'">
              <div class="text-sm text-gray-700 leading-8">
                <div
                  v-for="(line, i) in displaySpecs.split('\n')"
                  :key="i"
                  class="flex gap-2 py-1.5 border-b border-gray-50 last:border-0"
                >
                  <template v-if="line.includes('：')">
                    <span class="text-gray-400 w-28 flex-shrink-0">{{ line.split('：')[0] }}</span>
                    <span class="text-gray-800">{{ line.split('：').slice(1).join('：') }}</span>
                  </template>
                  <span v-else class="text-gray-600">{{ line }}</span>
                </div>
              </div>
            </div>

          </div>
        </div>

        <!-- ── 推薦商品 ── -->
        <div v-if="relatedProducts.length" class="mt-14">
          <h2 class="text-xl font-bold text-brand-dark mb-5">您可能也喜歡</h2>
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <ProductCard
              v-for="p in relatedProducts"
              :key="p.id"
              :product="p"
              layout="grid"
            />
          </div>
        </div>

      </div>
    </template>

    <!-- ── Lightbox ── -->
    <transition name="fade">
      <div
        v-if="lightboxOpen"
        class="fixed inset-0 z-[100] bg-black bg-opacity-80 flex items-center justify-center"
        @click.self="lightboxOpen = false"
      >
        <div class="relative bg-white rounded-3xl p-10 flex items-center justify-center" style="min-width: 300px; min-height: 300px;">
          <button
            class="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition-colors"
            @click="lightboxOpen = false"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <img
            v-if="selectedGalleryImage && isImageUrl(selectedGalleryImage.src)"
            :src="selectedGalleryImage.src"
            :alt="product.name"
            class="max-w-[70vw] max-h-[70vh] object-contain"
            :style="{ objectPosition: selectedGalleryImage.objectPosition || 'center' }"
          />
          <span v-else class="text-[200px] leading-none select-none">{{ selectedGalleryImage ? selectedGalleryImage.src : product && product.image }}</span>
        </div>
      </div>
    </transition>

  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Product, Category, TempZone, TEMP_ZONE_LABEL } from '@/types'
import ProductCard from '@/components/product/ProductCard.vue'
import { getGiftProgressText } from '@/utils/promotions'

type StockStatus = 'in-stock' | 'sold-out' | 'restocking' | 'preorder'

const ZONE_RULES: Record<TempZone, { fee: number; freeAt: number; label: string }> = {
  ambient: { fee: 60,  freeAt: 990,  label: '常溫' },
  chilled: { fee: 100, freeAt: 1500, label: '冷藏' },
  frozen:  { fee: 150, freeAt: 2000, label: '冷凍' },
  fresh:   { fee: 120, freeAt: 800,  label: '產地直送' },
}

interface Tab {
  key: string
  label: string
}

interface GalleryImage {
  src: string
  objectPosition?: string
}

export default Vue.extend({
  name: 'ProductDetailView',
  components: { ProductCard },

  data() {
    return {
      quantity:           1,
      isWishlisted:       false,
      lightboxOpen:       false,
      selectedImageIndex: 0,
      galleryTouchStartX: 0,
      activeTab:          'features' as string,
      addedNotice:        false,
      shareNotice:        '',

      tabs: [
        { key: 'features',     label: '產品特色' },
        { key: 'introduction', label: '產品介紹' },
        { key: 'specs',        label: '成分規格' },
      ] as Tab[],
    }
  },

  computed: {
    product(): Product | undefined {
      const id = this.$route.params.id
      return this.$store.getters['products/productById'](id)
    },

    category(): Category | undefined {
      if (!this.product) return undefined
      return this.$store.getters['products/categoryById'](this.product.categoryId)
    },

    relatedProducts(): Product[] {
      if (!this.product) return []
      return this.$store.getters['products/relatedProducts'](
        this.product.categoryId,
        this.product.id
      )
    },
    galleryImages(): GalleryImage[] {
      if (!this.product) return []
      const rawImages = this.product.images?.length ? this.product.images : [this.product.image]
      return rawImages.map((src, index) => ({
        src,
        objectPosition: this.galleryObjectPosition(index),
      }))
    },
    selectedGalleryImage(): GalleryImage | null {
      return this.galleryImages[this.selectedImageIndex] || this.galleryImages[0] || null
    },

    // 庫存狀態：優先使用 stockStatus 欄位，否則從 inStock 推斷
    stockStatus(): StockStatus {
      if (!this.product) return 'sold-out'
      if (this.product.stockStatus) return this.product.stockStatus
      return this.product.inStock ? 'in-stock' : 'sold-out'
    },

    stockLabel(): string {
      const map: Record<StockStatus, string> = {
        'in-stock':    '',
        'sold-out':    '已售完',
        'restocking':  '補貨中',
        'preorder':    '預購中',
      }
      return map[this.stockStatus]
    },

    stockBadgeClass(): string {
      const map: Record<StockStatus, string> = {
        'in-stock':   '',
        'sold-out':   'bg-red-100 text-red-600',
        'restocking': 'bg-orange-100 text-orange-600',
        'preorder':   'bg-blue-100 text-blue-600',
      }
      return map[this.stockStatus]
    },

    canAddToCart(): boolean {
      return this.stockStatus === 'in-stock' || this.stockStatus === 'preorder'
    },

    addToCartLabel(): string {
      if (this.stockStatus === 'sold-out')   return '已售完'
      if (this.stockStatus === 'restocking') return '補貨中，無法購買'
      if (this.stockStatus === 'preorder')   return '加入預購車'
      return '加入購物車'
    },

    tempLabel(): string {
      if (!this.product) return ''
      return TEMP_ZONE_LABEL[this.product.tempZone as TempZone]
    },

    tempBadgeClass(): string {
      if (!this.product) return ''
      const map: Record<TempZone, string> = {
        ambient: 'bg-temp-ambient',
        chilled: 'bg-temp-chilled',
        frozen:  'bg-temp-frozen',
        fresh:   'bg-temp-fresh',
      }
      return map[this.product.tempZone as TempZone]
    },

    tempShippingFee(): string {
      if (!this.product) return ''
      const map: Record<TempZone, string> = {
        ambient: '滿 $990 免運',
        chilled: '低溫配送 $100',
        frozen:  '冷凍宅配 $150',
        fresh:   '產地直送 $120',
      }
      return map[this.product.tempZone as TempZone]
    },

    displayPrice(): number {
      if (!this.product) return 0
      return this.product.memberPrice ?? this.product.originalPrice ?? this.product.price
    },

    subtotal(): number {
      return this.displayPrice * this.quantity
    },
    giftProgressText(): string {
      if (!this.product) return ''
      return getGiftProgressText(this.product, this.quantity)
    },

    zoneRule(): { fee: number; freeAt: number; label: string } {
      if (!this.product) return ZONE_RULES.ambient
      return ZONE_RULES[this.product.tempZone]
    },

    currentZoneSubtotal(): number {
      if (!this.product) return 0
      const itemsByZone = this.$store.getters['cart/itemsByZone']
      return itemsByZone[this.product.tempZone].reduce((sum: number, item: { product: Product; quantity: number }) => {
        const price = item.product.memberPrice ?? item.product.originalPrice ?? item.product.price
        return sum + price * item.quantity
      }, 0)
    },

    projectedZoneSubtotal(): number {
      return this.currentZoneSubtotal + this.subtotal
    },

    freeShippingRemaining(): number {
      return Math.max(0, this.zoneRule.freeAt - this.projectedZoneSubtotal)
    },

    freeShippingProgress(): number {
      return Math.min(100, Math.round((this.projectedZoneSubtotal / this.zoneRule.freeAt) * 100))
    },

    shareUrl(): string {
      if (typeof window === 'undefined') return ''
      return window.location.href
    },

    displayFeatures(): string[] {
      if (this.product?.features?.length) return this.product.features
      return [
        '低溫烘焙保留食材原味與清爽口感。',
        '獨立包裝設計，外出攜帶與日常分食都方便。',
        '適合作為早餐、下午茶或運動後的輕食補充。'
      ]
    },
    displayIntroduction(): string {
      if (this.product?.introduction) return this.product.introduction
      return '嚴選原料搭配穩定製程，保留食材本身香氣與營養特色，適合日常家庭常備、個人補給與輕食搭配。開封後即可食用，也能搭配沙拉、優格或早餐穀物一起享用。'
    },
    displaySpecs(): string {
      if (this.product?.specs) return this.product.specs
      return '內容物：嚴選食材綜合配方\n淨重：依商品包裝標示\n保存方式：請置於陰涼乾燥處，避免陽光直射\n有效日期：標示於包裝上\n產地：台灣'
    },
  },

  watch: {
    // 切換商品時重置狀態
    '$route.params.id'() {
      this.quantity = 1
      this.isWishlisted = false
      this.selectedImageIndex = 0
      this.activeTab = 'features'
      this.addedNotice = false
      this.shareNotice = ''
      window.scrollTo({ top: 0, behavior: 'smooth' })
    },
  },

  methods: {
    isImageUrl(image: string) {
      return /^https?:\/\//.test(image) || image.startsWith('/')
    },

    galleryObjectPosition(index: number) {
      if (!this.product) return 'center center'
      if (this.product.images && this.product.images.length > 1) return 'center center'
      if (this.product.id === 'op202') {
        return ['center center', '34% center', '78% center'][index] || 'center center'
      }
      return 'center center'
    },

    previousImage() {
      if (this.galleryImages.length <= 1) return
      this.selectedImageIndex = (this.selectedImageIndex - 1 + this.galleryImages.length) % this.galleryImages.length
    },

    nextImage() {
      if (this.galleryImages.length <= 1) return
      this.selectedImageIndex = (this.selectedImageIndex + 1) % this.galleryImages.length
    },

    onGalleryTouchStart(event: TouchEvent) {
      this.galleryTouchStartX = event.changedTouches[0]?.clientX || 0
    },

    onGalleryTouchEnd(event: TouchEvent) {
      const touchEndX = event.changedTouches[0]?.clientX || 0
      const deltaX = touchEndX - this.galleryTouchStartX

      if (Math.abs(deltaX) < 40) return
      if (deltaX < 0) {
        this.nextImage()
        return
      }
      this.previousImage()
    },

    addToCart() {
      if (!this.product || !this.canAddToCart) return
      for (let i = 0; i < this.quantity; i++) {
        this.$store.dispatch('cart/addItem', this.product)
      }
      this.$store.dispatch('ui/openCartDrawer')
      this.addedNotice = true
      setTimeout(() => { this.addedNotice = false }, 3000)
    },

    shareTo(platform: 'line' | 'facebook') {
      if (!this.product || !this.shareUrl) return
      const text = encodeURIComponent(`${this.product.name}｜統一生機`)
      const url = encodeURIComponent(this.shareUrl)
      const target = platform === 'line'
        ? `https://social-plugins.line.me/lineit/share?url=${url}`
        : `https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${text}`

      window.open(target, '_blank', 'noopener,noreferrer,width=720,height=640')
    },

    async copyLink() {
      if (!this.shareUrl) return
      try {
        if (navigator.clipboard?.writeText) {
          await navigator.clipboard.writeText(this.shareUrl)
        } else {
          const input = document.createElement('input')
          input.value = this.shareUrl
          document.body.appendChild(input)
          input.select()
          document.execCommand('copy')
          document.body.removeChild(input)
        }
        this.shareNotice = '商品連結已複製'
        window.setTimeout(() => { this.shareNotice = '' }, 2500)
      } catch (_error) {
        this.shareNotice = '目前無法自動複製，請手動複製網址'
      }
    },
  },
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
