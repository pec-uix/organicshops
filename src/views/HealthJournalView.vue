<template>
  <div class="min-h-screen bg-brand-bg pb-20">
    <section class="border-b border-gray-100 bg-white">
      <div class="mx-auto max-w-6xl px-4 py-16 lg:py-20">
        <p class="text-xs font-black tracking-[0.35em] text-brand-primary">HEALTH JOURNAL</p>
        <div class="mt-4 grid gap-8 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-end">
          <div>
            <h1 class="max-w-3xl text-4xl font-black leading-tight text-gray-800 lg:text-5xl">
              健康誌
              <br />
              每月有機生活提案
            </h1>
            <p class="mt-5 max-w-2xl text-sm leading-8 text-gray-600 lg:text-base">
              整理季節飲食、安心食材、日常保健與品牌專題，以 PDF 電子刊形式提供線上閱讀與下載。
            </p>
          </div>

          <div class="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <p class="text-xs font-black tracking-[0.25em] text-gray-400">可閱讀期數</p>
            <p class="mt-2 text-3xl font-black text-brand-primary">{{ activeJournals.length }}</p>
            <p class="mt-2 text-sm leading-6 text-gray-500">已整理可閱讀的健康誌 PDF</p>
          </div>
        </div>
      </div>
    </section>

    <section class="mx-auto max-w-6xl px-4 py-12 lg:py-16">
      <div v-if="activeJournals.length" class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <PdfCard
          v-for="journal in activeJournals"
          :key="journal.id"
          :title="journal.title"
          :subtitle="journal.subtitle"
          :description="journal.description"
          :cover-image="journal.coverImage"
          :pdf-url="journal.pdfUrl"
          :publish-date="journal.publishDate"
          :label="journal.issueLabel"
        />
      </div>

      <div v-else class="rounded-2xl border border-dashed border-gray-200 bg-white px-8 py-16 text-center shadow-sm">
        <div class="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-surface text-brand-primary">
          <svg class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5S19.832 5.477 21 6.253v13C19.832 18.477 18.246 18 16.5 18s-3.332.477-4.5 1.253" />
          </svg>
        </div>
        <h2 class="mt-5 text-2xl font-black text-gray-800">健康誌整理中</h2>
        <p class="mx-auto mt-3 max-w-xl text-sm leading-7 text-gray-500">
          新一期健康誌正在準備，之後可在這裡瀏覽封面、期數並開啟 PDF 閱讀。
        </p>
      </div>
    </section>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import PdfCard from '@/components/content/PdfCard.vue'
import { mockHealthJournals } from '@/mock/data'
import { HealthJournal } from '@/types'

export default Vue.extend({
  name: 'HealthJournalView',
  components: { PdfCard },
  computed: {
    activeJournals(): HealthJournal[] {
      return mockHealthJournals
        .filter((journal) => journal.isActive)
        .sort((a, b) => b.publishDate.localeCompare(a.publishDate))
    },
  },
})
</script>
