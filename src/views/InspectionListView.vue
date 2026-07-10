<template>
  <div class="min-h-screen bg-brand-bg pb-20">
    <section class="relative overflow-hidden bg-[#F0F4F1]">
      <img
        :src="inspectionBannerImage"
        alt="安心檢驗與品質把關"
        class="absolute inset-0 h-full w-full object-cover opacity-90"
      />
      <div class="absolute inset-0 bg-gradient-to-r from-white/15 to-transparent"></div>
      <div class="relative z-10 mx-auto max-w-7xl px-4 py-14 lg:px-8 lg:py-20">
        <h1 class="mt-4 type-page-title text-brand-dark lg:text-4xl">檢驗報告</h1>
        <p class="mt-4 max-w-2xl type-body text-gray-600">
          公開透明，每一口都是安心承諾
        </p>
      </div>
    </section>

    <main class="max-w-5xl mx-auto px-4 pt-8">
      <nav class="mb-6 flex flex-wrap items-center gap-x-1.5 gap-y-1 border-b border-gray-100 pb-8 text-sm text-gray-500">
        <router-link to="/" class="inline-flex items-center gap-1 whitespace-nowrap transition-colors hover:text-brand-primary" aria-label="返回首頁">
          <svg class="h-4 w-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 11.5L12 4l9 7.5M5.5 10.5V20h13v-9.5M9.5 20v-5.5h5V20" />
          </svg>
          <span>首頁</span>
        </router-link>
        <span class="inline-flex items-center gap-1.5 whitespace-nowrap text-gray-800">
          <span>›</span>
          檢驗報告
        </span>
      </nav>

      <div class="mb-6 overflow-hidden rounded-2xl border border-brand-primary bg-white shadow-sm">
        <div class="p-5">
          <div class="grid gap-4 lg:grid-cols-[minmax(0,1fr)_13rem]">
            <label class="block">
              <span class="mb-2 block text-sm font-bold tracking-[0.08em] text-gray-500">關鍵字搜尋</span>
              <input
                v-model.trim="keyword"
                type="search"
                placeholder="搜尋關鍵字、商品名稱"
                class="w-full rounded-xl border border-gray-300 bg-brand-bg px-4 py-3 text-sm font-medium text-gray-700 outline-none transition-colors placeholder:text-gray-400 focus:border-brand-primary focus:bg-white"
              />
            </label>

            <label class="block relative">
              <span class="mb-2 block text-sm font-bold tracking-[0.08em] text-gray-500">商品分類</span>
              <select
                v-model="selectedCategory"
                class="w-full appearance-none rounded-xl border border-gray-300 bg-brand-bg px-4 py-3 pr-12 text-sm font-bold text-gray-700 outline-none transition-colors focus:border-brand-primary focus:bg-white"
              >
                <option value="">全部分類</option>
                <option v-for="category in categoryOptions" :key="category.value" :value="category.value">
                  {{ category.label }}
                </option>
              </select>
              <svg class="pointer-events-none absolute right-4 top-[3.15rem] h-5 w-5 -translate-y-1/2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </label>
          </div>
        </div>
      </div>

      <div v-if="reports.length">
        <!-- 手機：卡片列表 -->
        <ul class="lg:hidden space-y-3">
          <li
            v-for="rep in reports"
            :key="rep.id"
            class="flex items-center justify-between gap-3 rounded-2xl border border-brand-primary/15 bg-white px-4 py-4 shadow-sm"
          >
            <div class="min-w-0 flex-1">
              <p class="font-bold text-brand-dark leading-snug">{{ displayProductName(rep.productName) }}</p>
              <p class="mt-1 text-xs font-mono text-gray-400">{{ rep.reportDate }}</p>
              <span class="mt-2 inline-flex items-center gap-1 rounded-full bg-brand-primary/10 px-2.5 py-0.5 text-xs font-bold text-brand-primary">
                <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
                </svg>
                {{ rep.resultLabel }}
              </span>
            </div>
            <button
              type="button"
              class="flex-shrink-0 inline-flex items-center gap-1 rounded-full bg-brand-accent px-4 py-2 text-sm font-bold text-white shadow-sm transition-colors hover:opacity-90"
              @click="openReport(rep)"
            >
              <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 6h18M7 6v14h10V6M9 10h6M9 14h6" />
              </svg>
              報告
            </button>
          </li>
        </ul>

        <!-- 桌面：表格 -->
        <div class="hidden lg:block overflow-hidden rounded-3xl border border-brand-primary/15 bg-brand-surface/25 shadow-sm">
          <table class="w-full text-left text-sm">
            <thead class="bg-brand-primary text-white font-bold">
              <tr>
                <th class="px-8 py-5">檢驗品項</th>
                <th class="px-8 py-5 text-center">檢驗日期</th>
                <th class="px-8 py-5 text-center">檢驗結果</th>
                <th class="px-8 py-5 text-center">檢驗報告</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-brand-primary/8">
              <tr v-for="rep in reports" :key="rep.id" class="transition-colors odd:bg-white even:bg-brand-surface/35 hover:bg-brand-surface/55">
                <td class="px-8 py-5">
                  <p class="text-sm font-bold text-brand-dark">{{ displayProductName(rep.productName) }}</p>
                </td>
                <td class="px-8 py-5 text-center font-mono text-gray-500">{{ rep.reportDate }}</td>
                <td class="px-8 py-5 text-center">
                  <span class="inline-flex items-center gap-1.5 rounded-full bg-brand-primary/10 px-3 py-1 text-brand-primary font-bold">
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>
                    {{ rep.resultLabel }}
                  </span>
                </td>
                <td class="px-8 py-5 text-center">
                  <div class="flex items-center justify-center">
                    <button
                      type="button"
                      class="inline-flex items-center gap-1 rounded-full bg-brand-accent px-3.5 py-1.5 font-bold text-white shadow-sm transition-colors hover:opacity-90"
                      @click="openReport(rep)"
                    >
                      <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 6h18M7 6v14h10V6M9 10h6M9 14h6" />
                      </svg>
                      報告
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div v-else class="rounded-2xl border border-dashed border-gray-200 bg-white px-8 py-16 text-center shadow-sm">
        <div class="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-surface text-brand-primary shadow-sm">
          <svg class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-4.35-4.35M11 18a7 7 0 100-14 7 7 0 000 14z" />
          </svg>
        </div>
        <h2 class="mt-5 type-section-title text-gray-800">找不到符合條件的檢驗報告</h2>
        <p class="mx-auto mt-3 max-w-xl type-body text-gray-500">
          請嘗試更換商品名稱或商品分類。
        </p>
      </div>
    </main>

    <!-- ── PDF.js Modal ── -->
    <InspectionPdfModal :report="selectedReport" @close="closeReport" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { mockInspectionReports } from '@/mock/data'
