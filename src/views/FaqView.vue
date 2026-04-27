<template>
  <div class="min-h-screen bg-brand-bg pb-20">
    <div class="bg-white border-b border-gray-100 py-12 text-center">
      <h1 class="text-3xl font-black text-gray-800 mb-2">常見問題</h1>
      <p class="text-gray-400">解答您的購物疑惑，讓體驗更順暢</p>
    </div>

    <div class="max-w-3xl mx-auto px-4 mt-12 space-y-8">
      <section v-for="section in faqSections" :key="section.title">
        <h2 class="text-lg font-bold text-brand-primary mb-4 flex items-center gap-2">
          <span class="w-1.5 h-6 bg-brand-primary rounded-full"></span>
          {{ section.title }}
        </h2>
        <div class="space-y-3">
          <div 
            v-for="(item, idx) in section.items" 
            :key="idx"
            class="bg-white rounded-2xl shadow-sm border border-gray-50 overflow-hidden"
          >
            <button 
              @click="toggle(section.title + idx)"
              class="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <span class="font-bold text-gray-700 text-sm">{{ item.q }}</span>
              <svg 
                class="w-5 h-5 text-gray-300 transition-transform" 
                :class="{ 'rotate-180': isOpen(section.title + idx) }"
                fill="none" viewBox="0 0 24 24" stroke="currentColor"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <div v-show="isOpen(section.title + idx)" class="px-6 pb-5">
              <p class="text-sm text-gray-500 leading-relaxed pt-2 border-t border-gray-50">
                {{ item.a }}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: 'FaqView',
  data() {
    return {
      openedItems: [] as string[],
      faqSections: [
        {
          title: '購物流程',
          items: [
            { q: '如何加入會員？', a: '點擊右上方人像圖示，選擇「立即註冊」，輸入手機號碼並完成簡訊驗證即可加入。' },
            { q: '忘記密碼怎麼辦？', a: '在登入頁面點擊「忘記密碼」，我們將寄送重設密碼連結至您的註冊 Email。' }
          ]
        },
        {
          title: '配送與運費',
          items: [
            { q: '運費如何計算？', a: '常溫商品滿 $800 免運，低溫商品滿 $1,200 免運，未達門檻收取 $150 運費。' },
            { q: '配送需要多久？', a: '訂單成立後約 2-4 個工作天內出貨，週六日與國定假日不出貨。' }
          ]
        },
        {
          title: '退換貨政策',
          items: [
            { q: '收到商品有瑕疵怎麼辦？', a: '請於收到商品 7 日內，透過「聯絡客服」或「訂單明細」申請退換貨，並附上照片。' },
            { q: '生鮮食品可以退貨嗎？', a: '依據法規，生鮮食品不適用 7 天鑑賞期，除商品品質問題外恕不接受退貨。' }
          ]
        }
      ]
    }
  },
  methods: {
    toggle(id: string) {
      const idx = this.openedItems.indexOf(id)
      if (idx > -1) this.openedItems.splice(idx, 1)
      else this.openedItems.push(id)
    },
    isOpen(id: string) {
      return this.openedItems.includes(id)
    }
  }
})
</script>
