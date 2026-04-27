<template>
  <div class="min-h-screen bg-brand-bg pb-24">
    <!-- ══ 頁首 ══ -->
    <div class="bg-white border-b border-gray-100 sticky top-0 z-10">
      <div class="max-w-7xl mx-auto px-4 py-6 text-center">
        <h1 class="text-2xl lg:text-3xl font-black text-gray-800">關於統一生機</h1>
        <p class="text-sm text-gray-400 mt-1">專注有機，守護每一份純真美味</p>
      </div>
    </div>

    <div class="max-w-5xl mx-auto px-4 mt-12 space-y-20">
      <!-- 品牌故事 -->
      <section class="flex flex-col lg:flex-row items-center gap-12">
        <div class="flex-1 space-y-6">
          <div class="inline-block px-3 py-1 bg-brand-surface text-brand-primary text-xs font-bold rounded-full">Since 1999</div>
          <h2 class="text-3xl font-black text-gray-800">堅持有機，是我們對生命的諾言</h2>
          <p class="text-gray-500 leading-relaxed">
            統一生機成立於 1999 年，當時有機概念在台灣尚處萌芽階段。我們懷抱著對土地的敬畏與對健康的堅持，從第一粒種子開始，建立起完整的有機供應鏈。
          </p>
          <p class="text-gray-500 leading-relaxed">
            我們相信，食的安全不應是奢侈，而是生活的基本。透過產地直接合作與嚴格的品管標準，我們將大自然的恩賜，原封不動地送到您的餐桌。
          </p>
        </div>
        <div class="w-full lg:w-96 h-96 bg-brand-surface rounded-[2.5rem] flex items-center justify-center text-[120px] select-none shadow-inner border border-brand-primary/5">
          🌱
        </div>
      </section>

      <!-- 理念卡片 -->
      <section class="bg-white rounded-[3rem] p-12 shadow-sm border border-gray-50 text-center">
        <h2 class="text-2xl font-black text-gray-800 mb-12">我們的核心價值</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div v-for="idea in ideas" :key="idea.title" class="space-y-4">
            <div class="w-20 h-20 bg-brand-bg rounded-3xl flex items-center justify-center text-4xl mx-auto shadow-sm">
              {{ idea.icon }}
            </div>
            <h3 class="font-bold text-gray-800 text-lg">{{ idea.title }}</h3>
            <p class="text-sm text-gray-400 leading-relaxed px-4">{{ idea.desc }}</p>
          </div>
        </div>
      </section>

      <!-- 認證區 -->
      <section class="text-center">
        <h2 class="text-xl font-black text-gray-800 mb-8">國際權威認證・品質安心保證</h2>
        <div class="flex flex-wrap justify-center gap-6 opacity-40 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-500">
          <div v-for="i in 4" :key="i" class="w-40 h-20 bg-white border border-gray-100 rounded-2xl flex items-center justify-center font-black text-[10px] text-gray-300 tracking-tighter">
            CERTIFIED LOGO {{ i }}
          </div>
        </div>
      </section>

      <!-- ══ 品牌導覽 (New) ══ -->
      <section class="pt-12 border-t border-gray-100">
        <h2 class="text-2xl font-black text-gray-800 mb-8 text-center">探索更多</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <router-link 
            v-for="nav in brandNavs" 
            :key="nav.to"
            :to="nav.to"
            class="bg-white p-8 rounded-[2rem] border border-gray-50 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all group"
          >
            <div class="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">{{ nav.icon }}</div>
            <h3 class="font-bold text-gray-800 text-lg mb-2">{{ nav.label }}</h3>
            <p class="text-xs text-gray-400 leading-relaxed mb-4">{{ nav.desc }}</p>
            <span class="text-xs font-bold text-brand-primary flex items-center gap-1 group-hover:gap-2 transition-all">
              立即前往
              <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </span>
          </router-link>
        </div>
      </section>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: 'AboutView',
  data() {
    return {
      ideas: [
        { icon: '🌿', title: '堅持有機', desc: '從源頭把關，絕不妥協的驗證標準，確保純淨營養。' },
        { icon: '🤝', title: '產地直洽', desc: '與農友共生共好，縮短農場到餐桌的距離，保證新鮮。' },
        { icon: '🌎', title: '永續生活', desc: '友善環境的包裝，與地球共生息，創造更好的明天。' }
      ],
      brandNavs: [
        { to: '/news',   icon: '📢', label: '最新消息', desc: '獲取統一生機第一手活動資訊與健康情報。' },
        { to: '/stores', icon: '🏪', label: '銷售通路', desc: '尋找離您最近的實體門市，親手觸摸新鮮。' },
        { to: '/contact', icon: '💬', label: '聯絡我們', desc: '有任何問題嗎？我們的客服團隊隨時為您服務。' }
      ]
    }
  }
})
</script>
