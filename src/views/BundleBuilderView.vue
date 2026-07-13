<template>
  <div class="min-h-screen bg-brand-bg pb-28 lg:pb-14">
    <div class="mx-auto max-w-7xl px-4 py-6 lg:px-8 lg:py-10">
      <nav class="mb-6 flex flex-wrap items-center gap-1.5 text-sm font-semibold text-gray-500">
        <router-link to="/" class="transition-colors hover:text-brand-primary">首頁</router-link>
        <span>›</span>
        <router-link to="/event/SUMMER2026?group=flash" class="transition-colors hover:text-brand-primary">活動專區</router-link>
        <span>›</span>
        <span class="text-brand-dark">組合購</span>
      </nav>

      <section class="overflow-hidden rounded-3xl bg-white shadow-sm">
        <div class="grid gap-0 lg:grid-cols-[0.72fr_1.28fr]">
          <div class="bg-brand-surface/40 p-4 lg:p-6">
            <div class="aspect-[5/3] overflow-hidden rounded-2xl bg-white shadow-sm">
              <img :src="bundle.image" :alt="bundle.title" class="h-full w-full object-cover" />
            </div>
          </div>
          <div class="flex flex-col justify-center p-5 lg:p-7">
            <h1 class="text-2xl font-black leading-tight text-brand-dark lg:text-4xl">{{ bundle.title }}</h1>
            <p class="mt-3 max-w-2xl text-sm font-semibold leading-7 text-gray-500 lg:text-base">
              {{ bundle.heroText }}
            </p>
            <div class="mt-5 flex flex-wrap items-end gap-4">
              <div>
                <p class="text-xs font-black tracking-[0.18em] text-gray-400">活動售價</p>
                <p class="mt-1 text-3xl font-black text-brand-primary">
                  <span class="text-lg">$</span>{{ bundle.price.toLocaleString() }}
                </p>
              </div>
              <p class="pb-2 text-sm font-bold text-gray-400 line-through">原價 ${{ bundle.originalPrice.toLocaleString() }}</p>
              <span class="pb-2 text-sm font-black text-brand-primary">折抵 ${{ bundleDiscount.toLocaleString() }}</span>
            </div>
          </div>
        </div>
      </section>

      <div class="mt-6 grid gap-5 lg:grid-cols-[minmax(0,1fr)_21rem] lg:items-start">
        <main class="space-y-5">
          <section class="rounded-3xl border border-brand-primary/15 bg-white p-4 shadow-sm lg:p-5">
            <div class="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div class="flex items-center gap-3">
                  <span class="flex h-8 w-8 items-center justify-center rounded-full bg-brand-primary text-xs font-black text-white">1</span>
                  <h2 class="type-section-title text-brand-dark">選擇主商品</h2>
                  <span class="rounded-full bg-brand-primary px-3 py-1 text-xs font-black text-white">{{ isMainComplete ? '已完成' : '必選' }}</span>
                </div>
                <p class="mt-3 text-sm font-semibold text-gray-500">
                  {{ bundle.mainRuleText }}，組合價 ${{ bundle.price.toLocaleString() }}。
                  <span class="font-black text-brand-primary">{{ isMainComplete ? '已符合組合價。' : mainIncompleteText }}</span>
                </p>
              </div>
              <span class="rounded-full bg-brand-surface px-4 py-2 text-sm font-black text-brand-primary">
                已選 {{ mainSelectedCount }} / {{ mainRequiredCount }} 件
              </span>
            </div>

            <div class="mt-5 space-y-6">
              <div
                v-for="group in mainGroups"
                :key="group.id"
              >
                <div v-if="mainGroups.length > 1" class="mb-3 flex flex-wrap items-center justify-between gap-2">
                  <div class="flex items-center gap-2">
                    <span
                      class="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-xs font-black"
                      :class="isMainGroupComplete(group.id) ? 'bg-brand-primary text-white' : 'bg-gray-200 text-gray-600'"
                    >{{ group.id.length <= 2 ? group.id : (mainGroups.indexOf(group) + 1) }}</span>
                    <p class="text-sm font-black text-brand-dark">{{ group.title }}</p>
                    <p class="text-xs font-semibold text-gray-400">{{ group.description }}</p>
                  </div>
                  <span
                    class="rounded-full px-3 py-1 text-xs font-black"
                    :class="mainGroupSelectedCount(group.id) >= group.required ? 'bg-brand-surface text-brand-primary' : 'bg-gray-100 text-gray-500'"
                  >
                    已選 {{ mainGroupSelectedCount(group.id) }} / {{ group.required }}
                  </span>
                </div>

                <div class="grid grid-cols-2 gap-3 lg:grid-cols-4">
                  <article
                    v-for="item in mainItemsByGroup(group.id)"
                    :key="item.id"
                    class="rounded-2xl border border-gray-100 bg-white p-3 shadow-sm transition-colors flex flex-col"
                    :class="mainQuantities[item.id] ? 'border-brand-primary/40 bg-brand-surface/20' : ''"
                  >
                    <button type="button" class="block w-full text-left" @click="openPreview(item)">
                      <div class="aspect-[4/3] overflow-hidden rounded-xl bg-gray-50">
                        <img :src="item.image" :alt="item.name" class="h-full w-full object-cover transition-transform duration-500 hover:scale-105" />
                      </div>
                    </button>
                    <h3 class="mt-3 line-clamp-2 h-12 text-sm font-black leading-6 text-brand-dark">{{ item.name }}</h3>
                    <div class="mt-auto pt-3">
                      <div class="flex w-full items-center overflow-hidden rounded-full border border-gray-200 bg-white">
                        <button class="flex h-9 w-10 flex-shrink-0 items-center justify-center text-base font-black text-gray-400 hover:text-brand-primary disabled:opacity-30" :disabled="mainQuantities[item.id] <= 0" @click="decrementMain(item.id)">−</button>
                        <span class="flex-1 text-center text-xs font-black text-brand-dark">{{ mainQuantities[item.id] }}</span>
                        <button class="flex h-9 w-10 flex-shrink-0 items-center justify-center text-base font-black text-gray-400 hover:text-brand-primary disabled:opacity-30" :disabled="!canIncrementMain(item)" @click="incrementMain(item.id)">+</button>
                      </div>
                    </div>
                    <button
                      type="button"
                      class="mt-3 inline-flex w-full items-center justify-center rounded-full bg-brand-surface px-3 py-2 text-xs font-black text-brand-primary transition-colors hover:bg-brand-primary hover:text-white"
                      @click="openPreview(item)"
                    >
                      查看商品詳情
                    </button>
                  </article>
                </div>
              </div>
            </div>
          </section>

          <section v-if="bundle.hasGift" class="rounded-3xl border border-brand-primary/15 bg-brand-surface/35 p-4 shadow-sm lg:p-5">
            <div class="flex flex-wrap items-center gap-3">
              <span class="flex h-8 w-8 items-center justify-center rounded-full bg-white text-xs font-black text-brand-primary shadow-sm">2</span>
              <h2 class="type-section-title text-brand-dark">贈品</h2>
              <span class="rounded-full bg-white px-3 py-1 text-xs font-black text-brand-primary">已包含</span>
            </div>
            <div class="mt-4 flex flex-col gap-3 rounded-2xl bg-white p-3 shadow-sm sm:flex-row sm:items-center">
              <div class="h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl bg-brand-surface">
                <img :src="bundle.giftImage || giftItem.image" :alt="bundle.giftName || giftItem.name" class="h-full w-full object-cover" />
              </div>
              <div class="min-w-0 flex-1">
                <p class="text-base font-black text-brand-dark">{{ bundle.giftName || giftItem.name }} x{{ bundle.giftQty || 1 }}</p>
                <p class="mt-1 text-sm font-semibold text-gray-500">{{ bundle.giftText }}</p>
              </div>
              <span class="rounded-full bg-brand-surface px-4 py-2 text-sm font-black text-brand-primary">$0</span>
            </div>
          </section>

          <section class="rounded-3xl border border-gray-100 bg-white p-4 shadow-sm lg:p-5">
            <div class="flex flex-wrap items-start justify-between gap-3">
              <div class="flex items-center gap-3">
                <span class="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-xs font-black text-gray-500">{{ bundle.hasGift ? 3 : 2 }}</span>
                <h2 class="type-section-title text-brand-dark">加價購</h2>
                <span class="rounded-full bg-gray-100 px-3 py-1 text-xs font-black text-gray-500">可略過</span>
              </div>
              <p class="text-sm font-semibold text-gray-400">完成主組合後，可加選指定商品。</p>
            </div>
            <div class="mt-4 grid gap-3 grid-cols-2 lg:grid-cols-4">
              <article
                v-for="item in addOnItems"
                :key="item.id"
                class="group flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
              >
                <button type="button" class="relative aspect-square w-full overflow-hidden bg-gray-50" @click="openPreview(item)">
                  <img :src="item.image" :alt="item.name" class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                </button>
                <div class="flex flex-1 flex-col p-3">
                  <button type="button" class="line-clamp-2 h-[2.75rem] text-left text-sm font-black leading-snug text-brand-dark hover:text-brand-primary" @click="openPreview(item)">{{ item.name }}</button>
                  <div class="mt-auto pt-3">
                    <p class="text-xs font-bold text-gray-400 line-through">原價 ${{ item.originalPrice.toLocaleString() }}</p>
                    <p class="mt-0.5 text-base font-black text-brand-primary">加購價 ${{ item.addOnPrice.toLocaleString() }}</p>
                    <div
                      class="mt-2 flex w-full items-center overflow-hidden rounded-xl border border-gray-200 bg-white"
                      :class="!isMainComplete ? 'opacity-40' : ''"
                    >
                      <button
                        class="flex h-9 w-10 flex-shrink-0 items-center justify-center text-base font-black text-gray-400 hover:text-brand-primary disabled:opacity-30"
                        :disabled="!isMainComplete || addOnQuantities[item.id] <= 0"
                        @click="$set(addOnQuantities, item.id, Math.max(0, addOnQuantities[item.id] - 1))"
                      >−</button>
                      <span class="flex-1 text-center text-sm font-black text-brand-dark">{{ addOnQuantities[item.id] }}</span>
                      <button
                        class="flex h-9 w-10 flex-shrink-0 items-center justify-center text-base font-black text-gray-400 hover:text-brand-primary disabled:opacity-30"
                        :disabled="!isMainComplete"
                        @click="$set(addOnQuantities, item.id, addOnQuantities[item.id] + 1)"
                      >+</button>
                    </div>
                  </div>
                </div>
              </article>
            </div>
          </section>

        </main>

        <aside class="hidden lg:block">
          <div class="sticky top-24 rounded-3xl border border-gray-100 bg-white p-5 shadow-sm">
            <h2 class="text-lg font-black text-brand-dark">組合摘要</h2>
            <div class="mt-5 space-y-3 text-sm font-bold">
              <div
                v-for="group in mainGroups"
                :key="'summary-'+group.id"
                class="flex justify-between gap-3"
              >
                <span class="text-gray-500">{{ group.title }}</span>
                <span :class="isMainGroupComplete(group.id) ? 'text-brand-primary' : 'text-gray-800'">{{ mainGroupSelectedCount(group.id) }} / {{ group.required }}</span>
              </div>
              <div v-if="bundle.hasGift" class="flex justify-between gap-3"><span class="text-gray-500">贈品</span><span class="text-brand-primary">1 / 1</span></div>
              <div class="flex justify-between gap-3"><span class="text-gray-500">加價購</span><span>{{ addOnCount }} 件</span></div>
            </div>
            <div class="my-5 border-t border-gray-100"></div>
            <div class="space-y-3 text-sm font-bold">
              <div class="flex justify-between"><span class="text-gray-500">原價</span><span class="line-through">${{ bundle.originalPrice.toLocaleString() }}</span></div>
              <div class="flex justify-between"><span class="text-gray-500">折抵</span><span class="text-brand-primary">-${{ bundleDiscount.toLocaleString() }}</span></div>
              <div class="flex justify-between"><span class="text-gray-500">主組合</span><span>${{ bundle.price.toLocaleString() }}</span></div>
              <div class="flex justify-between"><span class="text-gray-500">贈品</span><span>$0</span></div>
              <div class="flex justify-between"><span class="text-gray-500">加價購</span><span>${{ addOnSubtotal.toLocaleString() }}</span></div>
              <div class="flex justify-between"><span class="text-gray-500">滿額折抵</span><span>$0</span></div>
            </div>
            <div class="mt-5 flex items-end justify-between border-t border-gray-100 pt-5">
              <span class="text-sm font-black text-gray-500">小計</span>
              <span class="text-3xl font-black text-brand-primary">${{ subtotal.toLocaleString() }}</span>
            </div>
            <button
              class="mt-5 h-12 w-full rounded-2xl text-base font-black transition-all"
              :class="isMainComplete ? 'bg-brand-primary text-white hover:bg-brand-dark active:scale-[0.98]' : 'cursor-not-allowed bg-gray-200 text-gray-400'"
              :disabled="!isMainComplete"
              @click="addBundleToCart"
            >
              {{ isMainComplete ? '加入購物車' : `再選 ${mainRemainingCount} 件` }}
            </button>
          </div>
        </aside>
      </div>
    </div>

    <div class="fixed inset-x-0 bottom-0 z-30 border-t border-gray-100 bg-white/95 px-4 py-3 shadow-[0_-8px_24px_rgba(0,0,0,0.08)] backdrop-blur lg:hidden">
      <div class="mx-auto flex max-w-7xl items-center gap-3">
        <div class="min-w-0 flex-1">
          <p class="text-xs font-bold text-gray-500">主商品 {{ mainSelectedCount }} / {{ mainRequiredCount }}・小計</p>
          <p class="text-xl font-black text-brand-primary">${{ subtotal.toLocaleString() }}</p>
        </div>
        <button
          class="h-11 rounded-2xl px-5 text-sm font-black"
          :class="isMainComplete ? 'bg-brand-primary text-white' : 'bg-gray-200 text-gray-400'"
          :disabled="!isMainComplete"
          @click="addBundleToCart"
        >
          {{ isMainComplete ? '加入購物車' : `再選 ${mainRemainingCount} 件` }}
        </button>
      </div>
    </div>

    <transition name="modal">
      <div v-if="previewItem" class="fixed inset-0 z-[100] flex items-end justify-center bg-brand-dark/50 p-0 backdrop-blur-sm sm:items-center sm:p-4" @click.self="previewItem = null">
        <div class="flex h-[82vh] w-full max-w-4xl flex-col overflow-hidden rounded-t-3xl bg-white shadow-xl sm:h-[640px] sm:rounded-3xl">

          <!-- ① 上方區：左圖 + 右欄（固定高度不伸縮） -->
          <div class="flex flex-shrink-0 flex-col sm:h-[300px] sm:flex-row">

            <!-- 左：主圖 -->
            <div class="hidden flex-shrink-0 bg-brand-surface/30 p-3 sm:block sm:h-full sm:w-[44%] sm:p-4">
              <div class="h-52 overflow-hidden rounded-2xl sm:h-full">
                <img
                  :src="previewGalleryImages[previewImageIndex] || previewItem.image"
                  :alt="previewItem.name"
                  class="h-full w-full object-cover"
                />
              </div>
            </div>

            <!-- 右：商品名稱 + 簡述 + 規格 -->
            <div class="flex flex-1 flex-col overflow-hidden px-5 py-4 sm:px-6 sm:py-5">
              <div class="flex items-start justify-between gap-3">
                <h2 class="text-xl font-bold leading-snug text-brand-dark sm:text-2xl">{{ previewItem.name }}</h2>
                <button class="flex-shrink-0 text-2xl leading-none text-gray-400 hover:text-brand-primary" @click="previewItem = null">×</button>
              </div>
              <div class="my-3 border-t border-gray-200" />
              <div class="flex-1 overflow-hidden">
                <p class="line-clamp-3 text-sm leading-7 text-gray-500">
                  <span class="font-semibold text-gray-600">商品簡述：</span>{{ previewItem.description }}
                </p>
                <dl v-if="previewRealProduct" class="mt-3 space-y-2 text-sm leading-6">
                  <div v-if="previewRealProduct.productNo" class="grid grid-cols-[1.5rem_4.5rem_1fr] items-center gap-x-2 text-gray-500">
                    <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M7 7h10M7 11h10M7 15h6M5 3h14a1 1 0 011 1v16l-3-2-2 2-2-2-2 2-2-2-3 2V4a1 1 0 011-1z" /></svg>
                    <dt class="text-xs">商品編號</dt><dd class="text-gray-700">{{ previewRealProduct.productNo }}</dd>
                  </div>
                  <div v-if="previewRealProduct.unit" class="grid grid-cols-[1.5rem_4.5rem_1fr] items-center gap-x-2 text-gray-500">
                    <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M5 19h14M7 19l1.5-8h7L17 19M9 11V8a3 3 0 016 0v3M8 15h8" /></svg>
                    <dt class="text-xs">商品規格</dt><dd class="text-gray-700">{{ previewRealProduct.unit }}</dd>
                  </div>
                  <div v-if="previewRealProduct.origin" class="grid grid-cols-[1.5rem_4.5rem_1fr] items-center gap-x-2 text-gray-500">
                    <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M12 21s7-4.4 7-11a7 7 0 10-14 0c0 6.6 7 11 7 11z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M9.5 10.5l1.6 1.6 3.4-4" /></svg>
                    <dt class="text-xs">產地</dt><dd class="text-gray-700">{{ previewRealProduct.origin }}</dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>

          <!-- 縮圖列（若有多圖） -->
          <div v-if="previewGalleryImages.length > 1" class="hidden flex-shrink-0 gap-2 overflow-x-auto border-t border-gray-100 px-4 py-2 sm:flex">
            <button
              v-for="(img, idx) in previewGalleryImages"
              :key="idx"
              class="h-14 w-14 flex-shrink-0 overflow-hidden rounded-xl border-2 transition-all"
              :class="previewImageIndex === idx ? 'border-brand-primary' : 'border-gray-200 hover:border-brand-primary/40'"
              @click="previewImageIndex = idx"
            >
              <img :src="img" :alt="`${previewItem.name}-${idx + 1}`" class="h-full w-full object-cover" />
            </button>
          </div>

          <!-- ② 分頁 nav（全寬，橫跨圖片與右欄正下方） -->
          <div class="flex flex-shrink-0 justify-center gap-0 border-b-2 border-gray-200 px-5 sm:px-6">
            <button
              v-for="tab in [{ key: 'features', label: '產品特色' }, { key: 'introduction', label: '產品介紹' }, { key: 'specs', label: '成分規格' }]"
              :key="tab.key"
              class="relative px-4 py-2.5 text-sm font-bold transition-colors"
              :class="previewTab === tab.key ? 'text-brand-primary' : 'text-gray-400 hover:text-gray-700'"
              @click="previewTab = tab.key"
            >
              {{ tab.label }}
              <span v-if="previewTab === tab.key" class="absolute bottom-[-2px] left-0 right-0 h-0.5 bg-brand-primary" />
            </button>
          </div>

          <!-- ③ 分頁內容（flex-1，可捲動） -->
          <div class="min-h-0 flex-1 overflow-y-auto px-5 py-4 text-sm leading-7 text-gray-600 sm:px-6">

            <!-- 產品特色 -->
            <div v-if="previewTab === 'features'">
              <ul v-if="previewFeatures.length" class="space-y-3">
                <li v-for="(line, i) in previewFeatures" :key="i" class="flex items-start gap-3">
                  <span class="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-brand-surface text-xs font-black text-brand-primary">{{ i + 1 }}</span>
                  <span>{{ line }}</span>
                </li>
              </ul>
              <p v-else class="text-gray-400">暫無產品特色資料。</p>
            </div>

            <!-- 產品介紹 -->
            <div v-else-if="previewTab === 'introduction'">
              <div v-if="previewRealProduct && previewRealProduct.productDescriptionHtml" class="product-html" v-html="previewRealProduct.productDescriptionHtml" />
              <p v-else-if="previewRealProduct && previewRealProduct.introduction" class="whitespace-pre-line">{{ previewRealProduct.introduction }}</p>
              <p v-else class="text-gray-400">暫無產品介紹資料。</p>
            </div>

            <!-- 成分規格 -->
            <div v-else-if="previewTab === 'specs'">
              <div v-if="previewRealProduct && previewRealProduct.specificationHtml" class="product-html" v-html="previewRealProduct.specificationHtml" />
              <div v-else-if="previewRealProduct && previewRealProduct.specs" class="whitespace-pre-line">{{ previewRealProduct.specs }}</div>
              <dl v-else-if="previewItem.storage || previewItem.notice" class="space-y-3">
                <div v-if="previewItem.storage" class="grid grid-cols-[5rem_1fr] gap-x-3 border-b border-gray-50 py-1.5">
                  <dt class="font-bold text-gray-700">保存方式</dt><dd>{{ previewItem.storage }}</dd>
                </div>
                <div v-if="previewItem.notice" class="grid grid-cols-[5rem_1fr] gap-x-3 py-1.5">
                  <dt class="font-bold text-gray-700">注意事項</dt><dd>{{ previewItem.notice }}</dd>
                </div>
              </dl>
              <p v-else class="text-gray-400">暫無成分規格資料。</p>
            </div>

          </div>

          <!-- ④ 返回選擇 button（固定底部） -->
          <div class="flex-shrink-0 border-t border-gray-100 px-5 py-4 sm:px-6">
            <button class="h-12 w-full rounded-2xl bg-brand-primary text-sm font-black text-white transition-colors hover:bg-brand-dark" @click="previewItem = null">
              返回選擇
            </button>
          </div>

        </div>
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Product } from '@/types'

