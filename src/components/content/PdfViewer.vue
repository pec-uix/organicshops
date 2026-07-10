<template>
  <section class="space-y-5">
    <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h3 class="font-bold text-gray-800 flex items-center gap-2">
          <span class="w-1 h-4 bg-brand-primary rounded-full"></span>
          {{ title }}
        </h3>
        <p v-if="description" class="mt-2 text-sm leading-6 text-gray-500">{{ description }}</p>
      </div>

      <span
        class="w-fit rounded-full px-3 py-1 text-[11px] font-black"
        :class="pdfUrl ? 'bg-brand-surface text-brand-primary' : 'bg-gray-100 text-gray-400'"
      >
        {{ pdfUrl ? 'PDF 可閱讀' : 'PDF 整理中' }}
      </span>
    </div>

    <div class="aspect-[1/1.35] rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 p-6">
      <div class="flex h-full items-center justify-center rounded-xl bg-white/70">
        <div class="max-w-sm text-center">
          <svg class="w-14 h-14 text-gray-200 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p class="text-sm font-black text-gray-600">{{ previewTitle }}</p>
          <p class="mt-3 text-xs leading-6 text-gray-400">
            {{ previewMessage }}
          </p>
          <p v-if="pdfUrl" class="mt-4 break-all rounded-xl bg-gray-50 px-3 py-2 text-[11px] font-medium text-gray-400">
            {{ pdfUrl }}
          </p>
        </div>
      </div>
    </div>

    <div class="flex flex-col gap-3 sm:flex-row">
      <a
        v-if="pdfUrl"
        :href="pdfUrl"
        target="_blank"
        rel="noopener noreferrer"
        class="inline-flex flex-1 items-center justify-center rounded-xl bg-brand-primary px-4 py-3 text-sm font-black text-white transition-colors hover:bg-brand-dark"
      >
        線上閱讀
      </a>
      <a
        v-if="pdfUrl"
        :href="pdfUrl"
        download
        class="inline-flex flex-1 items-center justify-center rounded-xl border border-brand-primary/20 bg-white px-4 py-3 text-sm font-black text-brand-primary transition-colors hover:bg-brand-surface"
      >
        下載 PDF
      </a>
      <div v-else class="rounded-2xl bg-gray-50 px-4 py-4 text-center text-sm font-bold text-gray-400">
        PDF 檔案整理中
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'PdfViewer',
  props: {
    title: { type: String, default: 'PDF 預覽' },
    description: { type: String, default: '' },
    pdfUrl: { type: String, default: '' },
    previewTitle: { type: String, default: 'PDF 報告預覽' },
  },
  computed: {
    previewMessage(): string {
      return this.pdfUrl
        ? '可使用下方按鈕開啟或下載 PDF 檔案。'
        : 'PDF 檔案正在整理，請稍後再查看。'
    },
  },
})
</script>
