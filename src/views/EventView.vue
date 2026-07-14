<template>
  <div class="min-h-screen bg-brand-bg">
    <div class="max-w-7xl mx-auto px-4 py-8">
      <nav class="mb-6 flex flex-wrap items-center gap-x-1.5 gap-y-1 text-sm text-gray-500">
        <router-link to="/" class="inline-flex items-center gap-1 whitespace-nowrap transition-colors hover:text-brand-primary" aria-label="返回首頁">
          <svg class="h-4 w-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 11.5L12 4l9 7.5M5.5 10.5V20h13v-9.5M9.5 20v-5.5h5V20" />
          </svg>
          <span>首頁</span>
        </router-link>
        <span class="inline-flex items-center gap-1.5 whitespace-nowrap">
          <span>›</span>
          <router-link to="/events" class="transition-colors hover:text-brand-primary">活動專區</router-link>
        </span>
        <template v-if="activeGroup">
          <button
            type="button"
            class="inline-flex items-center gap-1.5 whitespace-nowrap transition-colors hover:text-brand-primary focus:outline-none focus-visible:text-brand-primary"
            @click="backToGroup"
          >
            <span>›</span>
            {{ activeGroup.title }}
          </button>
        </template>
        <template v-if="activeItem">
          <span class="inline-flex items-center gap-1.5 whitespace-nowrap text-gray-800">
            <span>›</span>
            {{ activeItem.label }}
          </span>
        </template>
      </nav>

      <section class="mb-6 overflow-hidden rounded-[28px] bg-white shadow-sm">
        <div class="relative h-[320px] overflow-hidden sm:h-[380px] lg:h-[420px]">
          <img
            :src="currentItem.image"
            :alt="currentItem.label"
            class="absolute inset-0 h-full w-full object-cover object-center"
          />
          <div class="absolute inset-0 bg-gradient-to-r from-black/55 via-black/25 to-black/15"></div>
          <div class="absolute inset-0 flex items-end p-6 sm:p-8 lg:p-12">
            <div class="max-w-2xl text-white">
              <p class="inline-flex rounded-none bg-brand-primary px-4 py-1 text-sm font-bold tracking-[0.2em] text-white uppercase">
                活動主題
              </p>
              <h1 class="mt-5 text-[clamp(2.5rem,5vw,4.8rem)] font-black leading-[0.95] tracking-[-0.02em] text-white">
                {{ activeItem ? activeItem.label : activeGroup.title }}
              </h1>
              <p class="mt-5 max-w-3xl text-lg font-semibold leading-8 text-white/92 sm:text-2xl sm:leading-9">
                {{ activeItem ? activeItem.shortText : activeGroup.description }}
              </p>
              <p class="mt-4 max-w-3xl text-base font-semibold leading-7 text-white/88 sm:text-lg">
                {{ activeItem ? activeItem.bannerText : currentItem.bannerText }}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section v-if="!activeItem" class="mb-6 overflow-hidden rounded-3xl bg-white shadow-sm">
        <div class="relative">
          <div class="grid grid-flow-col grid-rows-2 auto-cols-[calc((100%-1rem)/3)] gap-2 overflow-x-auto px-3 py-3 pr-14 sm:grid-flow-row sm:auto-cols-auto sm:grid-cols-2 sm:grid-rows-none sm:gap-4 sm:overflow-visible sm:p-0 xl:grid-cols-3">
            <router-link
              v-for="item in activeGroup.items"
              :key="item.id"
              :to="campaignItemRoute(item.id)"
              class="group overflow-hidden rounded-2xl border border-brand-primary/20 bg-white p-2 text-center shadow-sm transition-all hover:-translate-y-1 hover:border-brand-primary/45 hover:shadow-md sm:rounded-3xl sm:border-l-4 sm:border-l-brand-primary sm:p-4 sm:text-left"
              :class="currentItem.id === item.id ? 'bg-brand-surface/35' : ''"
            >
              <div class="flex flex-col items-center gap-2 sm:flex-row sm:gap-4">
                <div class="h-14 w-full flex-shrink-0 overflow-hidden rounded-xl bg-brand-surface ring-1 ring-brand-primary/15 sm:h-16 sm:w-16 sm:rounded-2xl">
                  <img :src="item.image" :alt="item.label" class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                </div>
                <div class="min-w-0">
                  <h3 class="line-clamp-2 text-xs font-black leading-snug text-brand-dark group-hover:text-brand-primary sm:truncate sm:text-lg">{{ item.label }}</h3>
                </div>
              </div>
            </router-link>
          </div>
          <div class="pointer-events-none absolute inset-y-0 right-0 flex w-12 items-center justify-center bg-gradient-to-l from-white via-white/95 to-white/0 sm:hidden">
            <span class="flex h-8 w-8 items-center justify-center rounded-full bg-brand-primary text-white shadow-sm">
              <svg class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2.4" viewBox="0 0 24 24" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </span>
          </div>
        </div>
      </section>

      <section class="mb-6 flex items-center justify-between gap-4 border-b border-gray-100 pb-4">
        <div class="flex flex-wrap items-center gap-3">
          <h2 class="type-page-title tracking-tight text-brand-dark">
            {{ activeItem ? activeItem.label : activeGroup.title }}
          </h2>
          <button
            class="inline-flex items-center gap-2 rounded-xl border border-brand-primary/20 bg-white px-4 py-2.5 text-sm font-bold text-brand-primary transition-all hover:bg-brand-surface"
            @click="backToGroup"
          >
            <span>進階篩選</span>
          </button>
        </div>

        <div class="flex flex-wrap items-center gap-4 sm:gap-6">
          <div class="flex items-center gap-2">
            <label class="text-sm font-bold text-gray-400 tracking-tighter">排序方式</label>
            <select
              v-model="sortBy"
              class="text-sm border-0 bg-transparent font-bold text-brand-primary focus:ring-0 cursor-pointer"
            >
              <option v-for="opt in sortOptions" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
            </select>
          </div>
          <div class="flex items-center bg-gray-100 p-1 rounded-md shadow-inner">
            <button
              @click="viewMode = 'grid'"
              class="p-1.5 rounded transition-all"
              :class="viewMode === 'grid' ? 'bg-white shadow-sm text-brand-primary' : 'text-gray-400 hover:text-gray-600'"
            >
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2z" />
              </svg>
            </button>
            <button
              @click="viewMode = 'list'"
              class="p-1.5 rounded transition-all"
              :class="viewMode === 'list' ? 'bg-white shadow-sm text-brand-primary' : 'text-gray-400 hover:text-gray-600'"
            >
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </section>

      <section>
        <div v-if="isBundleItemPage" class="grid grid-cols-2 gap-3 lg:grid-cols-3 xl:grid-cols-4">
          <router-link
            v-for="bundle in bundleProducts"
            :key="bundle.name"
            :to="bundle.path"
            class="group flex flex-col overflow-hidden rounded-3xl border border-brand-primary/20 bg-white shadow-sm transition-all hover:-translate-y-1 hover:border-brand-primary/40 hover:shadow-md"
          >
            <div class="aspect-[4/3] w-full flex-shrink-0 overflow-hidden bg-brand-surface/40">
              <img :src="bundle.image" :alt="bundle.name" class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
            </div>
            <div class="flex flex-1 flex-col p-5">
              <h3 class="line-clamp-2 text-xl font-black leading-tight text-brand-dark group-hover:text-brand-primary">{{ bundle.name }}</h3>
              <p class="mt-3 line-clamp-2 text-sm font-semibold leading-6 text-gray-500">{{ bundle.description }}</p>
              <div class="mt-auto pt-5">
                <p class="text-xs font-bold text-gray-400 line-through">原價 ${{ bundle.originalPrice.toLocaleString() }}</p>
                <p class="mt-0.5 text-2xl font-black text-brand-primary">
                  <span class="text-sm">活動價 $</span>{{ bundle.price.toLocaleString() }}
                </p>
                <span class="mt-3 flex h-10 w-full items-center justify-center rounded-xl bg-brand-primary text-sm font-black text-white transition-all hover:bg-brand-dark active:scale-[0.98]">選購組合</span>
              </div>
            </div>
          </router-link>
        </div>
        <div v-else-if="sortedProducts.length" :class="viewMode === 'grid' ? 'grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5' : 'flex flex-col gap-4'">
          <ProductCard
            v-for="product in sortedProducts"
            :key="product.id"
            :product="product"
            :layout="viewMode"
            :full-width="viewMode === 'list'"
            :action-label="productCardActionLabel"
            :confirm-action-label="productCardConfirmActionLabel"
            :bundle-rule-text="bundleRuleText"
            :bundle-selected-count="1"
            :bundle-required-count="2"
            :bundle-price="390"
            :one-plus-one-mode="isOnePlusOnePage"
          />
        </div>
        <div v-else class="rounded-2xl border border-dashed border-gray-200 bg-white px-6 py-16 text-center shadow-sm">
          <h3 class="type-section-title mb-2">目前沒有商品資料</h3>
          <p class="text-sm text-gray-400">請稍後再試。</p>
        </div>
      </section>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import ProductCard from '@/components/product/ProductCard.vue'
