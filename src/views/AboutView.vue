<template>
  <div class="min-h-screen bg-brand-bg pb-24">
    <section class="relative overflow-hidden bg-[#F0F4F1]">
      <img
        :src="aboutBannerImage"
        alt="統一生機品牌介紹"
        class="absolute inset-0 h-full w-full object-cover opacity-90"
      />
      <div class="absolute inset-0 bg-gradient-to-r from-white/15 to-transparent"></div>
      <div class="relative z-10 mx-auto max-w-7xl px-4 py-14 lg:px-8 lg:py-20">
        <h1 class="type-page-title text-brand-dark lg:text-4xl">
          關於統一生機
        </h1>
        <p class="mt-4 max-w-2xl type-body text-gray-600">
          提供健康安心又便利的生機食品
        </p>
      </div>
    </section>

    <main class="mx-auto max-w-7xl px-4 pt-8 lg:px-8">
      <nav class="mb-10 flex flex-wrap items-center gap-x-1.5 gap-y-1 border-b border-gray-100 pb-8 text-sm text-gray-500">
        <router-link to="/" class="inline-flex items-center gap-1 whitespace-nowrap transition-colors hover:text-brand-primary" aria-label="返回首頁">
          <svg class="h-4 w-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 11.5L12 4l9 7.5M5.5 10.5V20h13v-9.5M9.5 20v-5.5h5V20" />
          </svg>
          <span>首頁</span>
        </router-link>
        <span class="inline-flex items-center gap-1.5 whitespace-nowrap text-gray-800">
          <span>›</span>
          關於我們
        </span>
      </nav>

      <section class="mx-auto max-w-5xl">
        <div class="mb-10">
          <h2 class="type-section-title border-l-4 border-brand-primary pl-4 text-brand-dark">
            統一生機 企業簡介
          </h2>
        </div>

        <div class="space-y-6 type-body text-gray-600">
          <p>
            統一生機成立於西元 1999 年，由「統一企業集團」100% 投資經營。二十多年前，統一企業集團已預見消費者追求健康及食品安全的需求，以及全球有機產業的巨大發展潛力，因此結合「統一企業」及「統一超商」兩大集團之研發、製造、流通等多項豐富資源，有遠見地成立統一生機開發股份有限公司，致力提供民眾更健康且安全無虞的飲食，希望為社會及環境帶來正面的影響力。
          </p>
          <p>
            隨著國人健康養生意識抬頭，統一生機本著健康、安心、少添加的理念，讓產品成分清楚揭露，並持續朝少添加、不添加的方向努力。從源頭把關、製程監控、品保檢驗、倉儲保鮮、物流配送、售後服務等，努力扮演好食安守門員的角色。
          </p>
          <p>
            透過知識行銷之傳遞，讓消費者了解飲食、健康、心靈、環境的重要，於享受美好的飲食中，更能體會對人類、對地球盡一份關愛的心力，同時使身、心、靈更為健康平衡。
          </p>
        </div>
      </section>

      <section class="mx-auto mt-14 max-w-5xl">
        <div class="grid gap-4 md:grid-cols-2">
          <div
            v-for="item in profileItems"
            :key="item.label"
            class="rounded-md border border-gray-200 bg-white p-6"
          >
            <p class="text-xs font-black tracking-[0.22em] text-brand-primary">{{ item.label }}</p>
            <p class="mt-3 text-base font-bold leading-8 text-brand-dark">{{ item.value }}</p>
          </div>
        </div>
      </section>

      <section class="mx-auto mt-16 max-w-5xl">
        <div class="mb-8">
          <h2 class="type-section-title border-l-4 border-brand-primary pl-4 text-brand-dark">
            企業標誌與色彩意義
          </h2>
        </div>
        <div class="grid gap-8 lg:grid-cols-[18rem_minmax(0,1fr)] lg:items-start">
          <div class="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
            <img :src="publicAsset('/logo.gif')" alt="統一生機標誌" class="mx-auto max-h-24 object-contain" />
          </div>
          <div class="space-y-5 type-body text-gray-600">
            <p>
              水平底座及墨綠色區塊象徵綠色大地，代表統一生機重視自然、健康、環保的企業精神。萌生的芽綠色葉子象徵生機盎然，代表統一生機以追求人體健康為根本，致力提供符合新鮮有機、安心無毒概念的優質商品與生活提案。
            </p>
            <p>
              上方半圓形紫紅色弧線象徵旭日東昇、朝氣蓬勃，代表統一生機希望跟消費者共創活力樂活的幸福人生。整個造型象徵圓滿、踏實、永續，以及充滿健康活力的每一天。
            </p>
            <div class="grid gap-3 sm:grid-cols-3">
              <div v-for="color in colorMeanings" :key="color.name" class="rounded-md border border-gray-100 bg-white p-4">
                <span class="block h-8 w-8 rounded-full" :style="{ backgroundColor: color.hex }"></span>
                <p class="mt-3 text-sm font-black text-brand-dark">{{ color.name }}</p>
                <p class="mt-1 text-xs font-medium leading-5 text-gray-500">{{ color.desc }}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="mx-auto mt-16 max-w-5xl">
        <div class="mb-8">
          <h2 class="type-section-title border-l-4 border-brand-primary pl-4 text-brand-dark">
            產品與通路
          </h2>
        </div>
        <div class="grid gap-5 md:grid-cols-2">
          <div
            v-for="item in channelHighlights"
            :key="item.title"
            class="rounded-md border border-gray-200 bg-white p-6"
          >
            <h3 class="type-card-title text-brand-dark">{{ item.title }}</h3>
            <p class="mt-3 type-body text-gray-600">{{ item.desc }}</p>
          </div>
        </div>
      </section>

      <section class="mx-auto mt-16 max-w-5xl">
        <div class="mb-8">
          <h2 class="type-section-title border-l-4 border-brand-primary pl-4 text-brand-dark">
            品質把關
          </h2>
        </div>
        <div class="space-y-4">
          <div
            v-for="(item, index) in qualityItems"
            :key="item"
            class="grid gap-4 rounded-md border border-gray-200 bg-white p-6 sm:grid-cols-[3rem_minmax(0,1fr)] sm:items-start"
          >
            <div class="flex h-12 w-12 items-center justify-center rounded-full bg-brand-primary text-lg font-black text-white">
              {{ index + 1 }}
            </div>
            <p class="type-body text-gray-600">{{ item }}</p>
          </div>
        </div>
      </section>

      <section class="mx-auto mt-16 max-w-5xl">
        <div class="mb-8">
          <h2 class="type-section-title border-l-4 border-brand-primary pl-4 text-brand-dark">
            服務時間
          </h2>
        </div>
        <div class="grid gap-5 md:grid-cols-2">
          <div
            v-for="item in serviceHours"
            :key="item.title"
            class="rounded-md border border-gray-200 bg-white p-6"
          >
            <p class="text-xs font-black tracking-[0.22em] text-brand-primary">{{ item.phone }}</p>
            <h3 class="mt-3 text-lg font-black text-brand-dark">{{ item.title }}</h3>
            <p class="mt-3 whitespace-pre-line type-body text-gray-600">{{ item.hours }}</p>
          </div>
        </div>
      </section>

      <section class="mx-auto mt-16 max-w-5xl border-t border-gray-100 pt-12">
        <div class="mb-8">
          <h2 class="type-section-title border-l-4 border-brand-primary pl-4 text-brand-dark">
            探索更多
          </h2>
        </div>
        <div class="grid grid-cols-1 gap-6 md:grid-cols-3">
          <router-link
            v-for="nav in brandNavs"
            :key="nav.to"
            :to="nav.to"
            class="group rounded-md border border-gray-200 bg-white p-6 transition-all hover:border-brand-primary hover:shadow-[0_4px_12px_rgba(0,0,0,0.03)]"
          >
            <h3 class="text-lg font-black text-brand-dark group-hover:text-brand-primary">{{ nav.label }}</h3>
            <p class="mt-3 type-body text-gray-500">{{ nav.desc }}</p>
          </router-link>
        </div>
      </section>
    </main>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { publicAssetPath } from '@/utils/public-path'

