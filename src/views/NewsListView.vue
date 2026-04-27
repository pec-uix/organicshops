<template>
  <div class="min-h-screen bg-brand-bg pb-20">
    <div class="bg-white border-b border-gray-100 py-12 text-center">
      <h1 class="text-3xl font-black text-gray-800 mb-2 tracking-[0.2em]">品牌健康誌</h1>
      <p class="text-gray-400 font-serif italic tracking-widest">Stories of Soil, Food and Life</p>
    </div>

    <div class="max-w-5xl mx-auto px-4 mt-12">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
        <router-link 
          v-for="news in newsList" 
          :key="news.id"
          :to="'/news/' + news.id"
          class="group flex flex-col"
        >
          <div class="aspect-[4/3] bg-[#F2F1EE] flex items-center justify-center text-6xl mb-6 relative overflow-hidden">
            {{ news.icon }}
            <div class="absolute inset-0 bg-brand-primary/0 group-hover:bg-brand-primary/5 transition-colors"></div>
          </div>
          <div class="px-1">
            <div class="flex items-center gap-3 mb-3">
              <span class="text-[9px] font-black text-brand-primary uppercase tracking-[0.2em] border-b border-brand-primary pb-0.5">{{ news.tag }}</span>
              <span class="text-[9px] text-gray-300 font-mono tracking-tighter">{{ news.date }}</span>
            </div>
            <h2 class="text-lg font-sans font-black text-gray-800 group-hover:text-brand-primary transition-colors line-clamp-2 leading-tight tracking-wide">
              {{ news.title }}
            </h2>
            <p class="text-xs text-gray-400 mt-4 line-clamp-2 leading-loose font-serif italic tracking-widest">
              {{ news.summary }}
            </p>
          </div>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: 'NewsListView',
  data() {
    return {
      newsList: [
        { id: '1', title: '【重要公告】春節期間物流配送調整通知', date: '2026-01-15', tag: '公告', icon: '🧧', summary: '因應農曆春節假期，統一生機官方購物網之配送時間將進行調整...' },
        { id: '2', title: '【新品上市】初夏首採！有機荔枝預購開跑', date: '2026-04-20', tag: '活動', icon: '🍈', summary: '來自高雄大樹的嚴選有機荔枝，顆顆飽滿香甜，現正開放限量預購中。' },
        { id: '3', title: '【品牌消息】統一生機榮獲 2026 有機大賞首獎', date: '2026-03-10', tag: '消息', icon: '🏆', summary: '感謝各界肯定，統一生機將繼續秉持「健康、環保、永續」的理念服務。' },
        { id: '4', title: '【優惠提醒】點數兩倍送！綠色生活節正式展開', date: '2026-04-01', tag: '活動', icon: '🌿', summary: '即日起至 4/30，全館消費滿額即享點數兩倍回饋，快來選購您的健康物資。' }
      ]
    }
  }
})
</script>