import { mockProducts } from '@/mock/data'
import { Product } from '@/types'

const CAMPAIGN_ITEM_PRODUCT_IDS: Record<string, string[]> = {
  'flash-limited': [
    '12501', '12900', '11840', '12901', '12898', '12899', '12877', '12839',
    '12808', '12677', '12848', '12847', '12783', '12826', '12655', '12855',
    '12853', '12854', '12529', '12849', '12502', '12506', '12472', '12672',
    '12806', '12805', '12804', '12803', '12802', '12801', '12800', '12799',
  ],
  'flash-oneplusone': [
    '12620', '11522', '11892', '12846', '9434', '12398', '12397', '12084',
    '12815', '9439', '12903', '12904', '12902', '7754', '12583', '12087',
  ],
  'flash-multi': [
    '12677', '12832', '9923', '12831', '12830', '12829', '12823', '12790',
    '12806', '12805', '12804', '12803', '12802', '12801', '12800', '12799',
    '12488', '12487', '12134', '12894', '11973', '11695', '11696', '12137',
    '9550', '9549', '12641', '8380', '12672', '12644', '12642', '12643',
    '12651', '12649', '12647', '12646', '12648', '12650', '7853', '7854',
    '7855', '12390', '12366', '12645', '7295', '7833',
  ],
  'flash-surplus': [
    '12916', '12897', '12896', '11868', '9895', '12781', '12845', '12838',
    '12836', '12835', '12834', '12833', '12795', '12793', '12773', '12731',
    '12730', '12853', '12638', '11866', '12598', '12557',
  ],
  'flash-member': [
    '10421', '9437', '12085', '12415', '8135', '8692', '12083', '12832',
    '9898', '2866', '10849', '12701', '12092', '12834', '10902',
  ],
  'theme-oats': [
    '12084', '12815', '12904', '12903', '12902', '12097', '12082', '11866',
    '11872', '11873', '11867', '11868', '12879', '11871', '11870', '11863',
    '12816', '12817',
  ],
  'theme-mediterranean': [
    '12081', '12082', '12083', '12084', '12085', '12086', '12087', '12093',
    '11287', '12088', '12089', '12091', '12092',
  ],
  'flash-summer': ['9549', '11868', '12730', '6875', '12828'],
  'flash-ghost':  ['12831', '12091', '11873', '12749', '12093'],
  'theme-gift': ['12415', '12179', '9264', '9265', '12833', '12082', '12081', '11866', '11872'],
}

