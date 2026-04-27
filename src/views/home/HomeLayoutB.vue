<template>
  <div class="home-layout-b bg-white font-sans text-gray-800">
    <section class="section-white py-12 overflow-hidden">
      <div class="container mx-auto px-4 lg:px-8">
        <div class="grid grid-cols-12 gap-4">
          <router-link
            :to="heroMain.to"
            class="col-span-12 lg:col-span-8 relative rounded-2xl overflow-hidden h-[400px] lg:h-[500px] group shadow-sm hover:shadow-xl transition-shadow duration-500"
          >
            <img
              :src="heroMainVisual"
              :alt="heroMain.title"
              class="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 group-hover:rotate-1"
            />
            <div class="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent flex flex-col justify-center px-8 lg:px-12">
              <h1
                class="text-white text-4xl lg:text-5xl font-bold mb-4 leading-tight animate-fade-in-up"
                v-html="formatHeroTitle(heroMain.title)"
              ></h1>
              <p class="text-white text-base lg:text-lg mb-8 opacity-90 animate-fade-in-up delay-100 max-w-xl">
                {{ heroMain.subtitle }}
              </p>
              <span
                class="bg-[#E8A020] text-white px-8 py-3 rounded-full font-bold w-fit hover:bg-[#d48f1a] hover:-translate-y-1 active:scale-95 transition-all shadow-lg animate-fade-in-up delay-200"
              >
                {{ heroMain.cta }}
              </span>
            </div>
          </router-link>

          <div class="col-span-12 lg:col-span-4 flex flex-col gap-4">
            <router-link
              v-for="card in heroSideCards"
              :key="card.id"
              :to="card.to"
              class="relative h-[192px] lg:h-[242px] rounded-2xl overflow-hidden group cursor-pointer"
            >
              <span
                class="absolute top-0 right-0 text-white px-4 py-1 z-10 rounded-bl-xl font-bold shadow-md transform translate-x-1 -translate-y-1 rotate-3 group-hover:rotate-0 transition-transform"
                :class="card.badgeClass"
              >
                {{ card.badge }}
              </span>
              <img
                :src="card.visual"
                :alt="card.title"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div class="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors duration-500"></div>
              <div class="absolute inset-x-0 bottom-0 z-10 p-5 text-white">
                <p class="text-[10px] font-black tracking-[0.35em] text-[#E8A020]">{{ card.tag }}</p>
                <h2 class="mt-2 text-2xl font-black leading-tight" v-html="formatHeroTitle(card.title)"></h2>
                <p class="mt-2 text-sm text-white/85 line-clamp-2">{{ card.subtitle }}</p>
              </div>
            </router-link>
          </div>
        </div>
      </div>
    </section>

    <section class="section-beige py-12 bg-[#F7F5F0]">
      <div class="container mx-auto px-4 lg:px-8">
        <div class="bg-[#2D6A2D] rounded-t-2xl p-6 flex flex-col md:flex-row justify-between items-center shadow-lg relative overflow-hidden">
          <div class="flex items-center space-x-4 border-l-4 border-[#E8A020] pl-4 z-10">
            <h2 class="text-white text-2xl font-bold tracking-wider">⚡ 限時特價倒數</h2>
          </div>
          <div class="flex items-baseline space-x-2 mt-4 md:mt-0 z-10">
            <span class="text-white opacity-90 font-medium">剩餘時間</span>
            <span class="text-[#E8A020] text-4xl md:text-5xl font-black italic font-mono drop-shadow-md">{{ countdown }}</span>
          </div>
          <div class="absolute inset-0 opacity-10 bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,#fff_10px,#fff_20px)]"></div>
        </div>

        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mt-8">
          <router-link
            v-for="product in flashSaleProducts"
            :key="product.id"
            :to="productLink(product.id)"
            class="product-card group cursor-pointer"
          >
            <div class="relative bg-white rounded-xl p-4 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl border border-gray-100 h-full flex flex-col">
              <div class="absolute -top-3 -right-3 bg-red-500 text-white w-14 h-14 rounded-full flex items-center justify-center font-bold text-sm shadow-lg z-10 transform rotate-12 group-hover:scale-110 group-hover:-rotate-12 transition-all duration-300">
                -{{ discountPercent(product) }}%
              </div>
              <div class="overflow-hidden rounded-lg mb-4 bg-[#F7F5F0]">
                <img :src="product.image" :alt="product.name" class="w-full h-48 object-contain transform group-hover:scale-110 transition-transform duration-500" />
              </div>
              <div class="mb-2 flex flex-wrap gap-2">
                <span class="rounded-full bg-green-50 px-2.5 py-1 text-[10px] font-bold text-[#2D6A2D]">{{ tempZoneLabel(product.tempZone) }}</span>
                <span v-if="product.isOrganic" class="rounded-full bg-[#FFF6E2] px-2.5 py-1 text-[10px] font-bold text-[#B97A12]">有機認證</span>
              </div>
              <h3 class="font-bold text-gray-700 h-12 line-clamp-2 group-hover:text-[#2D6A2D] transition-colors">{{ product.name }}</h3>
              <div class="mt-auto pt-4">
                <span class="text-gray-400 line-through text-sm">{{ formatCurrency(product.originalPrice || product.price) }}</span>
                <div class="text-[#2D6A2D] font-black text-2xl">{{ formatCurrency(memberPrice(product)) }}</div>
              </div>
              <span class="w-full mt-4 bg-green-50 border border-[#2D6A2D] text-[#2D6A2D] py-2 rounded-lg text-center group-hover:bg-[#2D6A2D] group-hover:text-white group-hover:shadow-md active:scale-95 transition-all font-bold">
                🛒 加入購物車
              </span>
            </div>
          </router-link>
        </div>
      </div>
    </section>

    <section class="section-white py-12">
      <div class="container mx-auto px-4 lg:px-8">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <router-link
            v-for="product in featuredProducts"
            :key="product.id"
            :to="productLink(product.id)"
            class="product-card group cursor-pointer"
          >
            <div class="relative bg-white rounded-xl p-4 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl border border-gray-100 h-full flex flex-col">
              <div class="overflow-hidden rounded-lg mb-4 bg-[#F7F5F0]">
                <img :src="product.image" :alt="product.name" class="w-full h-48 object-contain transform group-hover:scale-110 transition-transform duration-500" />
              </div>
              <div class="mb-2 flex flex-wrap gap-2">
                <span class="rounded-full bg-green-50 px-2.5 py-1 text-[10px] font-bold text-[#2D6A2D]">{{ tempZoneLabel(product.tempZone) }}</span>
                <span v-if="product.tags.length" class="rounded-full bg-gray-100 px-2.5 py-1 text-[10px] font-bold text-gray-600">{{ product.tags[0] }}</span>
              </div>
              <h3 class="font-bold text-gray-700 h-12 line-clamp-2 group-hover:text-[#2D6A2D] transition-colors">{{ product.name }}</h3>
              <p class="mt-2 text-sm text-gray-400">{{ product.unit }}</p>
              <div class="mt-auto pt-4">
                <span class="text-gray-400 line-through text-sm">{{ formatCurrency(product.originalPrice || product.price) }}</span>
                <div class="text-[#2D6A2D] font-black text-2xl">{{ formatCurrency(memberPrice(product)) }}</div>
              </div>
            </div>
          </router-link>
        </div>
      </div>
    </section>

    <section class="section-white py-12">
      <div class="container mx-auto px-4 lg:px-8">
        <div class="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#1B4332] to-[#2D6A2D] p-8 md:p-12 shadow-2xl flex flex-col md:flex-row items-center justify-between group">
          <div class="z-10 text-center md:text-left flex flex-col md:flex-row items-center">
            <div class="text-6xl mr-0 md:mr-6 mb-4 md:mb-0 animate-bounce">🎁</div>
            <div>
              <h2 class="text-white text-3xl font-black tracking-wide mb-2">{{ giveawayBanner.title }}</h2>
              <p class="text-green-100 text-lg">
                {{ giveawayBanner.subtitle }}
              </p>
            </div>
          </div>
          <router-link
            :to="giveawayBanner.to"
            class="mt-8 md:mt-0 z-10 bg-[#E8A020] text-white px-10 py-4 rounded-full font-black text-lg hover:bg-[#FFB732] hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_rgba(232,160,32,0.4)]"
          >
            {{ giveawayBanner.cta }}
          </router-link>
          <div class="absolute -right-10 -bottom-10 w-64 h-64 bg-white opacity-10 rounded-full animate-float"></div>
          <div class="absolute right-40 -top-20 w-32 h-32 bg-[#E8A020] opacity-20 rounded-full animate-float" style="animation-delay: 1.5s;"></div>
        </div>
      </div>
    </section>

    <section class="section-beige py-12 bg-[#F7F5F0]">
      <div class="container mx-auto px-4 lg:px-8">
        <div class="flex items-center mb-8">
          <span class="text-3xl mr-3">👑</span>
          <h2 class="text-2xl font-black text-gray-800 border-b-4 border-[#E8A020] pb-1">本週人氣排行榜</h2>
        </div>

        <div class="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
          <router-link
            v-for="item in rankingItems"
            :key="item.rank"
            :to="item.to"
            class="flex items-center p-4 border-b border-gray-50 last:border-b-0 hover:bg-green-50 hover:translate-x-2 transition-all cursor-pointer group"
          >
            <div
              class="w-10 h-10 rounded-full flex items-center justify-center font-black text-white shadow-md mr-6 shrink-0 group-hover:scale-110 transition-transform"
              :class="rankBadgeClass(item.rank)"
            >
              {{ item.rank }}
            </div>

            <div class="overflow-hidden rounded-lg mr-6 border bg-white">
              <img :src="item.image" :alt="item.name" class="w-16 h-16 object-cover transform group-hover:scale-110 transition-transform duration-300" />
            </div>

            <div class="flex-grow min-w-0">
              <h4 class="font-bold text-gray-800 group-hover:text-[#2D6A2D] transition-colors truncate">{{ item.name }}</h4>
              <p class="text-sm text-gray-400 mt-1 flex items-center">
                🔥 本週銷量 <span class="font-bold text-gray-600 ml-1">{{ item.count.toLocaleString() }}</span>
              </p>
            </div>

            <div class="text-right flex flex-col items-end ml-4">
              <div class="text-[#2D6A2D] font-black text-xl">{{ formatCurrency(item.price) }}</div>
              <span class="text-xs bg-gray-100 text-gray-600 px-3 py-1.5 rounded-full mt-2 hover:bg-[#2D6A2D] hover:text-white active:scale-95 transition-all font-medium">
                ❤️ 快速收藏
              </span>
            </div>
          </router-link>
        </div>
      </div>
    </section>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { mockCategories, mockHomeLayouts, mockProducts } from '@/mock/data'
