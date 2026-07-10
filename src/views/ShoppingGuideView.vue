<template>
  <div class="min-h-screen bg-brand-bg pb-20">
    <section class="relative overflow-hidden bg-[#F0F4F1]">
      <img
        :src="shoppingGuideBannerImage"
        alt="購物須知"
        class="absolute inset-0 h-full w-full object-cover opacity-90"
      />
      <div class="absolute inset-0 bg-gradient-to-r from-white/15 to-transparent"></div>
      <div class="relative z-10 mx-auto max-w-[1100px] px-4 py-14 lg:px-8 lg:py-20">
        <h1 class="text-3xl font-black leading-tight tracking-[0.16em] text-brand-dark lg:text-5xl">購物須知</h1>
        <p class="mt-5 max-w-2xl text-sm font-bold leading-[1.6] text-[#374151] lg:text-base">
          了解購物流程、結帳方式、運費與注意事項
        </p>
      </div>
    </section>

    <main class="mx-auto max-w-[1100px] px-4 pt-8 lg:px-8">
      <nav class="mb-6 flex flex-wrap items-center gap-x-1.5 gap-y-1 border-b border-gray-100 pb-8 text-sm text-gray-500">
        <router-link to="/" class="inline-flex items-center gap-1 whitespace-nowrap transition-colors hover:text-brand-primary" aria-label="返回首頁">
          <svg class="h-4 w-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 11.5L12 4l9 7.5M5.5 10.5V20h13v-9.5M9.5 20v-5.5h5V20" />
          </svg>
          <span>首頁</span>
        </router-link>
        <span class="inline-flex items-center gap-1.5 whitespace-nowrap text-gray-800">
          <span>›</span>
          購物須知
        </span>
      </nav>

      <div class="mx-auto max-w-[1100px] space-y-8">
      <!-- 1. 購物流程與結帳步驟 -->
      <section class="mt-8 first:mt-0">
        <div class="px-6 py-5 sm:px-8">
          <h2 class="border-l-4 border-brand-primary pl-3 text-lg font-bold text-gray-800">購物流程與結帳步驟</h2>
          <p class="mt-1 text-sm text-gray-400">從選商品、結帳到送達，依序完成即可。</p>
        </div>
        <div class="px-6 py-8 sm:px-8">
          <div class="rounded-2xl border border-gray-100 bg-[#F9FAFB] p-2">
            <div class="overflow-x-auto">
              <div class="grid min-w-[980px] grid-cols-6 gap-2 xl:min-w-0">
                <button
                  v-for="(step, idx) in steps"
                  :key="step.title"
                  type="button"
                  class="group relative flex flex-col items-center justify-center rounded-xl border px-4 py-4 text-center transition-colors"
                  :class="selectedStepIndex === idx ? 'border-brand-primary bg-white text-brand-primary shadow-sm' : 'border-transparent bg-transparent text-gray-500 hover:border-gray-200 hover:bg-white hover:text-gray-700'"
                  @click="selectedStepIndex = idx"
                >
                  <div class="flex h-14 w-14 items-center justify-center rounded-full bg-brand-primary text-sm font-black tracking-[0.12em] text-white">
                    {{ `0${idx + 1}` }}
                  </div>
                  <span class="mt-3 text-sm font-bold leading-5 text-inherit">{{ step.title }}</span>
                </button>
              </div>
            </div>
          </div>

          <div class="mt-5 bg-white px-0 py-1 sm:py-2">
            <div class="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div class="flex items-center gap-3">
                <div class="flex h-12 w-12 items-center justify-center rounded-full bg-brand-primary text-sm font-black tracking-[0.12em] text-white">
                  {{ `0${selectedStepIndex + 1}` }}
                </div>
                <h3 class="text-xl font-black text-gray-800">{{ selectedStep.title }}</h3>
              </div>
            </div>
            <p class="mt-5 text-[15px] leading-7 text-gray-600">
              {{ selectedStep.detail }}
            </p>
          </div>
        </div>
      </section>

      <div class="mx-6 border-t-2 border-gray-200 sm:mx-8"></div>

      <!-- 3. 運費與配送規則 -->
      <section class="mt-8">
        <div class="px-6 py-5 sm:px-8">
          <h2 class="border-l-4 border-brand-primary pl-3 text-lg font-bold text-gray-800">運費與配送規則</h2>
          <p class="mt-1 text-sm text-gray-400">不同溫層分開計算，實際金額以結帳頁顯示為準。</p>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-left text-sm">
            <thead class="bg-[#F4F7F0] font-bold text-gray-400">
              <tr>
                <th class="px-6 py-3.5 sm:px-8">配送溫層</th>
                <th class="px-6 py-3.5 sm:px-8">免運門檻</th>
                <th class="px-6 py-3.5 sm:px-8">未達門檻運費</th>
                <th class="px-6 py-3.5 sm:px-8">配送方式</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-50">
              <tr v-for="row in shippingRules" :key="row.temp">
                <td class="px-6 py-3.5 font-bold text-gray-700 sm:px-8">{{ row.temp }}</td>
                <td class="px-6 py-3.5 font-bold text-brand-primary sm:px-8">滿 ${{ row.threshold }}</td>
                <td class="px-6 py-3.5 text-gray-500 sm:px-8">${{ row.fee }}</td>
                <td class="px-6 py-3.5 text-gray-500 sm:px-8">{{ row.method }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="grid gap-3 border-t border-gray-50 px-6 py-5 text-sm text-gray-500 sm:px-8 md:grid-cols-3">
          <div v-for="note in shippingNotes" :key="note" class="rounded-2xl bg-gray-50 px-4 py-3 leading-relaxed">
            {{ note }}
          </div>
        </div>
      </section>

      <div class="mx-6 border-t-2 border-gray-200 sm:mx-8"></div>

      <!-- 4. 注意事項 -->
      <section class="mt-8">
        <div class="px-6 py-5 sm:px-8">
          <h2 class="border-l-4 border-brand-primary pl-3 text-lg font-bold text-gray-800">注意事項</h2>
          <p class="mt-1 text-sm text-gray-400">下單前先確認效期與商品標示，避免配送後產生落差。</p>
        </div>
        <div class="space-y-4 px-6 py-6 sm:px-8">
          <div v-for="item in notices" :key="item.title" class="rounded-2xl bg-brand-bg p-5">
            <p class="text-sm font-bold text-gray-800">{{ item.title }}</p>
            <p class="mt-2 text-sm leading-relaxed text-gray-500">{{ item.detail }}</p>
          </div>
        </div>
      </section>
      </div>
    </main>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: 'ShoppingGuideView',
  data() {
    return {
      shoppingGuideBannerImage: require('../../images/背景圖.png'),
      selectedStepIndex: 0,
      steps: [
        {
          title: '選購商品',
          detail: '先從分類、搜尋或推薦區挑選商品，進入詳情頁後可查看規格與價格。'
        },
        {
          title: '加入購物車',
          detail: '確認數量與規格後加入購物車，若有其他商品可繼續瀏覽後再結帳。'
        },
        {
          title: '填寫結帳資訊',
          detail: '前往結帳頁選擇配送方式並填入收件資料，送出前可再次確認折抵與運費。'
        },
        {
          title: '送出訂單',
          detail: '確認所有內容無誤後送出，完成後可至會員中心查看訂單進度。'
        },
        {
          title: '出貨配送',
          detail: '系統依商品溫層與配送方式安排出貨，請留意配送時間與聯絡資訊。'
        },
        {
          title: '商品送達',
          detail: '收到商品後即可依保存方式存放，享受新鮮送達的有機好物。'
        }
      ],
      shippingRules: [
        { temp: '常溫宅配', threshold: 1200, fee: 120, method: '黑貓宅配 / 新竹貨運宅配' },
        { temp: '常溫超商取貨', threshold: 599, fee: 60, method: '7-11 超商取貨（含取貨付款）' },
        { temp: '冷凍宅配', threshold: 800, fee: 120, method: '黑貓低溫宅配' },
        { temp: '冷凍超商取貨', threshold: 800, fee: 100, method: '依可配送門市為準' }
      ],
      shippingNotes: [
        '常溫商品與冷凍商品因溫層不同，運費會分開計算。',
        '運費金額以未扣抵購物金前的訂單金額為準。',
        '金門、澎湖等離島地區暫不提供配送服務。'
      ],
      notices: [
        {
          title: '食品效期說明',
          detail: '食品類商品依商品效期長短不一管理，出貨商品至少需保有一半以上效期；若為即期品，頁面會另外標示。'
        },
        {
          title: '商品標示補充',
          detail: '若有活動贈品、限量品或特殊配送限制，會在品名、文案或活動說明中補充，請下單前留意相關標示。'
        }
      ]
    }
  },
  computed: {
    selectedStep(): { title: string; detail: string } {
      return this.steps[this.selectedStepIndex] || this.steps[0]
    }
  }
})
</script>
