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
            <div class="mb-4 flex flex-wrap gap-2">
              <span class="rounded-full bg-brand-primary px-3 py-1 text-xs font-black text-white">{{ bundle.ruleLabel }}</span>
              <span v-if="bundle.hasGift" class="rounded-full bg-brand-surface px-3 py-1 text-xs font-black text-brand-primary">贈品已含</span>
              <span class="rounded-full bg-gray-100 px-3 py-1 text-xs font-black text-gray-500">可加價購</span>
            </div>
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

            <div class="mt-5 space-y-5">
              <div
                v-for="group in mainGroups"
                :key="group.id"
                class="rounded-2xl border border-gray-100 bg-gray-50/70 p-3"
              >
                <div class="mb-3 flex flex-wrap items-center justify-between gap-2">
                  <div class="flex items-center gap-2">
                    <span class="flex h-8 w-8 items-center justify-center rounded-xl bg-brand-primary text-sm font-black text-white">{{ group.id }}</span>
                    <div>
                      <h3 class="text-sm font-black text-brand-dark">{{ group.title }}</h3>
                      <p class="mt-0.5 text-xs font-bold text-gray-400">{{ group.description }}</p>
                    </div>
                  </div>
                  <span
                    class="rounded-full px-3 py-1 text-xs font-black"
                    :class="mainGroupSelectedCount(group.id) >= group.required ? 'bg-brand-surface text-brand-primary' : 'bg-white text-gray-500'"
                  >
                    已選 {{ mainGroupSelectedCount(group.id) }} / {{ group.required }}
                  </span>
                </div>

                <div class="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                  <article
                    v-for="item in mainItemsByGroup(group.id)"
                    :key="item.id"
                    class="rounded-2xl border border-gray-100 bg-white p-3 shadow-sm transition-colors"
                    :class="mainQuantities[item.id] ? 'border-brand-primary/40 bg-brand-surface/20' : ''"
                  >
                    <button type="button" class="block w-full text-left" @click="openPreview(item)">
                      <div class="aspect-[4/3] overflow-hidden rounded-xl bg-gray-50">
                        <img :src="item.image" :alt="item.name" class="h-full w-full object-cover transition-transform duration-500 hover:scale-105" />
                      </div>
                      <h3 class="mt-3 line-clamp-2 text-sm font-black leading-6 text-brand-dark">{{ item.name }}</h3>
                    </button>
                    <p class="mt-1.5 line-clamp-2 text-xs font-semibold leading-5 text-gray-500">{{ item.description }}</p>
                    <div class="mt-3 flex items-end justify-between gap-2">
                      <div>
                        <p class="text-xs font-bold text-gray-400">單品參考價</p>
                        <p class="text-base font-black text-brand-primary">${{ item.price.toLocaleString() }}</p>
                      </div>
                      <div class="inline-flex items-center overflow-hidden rounded-full border border-gray-200 bg-white">
                        <button class="flex h-8 w-8 items-center justify-center text-base font-black text-gray-400 hover:text-brand-primary disabled:opacity-30" :disabled="mainQuantities[item.id] <= 0" @click="decrementMain(item.id)">−</button>
                        <span class="w-8 text-center text-xs font-black text-brand-dark">{{ mainQuantities[item.id] }}</span>
                        <button class="flex h-8 w-8 items-center justify-center text-base font-black text-gray-400 hover:text-brand-primary disabled:opacity-30" :disabled="!canIncrementMain(item)" @click="incrementMain(item.id)">+</button>
                      </div>
                    </div>
                    <router-link
                      :to="productDetailTo(item)"
                      class="mt-3 inline-flex w-full items-center justify-center rounded-full bg-brand-surface px-3 py-2 text-xs font-black text-brand-primary transition-colors hover:bg-brand-primary hover:text-white"
                    >
                      查看商品詳情
                    </router-link>
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
                <img :src="giftItem.image" :alt="giftItem.name" class="h-full w-full object-cover" />
              </div>
              <div class="min-w-0 flex-1">
                <p class="text-base font-black text-brand-dark">{{ giftItem.name }} x1</p>
                <p class="mt-1 text-sm font-semibold text-gray-500">{{ bundle.giftText }}</p>
              </div>
              <span class="rounded-full bg-brand-surface px-4 py-2 text-sm font-black text-brand-primary">$0</span>
            </div>
          </section>

          <section class="rounded-3xl border border-gray-100 bg-white p-4 shadow-sm lg:p-5">
            <div class="flex flex-wrap items-start justify-between gap-3">
              <div class="flex items-center gap-3">
                <span class="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-xs font-black text-gray-500">3</span>
                <h2 class="type-section-title text-brand-dark">加價購</h2>
                <span class="rounded-full bg-gray-100 px-3 py-1 text-xs font-black text-gray-500">可略過</span>
              </div>
              <p class="text-sm font-semibold text-gray-400">完成主組合後，可加選指定商品。</p>
            </div>
            <div class="mt-4 grid gap-3 md:grid-cols-2">
              <article v-for="item in addOnItems" :key="item.id" class="flex gap-3 rounded-2xl border border-gray-100 bg-white p-3 shadow-sm">
                <button type="button" class="h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl bg-gray-50" @click="openPreview(item)">
                  <img :src="item.image" :alt="item.name" class="h-full w-full object-cover" />
                </button>
                <div class="min-w-0 flex-1">
                  <button type="button" class="line-clamp-2 text-left text-sm font-black text-brand-dark hover:text-brand-primary" @click="openPreview(item)">{{ item.name }}</button>
                  <p class="mt-2 text-xs font-bold text-gray-400 line-through">原價 ${{ item.originalPrice.toLocaleString() }}</p>
                  <p class="mt-1 text-base font-black text-brand-primary">加購價 ${{ item.addOnPrice.toLocaleString() }}</p>
                  <div class="mt-2 inline-flex items-center overflow-hidden rounded-full border border-gray-200 bg-white">
                    <button class="flex h-8 w-8 items-center justify-center text-base font-black text-gray-400 hover:text-brand-primary disabled:opacity-30" :disabled="addOnQuantities[item.id] <= 0" @click="decrementAddOn(item.id)">−</button>
                    <span class="w-8 text-center text-xs font-black text-brand-dark">{{ addOnQuantities[item.id] }}</span>
                    <button class="flex h-8 w-8 items-center justify-center text-base font-black text-gray-400 hover:text-brand-primary" @click="incrementAddOn(item.id)">+</button>
                  </div>
                </div>
              </article>
            </div>
          </section>

          <section class="rounded-3xl border border-gray-100 bg-white p-4 shadow-sm lg:p-5">
            <div class="flex flex-wrap items-center gap-3">
              <span class="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-xs font-black text-gray-500">4</span>
              <h2 class="type-section-title text-brand-dark">加碼優惠</h2>
              <span class="rounded-full bg-gray-100 px-3 py-1 text-xs font-black text-gray-500">進度優惠</span>
            </div>
            <div class="mt-5 space-y-5">
              <div>
                <div class="mb-2 flex items-center justify-between text-sm font-bold">
                  <span class="text-gray-600">{{ freeShippingRemaining > 0 ? `再加 $${freeShippingRemaining.toLocaleString()} 享滿 $1,200 免運` : '已達滿 $1,200 免運' }}</span>
                  <span class="text-gray-400">門檻 $1,200</span>
                </div>
                <div class="h-2 overflow-hidden rounded-full bg-gray-100">
                  <div class="h-full rounded-full bg-brand-primary transition-all" :style="{ width: `${freeShippingProgress}%` }" />
                </div>
              </div>
              <div>
                <div class="mb-2 flex items-center justify-between text-sm font-bold">
                  <span class="text-gray-600">{{ giftRemaining > 0 ? `再加 $${giftRemaining.toLocaleString()} 贈有機燕麥飲` : '已符合有機燕麥飲贈品門檻' }}</span>
                  <span class="text-gray-400">門檻 $1,500</span>
                </div>
                <div class="h-2 overflow-hidden rounded-full bg-gray-100">
                  <div class="h-full rounded-full bg-brand-accent transition-all" :style="{ width: `${giftProgress}%` }" />
                </div>
              </div>
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
              <div class="flex justify-between gap-3"><span class="text-gray-500">滿額優惠</span><span>{{ freeShippingRemaining > 0 ? `尚差 $${freeShippingRemaining.toLocaleString()}` : '已達成' }}</span></div>
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
        <div class="w-full max-w-2xl overflow-hidden rounded-t-3xl bg-white shadow-xl sm:rounded-3xl">
          <div class="grid gap-0 sm:grid-cols-[0.9fr_1.1fr]">
            <div class="aspect-square bg-gray-50">
              <img :src="previewItem.image" :alt="previewItem.name" class="h-full w-full object-cover" />
            </div>
            <div class="p-6">
              <div class="flex items-start justify-between gap-4">
                <h3 class="text-2xl font-black leading-tight text-brand-dark">{{ previewItem.name }}</h3>
                <button class="text-3xl leading-none text-gray-400 hover:text-brand-primary" @click="previewItem = null">×</button>
              </div>
              <p class="mt-4 text-sm font-semibold leading-7 text-gray-500">{{ previewItem.description }}</p>
              <div class="mt-5 space-y-3 rounded-2xl bg-brand-bg p-4 text-sm leading-6 text-gray-600">
                <p><span class="font-black text-brand-dark">保存方式：</span>{{ previewItem.storage }}</p>
                <p><span class="font-black text-brand-dark">注意事項：</span>{{ previewItem.notice }}</p>
              </div>
              <button class="mt-6 h-11 w-full rounded-2xl bg-brand-primary text-sm font-black text-white hover:bg-brand-dark" @click="previewItem = null">
                返回選擇
              </button>
            </div>
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
          ruleLabel: 'A+B 分區任選',
          heroText: '選滿 A 區 1 件與 B 區 1 件即可用組合價加入購物車，贈品將隨組合自動帶入。',
          mainRuleText: 'A 區商品 1 件 + B 區商品 1 件',
          hasGift: true,
          giftText: '主商品選滿 2 件後，隨組合附贈。',
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
      } as Record<string, number>,
      addOnQuantities: {
        goji: 0,
        whitefungus: 0,
      } as Record<string, number>,
      previewItem: null as BundleChoice | BundleAddOn | null,
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
        .map((group) => group.id)
      if (!missing.length) return '已符合組合價。'
      return `請完成 ${missing.join('、')} 區商品選擇。`
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
        ...(this.bundle.hasGift ? ['贈品：精美提袋 x1'] : []),
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
