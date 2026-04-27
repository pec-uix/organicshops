<template>
  <div class="min-h-screen bg-brand-bg pb-20">
    <div class="bg-white border-b border-gray-100 py-12 text-center">
      <h1 class="text-3xl font-black text-gray-800 mb-2">購物須知</h1>
      <p class="text-gray-400">了解購物的每一小步，安心更放心</p>
    </div>

    <div class="max-w-4xl mx-auto px-4 mt-12 space-y-12">
      <!-- 流程圖 -->
      <section>
        <h2 class="text-lg font-bold text-gray-800 mb-8 text-center">購物流程</h2>
        <div class="flex flex-col md:flex-row items-center justify-between gap-4">
          <div v-for="(step, idx) in steps" :key="idx" class="flex flex-col items-center flex-1">
            <div class="w-16 h-16 rounded-full bg-brand-surface flex items-center justify-center text-2xl shadow-inner border border-brand-primary/10">
              {{ step.icon }}
            </div>
            <p class="text-sm font-bold text-gray-700 mt-4">{{ step.title }}</p>
            <p class="text-[10px] text-gray-400 mt-1">{{ step.desc }}</p>
            <div v-if="idx < steps.length - 1" class="hidden md:block absolute -right-4 top-8 text-gray-200">
              <svg class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>
      </section>

      <!-- 運費表格 -->
      <section class="bg-white rounded-3xl shadow-sm overflow-hidden border border-gray-50">
        <div class="bg-brand-primary/5 px-8 py-4 border-b border-gray-50">
          <h2 class="font-bold text-gray-800">運費與配送規則</h2>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-left text-sm">
            <thead class="bg-gray-50 text-gray-400 font-bold">
              <tr>
                <th class="px-8 py-4">配送溫層</th>
                <th class="px-8 py-4">免運門檻</th>
                <th class="px-8 py-4">未達門檻運費</th>
                <th class="px-8 py-4">配送方式</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-50">
              <tr v-for="row in shippingRules" :key="row.temp">
                <td class="px-8 py-4 font-bold text-gray-700">{{ row.temp }}</td>
                <td class="px-8 py-4 text-brand-primary font-bold">滿 ${{ row.threshold }}</td>
                <td class="px-8 py-4 text-gray-500">${{ row.fee }}</td>
                <td class="px-8 py-4 text-gray-500">{{ row.method }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: 'ShoppingGuideView',
  data() {
    return {
      steps: [
        { icon: '🔍', title: '選購商品', desc: '挑選有機好物' },
        { icon: '🛒', title: '加入購物車', desc: '確認品項數量' },
        { icon: '💳', title: '結帳付款', desc: '選擇多元支付' },
        { icon: '📦', title: '出貨配送', desc: '安心配送到府' },
        { icon: '✨', title: '商品送達', desc: '開啟美味生活' }
      ],
      shippingRules: [
        { temp: '常溫宅配', threshold: 1200, fee: 100, method: '黑貓宅配 / 新竹貨運宅配' },
        { temp: '常溫超商取貨', threshold: 599, fee: 60, method: '7-11 超商取貨（含取貨付款）' },
        { temp: '冷凍宅配', threshold: 800, fee: 150, method: '黑貓低溫宅配' }
      ]
    }
  }
})
</script>