export default Vue.extend({
  name: 'AboutView',
  data() {
    return {
      aboutBannerImage: require('../../images/背景圖.png'),
      profileItems: [
        { label: '企業定位', value: '健康安心又便利的生機食品提供者。' },
        { label: '企業使命', value: '滿足顧客健康、養生的生機飲食需求，落實食安至上，並善盡良好社會公民之責任。' },
        { label: '企業願景', value: '成為台灣生機食品的領導品牌。' },
        { label: '企業文化', value: '簡單操作、誠信經營。' },
        { label: '企業核心價值', value: '健康、安心。' },
        { label: '經營理念', value: '致力成為最優質的生機飲食事業，為提升心靈享受、環境甦生、飲食健康而努力。' },
      ],
      colorMeanings: [
        { name: '墨綠色', hex: '#007135', desc: '代表對自然、健康、環保的重視。' },
        { name: '芽綠色', hex: '#75A633', desc: '代表以人體健康為本及提供新鮮有機、安心產品的堅持。' },
        { name: '紫紅色', hex: '#B41A8D', desc: '代表充滿朝氣，開創活力樂活的人生。' },
      ],
      channelHighlights: [
        {
          title: '多元生機商品',
          desc: '提供堅果果乾、五穀雜糧、調味品、海鹽、油品、冷凍食品、沖泡飲品及樂活零嘴等多元化商品，滿足家庭健康飲食所需。',
        },
        {
          title: '安心便利通路',
          desc: '提供安心又便利的宅配服務，並透過購物網站、客服、傳真訂購、特約店與各大主流通路，讓消費者隨時接觸樂活飲食。',
        },
      ],
      serviceHours: [
        {
          title: '免付費訂貨專線',
          phone: '0800-777-000',
          hours: '週一至週五 AM 8:00 - PM 18:00\n國定例假日 AM 8:30 - PM 17:30\n週六及週日休假',
        },
        {
          title: '愛用者服務專線',
          phone: '0800-880-988',
          hours: '週一至週五 AM 8:00 - PM 17:00',
        },
      ],
      qualityItems: [
        '堅果、果乾、穀物等大宗食材多來自各主要產地，全年穩定進櫃，原料採溫控保鮮，每批原料經檢驗合格，並定期送第三方公正單位進行多項檢驗。',
        '有機產品源頭皆符合有機法令，經有機驗證機構驗證合格；生機產品則以不添加、保留原始營養為方向，並符合相關食品衛生標準。',
        '透過統一生機購物網上的產品檢驗報告專區，發布品質檢驗報告資料，讓飲食的安心與保障做到有憑有證。',
      ],
      brandNavs: [
        { to: '/news', label: '最新消息', desc: '查看活動、公告、上架資訊與品牌動態。' },
        { to: '/stores', label: '特約店', desc: '尋找實體特約店與通路資訊。' },
        { to: '/contact', label: '聯絡我們', desc: '商品、訂單與服務問題可由客服協助。' },
      ],
    }
  },
  methods: {
    publicAsset(path: string): string {
      return publicAssetPath(path)
    },
  },
})
</script>
