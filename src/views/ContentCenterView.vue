<template>
  <div class="min-h-screen bg-brand-bg pb-20">
    <section class="relative overflow-hidden bg-[#F6F3EA]">
      <div class="absolute inset-0 opacity-60">
        <div class="absolute -left-16 top-10 h-40 w-40 rounded-full bg-[#DDE9C8] blur-3xl"></div>
        <div class="absolute right-0 top-0 h-56 w-56 rounded-full bg-[#F4D7A1] blur-3xl"></div>
      </div>

      <div class="relative mx-auto max-w-6xl px-4 py-16 lg:py-20">
        <p class="text-xs font-black tracking-[0.35em] text-brand-primary">CONTENT PREVIEW</p>
        <h1 class="mt-4 max-w-3xl text-4xl font-black leading-tight text-gray-800 lg:text-5xl">
          健康誌與食譜頁面
          <br />
          先用共同頁面確認方向
        </h1>
        <p class="mt-5 max-w-2xl text-sm leading-7 text-gray-500 lg:text-base">
          這裡先整合「健康誌」與「食譜」兩個內容入口，確認資訊架構、視覺風格與內容欄位後，
          再拆成獨立頁面或保留共用入口。
        </p>
      </div>
    </section>

    <section class="mx-auto mt-10 max-w-6xl px-4">
      <div class="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <div class="grid gap-6 md:grid-cols-2">
          <article
            v-for="section in sections"
            :key="section.key"
            class="overflow-hidden rounded-[2rem] border border-white/70 bg-white shadow-sm"
          >
            <div class="px-6 py-6" :style="{ background: section.banner }">
              <div class="flex items-start justify-between gap-4">
                <div>
                  <p class="text-xs font-black tracking-[0.3em]" :style="{ color: section.accent }">{{ section.eyebrow }}</p>
                  <h2 class="mt-3 text-2xl font-black text-gray-800">{{ section.title }}</h2>
                </div>
                <span class="text-4xl">{{ section.icon }}</span>
              </div>
              <p class="mt-4 text-sm leading-7 text-gray-600">{{ section.description }}</p>
            </div>

            <div class="space-y-5 px-6 py-6">
              <div>
                <p class="text-xs font-black tracking-[0.25em] text-gray-400">預計內容</p>
                <ul class="mt-3 space-y-2 text-sm leading-6 text-gray-600">
                  <li v-for="item in section.items" :key="item" class="flex items-start gap-2">
                    <span class="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full" :style="{ backgroundColor: section.accent }"></span>
                    <span>{{ item }}</span>
                  </li>
                </ul>
              </div>

              <div class="rounded-2xl border border-dashed border-gray-200 bg-gray-50 px-4 py-4">
                <p class="text-xs font-black tracking-[0.25em] text-gray-400">目前規劃</p>
                <p class="mt-2 text-sm leading-7 text-gray-600">{{ section.plan }}</p>
              </div>

              <button
                type="button"
                class="inline-flex items-center rounded-full px-4 py-2 text-sm font-bold text-white shadow-sm"
                :style="{ backgroundColor: section.accent }"
              >
                待確認內容架構
              </button>
            </div>
          </article>
        </div>

        <aside class="rounded-[2rem] bg-[#2F3B2F] px-6 py-7 text-white shadow-sm">
          <p class="text-xs font-black tracking-[0.3em] text-[#C9DBB0]">NEXT STEP</p>
          <h3 class="mt-3 text-2xl font-black leading-tight">這頁先當共用入口</h3>
          <p class="mt-4 text-sm leading-7 text-white/75">
            待你確認後，可以選擇：
          </p>

          <ul class="mt-5 space-y-3 text-sm leading-6 text-white/85">
            <li v-for="option in nextSteps" :key="option" class="flex items-start gap-3">
              <span class="mt-1 text-[#DDE9C8]">•</span>
              <span>{{ option }}</span>
            </li>
          </ul>

          <div class="mt-8 rounded-2xl bg-white/10 px-4 py-4">
            <p class="text-xs font-black tracking-[0.25em] text-[#C9DBB0]">建議做法</p>
            <p class="mt-2 text-sm leading-7 text-white/80">
              如果健康誌之後以每月 PDF 為主、食譜則是文章卡片或分類列表，最終通常還是拆成兩個頁面比較合理。
              現在先共用一頁，可以先確認品牌語氣和版型方向。
            </p>
          </div>
        </aside>
      </div>
    </section>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

interface PreviewSection {
  key: string
  eyebrow: string
  title: string
  icon: string
  accent: string
  banner: string
  description: string
  items: string[]
  plan: string
}

export default Vue.extend({
  name: 'ContentCenterView',
  data() {
    return {
      sections: [
        {
          key: 'journal',
          eyebrow: 'HEALTH JOURNAL',
          title: '健康誌',
          icon: '📘',
          accent: '#6B8E23',
          banner: 'linear-gradient(135deg, #EEF5E4 0%, #F8FBF2 100%)',
          description: '預留給每月健康主題刊物、品牌專題、保健知識與 PDF 月刊內容。',
          items: [
            '每月一期 PDF 電子刊',
            '本月主題與編輯摘要',
            '歷月期數列表與下載入口',
          ],
          plan: '目前先以「每月一個 PDF 檔」的模式規劃，之後可補封面圖、月份篩選與線上預覽。',
        },
        {
          key: 'recipe',
          eyebrow: 'RECIPE STUDIO',
          title: '食譜',
          icon: '🥗',
          accent: '#D6862B',
          banner: 'linear-gradient(135deg, #FFF1DE 0%, #FFF8EF 100%)',
          description: '預留給料理提案、食材搭配、節氣菜單與操作步驟等內容型頁面。',
          items: [
            '主題食譜卡片列表',
            '料理步驟與食材建議',
            '可串接商品導購或搭配組合',
          ],
          plan: '目前先保留為內容入口，待你確認是要清單式、雜誌式，還是單篇圖文頁之後再拆開。',
        },
      ] as PreviewSection[],
      nextSteps: [
        '維持這個共用入口頁，再各自延伸到健康誌與食譜子頁面',
        '把健康誌與食譜直接拆成兩個獨立頁面',
        '先確認其中一個頁面樣式，再複製相同架構到另一個內容區',
      ] as string[],
    }
  },
})
</script>
