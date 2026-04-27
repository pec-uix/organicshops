<template>
  <div class="min-h-screen bg-brand-bg pb-24 lg:pb-12">
    <!-- ══ 行動端頂部導航 ══ -->
    <div class="bg-white border-b border-gray-100 sticky top-0 z-30 lg:hidden">
      <div class="px-4 py-3 flex items-center justify-between">
        <button @click="$router.back()" class="text-gray-400 p-1">
          <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 class="font-bold text-gray-800 text-sm truncate max-w-[200px]">{{ combo.name }}</h1>
        <div class="w-8"></div> <!-- 佔位平衡 -->
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 pt-4 lg:pt-8">
      <div class="flex flex-col lg:flex-row gap-8">
        
        <!-- ── 左側：商品圖片與品項清單 ── -->
        <div class="flex-1 space-y-6">
          <!-- 組合大圖 -->
          <div class="bg-white rounded-3xl shadow-sm overflow-hidden aspect-video lg:aspect-auto lg:h-[400px] flex items-center justify-center text-[120px] select-none relative border border-gray-50">
            {{ combo.image }}
            <div class="absolute top-4 left-4 flex flex-col gap-2">
              <span class="bg-brand-primary text-white text-xs px-3 py-1 rounded-full font-bold shadow-sm">
                組合優惠
              </span>
              <span class="bg-indigo-500 text-white text-xs px-3 py-1 rounded-full font-bold shadow-sm">
                {{ combo.tempZoneLabel }}
              </span>
            </div>
          </div>

          <!-- 品項清單 -->
          <div class="bg-white rounded-3xl shadow-sm p-6 border border-gray-50">
            <h2 class="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
              <span class="w-1.5 h-6 bg-brand-primary rounded-full"></span>
              組合內含品項
            </h2>
            <div class="space-y-6">
              <div 
                v-for="(item, idx) in comboItems" 
                :key="item.id"
                class="flex items-center gap-4 group"
              >
                <!-- 品項圖 -->
                <div class="w-20 h-20 rounded-2xl bg-brand-surface flex items-center justify-center text-4xl flex-shrink-0 group-hover:scale-105 transition-transform duration-300">
                  {{ item.image }}
                </div>
                
                <!-- 品項資訊 -->
                <div class="flex-1 min-w-0">
                  <h3 class="font-bold text-gray-800 text-sm sm:text-base truncate mb-0.5">{{ item.name }}</h3>
                  <p class="text-xs text-gray-400 mb-2">{{ item.unit }}・單價 ${{ item.price }}</p>
                  
                  <!-- 數量調整器 -->
                  <div class="flex items-center bg-gray-50 w-fit rounded-xl border border-gray-100 overflow-hidden">
                    <button 
                      @click="updateQty(idx, -1)"
                      class="px-3 py-1.5 hover:bg-gray-100 text-gray-400 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                      :disabled="item.qty <= item.minQty"
                    >
                      <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
                      </svg>
                    </button>
                    <span class="w-10 text-center font-mono font-bold text-gray-700">{{ item.qty }}</span>
                    <button 
                      @click="updateQty(idx, 1)"
                      class="px-3 py-1.5 hover:bg-gray-100 text-gray-400 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                      :disabled="item.qty >= item.maxQty"
                    >
                      <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                      </svg>
                    </button>
                  </div>
                </div>

                <!-- 小計 -->
                <div class="text-right hidden sm:block">
                  <p class="text-xs text-gray-400 mb-1">小計</p>
                  <p class="font-bold text-gray-800">${{ (item.price * item.qty).toLocaleString() }}</p>
                </div>
              </div>
            </div>
            
            <!-- 組合小計提示 -->
            <div class="mt-8 p-4 bg-brand-surface rounded-2xl border border-brand-primary/10">
              <p class="text-xs text-brand-primary font-medium leading-relaxed">
                💡 提示：本組合支援部分品項數量調整，您可以根據需求增加最愛的品項。調整後總金額將會即時試算，整組購買更划算！
              </p>
            </div>
          </div>

          <!-- 詳細資訊 Tab -->
          <div class="bg-white rounded-3xl shadow-sm overflow-hidden border border-gray-50">
            <div class="flex border-b border-gray-50">
              <button 
                v-for="tab in tabs" 
                :key="tab.id"
                @click="activeTab = tab.id"
                class="flex-1 py-4 text-sm font-bold transition-all relative"
                :class="activeTab === tab.id ? 'text-brand-primary' : 'text-gray-400 hover:text-gray-600'"
              >
                {{ tab.label }}
                <div 
                  v-if="activeTab === tab.id"
                  class="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-1 bg-brand-primary rounded-full"
                ></div>
              </button>
            </div>
            <div class="p-6">
              <div v-if="activeTab === 'intro'" class="space-y-4">
                <p class="text-sm text-gray-600 leading-relaxed">{{ combo.description }}</p>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                  <div v-for="(feat, i) in combo.features" :key="i" class="flex gap-3">
                    <span class="text-brand-primary text-lg">✅</span>
                    <p class="text-sm text-gray-600">{{ feat }}</p>
                  </div>
                </div>
              </div>
              <div v-else class="space-y-3">
                <div v-for="(spec, label) in combo.specs" :key="label" class="flex border-b border-gray-50 pb-3 last:border-0">
                  <span class="w-24 text-sm text-gray-400 flex-shrink-0">{{ label }}</span>
                  <span class="text-sm text-gray-700 font-medium">{{ spec }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- ── 右側：結帳資訊（桌機懸浮） ── -->
        <aside class="w-full lg:w-96 space-y-6">
          <div class="bg-white rounded-3xl shadow-lg p-8 border border-gray-50 lg:sticky lg:top-24">
            <div class="mb-6">
              <p class="text-xs text-brand-accent font-bold mb-1">BEST SELLER</p>
              <h1 class="text-2xl font-black text-gray-800 leading-tight mb-2">{{ combo.name }}</h1>
              <p class="text-sm text-gray-500 line-clamp-2">{{ combo.shortDesc }}</p>
            </div>

            <!-- 價格試算 -->
            <div class="space-y-4 mb-8 pt-6 border-t border-gray-100">
              <div class="flex justify-between items-center text-sm text-gray-500">
                <span>品項總計</span>
                <span class="font-mono">${{ totalPrice.toLocaleString() }}</span>
              </div>
              <div class="flex justify-between items-center text-sm text-brand-primary font-bold">
                <span>組合折扣</span>
                <span class="font-mono">-${{ combo.discountAmount.toLocaleString() }}</span>
              </div>
              <div class="flex justify-between items-end pt-2">
                <span class="font-bold text-gray-800">應付金額</span>
                <div class="text-right">
                  <p class="text-3xl font-black text-brand-primary leading-none">
                    <span class="text-lg font-bold mr-0.5">$</span>{{ finalPrice.toLocaleString() }}
                  </p>
                  <p class="text-[10px] text-gray-400 mt-1">含 5% 營業稅，運費另計</p>
                </div>
              </div>
            </div>

            <!-- 操作按鈕 -->
            <div class="space-y-3">
              <button 
                @click="addToCart"
                class="w-full bg-brand-primary text-white py-4 rounded-2xl font-bold text-lg hover:bg-brand-dark transition-all active:scale-[0.98] shadow-xl shadow-brand-primary/20 flex items-center justify-center gap-2"
              >
                <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                整組加入購物車
              </button>
              <button class="w-full py-4 rounded-2xl font-bold text-gray-500 hover:bg-gray-50 transition-colors">
                收藏組合
              </button>
              <p v-if="addedNotice" class="rounded-2xl border border-brand-primary/15 bg-brand-surface px-4 py-3 text-sm font-medium text-brand-primary">
                已將「{{ combo.name }}」加入購物車
              </p>
            </div>

            <!-- 安心保證 -->
            <div class="mt-8 grid grid-cols-2 gap-4">
              <div class="flex flex-col items-center text-center p-3 bg-gray-50 rounded-2xl">
                <span class="text-xl mb-1">🛡️</span>
                <p class="text-[10px] font-bold text-gray-500">嚴格檢驗</p>
              </div>
              <div class="flex flex-col items-center text-center p-3 bg-gray-50 rounded-2xl">
                <span class="text-xl mb-1">🚚</span>
                <p class="text-[10px] font-bold text-gray-500">低溫快遞</p>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>

    <!-- 行動端底部結帳列 -->
    <div class="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 lg:hidden z-40 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
      <div class="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div>
          <p class="text-[10px] text-gray-400 font-bold uppercase tracking-wider">應付金額</p>
          <p class="text-2xl font-black text-brand-primary leading-tight">
            <span class="text-sm font-bold">$</span>{{ finalPrice.toLocaleString() }}
          </p>
        </div>
        <button 
          @click="addToCart"
          class="flex-1 bg-brand-primary text-white py-3.5 rounded-xl font-bold hover:bg-brand-dark active:scale-[0.98] transition-all flex items-center justify-center gap-2"
        >
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          加入購物車
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Product, TempZone } from '@/types'

