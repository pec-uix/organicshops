<template>
  <div class="min-h-screen bg-brand-bg pb-20">
    <div class="max-w-3xl mx-auto px-4 pt-12">
      <router-link to="/inspections" class="text-xs text-gray-400 hover:text-brand-primary transition-colors flex items-center gap-1 mb-8">
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
        返回列表
      </router-link>

      <div v-if="report" class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div class="p-8 lg:p-10">
          <div class="flex items-center gap-3 mb-4">
            <span class="px-2 py-0.5 bg-brand-primary text-white text-[10px] font-bold rounded">{{ primaryTag }}</span>
            <span class="text-xs text-gray-300 font-mono">ID: {{ report.id }}</span>
          </div>
          <h1 class="text-2xl font-black text-gray-800 mb-8">{{ report.reportTitle }}</h1>
          
          <div class="grid grid-cols-1 gap-6 mb-12 sm:grid-cols-2">
            <div class="p-4 bg-gray-50 rounded-2xl border border-gray-100">
              <p class="text-[10px] text-gray-400 font-bold uppercase mb-1">檢驗品項</p>
              <p class="text-sm font-bold text-gray-700">{{ report.productName }}</p>
            </div>
            <div class="p-4 bg-gray-50 rounded-2xl border border-gray-100">
              <p class="text-[10px] text-gray-400 font-bold uppercase mb-1">檢驗日期</p>
              <p class="text-sm font-bold text-gray-700">{{ formattedReportDate }}</p>
            </div>
            <div class="p-4 bg-gray-50 rounded-2xl border border-gray-100">
              <p class="text-[10px] text-gray-400 font-bold uppercase mb-1">檢驗結果</p>
              <p class="text-sm font-bold text-green-600">{{ report.resultLabel }}</p>
            </div>
            <div class="p-4 bg-gray-50 rounded-2xl border border-gray-100">
              <p class="text-[10px] text-gray-400 font-bold uppercase mb-1">檢驗單位 / 批號</p>
              <p class="text-sm font-bold text-gray-700">{{ report.labName || '未提供' }} / {{ report.batchNo || '未提供' }}</p>
            </div>
          </div>

          <PdfViewer
            title="詳細報告預覽"
            description="檢驗報告 PDF 可線上閱讀或下載保存。"
            :pdf-url="report.pdfUrl"
            :preview-title="report.reportTitle"
          />
        </div>
      </div>

      <div v-else class="rounded-2xl border border-dashed border-gray-200 bg-white px-8 py-16 text-center shadow-sm">
        <div class="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-surface text-brand-primary">
          <svg class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-4.35-4.35M11 18a7 7 0 100-14 7 7 0 000 14z" />
          </svg>
        </div>
        <h1 class="mt-5 text-2xl font-black text-gray-800">找不到檢驗報告</h1>
        <p class="mx-auto mt-3 max-w-xl text-sm leading-7 text-gray-500">
          這份檢驗報告暫時無法開啟，請返回列表重新選擇。
        </p>
        <router-link
          to="/inspections"
          class="mt-8 inline-flex rounded-xl bg-brand-primary px-5 py-3 text-sm font-black text-white hover:bg-brand-dark"
        >
          返回檢驗報告列表
        </router-link>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import PdfViewer from '@/components/content/PdfViewer.vue'
import { mockInspectionReports } from '@/mock/data'
import { InspectionReport } from '@/types'

export default Vue.extend({
  name: 'InspectionDetailView',
  components: { PdfViewer },
  computed: {
    report(): InspectionReport | undefined {
      return mockInspectionReports.find((item) => item.id === this.$route.params.id && item.isActive)
    },
    primaryTag(): string {
      return this.report?.tags[0] || this.report?.category || '檢驗報告'
    },
    formattedReportDate(): string {
      if (!this.report) return ''
      const date = new Date(this.report.reportDate)
      if (Number.isNaN(date.getTime())) return this.report.reportDate
      return date.toLocaleDateString('zh-TW', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      })
    },
  },
})
</script>
