<template>
  <div class="min-h-screen bg-brand-bg pb-20">
    <div class="bg-white border-b border-gray-100 py-12 text-center">
      <h1 class="text-3xl font-black text-gray-800 mb-2">銷售通路</h1>
      <p class="text-gray-400">尋找離您最近的統一生機，體驗鮮美原味</p>
    </div>

    <div class="max-w-6xl mx-auto px-4 mt-12">
      <div class="flex flex-col lg:flex-row gap-8">
        <!-- 門市列表 -->
        <div class="w-full lg:w-96 space-y-4 max-h-[600px] overflow-y-auto pr-2 scrollbar-hide">
          <div 
            v-for="store in stores" 
            :key="store.name"
            class="bg-white rounded-2xl p-5 shadow-sm border border-gray-50 hover:border-brand-primary transition-all cursor-pointer group"
          >
            <h3 class="font-bold text-gray-800 group-hover:text-brand-primary">{{ store.name }}</h3>
            <p class="text-xs text-gray-400 mt-2 flex items-start gap-2">
              <span>📍</span> {{ store.address }}
            </p>
            <p class="text-xs text-gray-400 mt-1 flex items-start gap-2">
              <span>📞</span> {{ store.phone }}
            </p>
            <div class="mt-4 flex gap-2">
              <span class="px-2 py-0.5 bg-brand-surface text-brand-primary text-[10px] font-bold rounded">有機生鮮</span>
              <span class="px-2 py-0.5 bg-indigo-50 text-indigo-500 text-[10px] font-bold rounded">冷鏈儲物</span>
            </div>
          </div>
        </div>

        <!-- 地圖佔位 -->
        <div class="flex-1 h-[600px] bg-gray-100 rounded-3xl relative overflow-hidden flex items-center justify-center">
          <div class="text-center">
            <div class="text-6xl mb-4 grayscale opacity-20">🗺️</div>
            <p class="text-gray-400 font-bold">互動式地圖載入中...</p>
          </div>
          <!-- 模擬地圖上的 Pin -->
          <div class="absolute inset-0 pointer-events-none">
            <div class="absolute top-1/4 left-1/3 text-3xl">📍</div>
            <div class="absolute top-1/2 left-1/2 text-3xl">📍</div>
            <div class="absolute bottom-1/3 right-1/4 text-3xl">📍</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: 'StoresView',
  data() {
    return {
      stores: [
        { name: '台北忠孝店', address: '台北市大安區忠孝東路三段 120 號', phone: '02-1234-5678' },
        { name: '板橋文化店', address: '新北市板橋區文化路二段 45 號', phone: '02-8765-4321' },
        { name: '桃園文中店', address: '桃園市桃園區文中路 8 號', phone: '03-123-4567' },
        { name: '台中西屯店', address: '台中市西屯區台灣大道三段 1 號', phone: '04-2345-6789' },
        { name: '高雄明誠店', address: '高雄市左營區明誠二路 50 號', phone: '07-345-6789' }
      ]
    }
  }
})
</script>