type BundleChoice = {
  id: string
  group?: string
  name: string
  description: string
  price: number
  image: string
  storage: string
  notice: string
}

type BundleAddOn = BundleChoice & {
  originalPrice: number
  addOnPrice: number
}

const assetUrl = (filename: string): string => `${process.env.BASE_URL || '/'}site-assets/${filename}`

export default Vue.extend({
  name: 'BundleBuilderView',
  data() {
    return {
      bundles: {
        'flax-sesame-990': {
          id: 'flax-sesame-990',
          title: '有機亞麻仁堅果粉與葡萄糖胺黑穀芝麻粉任2件組',
          price: 990,
          originalPrice: 1180,
          image: assetUrl('nuts.png'),
          ruleLabel: '任選 2 件',
          heroText: '任選 2 件即可用組合價加入購物車，贈品將隨組合自動帶入。',
          mainRuleText: '任選商品 2 件',
          hasGift: true,
          giftName: '精美提袋',
          giftQty: 1,
          giftImage: assetUrl('logo.gif'),
          giftText: '主商品選滿 2 件後，隨組合附贈。',
          groups: [
            { id: 'F990', title: '任選商品', description: '任選 2 件（可重複選購）', required: 2 },
          ],
        },
        'same-zone-six': {
          id: 'same-zone-six',
          title: '同區營養穀粉任選滿6件組',
          price: 1680,
          originalPrice: 1980,
          image: assetUrl('breakfast.png'),
          ruleLabel: '同區任選滿 6 件',
          heroText: '同一區商品數量選滿 6 件，即可用組合價加入購物車。',
          mainRuleText: '同區商品任選滿 6 件',
          hasGift: false,
          giftText: '',
          groups: [
            { id: 'S', title: '同區商品', description: '同一區商品數量合計需滿 6 件', required: 6 },
          ],
        },
        'optional-fixed-999': {
          id: 'optional-fixed-999',
          title: '堅果果乾任選3件固定$999',
          price: 999,
          originalPrice: 1260,
          image: assetUrl('nuts.png'),
          ruleLabel: '任選固定金額',
          heroText: '指定堅果與果乾任選 3 件，符合件數後以固定金額加入購物車。',
          mainRuleText: '堅果果乾區任選 3 件',
          hasGift: false,
          giftText: '',
          groups: [
            { id: 'O', title: '任選商品', description: '指定商品合計需滿 3 件', required: 3 },
          ],
        },
        'abc-daily-1290': {
          id: 'abc-daily-1290',
          title: 'A+B+C 日常保養組合$1,290',
          price: 1290,
          originalPrice: 1580,
          image: assetUrl('breakfast.png'),
          ruleLabel: 'A+B+C 組合',
          heroText: 'A 區早餐穀粉、B 區保養飲品、C 區點心各選 1 件，組成一套活動價。',
          mainRuleText: 'A、B、C 三區各選 1 件',
          hasGift: false,
          giftText: '',
          groups: [
            { id: 'A', title: 'A 區 早餐穀粉', description: '任選 1 件早餐穀粉', required: 1 },
            { id: 'B', title: 'B 區 喝的保養', description: '任選 1 件保養飲品', required: 1 },
            { id: 'C', title: 'C 區 堅果點心', description: '任選 1 件堅果點心', required: 1 },
          ],
        },
        'apricot-buy2-396': {
          id: 'apricot-buy2-396',
          title: '杏桃乾買2送1補貨組',
          price: 396,
          originalPrice: 594,
          image: assetUrl('nuts.png'),
          ruleLabel: '買 2 送 1',
          heroText: '杏桃乾任選同品項 2 包，符合條件即贈同品項 1 包，贈品隨組合以 $0 計入購物車。',
          mainRuleText: '選購杏桃乾 2 包',
          hasGift: true,
          giftName: '杏桃乾',
          giftQty: 1,
          giftImage: assetUrl('nuts.png'),
          giftText: '選購 2 件後，隨組合附贈杏桃乾 1 包（$0）。',
          groups: [
            { id: 'G2B1', title: '杏桃乾', description: '選購 2 件即贈 1 件', required: 2 },
          ],
        },
        'goji-buy2-1180': {
          id: 'goji-buy2-1180',
          title: '有機枸杞原汁買2送2組',
          price: 1180,
          originalPrice: 2360,
          image: assetUrl('goji.png'),
          ruleLabel: '買 2 送 2',
          heroText: '有機枸杞原汁 2 罐成組補貨，符合條件即贈同品項 2 罐，贈品隨組合以 $0 計入。',
          mainRuleText: '選購有機枸杞原汁 2 罐',
          hasGift: true,
          giftName: '有機枸杞原汁',
          giftQty: 2,
          giftImage: assetUrl('goji.png'),
          giftText: '選購 2 件後，隨組合附贈有機枸杞原汁 2 罐（$0）。',
          groups: [
            { id: 'G2S2', title: '有機枸杞原汁', description: '選購 2 件即贈 2 件', required: 2 },
          ],
        },
        'whitefungus-buyab-58': {
          id: 'whitefungus-buyab-58',
          title: '菊花枸杞銀耳露買A送B組',
          price: 58,
          originalPrice: 373,
          image: assetUrl('whitefungus.png'),
          ruleLabel: '買 A 送 B',
          heroText: 'A 區選購菊花枸杞銀耳露 1 瓶，再從 B 區挑選 1 件贈品（$0），組合一起加入購物車。',
          mainRuleText: 'A 區選 1 件 + B 區贈品選 1 件',
          hasGift: false,
          giftText: '',
          groups: [
            { id: 'GAB', title: 'A 區 主商品', description: '選購菊花枸杞銀耳露 1 件', required: 1 },
            { id: 'B_GIFT', title: 'B 區 贈品（$0）', description: '自選贈品 1 件', required: 1 },
          ],
        },
        'nuts-three-893': {
          id: 'nuts-three-893',
          title: '堅果果乾任選3件85折',
          price: 893,
          originalPrice: 1050,
          image: assetUrl('nuts.png'),
          ruleLabel: '任選 3 件 85 折',
          heroText: '指定堅果果乾任選 3 件，整組享 85 折，原價 $1,050，活動價 $893。',
          mainRuleText: '任選商品 3 件',
          hasGift: false,
          giftText: '',
          groups: [
            { id: 'N3', title: '任選商品', description: '任選 3 件（可重複選購）', required: 3 },
          ],
        },
        'breakfast-four-1560': {
          id: 'breakfast-four-1560',
          title: '早餐穀粉任選4件折$120',
          price: 1560,
          originalPrice: 1680,
          image: assetUrl('breakfast.png'),
          ruleLabel: '任選 4 件折 $120',
          heroText: '指定早餐穀粉任選 4 件，整筆折 $120，原價 $1,680，活動價 $1,560。',
          mainRuleText: '任選商品 4 件',
          hasGift: false,
          giftText: '',
          groups: [
            { id: 'B4', title: '任選商品', description: '任選 4 件（可重複選購）', required: 4 },
          ],
        },
        'senior-six-330': {
          id: 'senior-six-330',
          title: '銀髮飲品任選6件每件折$10',
          price: 330,
          originalPrice: 390,
          image: assetUrl('whitefungus.png'),
          ruleLabel: '任選 6 件每件折 $10',
          heroText: '指定飲品任選 6 件，每件折 $10，共折 $60，活動價 $330。',
          mainRuleText: '任選飲品 6 件',
          hasGift: false,
          giftText: '',
          groups: [
            { id: 'D6', title: '任選飲品', description: '任選 6 件（可重複選購）', required: 6 },
          ],
        },
        'fixed-three-390': {
          id: 'fixed-three-390',
          title: '指定商品任選3件固定$390',
          price: 390,
          originalPrice: 520,
          image: assetUrl('whitefungus.png'),
          ruleLabel: '指定件數固定價',
          heroText: '指定飲品與點心任選 3 件，符合件數後以固定組合價加入購物車。',
          mainRuleText: '指定商品任選 3 件',
          hasGift: false,
          giftText: '',
          groups: [
            { id: 'F', title: '指定商品', description: '指定商品合計需滿 3 件', required: 3 },
          ],
        },
      } as Record<string, {
        id: string
        title: string
        price: number
        originalPrice: number
        image: string
        ruleLabel: string
        heroText: string
        mainRuleText: string
        hasGift: boolean
        giftName?: string
        giftQty?: number
        giftImage?: string
        giftText: string
        groups?: Array<{ id: string; title: string; description: string; required: number }>
      }>,
      defaultMainGroups: [
        { id: 'A', title: 'A 區商品', description: '任選 1 件主搭配商品', required: 1 },
        { id: 'B', title: 'B 區商品', description: '任選 1 件副搭配商品', required: 1 },
      ] as Array<{ id: string; title: string; description: string; required: number }>,
      sameZoneMainGroups: [
        { id: 'S', title: '同區商品', description: '同一區商品數量合計需滿 6 件', required: 6 },
      ] as Array<{ id: string; title: string; description: string; required: number }>,
      mainQuantities: {
        sesame: 0,
        flax: 0,
        chia: 0,
        oats: 0,
        nutmix: 0,
        broccoli: 0,
        apricot: 0,
        gojidrink: 0,
        whitefungusMain: 0,
        'f990-sesame': 0,
        'f990-flax': 0,
        'f990-chia': 0,
        'f990-oats': 0,
        'g2b1-apricot': 0,
        'g2s2-goji': 0,
        'gab-whitefungus': 0,
        'bgift-nutmix': 0,
        'bgift-apricot': 0,
        'bgift-cashew': 0,
        'n3-nutmix': 0,
        'n3-apricot': 0,
        'n3-cashew': 0,
        'b4-sesame': 0,
        'b4-flax': 0,
        'b4-chia': 0,
        'b4-oats': 0,
        'd6-whitefungus': 0,
        'd6-goji': 0,
        'd6-drink': 0,
      } as Record<string, number>,
      addOnQuantities: {
        goji: 0,
        whitefungus: 0,
      } as Record<string, number>,
      previewItem: null as BundleChoice | BundleAddOn | null,
      previewTab: 'features' as 'features' | 'introduction' | 'specs',
      previewImageIndex: 0,
      mainItems: [
        {
          id: 'sesame',
          group: 'A',
          name: '葡萄糖胺黑穀芝麻粉',
          description: '黑穀芝麻粉搭配葡萄糖胺，適合日常補給與早餐飲品搭配。',
          price: 590,
          image: assetUrl('whitefungus.png'),
          storage: '請置於陰涼乾燥處，開封後請密封保存。',
          notice: '本品含芝麻與穀物成分，食用前請留意個人體質。',
        },
        {
          id: 'flax',
          group: 'A',
          name: '有機高纖高鈣亞麻仁堅果粉',
          description: '有機亞麻仁搭配堅果穀物，口感細緻，適合加入牛奶、豆漿或燕麥。',
          price: 590,
          image: assetUrl('nuts.png'),
          storage: '請置於陰涼乾燥處，避免陽光直射。',
          notice: '開封後建議盡早食用完畢，並保持包裝密封。',
        },
        {
          id: 'chia',
          group: 'B',
          name: '有機奇亞籽穀物粉',
          description: '奇亞籽與穀物粉調和，適合早餐、點心或日常纖維補充。',
          price: 520,
          image: assetUrl('breakfast.png'),
          storage: '請置於陰涼乾燥處。',
          notice: '可依個人喜好加入飲品或優格中食用。',
        },
        {
          id: 'oats',
          group: 'B',
          name: '有機燕麥堅果穀粉',
          description: '燕麥與堅果穀粉調和，適合早餐沖泡與日常補充。',
          price: 520,
          image: assetUrl('breakfast.png'),
          storage: '請置於陰涼乾燥處，開封後請密封保存。',
          notice: '可搭配牛奶、豆漿或優格食用。',
        },
        {
          id: 'nutmix',
          group: 'S',
          name: '原味綜合堅果隨手包',
          description: '低溫烘焙綜合堅果，適合日常點心與外出補給。',
          price: 350,
          image: assetUrl('nuts.png'),
          storage: '請置於陰涼乾燥處，避免陽光直射。',
          notice: '本品含堅果，食用前請留意過敏原。',
        },
        {
          id: 'broccoli',
          group: 'S',
          name: '有機鮮採椰菜',
          description: '有機栽培蔬菜，適合日常餐桌搭配。',
          price: 95,
          image: assetUrl('broccoli.png'),
          storage: '請冷藏保存並盡早食用。',
          notice: '生鮮商品請依包裝標示保存。',
        },
        {
          id: 'apricot',
          group: 'O',
          name: '杏桃乾',
          description: '嚴選香甜杏桃乾，適合午後點心與早餐搭配。',
          price: 420,
          image: assetUrl('nuts.png'),
          storage: '請置於陰涼乾燥處，開封後請密封保存。',
          notice: '果乾甜度來自食材本身，請依個人需求適量食用。',
        },
        {
          id: 'gojidrink',
          group: 'B',
          name: '有機枸杞原汁',
          description: '有機枸杞鮮榨，適合日常保養補給。',
          price: 590,
          image: assetUrl('goji.png'),
          storage: '請依包裝標示保存，開封後請冷藏。',
          notice: '飲用前請搖勻，開封後請盡速飲用。',
        },
        {
          id: 'whitefungusMain',
          group: 'C',
          name: '菊花枸杞銀耳露',
          description: '鮮銀耳搭配菊花與枸杞，清甜順口。',
          price: 390,
          image: assetUrl('whitefungus.png'),
          storage: '需冷藏保存。',
          notice: '飲用前請搖勻，開封後請盡速飲用。',
        },
        {
          id: 'fixedNutmix',
          group: 'F',
          name: '原味綜合堅果隨手包',
          description: '低溫烘焙綜合堅果，適合日常點心與外出補給。',
          price: 180,
          image: assetUrl('nuts.png'),
          storage: '請置於陰涼乾燥處，避免陽光直射。',
          notice: '本品含堅果，食用前請留意過敏原。',
        },
        {
          id: 'fixedApricot',
          group: 'F',
          name: '杏桃乾',
          description: '嚴選香甜杏桃乾，適合午後點心與早餐搭配。',
          price: 170,
          image: assetUrl('nuts.png'),
          storage: '請置於陰涼乾燥處。',
          notice: '果乾甜度來自食材本身。',
        },
        {
          id: 'fixedWhitefungus',
          group: 'F',
          name: '菊花枸杞銀耳露',
          description: '清爽飲品，適合搭配點心一起選購。',
          price: 170,
          image: assetUrl('whitefungus.png'),
          storage: '需冷藏保存。',
          notice: '飲用前請搖勻。',
        },
        {
          id: 'f990-sesame',
          group: 'F990',
          name: '葡萄糖胺黑穀芝麻粉',
          description: '黑穀芝麻粉搭配葡萄糖胺，適合日常補給與早餐飲品搭配。',
          price: 590,
          image: assetUrl('whitefungus.png'),
          storage: '請置於陰涼乾燥處，開封後請密封保存。',
          notice: '本品含芝麻與穀物成分，食用前請留意個人體質。',
        },
        {
          id: 'f990-flax',
          group: 'F990',
          name: '有機高纖高鈣亞麻仁堅果粉',
          description: '有機亞麻仁搭配堅果穀物，口感細緻，適合加入牛奶、豆漿或燕麥。',
          price: 590,
          image: assetUrl('nuts.png'),
          storage: '請置於陰涼乾燥處，避免陽光直射。',
          notice: '開封後建議盡早食用完畢，並保持包裝密封。',
        },
        {
          id: 'f990-chia',
          group: 'F990',
          name: '有機奇亞籽穀物粉',
          description: '奇亞籽與穀物粉調和，適合早餐、點心或日常纖維補充。',
          price: 520,
          image: assetUrl('breakfast.png'),
          storage: '請置於陰涼乾燥處。',
          notice: '可依個人喜好加入飲品或優格中食用。',
        },
        {
          id: 'f990-oats',
          group: 'F990',
          name: '有機燕麥堅果穀粉',
          description: '燕麥與堅果穀粉調和，適合早餐沖泡與日常補充。',
          price: 520,
          image: assetUrl('breakfast.png'),
          storage: '請置於陰涼乾燥處，開封後請密封保存。',
          notice: '可搭配牛奶、豆漿或優格食用。',
        },
        { id: 'g2b1-apricot', group: 'G2B1', name: '杏桃乾', description: '嚴選香甜杏桃乾，適合午後點心與早餐搭配。', price: 297, image: assetUrl('nuts.png'), storage: '請置於陰涼乾燥處，開封後請密封保存。', notice: '果乾甜度來自食材本身，請依個人需求適量食用。' },
        { id: 'g2s2-goji', group: 'G2S2', name: '有機枸杞原汁', description: '有機枸杞鮮榨，適合日常保養補給。', price: 590, image: assetUrl('goji.png'), storage: '請依包裝標示保存，開封後請冷藏。', notice: '飲用前請搖勻，開封後請盡速飲用。' },
        { id: 'gab-whitefungus', group: 'GAB', name: '菊花枸杞銀耳露', description: '鮮銀耳搭配菊花與枸杞，清甜順口。', price: 58, image: assetUrl('whitefungus.png'), storage: '需冷藏保存。', notice: '飲用前請搖勻，開封後請盡速飲用。' },
        { id: 'bgift-nutmix', group: 'B_GIFT', name: '原味綜合堅果隨手包', description: '低溫烘焙綜合堅果，適合日常點心與外出補給。', price: 0, image: assetUrl('nuts.png'), storage: '請置於陰涼乾燥處，避免陽光直射。', notice: '本品含堅果，食用前請留意過敏原。' },
        { id: 'bgift-apricot', group: 'B_GIFT', name: '杏桃乾', description: '嚴選香甜杏桃乾，適合午後點心與早餐搭配。', price: 0, image: assetUrl('nuts.png'), storage: '請置於陰涼乾燥處，開封後請密封保存。', notice: '果乾甜度來自食材本身，請依個人需求適量食用。' },
        { id: 'bgift-cashew', group: 'B_GIFT', name: '原味腰果隨手包', description: '精選飽滿腰果，口感香脆，是日常點心的最佳選擇。', price: 0, image: assetUrl('nuts.png'), storage: '請置於陰涼乾燥處，避免陽光直射。', notice: '本品含堅果，食用前請留意過敏原。' },
        { id: 'n3-nutmix', group: 'N3', name: '原味綜合堅果隨手包', description: '低溫烘焙綜合堅果，適合日常點心與外出補給。', price: 350, image: assetUrl('nuts.png'), storage: '請置於陰涼乾燥處，避免陽光直射。', notice: '本品含堅果，食用前請留意過敏原。' },
        { id: 'n3-apricot', group: 'N3', name: '杏桃乾', description: '嚴選香甜杏桃乾，適合午後點心與早餐搭配。', price: 350, image: assetUrl('nuts.png'), storage: '請置於陰涼乾燥處，開封後請密封保存。', notice: '果乾甜度來自食材本身，請依個人需求適量食用。' },
        { id: 'n3-cashew', group: 'N3', name: '原味腰果隨手包', description: '精選飽滿腰果，口感香脆，是日常點心的最佳選擇。', price: 350, image: assetUrl('nuts.png'), storage: '請置於陰涼乾燥處，避免陽光直射。', notice: '本品含堅果，食用前請留意過敏原。' },
        { id: 'b4-sesame', group: 'B4', name: '葡萄糖胺黑穀芝麻粉', description: '黑穀芝麻粉搭配葡萄糖胺，適合日常補給與早餐飲品搭配。', price: 420, image: assetUrl('whitefungus.png'), storage: '請置於陰涼乾燥處，開封後請密封保存。', notice: '本品含芝麻與穀物成分，食用前請留意個人體質。' },
        { id: 'b4-flax', group: 'B4', name: '有機高纖高鈣亞麻仁堅果粉', description: '有機亞麻仁搭配堅果穀物，口感細緻，適合加入牛奶、豆漿或燕麥。', price: 420, image: assetUrl('nuts.png'), storage: '請置於陰涼乾燥處，避免陽光直射。', notice: '開封後建議盡早食用完畢，並保持包裝密封。' },
        { id: 'b4-chia', group: 'B4', name: '有機奇亞籽穀物粉', description: '奇亞籽與穀物粉調和，適合早餐、點心或日常纖維補充。', price: 420, image: assetUrl('breakfast.png'), storage: '請置於陰涼乾燥處。', notice: '可依個人喜好加入飲品或優格中食用。' },
        { id: 'b4-oats', group: 'B4', name: '有機燕麥堅果穀粉', description: '燕麥與堅果穀粉調和，適合早餐沖泡與日常補充。', price: 420, image: assetUrl('breakfast.png'), storage: '請置於陰涼乾燥處，開封後請密封保存。', notice: '可搭配牛奶、豆漿或優格食用。' },
        { id: 'd6-whitefungus', group: 'D6', name: '菊花枸杞銀耳露', description: '鮮銀耳搭配菊花與枸杞，清甜順口。', price: 65, image: assetUrl('whitefungus.png'), storage: '需冷藏保存。', notice: '飲用前請搖勻，開封後請盡速飲用。' },
        { id: 'd6-goji', group: 'D6', name: '有機枸杞原汁', description: '有機枸杞鮮榨，適合日常保養補給。', price: 65, image: assetUrl('goji.png'), storage: '請依包裝標示保存，開封後請冷藏。', notice: '飲用前請搖勻，開封後請盡速飲用。' },
        { id: 'd6-drink', group: 'D6', name: '即飲保養飲', description: '精選保養成分即飲配方，方便日常補給。', price: 65, image: assetUrl('goji.png'), storage: '請依包裝標示保存，開封後請冷藏。', notice: '飲用前請搖勻，開封後請盡速飲用。' },
      ] as BundleChoice[],
      giftItem: {
        id: 'gift-bag',
        name: '精美提袋',
        image: assetUrl('logo.gif'),
      },
      addOnItems: [
        {
          id: 'goji',
          name: '有機枸杞原汁',
          description: '有機枸杞鮮榨，適合日常保養補給。',
          price: 1200,
          originalPrice: 1200,
          addOnPrice: 199,
          image: assetUrl('goji.png'),
          storage: '請依包裝標示保存，開封後請冷藏。',
          notice: '加價購商品可依需求選購，不影響主組合門檻。',
        },
        {
          id: 'whitefungus',
          name: '菊花枸杞銀耳露',
          description: '鮮銀耳搭配菊花與枸杞，清甜順口。',
          price: 65,
          originalPrice: 65,
          addOnPrice: 39,
          image: assetUrl('whitefungus.png'),
          storage: '需冷藏保存。',
          notice: '飲用前請搖勻，開封後請盡速飲用。',
        },
      ] as BundleAddOn[],
    }
  },
  computed: {
    bundleId(): string {
      return typeof this.$route.params.id === 'string' ? this.$route.params.id : 'flax-sesame-990'
    },
    bundle(): any {
      return this.bundles[this.bundleId] || this.bundles['flax-sesame-990']
    },
    mainGroups(): Array<{ id: string; title: string; description: string; required: number }> {
      return this.bundle.groups || this.defaultMainGroups
    },
    previewRealProduct(): Product | null {
      if (!this.previewItem) return null
      const products = this.$store.getters['products/allProducts'] as Product[]
      return products.find((p: Product) => p.name === this.previewItem!.name) || null
    },
    previewGalleryImages(): string[] {
      if (this.previewRealProduct?.images?.length) return this.previewRealProduct.images
      return [this.previewItem?.image || '']
    },
    previewFeatures(): string[] {
      const text = this.previewRealProduct?.description || this.previewItem?.description || ''
      return text.split(/\n|(?<=[。！？])\s*(?=\d+\.|[A-Z]|[^\s])/).map(s => s.trim()).filter(Boolean)
    },
    bundleDiscount(): number {
      return Math.max(0, this.bundle.originalPrice - this.bundle.price)
    },
    mainRequiredCount(): number {
      return this.mainGroups.reduce((sum, group) => sum + group.required, 0)
    },
    mainSelectedCount(): number {
      return this.mainGroups.reduce((sum, group) => sum + this.mainGroupSelectedCount(group.id), 0)
    },
    mainRemainingCount(): number {
      return Math.max(0, this.mainRequiredCount - this.mainSelectedCount)
    },
    mainIncompleteText(): string {
      const missing = this.mainGroups
        .filter((group) => this.mainGroupSelectedCount(group.id) < group.required)
      if (!missing.length) return '已符合組合價。'
      if (this.mainGroups.length === 1) return missing[0].description
      return `請完成${missing.map((g) => g.id.length <= 2 ? `${g.id} 區` : g.title).join('、')}選擇。`
    },
    isMainComplete(): boolean {
      return this.mainGroups.every((group) => this.mainGroupSelectedCount(group.id) === group.required)
    },
    addOnCount(): number {
      return Object.values(this.addOnQuantities).reduce((sum, qty) => sum + qty, 0)
    },
    addOnSubtotal(): number {
      return this.addOnItems.reduce((sum, item) => sum + item.addOnPrice * (this.addOnQuantities[item.id] || 0), 0)
    },
    subtotal(): number {
      return this.bundle.price + this.addOnSubtotal
    },
    freeShippingRemaining(): number {
      return Math.max(0, 1200 - this.subtotal)
    },
    freeShippingProgress(): number {
      return Math.min(100, Math.round((this.subtotal / 1200) * 100))
    },
    giftRemaining(): number {
      return Math.max(0, 1500 - this.subtotal)
    },
    giftProgress(): number {
      return Math.min(100, Math.round((this.subtotal / 1500) * 100))
    },
    selectedMainDetails(): string[] {
      return this.mainItems
        .filter((item) => this.mainGroups.some((group) => group.id === item.group))
        .filter((item) => this.mainQuantities[item.id] > 0)
        .map((item) => `${item.name} x${this.mainQuantities[item.id]}`)
    },
    selectedAddOnDetails(): string[] {
      return this.addOnItems
        .filter((item) => this.addOnQuantities[item.id] > 0)
        .map((item) => `${item.name} x${this.addOnQuantities[item.id]} +$${(item.addOnPrice * this.addOnQuantities[item.id]).toLocaleString()}`)
    },
  },
  methods: {
    mainItemsByGroup(groupId: string): BundleChoice[] {
      return this.mainItems.filter((item) => item.group === groupId)
    },
    mainGroupSelectedCount(groupId: string): number {
      return this.mainItemsByGroup(groupId).reduce((sum, item) => sum + (this.mainQuantities[item.id] || 0), 0)
    },
    isMainGroupComplete(groupId: string): boolean {
      const group = this.mainGroups.find((item) => item.id === groupId)
      return Boolean(group && this.mainGroupSelectedCount(groupId) === group.required)
    },
    canIncrementMain(item: BundleChoice): boolean {
      if (!item.group) return false
      const group = this.mainGroups.find((groupItem) => groupItem.id === item.group)
      if (!group) return false
      return this.mainGroupSelectedCount(item.group) < group.required
    },
    incrementMain(id: string) {
      const item = this.mainItems.find((mainItem) => mainItem.id === id)
      if (!item || !this.canIncrementMain(item)) return
      this.$set(this.mainQuantities, id, (this.mainQuantities[id] || 0) + 1)
    },
    decrementMain(id: string) {
      this.$set(this.mainQuantities, id, Math.max(0, (this.mainQuantities[id] || 0) - 1))
    },
    incrementAddOn(id: string) {
      this.$set(this.addOnQuantities, id, this.addOnQuantities[id] + 1)
    },
    decrementAddOn(id: string) {
      this.$set(this.addOnQuantities, id, Math.max(0, this.addOnQuantities[id] - 1))
    },
    openPreview(item: BundleChoice | BundleAddOn) {
      this.previewItem = item
      this.previewTab = 'features'
      this.previewImageIndex = 0
    },
    productDetailTo(item: BundleChoice | BundleAddOn): { path: string; query: Record<string, string> } {
      return {
        path: `/products/${this.bundleProductId(item.id)}`,
        query: {
          from: `/event/SUMMER2026?group=flash&item=flash-bundle`,
          bundle: this.bundle.id,
        },
      }
    },
    bundleProductId(choiceId: string): string {
      const map: Record<string, string> = {
        sesame: 'p101',
        flax: 'p101',
        chia: 'p105',
        oats: 'p105',
        nutmix: 'p101',
        broccoli: 'p105',
        apricot: 'p106',
        gojidrink: 'op201',
        whitefungusMain: 'p102',
        fixedNutmix: 'p101',
        fixedApricot: 'p106',
        fixedWhitefungus: 'p102',
      }
      return map[choiceId] || 'p101'
    },
    addBundleToCart() {
      if (!this.isMainComplete) return
      const details = [
        ...this.selectedMainDetails,
        ...(this.bundle.hasGift ? [`贈品：${this.bundle.giftName || '精美提袋'} x${this.bundle.giftQty || 1}`] : []),
        ...this.selectedAddOnDetails,
      ]
      const product: Product & { quantity?: number } = {
        id: `bundle-${this.bundle.id}`,
        name: this.bundle.title,
        description: details.join('、'),
        price: this.subtotal,
        originalPrice: this.bundle.originalPrice + this.addOnSubtotal,
        memberPrice: this.subtotal,
        unit: '組合套餐',
        categoryId: 'bundle',
        tempZone: 'ambient',
        image: this.bundle.image,
        inStock: true,
        isOrganic: true,
        origin: '統一生機',
        tags: ['組合購', this.bundle.ruleLabel],
        promotionMessage: `${this.bundle.ruleLabel}：原價 $${this.bundle.originalPrice.toLocaleString()}，折抵 $${this.bundleDiscount.toLocaleString()}，活動價 $${this.bundle.price.toLocaleString()}`,
        quantity: 1,
        comboItems: details,
      }
      this.$store.dispatch('cart/addItem', product)
      this.$store.dispatch('ui/openCartDrawer')
    },
  },
})
</script>
