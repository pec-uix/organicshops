<template>
  <div class="min-h-screen bg-brand-bg pb-20">
    <div class="max-w-3xl mx-auto px-4 pt-12">
      <router-link to="/news" class="text-xs text-gray-400 hover:text-brand-primary transition-colors flex items-center gap-1 mb-8">
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
        返回列表
      </router-link>

      <div class="bg-white rounded-[2rem] shadow-sm overflow-hidden border border-gray-50">
        <div class="aspect-[21/9] bg-brand-primary flex items-center justify-center text-8xl select-none">
          {{ news.icon }}
        </div>
        <div class="p-8 lg:p-12">
          <div class="flex items-center gap-3 mb-6">
            <span class="px-3 py-1 bg-brand-surface text-brand-primary text-xs font-bold rounded-full">{{ news.tag }}</span>
            <span class="text-xs text-gray-300 font-mono">{{ news.date }}</span>
          </div>
          <h1 class="text-2xl lg:text-4xl font-black text-gray-800 leading-tight mb-8">
            {{ news.title }}
          </h1>
          <div class="prose prose-sm max-w-none text-gray-500 leading-loose space-y-6">
            <p v-for="(p, i) in news.paragraphs" :key="i">{{ p }}</p>
          </div>
          <div class="mt-12 pt-8 border-t border-gray-50 flex justify-between items-center">
            <div class="flex gap-4">
              <button class="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center hover:text-blue-600 transition-colors">FB</button>
              <button class="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center hover:text-green-600 transition-colors">LINE</button>
            </div>
            <button @click="$router.back()" class="text-sm font-bold text-brand-primary">關閉文章</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: 'NewsDetailView',
  data() {
    return {
      news: {
        id: '1', 
        tag: '公告', 
        date: '2026-01-15', 
        icon: '🧧',
        title: '【重要公告】春節期間物流配送調整通知',
        paragraphs: [
          '感謝您對統一生機長久以來的支持。因應即將到來的 2026 農曆春節假期，為了讓物流夥伴也能安心過節，我們將針對訂單配送時間進行以下調整。',
          '1. 最後接單日期：1 月 24 日（五）18:00 前完成付款之訂單。',
          '2. 暫停配送期間：1 月 27 日（一）至 2 月 2 日（日）。',
          '3. 恢復正常作業：2 月 3 日（一）起陸續依照訂單順序安排出貨。',
          '春節期間網站仍可正常下單，唯配送時間會有所延遲，造成您的不便，敬請見諒。若有急需使用的商品，建議您提前完成選購與付款。'
        ]
      }
    }
  }
})
</script>