import { InspectionReport } from '@/types'
import InspectionPdfModal from '@/components/content/InspectionPdfModal.vue'

type CategoryOption = { value: string; label: string }

const CATEGORY_LABELS: Record<string, string> = {
  '生鮮直送': '生鮮品檢驗報告',
  '冷凍食材': '冷凍品檢驗報告',
  '堅果果乾': '堅果檢驗報告',
  '銀髮專區': '即飲飲料檢驗報告',
}

export default Vue.extend({
  name: 'InspectionListView',
  components: { InspectionPdfModal },
  data() {
    return {
      inspectionBannerImage: require('../../images/背景圖.png'),
      keyword: '',
      selectedCategory: '',
      selectedReport: null as InspectionReport | null,
    }
  },
  computed: {
    allReports(): InspectionReport[] {
      return mockInspectionReports
        .filter((report) => report.isActive)
        .sort((a, b) => b.reportDate.localeCompare(a.reportDate))
    },
    reports(): InspectionReport[] {
      const keyword = this.keyword.toLowerCase()
      return this.allReports.filter((report) => {
        const matchesKeyword = !keyword || [
          report.productName,
          report.reportTitle,
          report.batchNo || '',
          report.labName || '',
          report.category,
          ...report.tags,
        ].some((value) => value.toLowerCase().includes(keyword))
        const matchesCategory = !this.selectedCategory || report.category === this.selectedCategory
        return matchesKeyword && matchesCategory
      })
    },
    categoryOptions(): CategoryOption[] {
      const categories = Array.from(new Set(this.allReports.map((report) => report.category)))
      return categories.map((value) => ({
        value,
        label: CATEGORY_LABELS[value] || value,
      }))
    },
  },
  methods: {
    displayProductName(name: string): string {
      return name.replace(/^【OP換購】/, '')
    },
    openReport(report: InspectionReport) {
      this.selectedReport = report
      document.body.style.overflow = 'hidden'
    },
    closeReport() {
      this.selectedReport = null
      document.body.style.overflow = ''
    },
  },
})
</script>

<style scoped>
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.2s ease;
}
.modal-fade-enter,
.modal-fade-leave-to {
  opacity: 0;
}
</style>
