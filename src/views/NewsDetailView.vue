<template>
  <div class="min-h-screen bg-brand-bg pb-20">
    <div v-if="news" class="mx-auto max-w-7xl px-4 pt-8 lg:px-8">
      <nav class="mb-10 flex flex-wrap items-center gap-x-1.5 gap-y-1 border-b border-gray-100 pb-8 text-sm text-gray-500">
        <router-link to="/" class="inline-flex items-center gap-1 whitespace-nowrap transition-colors hover:text-brand-primary" aria-label="返回首頁">
          <svg class="h-4 w-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 11.5L12 4l9 7.5M5.5 10.5V20h13v-9.5M9.5 20v-5.5h5V20" />
          </svg>
          <span>首頁</span>
        </router-link>
        <span class="inline-flex items-center gap-1.5 whitespace-nowrap">
          <span>›</span>
          <router-link to="/news" class="transition-colors hover:text-brand-primary">最新消息</router-link>
        </span>
        <span class="inline-flex min-w-0 items-center gap-1.5 text-gray-800">
          <span>›</span>
          <span class="truncate">{{ news.title }}</span>
        </span>
      </nav>

      <article class="mx-auto max-w-5xl py-10 lg:py-14">
        <header class="text-center">
          <h1 class="text-2xl font-black leading-tight tracking-wide text-brand-dark lg:text-4xl">
            {{ news.title }}
          </h1>
          <div class="mt-6 flex flex-wrap items-center justify-center text-sm">
            <span class="font-bold tracking-[0.14em] text-gray-400">{{ formatDate(news.date) }}</span>
          </div>
        </header>

        <div class="my-10 h-px bg-gray-100"></div>

        <div>
          <p class="text-base font-bold leading-8 text-gray-700 lg:text-lg">
            {{ news.summary }}
          </p>
          <div class="mt-8 space-y-6 text-[15px] font-medium leading-8 text-gray-600">
            <p v-for="(p, i) in news.paragraphs" :key="i">{{ p }}</p>
          </div>
        </div>

        <footer class="mt-12 flex flex-col gap-4 border-t border-gray-100 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p class="text-xs font-bold tracking-[0.12em] text-gray-400">發布日期：{{ formatDate(news.date) }}</p>
          <router-link to="/news" class="inline-flex w-fit items-center gap-2 rounded-lg border border-brand-primary px-4 py-2 text-sm font-bold text-brand-primary transition-colors hover:bg-brand-primary hover:text-white">
            返回最新消息
          </router-link>
        </footer>
      </article>

      <section v-if="otherNews.length" class="mx-auto mt-12 max-w-5xl">
        <div class="mb-6 flex items-center justify-between border-b border-gray-100 pb-4">
          <h2 class="border-l-4 border-brand-primary pl-4 text-2xl font-serif font-black tracking-widest text-brand-dark">
            其他消息
          </h2>
          <router-link to="/news" class="text-xs font-bold tracking-widest text-brand-primary hover:text-brand-dark">
            查看全部
          </router-link>
        </div>
        <div class="grid gap-4 md:grid-cols-2">
          <router-link
            v-for="item in otherNews"
            :key="item.id"
            :to="`/news/${item.id}`"
            class="group rounded-md border border-gray-200 bg-white p-5 transition-all hover:border-brand-primary hover:shadow-[0_4px_12px_rgba(0,0,0,0.03)]"
          >
            <div class="mb-3 flex items-center gap-3 text-xs font-bold tracking-[0.12em] text-gray-400">
              <span>{{ formatDate(item.date) }}</span>
              <span class="h-1 w-1 rounded-full bg-brand-primary/60"></span>
              <span class="text-brand-primary">{{ item.tag }}</span>
            </div>
            <h3 class="line-clamp-2 text-base font-bold leading-snug text-gray-800 transition-colors group-hover:text-brand-primary">
              {{ item.title }}
            </h3>
            <p class="mt-2 truncate text-sm font-medium text-gray-500">{{ item.summary }}</p>
          </router-link>
        </div>
      </section>
    </div>

    <div v-else class="max-w-3xl mx-auto px-4 py-24">
      <div class="rounded-2xl border border-dashed border-gray-200 bg-white px-8 py-16 text-center shadow-sm">
        <div class="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-surface text-brand-primary">
          <svg class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h8l6 6v8a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h1 class="mt-5 text-2xl font-black text-gray-800">查無此消息</h1>
        <p class="mt-3 text-sm leading-7 text-gray-500">
          這則消息可能已下架，或網址有誤。請返回最新消息列表重新查看。
        </p>
        <router-link to="/news" class="mt-6 inline-flex rounded-xl bg-brand-primary px-5 py-3 text-sm font-bold text-white">
          回到最新消息
        </router-link>
      </div>
    </div>
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
  name: 'NewsDetailView',
  computed: {
    news(): NewsArticle | null {
      const newsId = String(this.$route.params.id || '')
      return (mockNewsArticles as NewsArticle[]).find((item) => item.id === newsId) || null
    },
    otherNews(): NewsArticle[] {
      if (!this.news) return []
      return (mockNewsArticles as NewsArticle[]).filter((item) => item.id !== this.news?.id).slice(0, 2)
    },
  },
  methods: {
    formatDate(date: string): string {
      return date.replace(/-/g, ' / ')
    }
  },
})
</script>