interface ComboItem {
  id:     string
  name:   string
  image:  string
  price:  number
  unit:   string
  qty:    number
  minQty: number
  maxQty: number
}

interface Combo {
  id:             string
  name:           string
  shortDesc:      string
  description:    string
  image:          string
  tempZoneLabel:  string
  discountAmount: number
  features:       string[]
  specs:          Record<string, string>
}

export default Vue.extend({
  name: 'ComboProductView',

  data() {
    return {
      activeTab: 'intro',
      tabs: [
        { id: 'intro', label: '商品介紹' },
        { id: 'specs', label: '規格說明' },
      ],

      // 假資料：組合基礎資訊
      combo: {
        id:             'CB20260422',
        name:           '【有機防疫】旬鮮蔬菜箱',
        shortDesc:      '嚴選產地直送有機蔬菜，一箱滿足一週健康需求，均衡攝取多種營養。',
        description:    '為了提供忙碌現代人更便利的有機選擇，統一生機推出「旬鮮蔬菜箱」，內含多款時令葉菜、根莖與蕈菇。每款品項皆經過嚴格有機認證與農殘檢測，確保每一口都吃得安心、吃出鮮美原味。',
        image:          '📦',
        tempZoneLabel:  '冷藏配送',
        discountAmount: 120, // 組合現折金額
        features: [
          '國家級有機認證標準',
          '產地全程冷鏈配送',
          '無化學農藥與肥料',
          '每箱含多種時令菜種',
        ],
        specs: {
          '商品內容': '有機葉菜 × 3、有機根莖 × 2、有機蕈菇 × 1',
          '產地':     '台灣各有機農場',
          '保存期限': '冷藏 3~5 天（請儘早食用）',
          '配送方式': '黑貓宅急便低溫配送',
          '負責商':   '統一生機股份有限公司',
        },
      } as Combo,

      // 假資料：組合細項
      comboItems: [
        { id: 'P01', name: '有機花椰菜',   image: '🥦', price: 95,  unit: '包/250g', qty: 1, minQty: 1, maxQty: 3 },
        { id: 'P02', name: '有機胡蘿蔔',   image: '🥕', price: 65,  unit: '袋/500g', qty: 1, minQty: 1, maxQty: 2 },
        { id: 'P03', name: '有機嫩豆腐',   image: '🫘', price: 45,  unit: '盒/300g', qty: 2, minQty: 1, maxQty: 4 },
        { id: 'P04', name: '放牧雞蛋',     image: '🥚', price: 180, unit: '盒/10入', qty: 1, minQty: 1, maxQty: 2 },
        { id: 'P05', name: '有機大白菜',   image: '🥬', price: 110, unit: '顆/800g', qty: 1, minQty: 1, maxQty: 2 },
      ] as ComboItem[],
      addedNotice: false,
    }
  },

  computed: {
    // 原始總價（加總品項）
    totalPrice(): number {
      return this.comboItems.reduce((sum, item) => sum + (item.price * item.qty), 0)
    },

    // 最終應付金額（扣除組合折扣）
    finalPrice(): number {
      const price = this.totalPrice - this.combo.discountAmount
      return Math.max(0, price)
    },

    comboTempZone(): TempZone {
      if (this.combo.tempZoneLabel.includes('冷凍')) return 'frozen'
      if (this.combo.tempZoneLabel.includes('冷藏')) return 'chilled'
      if (this.combo.tempZoneLabel.includes('產地')) return 'fresh'
      return 'ambient'
    },

    comboProduct(): Product {
      return {
        id: this.combo.id,
        name: this.combo.name,
        description: this.combo.shortDesc,
        price: this.finalPrice,
        originalPrice: this.totalPrice,
        memberPrice: this.finalPrice,
        unit: '組',
        categoryId: 'combo',
        tempZone: this.comboTempZone,
        image: this.combo.image,
        inStock: true,
        isOrganic: true,
        origin: '台灣',
        tags: ['組合購', this.combo.tempZoneLabel],
        conveniencePickup: false,
        introduction: this.combo.description,
        features: this.combo.features,
        specs: Object.entries(this.combo.specs).map(([label, value]) => `${label}：${value}`).join('\n'),
      }
    },
  },

  methods: {
    updateQty(index: number, delta: number) {
      const item = this.comboItems[index]
      const newQty = item.qty + delta
      if (newQty >= item.minQty && newQty <= item.maxQty) {
        item.qty = newQty
      }
    },

    addToCart() {
      this.$store.dispatch('cart/addItem', this.comboProduct)
      this.$store.dispatch('ui/openCartDrawer')
      this.addedNotice = true
      window.setTimeout(() => { this.addedNotice = false }, 2500)
    },
  },
})
</script>

<style scoped>
/* 隱藏原生 Number Input 箭頭 */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* 漸層文字效果 */
.text-brand-gradient {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
</style>
