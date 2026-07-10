<template>
  <article class="group flex h-full flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
    <div class="relative aspect-[4/3] overflow-hidden bg-brand-surface">
      <img
        :src="coverImage"
        :alt="title"
        class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
      <div class="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-[11px] font-black text-brand-primary shadow-sm">
        {{ label }}
      </div>
    </div>

    <div class="flex flex-1 flex-col space-y-4 p-5 sm:p-6">
      <div>
        <p class="type-eyebrow text-gray-400">{{ formattedDate }}</p>
        <h2 class="mt-2 type-card-title">{{ title }}</h2>
        <p v-if="subtitle" class="mt-2 text-sm font-bold text-brand-primary">{{ subtitle }}</p>
      </div>

      <p class="min-h-[3.5rem] flex-1 type-body text-gray-500">{{ description }}</p>

      <div class="flex flex-col gap-3 sm:flex-row">
        <a
          :href="pdfUrl"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex flex-1 items-center justify-center rounded-xl bg-brand-primary px-4 py-3 text-sm font-black text-white transition-colors hover:bg-brand-dark"
        >
          線上閱讀
        </a>
        <a
          :href="pdfUrl"
          download
          class="inline-flex flex-1 items-center justify-center rounded-xl border border-brand-primary/20 bg-white px-4 py-3 text-sm font-bold text-brand-primary transition-colors hover:bg-brand-surface"
        >
          下載 PDF
        </a>
      </div>
    </div>
  </article>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'PdfCard',
  props: {
    title: { type: String, required: true },
    subtitle: { type: String, default: '' },
    description: { type: String, required: true },
    coverImage: { type: String, required: true },
    pdfUrl: { type: String, required: true },
    publishDate: { type: String, required: true },
    label: { type: String, required: true },
  },
  computed: {
    formattedDate(): string {
      const date = new Date(this.publishDate)
      if (Number.isNaN(date.getTime())) return this.publishDate
      return date.toLocaleDateString('zh-TW', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      })
    },
  },
})
</script>