import { Product, TEMP_ZONE_LABEL, TempZone } from '@/types'

type HeroSideCard = {
  id: string
  tag: string
  title: string
  subtitle: string
  to: string
  visual: string
  badge: string
  badgeClass: string
}

type RankingItem = {
  rank: number
  name: string
  image: string
  count: number
  price: number
  to: string
}

export default Vue.extend({
  name: 'HomeLayoutB',
  data() {
    return {
      heroMain: mockHomeLayouts.b.heroMain,
      giveawayBanner: mockHomeLayouts.b.giveawayBanner,
      countdown: mockHomeLayouts.b.countdown,
    }
  },
  computed: {
    heroMainVisual(): string {
      return this.categoryPhoto('fresh')
    },
    heroSideCards(): HeroSideCard[] {
      return mockHomeLayouts.b.heroSides.map((card, index) => ({
        id: card.id,
        tag: card.tag,
        title: card.title,
        subtitle: card.subtitle,
        to: card.to,
        visual: this.categoryPhoto(index === 0 ? 'frozen' : 'pantry'),
        badge: index === 0 ? '限時特價' : '新品上市',
        badgeClass: index === 0 ? 'bg-red-600' : 'bg-[#2D6A2D]',
      }))
    },
    flashSaleProducts(): Product[] {
      return mockHomeLayouts.b.flashSaleProductIds
        .map((id) => mockProducts.find((product) => product.id === id))
        .filter(Boolean) as Product[]
    },
    featuredProducts(): Product[] {
      return mockProducts.slice(0, 5)
    },
    rankingItems(): RankingItem[] {
      return mockHomeLayouts.b.ranking.slice(0, 10).map((item) => {
        const product = mockProducts.find((entry) => entry.id === item.productId)
        return {
          rank: item.rank,
          name: product?.name || '人氣商品',
          image: product?.image || '',
          count: item.count,
          price: product ? this.memberPrice(product) : 0,
          to: product ? this.productLink(product.id) : '/products',
        }
      })
    },
  },
  methods: {
    categoryPhoto(categoryId: string): string {
      return mockCategories.find((category) => category.id === categoryId)?.icon || mockCategories[0].icon
    },
    formatHeroTitle(title: string): string {
      return title.replace(/\n/g, '<br />')
    },
    memberPrice(product: Product): number {
      return product.memberPrice || product.price
    },
    discountPercent(product: Product): number {
      const original = product.originalPrice || product.price
      const sale = this.memberPrice(product)
      if (!original || sale >= original) return 0
      return Math.round(((original - sale) / original) * 100)
    },
    productLink(productId: string): string {
      return `/products/${productId}`
    },
    formatCurrency(value: number): string {
      return `NT$${Math.round(value).toLocaleString()}`
    },
    tempZoneLabel(zone: TempZone): string {
      return TEMP_ZONE_LABEL[zone]
    },
    rankBadgeClass(rank: number): string {
      if (rank === 1) return 'bg-[#FFD700] shadow-[0_0_10px_rgba(255,215,0,0.6)]'
      if (rank === 2) return 'bg-[#C0C0C0] shadow-[0_0_10px_rgba(192,192,192,0.6)]'
      if (rank === 3) return 'bg-[#CD7F32] shadow-[0_0_10px_rgba(205,127,50,0.6)]'
      return 'bg-[#2D6A2D]'
    },
  },
})
</script>

<style scoped>
.section-white,
.section-beige {
  position: relative;
}

.product-card {
  perspective: 1000px;
}

img {
  max-width: 100%;
  height: auto;
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0) scale(1);
  }

  50% {
    transform: translateY(-20px) scale(1.05);
  }
}

.animate-float {
  animation: float 6s ease-in-out infinite;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in-up {
  animation: fadeInUp 0.8s ease-out forwards;
}

.delay-100 {
  animation-delay: 100ms;
}

.delay-200 {
  animation-delay: 200ms;
}

@media (max-width: 768px) {
  .section-white,
  .section-beige {
    padding-top: 2rem;
    padding-bottom: 2rem;
  }
}
</style>
