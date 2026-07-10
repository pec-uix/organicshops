<template>
  <div class="min-h-screen bg-brand-bg pb-24 text-gray-800">
    <section class="bg-white">
      <div class="mx-auto grid max-w-7xl gap-8 px-4 py-10 lg:grid-cols-[minmax(0,1fr)_22rem] lg:px-8 lg:py-14">
        <div>
          <nav class="mb-8 flex flex-wrap items-center gap-x-1.5 gap-y-1 text-sm text-gray-500">
            <router-link to="/" class="transition-colors hover:text-brand-primary">首頁</router-link>
            <span>›</span>
            <router-link to="/events" class="transition-colors hover:text-brand-primary">活動專區</router-link>
            <span>›</span>
            <span class="text-gray-800">OP 點數加價購</span>
          </nav>
          <p class="type-eyebrow text-brand-primary">主題企劃</p>
          <h1 class="mt-3 type-hero-title text-brand-dark">OP 點數加價購</h1>
          <p class="mt-4 max-w-2xl type-body text-gray-600">
            使用指定 OP 點數搭配加購價，換購統一生機精選商品。登入會員後可查看可用點數，並將商品加入購物車。
          </p>
          <div class="mt-6 flex flex-wrap gap-3">
            <span class="rounded-full bg-brand-surface px-4 py-2 text-sm font-bold text-brand-primary">點數 + 加購價</span>
            <span class="rounded-full bg-brand-surface px-4 py-2 text-sm font-bold text-brand-primary">指定商品適用</span>
            <span class="rounded-full bg-brand-surface px-4 py-2 text-sm font-bold text-brand-primary">可加入購物車結帳</span>
          </div>
        </div>

        <aside class="rounded-2xl border border-gray-100 bg-brand-surface p-6 shadow-sm">
          <p class="type-eyebrow text-brand-primary">OPENPOINT</p>
          <template v-if="isLoggedIn">
            <p class="mt-4 text-sm font-bold text-gray-500">目前可用點數</p>
            <div class="mt-2 flex items-baseline gap-2 text-brand-primary">
              <span class="text-4xl font-black leading-none">{{ userPoints.toLocaleString() }}</span>
              <span class="text-sm font-bold">點</span>
            </div>
            <p class="mt-3 type-muted text-gray-500">點數效期至 2026-12-31</p>
          </template>
          <template v-else>
            <h2 class="mt-4 type-section-title">登入後查看點數</h2>
            <p class="mt-3 type-body text-gray-600">
              登入會員即可確認可用點數，並使用點數加價購指定商品。
            </p>
            <router-link
              :to="{ name: 'login', query: { redirect: $route.fullPath } }"
              class="mt-5 inline-flex rounded-xl bg-brand-primary px-5 py-3 type-action text-white transition-colors hover:bg-brand-dark"
            >
              立即登入
            </router-link>
          </template>
        </aside>
      </div>
    </section>

    <main class="mx-auto max-w-7xl px-4 pt-8 lg:px-8">
      <section class="mb-6 grid gap-4 md:grid-cols-3">
        <div class="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <p class="type-eyebrow text-gray-400">STEP 1</p>
          <h2 class="mt-2 type-card-title">選擇換購商品</h2>
          <p class="mt-2 type-muted">每項商品會標示所需 OP 點數與加購金額。</p>
        </div>
        <div class="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <p class="type-eyebrow text-gray-400">STEP 2</p>
          <h2 class="mt-2 type-card-title">加入購物車</h2>
          <p class="mt-2 type-muted">點數需求會在購物車與結帳摘要中分開呈現。</p>
        </div>
        <div class="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <p class="type-eyebrow text-gray-400">STEP 3</p>
          <h2 class="mt-2 type-card-title">完成結帳</h2>
          <p class="mt-2 type-muted">依商品溫層與配送方式完成訂單。</p>
        </div>
      </section>

      <div class="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p class="type-eyebrow text-brand-primary">Exchange Items</p>
          <h2 class="mt-2 type-section-title">可換購商品</h2>
        </div>
        <p class="text-sm font-bold text-gray-400">共 {{ exchangeItems.length }} 件商品</p>
      </div>

      <div class="grid grid-cols-2 justify-items-center gap-4 md:grid-cols-3 md:gap-5 xl:grid-cols-4 xl:gap-6">
        <ProductCard
          v-for="item in exchangeItems"
          :key="item.id"
          :product="item"
          :available-op-points="isLoggedIn ? userPoints : null"
          action-label="加入購物車"
        />
      </div>
    </main>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import ProductCard from '@/components/product/ProductCard.vue'
import { Product } from '@/types'
import { mockProducts } from '@/mock/data'

export default Vue.extend({
  name: 'OPExchangeView',
  components: { ProductCard },
  data() {
    return {
      userPoints: 1250,
    }
  },
  computed: {
    isLoggedIn(): boolean { return this.$store.getters['auth/isLoggedIn'] },
    exchangeItems(): Product[] {
      return mockProducts.filter((product) => product.requiredOpPoints && product.inStock)
    },
  }
})
</script>
