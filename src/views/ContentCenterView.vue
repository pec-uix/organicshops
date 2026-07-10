<template>
  <div class="min-h-screen bg-brand-bg pb-20">
    <section class="relative overflow-hidden bg-[#F6F3EA]">
      <div class="absolute inset-0 opacity-60">
        <div class="absolute -left-16 top-10 h-40 w-40 rounded-full bg-[#DDE9C8] blur-3xl"></div>
        <div class="absolute right-0 top-0 h-56 w-56 rounded-full bg-[#F4D7A1] blur-3xl"></div>
      </div>

      <div class="relative mx-auto max-w-6xl px-4 py-16 lg:py-20">
        <p class="type-eyebrow text-brand-primary">CONTENT CENTER</p>
        <h1 class="mt-4 max-w-3xl type-hero-title">
          安心資訊與 PDF 內容
          <br />
          集中在同一個入口
        </h1>
        <p class="mt-5 max-w-2xl text-sm font-medium leading-7 text-gray-500 lg:text-base">
          將健康誌、禮盒型錄與檢驗報告整理成清楚的前台入口，讓使用者可以快速找到可閱讀、可下載的 PDF 內容。
        </p>
      </div>
    </section>

    <section class="mx-auto mt-10 max-w-6xl px-4">
      <div class="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <div class="grid gap-6 md:grid-cols-3">
          <article
            v-for="section in sections"
            :key="section.key"
            class="overflow-hidden rounded-[2rem] border border-white/70 bg-white shadow-sm"
          >
            <div class="px-6 py-6" :style="{ background: section.banner }">
              <div class="flex items-start justify-between gap-4">
                <div>
                  <p class="type-eyebrow" :style="{ color: section.accent }">{{ section.eyebrow }}</p>
                  <h2 class="mt-3 type-card-title">{{ section.title }}</h2>
                </div>
                <span class="text-4xl">{{ section.icon }}</span>
              </div>
              <p class="mt-4 type-body">{{ section.description }}</p>
            </div>

            <div class="space-y-5 px-6 py-6">
              <div>
                <p class="type-eyebrow text-gray-400">內容服務</p>
                <ul class="mt-3 space-y-2 text-sm leading-6 text-gray-600">
                  <li v-for="item in section.items" :key="item" class="flex items-start gap-2">
                    <span class="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full" :style="{ backgroundColor: section.accent }"></span>
                    <span>{{ item }}</span>
                  </li>
                </ul>
              </div>

              <router-link
                :to="section.to"
                class="inline-flex items-center rounded-full px-4 py-2 text-sm font-bold text-white shadow-sm transition-all hover:-translate-y-0.5"
                :style="{ backgroundColor: section.accent }"
              >
                {{ section.cta }}
              </router-link>
            </div>
          </article>
        </div>

        <aside class="rounded-[2rem] bg-[#2F3B2F] px-6 py-7 text-white shadow-sm">
          <p class="type-eyebrow text-[#C9DBB0]">PDF LIBRARY</p>
          <h3 class="mt-3 text-2xl font-bold leading-tight">安心內容一站查找</h3>
          <p class="mt-4 text-sm leading-7 text-white/75">
            將健康生活、節慶送禮與商品檢驗資訊整理在同一個入口，閱讀與下載都更直覺。
          </p>

          <ul class="mt-5 space-y-3 text-sm leading-6 text-white/85">
            <li v-for="option in nextSteps" :key="option" class="flex items-start gap-3">
              <span class="mt-1 text-[#DDE9C8]">•</span>
              <span>{{ option }}</span>
            </li>
          </ul>

          <div class="mt-8 rounded-2xl bg-white/10 px-4 py-4">
            <p class="type-eyebrow text-[#C9DBB0]">內容提醒</p>
            <p class="mt-2 text-sm leading-7 text-white/80">
              最新內容會持續更新，若沒有看到需要的檔案，可稍後再回來查看。
            </p>
          </div>
        </aside>
      </div>
    </section>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

interface ContentSection {
  key: string
  eyebrow: string
  title: string
  icon: string
  accent: string
  banner: string
  description: string
  items: string[]
  to: string
  cta: string
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
          description: '每月健康主題刊物、品牌專題與有機生活內容。',
          items: [
            'PDF 電子刊列表',
            '線上閱讀與下載',
            '依上架日期排序',
          ],
          to: '/health-journal',
          cta: '前往健康誌',
        },
        {
          key: 'gift',
          eyebrow: 'GIFT CATALOG',
          title: '禮盒型錄',
          icon: '🎁',
          accent: '#B7791F',
          banner: 'linear-gradient(135deg, #FFF3D7 0%, #FFF9EF 100%)',
          description: '節慶送禮、企業贈禮與年度型錄 PDF。',
          items: [
            '年度與節慶型錄',
            'PDF 線上瀏覽',
            '型錄下載入口',
          ],
          to: '/gift-catalog',
          cta: '前往禮盒型錄',
        },
        {
          key: 'inspection',
          eyebrow: 'INSPECTION',
          title: '檢驗報告',
          icon: '🔎',
          accent: '#557A32',
          banner: 'linear-gradient(135deg, #EAF3DF 0%, #F7FBF1 100%)',
          description: '依商品、分類與檢驗類型查找公開檢驗報告。',
          items: [
            '報告列表與詳情',
            '關鍵字與分類篩選',
            'PDF 預覽與下載',
          ],
          to: '/inspections',
          cta: '前往檢驗報告',
        },
      ] as ContentSection[],
      nextSteps: [
        '快速前往健康誌、禮盒型錄與檢驗報告',
        '集中瀏覽可閱讀與可下載的 PDF 內容',
        '依主題找到安心生活與商品資訊',
      ] as string[],
    }
  },
})
</script>
