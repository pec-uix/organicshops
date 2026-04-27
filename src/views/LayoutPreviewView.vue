<template>
  <div class="min-h-screen bg-[#F7F5F0]">
    <component :is="currentLayout" />

    <div class="fixed bottom-4 left-4 z-50 flex flex-col items-start gap-3">
      <div class="rounded-2xl border border-[#2D6A2D]/10 bg-white/95 p-3 shadow-xl backdrop-blur">
        <p class="mb-2 text-[10px] font-black tracking-[0.25em] text-[#2D6A2D]">快速切換版型</p>
        <div class="flex flex-col gap-2">
          <button
            v-for="tab in tabs"
            :key="'floating-' + tab.key"
            type="button"
            class="flex items-center gap-2 rounded-full border px-3 py-2 text-xs font-black tracking-[0.2em] transition-all"
            :class="currentKey === tab.key ? 'border-[#2D6A2D] bg-[#E8F5E8] text-[#2D6A2D] shadow-sm' : 'border-[#2D6A2D]/10 bg-white text-[#1F2937] hover:border-[#2D6A2D]/30 hover:bg-[#F7F5F0]'"
            @click="switchLayout(tab.key)"
          >
            <span
              class="flex h-7 w-7 items-center justify-center rounded-full text-[11px]"
              :class="currentKey === tab.key ? 'bg-[#2D6A2D] text-white' : 'bg-[#F7F5F0] text-[#2D6A2D]'"
            >
              {{ tab.key.toUpperCase() }}
            </span>
            <span>{{ tab.shortTitle }}</span>
          </button>
        </div>
      </div>

      <div class="rounded-2xl border border-[#2D6A2D]/10 bg-white px-4 py-3 text-xs font-black tracking-[0.25em] text-[#2D6A2D] shadow-lg">
        此為排版對焦展示，顏色以品牌色為準
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import HomeLayoutA from '@/views/home/HomeLayoutA.vue'
import HomeLayoutB from '@/views/home/HomeLayoutB.vue'
import HomeLayoutC from '@/views/home/HomeLayoutC.vue'
import HomeLayoutD from '@/views/home/HomeLayoutD.vue'

export default Vue.extend({
  name: 'LayoutPreviewView',
  components: {
    HomeLayoutA,
    HomeLayoutB,
    HomeLayoutC,
    HomeLayoutD,
  },
  data() {
    return {
      currentKey: 'a' as 'a' | 'b' | 'c' | 'd',
      tabs: [
        {
          key: 'a',
          title: '版面A 有機質感',
          shortTitle: '有機質感',
          lines: ['大圖 Hero 輪播', '溫層橫條 / 分類圖示 / 精選商品', '適合品牌感與內容質感呈現'],
        },
        {
          key: 'b',
          title: '版面B 促銷導向',
          shortTitle: '促銷導向',
          lines: ['跑馬燈公告 / 左大右小 Hero', '高密度商品與排行榜', '適合活動與銷售強化'],
        },
        {
          key: 'c',
          title: '版面C 功能電商',
          shortTitle: '功能電商',
          lines: ['分類側欄 / 主 Banner / 限時搶購', '分區商品與搜尋關鍵字', '適合效率導購與分類瀏覽'],
        },
        {
          key: 'd',
          title: '版面D 生鮮市集',
          shortTitle: '生鮮市集',
          lines: ['全寬食材攝影 Hero', '溫層入口 / 今日嚴選 / 組合購', '適合強調產地與生鮮氛圍'],
        },
      ],
    }
  },
  computed: {
    currentLayout() {
      const state = this as any
      const map: any = {
        a: HomeLayoutA,
        b: HomeLayoutB,
        c: HomeLayoutC,
        d: HomeLayoutD,
      }
      return map[state.currentKey]
    },
  },
  mounted() {
    const layout = this.$route.query.layout
    if (layout === 'a' || layout === 'b' || layout === 'c' || layout === 'd') {
      this.currentKey = layout
    }
  },
  methods: {
    switchLayout(key: 'a' | 'b' | 'c' | 'd') {
      if (key === 'a') {
        this.$router.push({ name: 'home' }).catch(() => undefined)
        return
      }
      this.currentKey = key
      if (this.$route.query.layout !== key) {
        this.$router.replace({ query: { ...this.$route.query, layout: key } }).catch(() => undefined)
      }
      window.scrollTo({ top: 0, behavior: 'smooth' })
    },
  },
})
</script>
