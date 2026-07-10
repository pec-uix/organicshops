<template>
  <div class="min-h-screen bg-brand-bg pb-20">
    <section class="relative overflow-hidden bg-[#F0F4F1]">
      <img
        :src="newsBannerImage"
        alt="有機生活與安心食材"
        class="absolute inset-0 h-full w-full object-cover opacity-90"
      />
      <div class="absolute inset-0 bg-gradient-to-r from-white/15 to-transparent"></div>
      <div class="relative z-10 mx-auto max-w-7xl px-4 py-14 lg:px-8 lg:py-20">
        <h1 class="text-3xl font-black leading-tight tracking-[0.16em] text-brand-dark lg:text-5xl">最新消息</h1>
        <p class="mt-5 max-w-2xl text-sm font-bold leading-[1.6] text-[#374151] lg:text-base">
          公告、活動、上架資訊與品牌動態
        </p>
      </div>
    </section>

    <main class="mx-auto max-w-7xl px-4 pt-8 lg:px-8">
      <nav class="mb-6 flex flex-wrap items-center gap-x-1.5 gap-y-1 border-b border-gray-100 pb-8 text-sm text-gray-500">
        <router-link to="/" class="inline-flex items-center gap-1 whitespace-nowrap transition-colors hover:text-brand-primary" aria-label="返回首頁">
          <svg class="h-4 w-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 11.5L12 4l9 7.5M5.5 10.5V20h13v-9.5M9.5 20v-5.5h5V20" />
          </svg>
          <span>首頁</span>
        </router-link>
        <span class="inline-flex items-center gap-1.5 whitespace-nowrap text-gray-800">
          <span>›</span>
          最新消息
        </span>
      </nav>

      <section class="mx-auto max-w-6xl">
        <router-link
          v-for="news in paginatedNewsList"
          :key="news.id"
          :to="'/news/' + news.id"
          class="group mb-3 grid cursor-pointer grid-cols-[72px_minmax(0,1fr)_2.25rem] items-center gap-4 rounded-md border border-gray-200 bg-white px-6 py-4 transition-all hover:border-brand-primary hover:shadow-[0_4px_12px_rgba(0,0,0,0.03)]"
        >
          <div class="flex h-[72px] w-[72px] flex-shrink-0 flex-col items-center justify-center rounded-full bg-brand-primary">
            <span class="text-[10px] font-bold tracking-[0.08em] text-white/80">
              {{ formatDateYearMonth(news.date) }}
            </span>
            <span class="mt-0.5 text-2xl font-black leading-none text-white">
              {{ formatDateDay(news.date) }}
            </span>
          </div>

          <div class="min-w-0">
            <h3 class="text-base font-bold leading-snug text-gray-800 transition-colors group-hover:text-brand-primary lg:text-lg">
              {{ news.title }}
            </h3>
            <p class="mt-2 truncate text-sm font-medium leading-6 text-gray-500">
              {{ news.summary }}
            </p>
          </div>

          <span class="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-bg text-brand-primary transition-colors group-hover:bg-brand-primary group-hover:text-white">
            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </span>
        </router-link>

        <nav
          v-if="totalPages > 1"
          class="mt-6 flex justify-center border-t border-gray-100 pt-6"
          aria-label="最新消息分頁"
        >
          <div class="flex items-center gap-2">
            <button
              type="button"
              class="rounded-md border border-gray-200 bg-white px-3 py-2 text-xs font-bold text-gray-500 transition-colors hover:border-brand-primary hover:text-brand-primary disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-gray-200 disabled:hover:text-gray-500"
              :disabled="currentPage === 1"
              @click="goToPage(currentPage - 1)"
            >
              上一頁
            </button>
            <button
              v-for="page in totalPages"
              :key="page"
              type="button"
              class="h-9 w-9 rounded-md border text-sm font-black transition-colors"
              :class="page === currentPage ? 'border-brand-primary bg-brand-primary text-white' : 'border-gray-200 bg-white text-gray-500 hover:border-brand-primary hover:text-brand-primary'"
              :aria-current="page === currentPage ? 'page' : undefined"
              @click="goToPage(page)"
            >
              {{ page }}
            </button>
            <button
              type="button"
              class="rounded-md border border-gray-200 bg-white px-3 py-2 text-xs font-bold text-gray-500 transition-colors hover:border-brand-primary hover:text-brand-primary disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-gray-200 disabled:hover:text-gray-500"
              :disabled="currentPage === totalPages"
              @click="goToPage(currentPage + 1)"
            >
              下一頁
            </button>
          </div>
        </nav>
      </section>

      <div v-if="newsList.length === 0" class="mt-8 rounded-2xl border border-dashed border-gray-200 bg-white px-6 py-16 text-center text-gray-500 shadow-sm">
        <div class="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-surface text-brand-primary">
          <svg class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h4l2 2h8a2 2 0 012 2v10a2 2 0 01-2 2z" />
          </svg>
        </div>
        <p class="mt-4 text-lg font-bold text-gray-700">這個分類暫無消息</p>
        <p class="mt-2 text-sm">你可以先切回「全部」，瀏覽更多品牌動態。</p>
      </div>
    </main>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { mockNewsArticles } from '@/mock/data'

interface NewsArticle {
  id: string
  tag: string
  date: string
  icon: string
  title: string
  summary: string
  cover: string
  paragraphs: string[]
}

export default Vue.extend({
  name: 'NewsListView',
  data() {
    return {
      currentPage: 1,
      pageSize: 12,
      newsBannerImage: require('../../images/背景圖.png'),
      newsList: mockNewsArticles as NewsArticle[],
    }
  },
  computed: {
    totalPages(): number {
      return Math.max(1, Math.ceil(this.newsList.length / this.pageSize))
    },
    pageStartIndex(): number {
      return (this.currentPage - 1) * this.pageSize
    },
    paginatedNewsList(): NewsArticle[] {
      return this.newsList.slice(this.pageStartIndex, this.pageStartIndex + this.pageSize)
    },
  },
  methods: {
    formatDateYearMonth(date: string): string {
      const [year, month] = date.split('-')
      return `${year}.${month}`
    },
    formatDateDay(date: string): string {
      const [, , day] = date.split('-')
      return day || ''
    },
    goToPage(page: number): void {
      this.currentPage = Math.min(Math.max(page, 1), this.totalPages)
    },
  }
})
</script>
