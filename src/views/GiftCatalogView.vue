<template>
  <div class="min-h-screen bg-brand-bg pb-20">
    <section class="border-b border-gray-100 bg-white">
      <div class="mx-auto max-w-6xl px-4 py-16 lg:py-20">
        <p class="text-xs font-black tracking-[0.35em] text-brand-accent">GIFT CATALOG</p>
        <div class="mt-4 grid gap-8 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-end">
          <div>
            <h1 class="max-w-3xl text-4xl font-black leading-tight text-gray-800 lg:text-5xl">
              禮盒型錄
              <br />
              節慶與企業送禮提案
            </h1>
            <p class="mt-5 max-w-2xl text-sm leading-8 text-gray-600 lg:text-base">
              整理年度禮盒、節慶檔期與企業贈禮推薦，以 PDF 型錄形式提供線上瀏覽與下載。
            </p>
          </div>

          <div class="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <p class="text-xs font-black tracking-[0.25em] text-gray-400">可閱讀型錄</p>
            <p class="mt-2 text-3xl font-black text-brand-accent">{{ activeCatalogs.length }}</p>
            <p class="mt-2 text-sm leading-6 text-gray-500">已整理可閱讀的禮盒型錄 PDF</p>
          </div>
        </div>
      </div>
    </section>

    <section class="mx-auto max-w-6xl px-4 py-12 lg:py-16">
      <div v-if="activeCatalogs.length" class="grid gap-6 md:grid-cols-2">
        <PdfCard
          v-for="catalog in activeCatalogs"
          :key="catalog.id"
          :title="catalog.title"
          :description="catalog.description"
          :cover-image="catalog.coverImage"
          :pdf-url="catalog.pdfUrl"
          :publish-date="catalog.publishDate"
          :label="catalog.seasonLabel || '禮盒型錄'"
        />
      </div>

      <div v-else class="rounded-2xl border border-dashed border-gray-200 bg-white px-8 py-16 text-center shadow-sm">
        <div class="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-surface text-brand-accent">
          <svg class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12v8H4v-8m16 0H4m16 0v-2a2 2 0 00-2-2h-3.5M4 12v-2a2 2 0 012-2h3.5m0 0H12m-2.5 0C8.12 8 7 6.88 7 5.5S8.12 3 9.5 3 12 4.12 12 5.5V8m0 0h2.5M12 8V5.5C12 4.12 13.12 3 14.5 3S17 4.12 17 5.5 15.88 8 14.5 8" />
          </svg>
        </div>
        <h2 class="mt-5 text-2xl font-black text-gray-800">禮盒型錄整理中</h2>
        <p class="mx-auto mt-3 max-w-xl text-sm leading-7 text-gray-500">
          節慶與企業送禮型錄正在準備，之後可在這裡瀏覽檔期並開啟 PDF 閱讀。
        </p>
      </div>
    </section>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import PdfCard from '@/components/content/PdfCard.vue'
import { mockGiftCatalogs } from '@/mock/data'
import { GiftCatalog } from '@/types'

export default Vue.extend({
  name: 'GiftCatalogView',
  components: { PdfCard },
  computed: {
    activeCatalogs(): GiftCatalog[] {
      return mockGiftCatalogs
        .filter((catalog) => catalog.isActive)
        .sort((a, b) => b.publishDate.localeCompare(a.publishDate))
    },
  },
})
</script>
