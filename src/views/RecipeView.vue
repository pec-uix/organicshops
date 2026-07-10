<template>
  <div class="min-h-screen bg-brand-bg pb-20">
    <div class="max-w-4xl mx-auto px-4 py-20">
      <div class="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        <div class="bg-[#F8F1E3] px-8 py-10 text-center">
          <p class="text-xs font-black tracking-[0.35em] text-brand-primary">RECIPES</p>
          <h1 class="mt-4 text-3xl font-black text-gray-800">食譜專區</h1>
          <p class="mt-3 text-sm text-gray-500">更多料理靈感準備中</p>
        </div>

        <div class="px-8 py-10 text-center">
          <p class="mx-auto max-w-2xl text-sm leading-8 text-gray-600">
            未來將整理節氣餐桌、食材搭配與有機料理提案，讓日常飲食有更多安心選擇。
          </p>

          <div class="mt-8 inline-flex rounded-full bg-gray-100 px-5 py-2 text-sm font-bold text-gray-500">
            即將推出
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'RecipeView',
})
</script>
