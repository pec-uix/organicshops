<template>
  <div class="min-h-screen bg-brand-bg pb-20">
    <div class="max-w-4xl mx-auto px-4 py-20">
      <div class="overflow-hidden rounded-[2rem] border border-gray-100 bg-white shadow-sm">
        <div class="bg-[#F8F1E3] px-8 py-10 text-center">
          <div class="text-5xl">🥗</div>
          <h1 class="mt-4 text-3xl font-black text-gray-800">食譜專區</h1>
          <p class="mt-3 text-sm text-gray-500">頁面內容待確認中</p>
        </div>

        <div class="px-8 py-10 text-center">
          <p class="mx-auto max-w-2xl text-sm leading-8 text-gray-600">
            這一頁目前先保留為待確認狀態。待食譜內容形式、分類方式與呈現版型確認後，再進一步補上正式頁面內容。
          </p>

          <div class="mt-8 inline-flex rounded-full bg-gray-100 px-5 py-2 text-sm font-bold text-gray-500">
            待確認
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