type CampaignItem = {
  id: string
  label: string
  shortText: string
  description: string
  bannerText: string
  image: string
  productTags: string[]
}

type CampaignGroup = {
  id: string
  title: string
  description: string
  items: CampaignItem[]
}

const assetUrl = (filename: string): string => `${process.env.BASE_URL || '/'}site-assets/${filename}`

export default Vue.extend({
  name: 'EventView',
  components: { ProductCard },
  data() {
    return {
      activeGroupId: 'flash',
      activeItemId: '',
      sortBy: 'latest',
      viewMode: 'grid',
      sortOptions: [
        { value: 'latest', label: '最新上架' },
        { value: 'price_asc', label: '價格：低到高' },
        { value: 'price_desc', label: '價格：高到低' },
        { value: 'sales', label: '熱銷排行' },
      ],
      campaignGroups: [
        {
          id: 'flash',
          title: '快閃與特惠',
          description: '限時優惠與高回購主題集中瀏覽，先選主題再快速下探商品內容。',
          items: [
            {
              id: 'flash-limited',
              label: '限時優惠快閃區',
              shortText: '當週熱銷與限時價格',
              description: '精選商品限時上架，適合快速補貨與比價。',
              bannerText: '把握本週快閃，先選主題再快速查看商品。',
              image: assetUrl('broccoli.png'),
              productTags: ['flash'],
            },
            {
              id: 'flash-bundle',
              label: '任選多件組',
              shortText: '多件組合更划算',
              description: '早餐、常備與家庭補貨組合一次看齊。',
              bannerText: '同主題組合優惠，適合一次備齊。',
              image: assetUrl('breakfast.png'),
              productTags: ['optional'],
            },
            {
              id: 'flash-member',
              label: '會員日優惠',
              shortText: '會員專屬加碼',
              description: '會員限定價格與點數回饋內容。',
              bannerText: '會員日檔期內容集中展示。',
              image: assetUrl('salmon.png'),
              productTags: ['member'],
            },
            {
              id: 'flash-oneplusone',
              label: '買1送1必買區',
              shortText: '人氣商品高曝光',
              description: '適合搭配日常採買，一次抓住重點優惠。',
              bannerText: '高回購商品以大 banner 呈現。',
              image: assetUrl('nuts.png'),
              productTags: ['flash'],
            },
            {
              id: 'flash-multi',
              label: '多件組優惠',
              shortText: '組合價快速比較',
              description: '用同一頁快速查看多件組內容與價格。',
              bannerText: '一次看懂多件組優惠內容。',
              image: assetUrl('whitefungus.png'),
              productTags: ['optional'],
            },
            {
              id: 'flash-surplus',
              label: '惜福區',
              shortText: '惜福商品限量出清',
              description: '臨近效期或少量庫存商品集中瀏覽。',
              bannerText: '惜福內容也以 banner 呈現。',
              image: assetUrl('salmon.png'),
              productTags: ['flash'],
            },
            {
              id: 'flash-summer',
              label: '盛夏能量季',
              shortText: '夏日補給嚴選出擊',
              description: '夏季特別企劃，補充能量的嚴選好物。',
              bannerText: '盛夏能量季限時上架，把握夏日優惠。',
              image: assetUrl('broccoli.png'),
              productTags: ['flash'],
            },
            {
              id: 'flash-ghost',
              label: '中元普渡拜好拜滿',
              shortText: '拜拜必備好禮全攻略',
              description: '精選普渡必備商品，品質保證誠意十足。',
              bannerText: '中元節特別企劃，誠意滿滿好物嚴選。',
              image: assetUrl('nuts.png'),
              productTags: ['flash'],
            },
          ] as CampaignItem[],
        },
        {
          id: 'theme',
          title: '主題企劃',
          description: '以飲食主題整理出活動內容，先看主題再往下找到對應商品。',
          items: [
            {
              id: 'theme-mediterranean',
              label: '地中海飲食推薦',
              shortText: '主題式選品入口',
              description: '以健康飲食主題整理相關商品與方案。',
              bannerText: '地中海飲食主題以 banner 呈現。',
              image: assetUrl('broccoli.png'),
              productTags: ['flash'],
            },
            {
              id: 'theme-oats',
              label: '隔夜燕麥片專區',
              shortText: '早餐主題精選',
              description: '以早餐與便利備餐為主的商品集合。',
              bannerText: '早餐主題區以大圖帶出視覺重點。',
              image: assetUrl('breakfast.png'),
              productTags: ['optional'],
            },
            {
              id: 'theme-gift',
              label: '健康伴手禮',
              shortText: '送禮與節慶主題',
              description: '禮盒與送禮內容集中整理。',
              bannerText: '送禮主題頁同樣使用 banner 呈現。',
              image: assetUrl('nuts.png'),
              productTags: ['member'],
            },
          ] as CampaignItem[],
        },
      ] as CampaignGroup[],
      bundleProducts: [
        {
          name: '有機亞麻仁堅果粉與葡萄糖胺黑穀芝麻粉任2件組',
          description: 'A 區商品 1 件 + B 區商品 1 件，組合價 $990，贈精美提袋 x1。',
          image: assetUrl('nuts.png'),
          price: 990,
          originalPrice: 1180,
          tags: ['A+B 分區任選', '贈品已含'],
          path: '/event/SUMMER2026/bundles/flax-sesame-990',
        },
        {
          name: '同區營養穀粉任選滿6件組',
          description: '同一區商品數量選滿 6 件，即可用組合價加入購物車。',
          image: assetUrl('breakfast.png'),
          price: 1680,
          originalPrice: 1980,
          tags: ['同區任選', '滿 6 件'],
          path: '/event/SUMMER2026/bundles/same-zone-six',
        },
        {
          name: '堅果果乾任選3件固定$999',
          description: '指定堅果與果乾任選 3 件，原價合計 $1,260，組合固定價 $999。',
          image: assetUrl('nuts.png'),
          price: 999,
          originalPrice: 1260,
          tags: ['任選固定金額', '滿 3 件'],
          ruleTitle: '任選固定金額',
          ruleText: '堅果果乾區任選 3 件，整組固定 $999。',
          selectionText: '原味綜合堅果、杏桃乾、有機燕麥堅果穀粉',
          discountText: '原價 $1,260，折抵 $261，活動價 $999',
          path: '/event/SUMMER2026/bundles/optional-fixed-999',
        },
        {
          name: 'A+B+C 日常保養組合$1,290',
          description: 'A 區早餐穀粉、B 區飲品、C 區點心各選 1 件，組成一套保養補貨組。',
          image: assetUrl('breakfast.png'),
          price: 1290,
          originalPrice: 1580,
          tags: ['A+B+C 組合', '各 1 件'],
          ruleTitle: 'A+B+C 組合',
          ruleText: 'A、B、C 三區各選 1 件，組合價 $1,290。',
          selectionText: '早餐穀粉區、喝的保養區、堅果點心區',
          discountText: '原價 $1,580，折抵 $290，活動價 $1,290',
          path: '/event/SUMMER2026/bundles/abc-daily-1290',
        },
        {
          name: '指定商品任選3件固定$390',
          description: '指定飲品與點心任選 3 件，符合件數後以固定組合價加入購物車。',
          image: assetUrl('whitefungus.png'),
          price: 390,
          originalPrice: 520,
          tags: ['指定件數固定價', '任選 3 件'],
          ruleTitle: '指定件數固定價',
          ruleText: '指定商品任選 3 件，固定組合價 $390。',
          selectionText: '菊花枸杞銀耳露、杏桃乾、原味綜合堅果',
          discountText: '原價 $520，折抵 $130，活動價 $390',
          path: '/event/SUMMER2026/bundles/fixed-three-390',
        },
        {
          name: '原味綜合堅果隨手包指定價格搭贈組',
          description: '指定商品售價 $315，加入購物車即搭贈同品項 1 組，適合補貨與分享。',
          image: assetUrl('nuts.png'),
          price: 315,
          originalPrice: 630,
          tags: ['指定價格', '買 1 送 1'],
          giftName: '原味綜合堅果隨手包',
          giftQuantity: 1,
          giftUnit: '25g x 10包/袋',
          giftImage: assetUrl('nuts.png'),
          path: '/event/SUMMER2026/bundles/flax-sesame-990',
        },
        {
          name: '杏桃乾買2送1補貨組',
          description: '杏桃乾任選同品項 2 包，符合條件即贈同品項 1 包，贈品於購物車以 $0 顯示。',
          image: assetUrl('nuts.png'),
          price: 396,
          originalPrice: 594,
          tags: ['買 2 送 1', '贈品 $0'],
          ruleTitle: '買2送1',
          ruleText: '杏桃乾購買 2 包，即贈杏桃乾 1 包。',
          selectionText: '杏桃乾',
          discountText: '贈品杏桃乾 x1，贈品小計 $0',
          giftName: '杏桃乾',
          giftQuantity: 1,
          giftUnit: '200g/包',
          giftImage: assetUrl('nuts.png'),
          path: '/event/SUMMER2026/bundles/apricot-buy2-396',
        },
        {
          name: '有機枸杞原汁買2送2組',
          description: '有機枸杞原汁 2 罐成組補貨，符合條件即贈同品項 2 罐。',
          image: assetUrl('salmon.png'),
          price: 1180,
          originalPrice: 2360,
          tags: ['買 2 送 2', '贈品 $0'],
          ruleTitle: '買2送2',
          ruleText: '有機枸杞原汁購買 2 罐，即贈有機枸杞原汁 2 罐。',
          selectionText: '有機枸杞原汁',
          discountText: '贈品有機枸杞原汁 x2，贈品小計 $0',
          giftName: '有機枸杞原汁',
          giftQuantity: 2,
          giftUnit: '500ml/瓶',
          giftImage: assetUrl('salmon.png'),
          path: '/event/SUMMER2026/bundles/goji-buy2-1180',
        },
        {
          name: '菊花枸杞銀耳露買A送B組',
          description: '購買菊花枸杞銀耳露，搭贈原味綜合堅果隨手包，飲品與點心一次備齊。',
          image: assetUrl('whitefungus.png'),
          price: 58,
          originalPrice: 373,
          tags: ['買 A 送 B', '贈品 $0'],
          ruleTitle: '買A送B',
          ruleText: '菊花枸杞銀耳露每購買 1 瓶，即贈原味綜合堅果隨手包 1 組。',
          selectionText: '菊花枸杞銀耳露',
          discountText: '贈品原味綜合堅果隨手包 x1，贈品小計 $0',
          giftName: '原味綜合堅果隨手包',
          giftQuantity: 1,
          giftUnit: '25g x 10包/袋',
          giftImage: assetUrl('nuts.png'),
          path: '/event/SUMMER2026/bundles/whitefungus-buyab-58',
        },
        {
          name: '堅果果乾任選3件85折',
          description: '原味堅果、杏桃乾與腰果隨手包可混搭，選滿指定件數即可享折扣。',
          image: assetUrl('nuts.png'),
          price: 893,
          originalPrice: 1050,
          tags: ['任選享折數', '滿 3 件'],
          ruleTitle: '任選享折數',
          ruleText: '指定堅果果乾任選 3 件，整組享 85 折。',
          selectionText: '原味綜合堅果、杏桃乾、原味腰果隨手包',
          discountText: '原價 $1,050，折抵 $157，活動價 $893',
          path: '/event/SUMMER2026/bundles/nuts-three-893',
        },
        {
          name: '早餐穀粉任選4件折$120',
          description: '沖泡穀粉系列可自由搭配，達指定件數後直接折抵固定金額。',
          image: assetUrl('breakfast.png'),
          price: 1560,
          originalPrice: 1680,
          tags: ['任選折固定金額', '折 $120'],
          ruleTitle: '任選折固定金額',
          ruleText: '指定早餐穀粉任選 4 件，整筆折 $120。',
          selectionText: '黑穀芝麻粉、亞麻仁堅果粉、奇亞籽穀物粉、燕麥堅果穀粉',
          discountText: '原價 $1,680，折抵 $120，活動價 $1,560',
          path: '/event/SUMMER2026/bundles/breakfast-four-1560',
        },
        {
          name: '銀髮飲品任選6件每件折$10',
          description: '日常飲品可依喜好混搭，選滿後每件商品各自折抵固定金額。',
          image: assetUrl('whitefungus.png'),
          price: 330,
          originalPrice: 390,
          tags: ['每件折固定金額', '滿 6 件'],
          ruleTitle: '任選每件折固定金額',
          ruleText: '指定飲品任選 6 件，每件折 $10。',
          selectionText: '菊花枸杞銀耳露、有機枸杞原汁、即飲保養飲',
          discountText: '原價 $390，折抵 $60，活動價 $330',
          path: '/event/SUMMER2026/bundles/senior-six-330',
        },
      ],
    }
  },
  computed: {
    activeGroup(): CampaignGroup {
      return this.campaignGroups.find((group: CampaignGroup) => group.id === this.activeGroupId) || this.campaignGroups[0]
    },
    currentItem(): CampaignItem {
      return this.activeItem || this.activeGroup.items[0]
    },
    activeItem(): CampaignItem | null {
      if (!this.activeItemId) return null
      return this.activeGroup.items.find((item: CampaignItem) => item.id === this.activeItemId) || null
    },
    products(): Product[] {
      const ids = CAMPAIGN_ITEM_PRODUCT_IDS[this.activeItemId]
      if (!ids) return mockProducts
      const allProducts: Product[] = this.$store.getters['products/allProducts']
      return ids.map(id => allProducts.find(p => p.id === id)).filter(Boolean) as Product[]
    },
    sortedProducts(): Product[] {
      const base = this.products
      switch (this.sortBy) {
        case 'price_asc':
          return [...base].sort((a, b) => (a.memberPrice ?? a.price) - (b.memberPrice ?? b.price))
        case 'price_desc':
          return [...base].sort((a, b) => (b.memberPrice ?? b.price) - (a.memberPrice ?? a.price))
        case 'sales':
          return [...base]
        default:
          return base
      }
    },
    isBundleItemPage(): boolean {
      return this.activeGroupId === 'flash' && this.activeItemId === 'flash-bundle'
    },
    productCardActionLabel(): string {
      return this.activeGroupId === 'flash' && this.activeItemId === 'flash-bundle' ? '加入組合購' : '加入購物車'
    },
    productCardConfirmActionLabel(): string {
      return this.activeGroupId === 'flash' && this.activeItemId === 'flash-bundle' ? '加入組合購' : '確認加入'
    },
    bundleRuleText(): string {
      return this.activeGroupId === 'flash' && this.activeItemId === 'flash-bundle'
        ? '有機紅藜麥、有機三色藜麥、有機奇亞籽任選第 2 件 5 折，可選 2 件，組合價 $390。'
        : ''
    },
    isOnePlusOnePage(): boolean {
      return this.activeItemId === 'flash-oneplusone'
    },
  },
  watch: {
    '$route.query': {
      handler() {
        this.syncSelectionFromRoute()
      },
      immediate: true,
    },
  },
  created() {
    this.syncSelectionFromRoute()
  },
  methods: {
    syncSelectionFromRoute() {
      const groupId = Array.isArray(this.$route.query.group) ? this.$route.query.group[0] : this.$route.query.group
      const itemId = Array.isArray(this.$route.query.item) ? this.$route.query.item[0] : this.$route.query.item

      if (typeof groupId === 'string' && this.campaignGroups.some((group: CampaignGroup) => group.id === groupId)) {
        this.activeGroupId = groupId
      }

      const group = this.activeGroup
      if (typeof itemId === 'string' && group.items.some((item: CampaignItem) => item.id === itemId)) {
        this.activeItemId = itemId
      } else {
        this.activeItemId = ''
      }
    },
    selectGroup(groupId: string) {
      this.activeGroupId = groupId
      this.activeItemId = ''
      this.$router.replace({
        path: this.$route.path,
        query: { ...this.$route.query, group: groupId, item: undefined },
      }).catch(() => {})
    },
    selectItem(itemId: string) {
      this.activeItemId = itemId
      this.$router.replace({
        path: this.$route.path,
        query: { ...this.$route.query, group: this.activeGroupId, item: itemId },
      }).catch(() => {})
    },
    backToGroup() {
      this.activeItemId = ''
      this.$router.replace({
        path: this.$route.path,
        query: { ...this.$route.query, group: this.activeGroupId, item: undefined },
      }).catch(() => {})
    },
    campaignItemRoute(itemId: string) {
      return {
        path: this.$route.path,
        query: { group: this.activeGroupId, item: itemId },
      }
    },
  },
})
</script>
