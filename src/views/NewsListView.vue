<template>
  <div class="min-h-screen bg-brand-bg pb-20">
    <div class="bg-white border-b border-gray-100 py-12 text-center">
      <h1 class="text-3xl font-black text-gray-800 mb-2 tracking-[0.16em]">最新消息</h1>
      <p class="text-gray-400">掌握公告、活動、上架資訊與品牌動態</p>
    </div>

    <div class="max-w-6xl mx-auto px-4 mt-10">
      <div class="mb-6 flex flex-wrap gap-3">
        <button
          v-for="category in categories"
          :key="category"
          type="button"
          class="rounded-full border px-4 py-2 text-sm font-bold transition-all"
          :class="activeCategory === category ? 'border-brand-primary bg-brand-primary text-white shadow-sm' : 'border-gray-200 bg-white text-gray-500 hover:border-brand-primary/30 hover:text-brand-primary'"
          @click="activeCategory = category"
        >
          {{ category }}
        </button>
      </div>

      <div class="rounded-[2rem] bg-white p-6 shadow-sm border border-gray-100 lg:p-8">
        <div class="grid gap-6 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,0.7fr)]">
          <router-link
            v-if="featuredNews"
            :to="`/news/${featuredNews.id}`"
            class="group overflow-hidden rounded-[1.75rem] bg-[#F5F1E8] border border-[#ECE5D8]"
          >
            <div class="aspect-[16/9] overflow-hidden bg-brand-surface">
              <img :src="featuredNews.cover" :alt="featuredNews.title" class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
            </div>
            <div class="p-6">
              <div class="flex flex-wrap items-center gap-3">
                <span class="rounded-full bg-white px-3 py-1 text-xs font-black text-brand-primary">{{ featuredNews.tag }}</span>
                <span class="text-xs text-gray-400">{{ formatDate(featuredNews.date) }}</span>
              </div>
              <h2 class="mt-4 text-2xl font-black leading-tight text-gray-800 group-hover:text-brand-primary transition-colors">
                {{ featuredNews.title }}
              </h2>
              <p class="mt-4 text-sm leading-7 text-gray-500">
                {{ featuredNews.summary }}
              </p>
              <div class="mt-5 inline-flex items-center gap-2 text-sm font-bold text-brand-primary">
                閱讀完整消息
                <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </router-link>

          <div class="rounded-[1.75rem] bg-gray-50 p-5">
            <p class="text-xs font-black tracking-[0.28em] text-gray-400">最新更新</p>
            <div class="mt-4 space-y-4">
              <router-link
                v-for="news in latestNews"
                :key="news.id"
                :to="`/news/${news.id}`"
                class="block rounded-2xl border border-transparent bg-white px-4 py-4 transition-all hover:border-brand-primary/20 hover:shadow-sm"
              >
                <div class="flex items-start gap-3">
                  <div class="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-brand-surface text-2xl">
                    {{ news.icon }}
                  </div>
                  <div class="min-w-0">
                    <div class="flex flex-wrap items-center gap-2 text-[11px]">
                      <span class="font-black text-brand-primary">{{ news.tag }}</span>
                      <span class="text-gray-300">{{ formatDate(news.date) }}</span>
                    </div>
                    <h3 class="mt-1 line-clamp-2 text-sm font-black leading-6 text-gray-800">{{ news.title }}</h3>
                  </div>
                </div>
              </router-link>
            </div>
          </div>
        </div>
      </div>

      <div class="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        <router-link
          v-for="news in filteredNewsList"
          :key="news.id"
          :to="'/news/' + news.id"
          class="group overflow-hidden rounded-[1.75rem] border border-gray-100 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
        >
          <div class="aspect-[4/3] overflow-hidden bg-brand-surface">
            <img :src="news.cover" :alt="news.title" class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
          </div>
          <div class="p-6">
            <div class="flex items-center gap-3 mb-3">
              <span class="rounded-full bg-brand-surface px-3 py-1 text-[11px] font-black text-brand-primary">{{ news.tag }}</span>
              <span class="text-[11px] text-gray-300">{{ formatDate(news.date) }}</span>
            </div>
            <h2 class="text-lg font-black text-gray-800 group-hover:text-brand-primary transition-colors line-clamp-2 leading-tight">
              {{ news.title }}
            </h2>
            <p class="text-sm text-gray-500 mt-4 line-clamp-3 leading-7">
              {{ news.summary }}
            </p>
            <div class="mt-5 inline-flex items-center gap-2 text-sm font-bold text-brand-primary">
              查看內容
              <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </router-link>
      </div>

      <div v-if="filteredNewsList.length === 0" class="mt-8 rounded-[1.75rem] border border-dashed border-gray-200 bg-white px-6 py-16 text-center text-gray-500">
        <div class="text-4xl">🗂️</div>
        <p class="mt-4 text-lg font-bold text-gray-700">目前此分類尚無消息</p>
        <p class="mt-2 text-sm">你可以先切回「全部」，或之後再補這個分類的內容。</p>
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
  name: 'NewsListView',
  data() {
    return {
      activeCategory: '全部',
      newsList: mockNewsArticles as NewsArticle[],
    }
  },
  computed: {
    categories(): string[] {
      const tags = this.newsList.map((item) => item.tag)
      return ['全部', ...Array.from(new Set(tags))]
    },
    filteredNewsList(): NewsArticle[] {
      if (this.activeCategory === '全部') return this.newsList
      return this.newsList.filter((item) => item.tag === this.activeCategory)
    },
    featuredNews(): NewsArticle | null {
      return this.filteredNewsList[0] || null
    },
    latestNews(): NewsArticle[] {
      return this.filteredNewsList.slice(1, 4)
    },
  },
  methods: {
    formatDate(date: string): string {
      return date.replace(/-/g, '.')
    },
  }
})
</script>
