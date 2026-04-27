<template>
  <div class="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col">
    <!-- Image area -->
    <div class="relative bg-brand-surface flex items-center justify-center h-36 text-6xl select-none">
      {{ product.image }}
      <!-- Temp zone badge -->
      <span :class="tempBadgeClass" class="absolute top-2 left-2 text-white text-xs px-2 py-0.5 rounded-full font-medium">
        {{ tempLabel }}
      </span>
      <!-- Organic badge -->
      <span v-if="product.isOrganic" class="absolute top-2 right-2 bg-brand-primary text-white text-xs px-1.5 py-0.5 rounded-full">
        有機
      </span>
      <!-- Out of stock overlay -->
      <div v-if="!product.inStock" class="absolute inset-0 bg-white bg-opacity-60 flex items-center justify-center">
        <span class="text-gray-500 font-medium text-sm">已售完</span>
      </div>
    </div>

    <!-- Content -->
    <div class="p-3 flex flex-col flex-1">
      <p class="text-xs text-gray-400 mb-0.5">📍 {{ product.origin }}</p>
      <h3 class="text-sm font-semibold text-gray-800 leading-snug mb-1 line-clamp-2">{{ product.name }}</h3>
      <p class="text-xs text-gray-500 mb-2">{{ product.unit }}</p>

      <!-- Price -->
      <div class="mt-auto">
        <div class="flex flex-col mb-2">
          <!-- 定價（有會員價時才顯示刪除線） -->
          <span
            v-if="product.memberPrice"
            class="text-gray-400 text-sm line-through leading-none"
          >${{ product.originalPrice }}</span>
          <!-- 主要顯示價格 -->
          <span class="text-brand-primary font-bold text-lg leading-tight">
            ${{ product.memberPrice ?? product.originalPrice }}
          </span>
          <!-- 會員價標籤 -->
          <span v-if="product.memberPrice" class="text-brand-accent text-xs font-medium">會員價</span>
        </div>

        <button
          :disabled="!product.inStock"
          class="w-full py-1.5 text-sm rounded-lg font-medium transition-colors"
          :class="product.inStock
            ? 'bg-brand-primary text-white hover:bg-brand-dark'
            : 'bg-gray-200 text-gray-400 cursor-not-allowed'"
          @click="addToCart"
        >
          {{ product.inStock ? '加入購物車' : '缺貨中' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { Product, TempZone, TEMP_ZONE_LABEL } from '@/types'

export default Vue.extend({
  name: 'ProductCard',

  props: {
    product: {
      type: Object as PropType<Product>,
      required: true,
    },
  },

  computed: {
    tempLabel(): string {
      return TEMP_ZONE_LABEL[this.product.tempZone as TempZone]
    },
    tempBadgeClass(): string {
      const map: Record<TempZone, string> = {
        ambient: 'bg-temp-ambient',
        chilled: 'bg-temp-chilled',
        frozen:  'bg-temp-frozen',
        fresh:   'bg-temp-fresh',
      }
      return map[this.product.tempZone as TempZone]
    },
  },

  methods: {
    addToCart() {
      this.$store.dispatch('cart/addItem', this.product)
    },
  },
})
</script>
