<template>
  <div class="min-h-screen bg-brand-bg pb-20">
    <div class="max-w-3xl mx-auto px-4 pt-12">
      <router-link to="/inspections" class="text-xs text-gray-400 hover:text-brand-primary transition-colors flex items-center gap-1 mb-8">
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
        返回列表
      </router-link>

      <div class="bg-white rounded-3xl shadow-sm border border-gray-50 overflow-hidden">
        <div class="p-8 lg:p-10">
          <div class="flex items-center gap-3 mb-4">
            <span class="px-2 py-0.5 bg-brand-primary text-white text-[10px] font-bold rounded">農殘檢驗</span>
            <span class="text-xs text-gray-300 font-mono">ID: REP-20260405-01</span>
          </div>
          <h1 class="text-2xl font-black text-gray-800 mb-8">有機花椰菜 檢驗報告詳情</h1>
          
          <div class="grid grid-cols-2 gap-6 mb-12">
            <div class="p-4 bg-gray-50 rounded-2xl">
              <p class="text-[10px] text-gray-400 font-bold uppercase mb-1">檢驗日期</p>
              <p class="text-sm font-bold text-gray-700">2026 年 04 月 05 日</p>
            </div>
            <div class="p-4 bg-gray-50 rounded-2xl">
              <p class="text-[10px] text-gray-400 font-bold uppercase mb-1">檢驗結果</p>
              <p class="text-sm font-bold text-green-600">合格 (未檢出)</p>
            </div>
          </div>

          <div class="space-y-6">
            <h3 class="font-bold text-gray-800 flex items-center gap-2">
              <span class="w-1 h-4 bg-brand-primary rounded-full"></span>
              詳細報告預覽
            </h3>
            <div class="aspect-[1/1.4] bg-gray-100 rounded-2xl flex items-center justify-center border-2 border-dashed border-gray-200">
              <div class="text-center">
                <svg class="w-12 h-12 text-gray-200 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p class="text-xs text-gray-400 font-medium">PDF 報告內容預覽區</p>
              </div>
            </div>
          </div>

          <div class="mt-12 flex gap-4">
            <button class="flex-1 bg-brand-primary text-white py-4 rounded-xl font-bold hover:bg-brand-dark transition-all flex items-center justify-center gap-2">
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              下載完整 PDF
            </button>
            <button class="w-14 h-14 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 hover:text-brand-primary transition-colors">
              <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({ name: 'InspectionDetailView' })
</script>
