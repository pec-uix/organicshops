<template>
  <div class="min-h-screen bg-brand-bg pb-20">
    <div class="bg-white border-b border-gray-100 py-12 text-center">
      <h1 class="text-3xl font-black text-gray-800 mb-2">檢驗報告</h1>
      <p class="text-gray-400">公開透明，每一口都是安心承諾</p>
    </div>

    <div class="max-w-5xl mx-auto px-4 mt-12">
      <div class="bg-white rounded-3xl shadow-sm overflow-hidden border border-gray-50">
        <div class="overflow-x-auto">
          <table class="w-full text-left text-sm">
            <thead class="bg-gray-50 text-gray-400 font-bold">
              <tr>
                <th class="px-8 py-5">報告類別</th>
                <th class="px-8 py-5">檢驗品項</th>
                <th class="px-8 py-5">檢驗日期</th>
                <th class="px-8 py-5">結果</th>
                <th class="px-8 py-5 text-right">操作</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-50">
              <tr v-for="rep in reports" :key="rep.id" class="hover:bg-gray-50/50 transition-colors">
                <td class="px-8 py-5">
                  <span class="px-2 py-0.5 bg-brand-surface text-brand-primary text-[10px] font-bold rounded">{{ rep.tag }}</span>
                </td>
                <td class="px-8 py-5 font-bold text-gray-700">{{ rep.name }}</td>
                <td class="px-8 py-5 text-gray-400 font-mono">{{ rep.date }}</td>
                <td class="px-8 py-5">
                  <span class="flex items-center gap-1.5 text-green-600 font-bold">
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>
                    合格
                  </span>
                </td>
                <td class="px-8 py-5 text-right space-x-4">
                  <router-link :to="'/inspections/' + rep.id" class="text-brand-primary hover:underline font-bold">查看</router-link>
                  <router-link :to="'/inspections/' + rep.id" class="text-gray-400 hover:text-gray-600 transition-colors">
                    <svg class="w-5 h-5 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </router-link>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: 'InspectionListView',
  data() {
    return {
      reports: [
        { id: '1', tag: '農殘', name: '有機花椰菜 (第 20260401 批次)', date: '2026-04-05' },
        { id: '2', tag: '重金屬', name: '放牧雞蛋 (第 20260315 批次)', date: '2026-03-20' },
        { id: '3', tag: '輻射', name: '智利冷凍鮭魚 (第 20260210 批次)', date: '2026-02-15' },
        { id: '4', tag: '農殘', name: '有機大白菜 (第 20260408 批次)', date: '2026-04-12' }
      ]
    }
  }
})
</script>
