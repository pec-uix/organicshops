<template>
  <div class="min-h-screen bg-brand-bg pb-20">
    <div v-if="news" class="max-w-4xl mx-auto px-4 pt-12">
      <router-link to="/news" class="text-xs text-gray-400 hover:text-brand-primary transition-colors flex items-center gap-1 mb-8">
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
        返回列表
      </router-link>

      <div class="bg-white rounded-[2rem] shadow-sm overflow-hidden border border-gray-50">
        <div class="aspect-[21/9] overflow-hidden bg-brand-surface">
          <img :src="news.cover" :alt="news.title" class="h-full w-full object-cover" />
        </div>
        <div class="p-8 lg:p-12">
          <div class="flex items-center gap-3 mb-6">
            <span class="px-3 py-1 bg-brand-surface text-brand-primary text-xs font-bold rounded-full">{{ news.tag }}</span>
            <span class="text-xs text-gray-300">{{ formatDate(news.date) }}</span>
          </div>
          <h1 class="text-2xl lg:text-4xl font-black text-gray-800 leading-tight mb-8">
            {{ news.title }}
          </h1>
          <p class="mb-8 text-base leading-8 text-gray-500">{{ news.summary }}</p>
          <div class="prose prose-sm max-w-none text-gray-500 leading-loose space-y-6">
            <p v-for="(p, i) in news.paragraphs" :key="i">{{ p }}</p>
          </div>
          <div class="mt-12 pt-8 border-t border-gray-50 flex justify-between items-center">
            <div class="text-xs text-gray-400">發布日期：{{ formatDate(news.date) }}</div>
            <button @click="$router.push('/news').catch(() => {})" class="text-sm font-bold text-brand-primary">返回最新消息</button>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="max-w-3xl mx-auto px-4 py-24">
      <div class="rounded-[2rem] border border-gray-100 bg-white px-8 py-16 text-center shadow-sm">
        <div class="text-5xl">📰</div>
        <h1 class="mt-5 text-2xl font-black text-gray-800">查無此消息</h1>
        <p class="mt-3 text-sm leading-7 text-gray-500">
          這則消息可能已下架，或網址有誤。請返回最新消息列表重新查看。
        </p>
        <router-link to="/news" class="mt-6 inline-flex rounded-full bg-brand-primary px-5 py-3 text-sm font-bold text-white">
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
  },
  methods: {
    formatDate(date: string): string {
      return date.replace(/-/g, '.')
    }
  },
})
</script>
