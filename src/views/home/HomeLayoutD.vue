<template>
  <div class="home-layout-d font-sans text-gray-800 bg-white">
    <section class="relative w-full h-[60vh] md:h-[600px] flex items-center justify-center overflow-hidden">
      <img :src="heroVisual" :alt="hero.title" class="absolute inset-0 w-full h-full object-cover" />
      <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>

      <div class="relative z-10 text-center px-4 flex flex-col items-center mt-12 md:mt-24">
        <div class="mb-4 rounded-full bg-white/15 px-4 py-1 text-white text-xs font-bold tracking-[0.3em] backdrop-blur">
          {{ hero.tag }}
        </div>
        <h1 class="max-w-5xl text-4xl md:text-[52px] font-bold text-white mb-4 tracking-[0.08em] leading-[1.15] md:leading-[1.18] shadow-sm" v-html="formatHeroTitle(hero.title)"></h1>
        <p class="text-lg md:text-xl text-white/95 mb-8 font-medium">
          {{ hero.subtitle }}
        </p>
        <router-link
          :to="hero.to"
          class="bg-white text-[#4CAF50] px-8 py-3 rounded-full font-bold text-lg hover:bg-[#4CAF50] hover:text-white transition-colors duration-300 shadow-lg"
        >
          {{ hero.cta }}
        </router-link>
      </div>
    </section>

    <section class="py-16 px-4 max-w-7xl mx-auto bg-white">
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        <router-link
          v-for="(cat, index) in tempCategories"
          :key="cat.id"
          :to="cat.to"
          class="group flex h-full flex-col justify-between rounded-[1.5rem] border border-gray-100 bg-white p-5 md:p-6 shadow-[0_12px_30px_rgba(15,23,42,0.06)] transition-all duration-300 hover:-translate-y-[6px] hover:shadow-[0_18px_38px_rgba(15,23,42,0.12)]"
          :style="{ borderTop: `4px solid ${cat.color}` }"
        >
          <div class="mb-6 flex items-start justify-between gap-4">
            <div class="min-w-0">
              <p class="mb-2 text-[11px] font-bold uppercase tracking-[0.24em]" :style="{ color: cat.color }">{{ cat.eyebrow }}</p>
              <h3 class="text-[28px] font-black leading-none text-gray-800 md:text-[32px]">{{ cat.name }}</h3>
              <p class="mt-3 text-sm leading-6 text-gray-500">{{ cat.desc }}</p>
            </div>
            <div
              class="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl shadow-sm"
              :style="{ backgroundColor: cat.softColor, color: cat.color }"
            >
              <svg v-if="cat.iconKey === 'ambient'" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M4 7.5h16M6 7.5l1.2 11h9.6L18 7.5M9 11v4.5M12 11v4.5M15 11v4.5M9 7.5V6a1 1 0 011-1h4a1 1 0 011 1v1.5" />
              </svg>
              <svg v-else-if="cat.iconKey === 'chilled'" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M12 3v18M8.5 6.5L12 10l3.5-3.5M8.5 17.5L12 14l3.5 3.5M4 12h16M6.5 8.5L10 12l-3.5 3.5M17.5 8.5L14 12l3.5 3.5" />
              </svg>
              <svg v-else-if="cat.iconKey === 'frozen'" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M12 2.5v19M7.5 5.5L12 10l4.5-4.5M7.5 18.5L12 14l4.5 4.5M3.5 12h17M6.5 8.5L10 12l-3.5 3.5M17.5 8.5L14 12l3.5 3.5" />
              </svg>
              <svg v-else class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M9 17l6-5-6-5v10zm10-5A7 7 0 115 12" />
              </svg>
            </div>
          </div>
          <div class="mt-auto flex items-center justify-between rounded-full bg-gray-50 px-4 py-3 text-sm font-bold" :style="{ color: cat.color }">
            <span>{{ cat.cta }}</span>
            <svg class="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
            </svg>
          </div>
        </router-link>
      </div>
    </section>

    <section class="py-16 px-4 bg-[#F7F5F0]">
      <div class="max-w-7xl mx-auto">
        <div class="flex justify-between items-end mb-8">
          <div class="flex items-center gap-3">
            <div class="w-1 h-8 bg-[#4CAF50] rounded-sm"></div>
            <h2 class="text-2xl font-bold text-[#4CAF50]">今日嚴選</h2>
          </div>
          <router-link :to="storyBanner.to" class="text-[#4CAF50] hover:text-green-700 font-medium flex items-center gap-1 text-sm md:text-base">
            看見產地資訊
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
            </svg>
          </router-link>
        </div>

        <div class="flex flex-col md:flex-row gap-6 md:gap-8">
          <div class="w-full md:w-[45%] relative rounded-2xl overflow-hidden group">
            <img :src="todayPick.image" :alt="todayPick.title" class="w-full h-[300px] md:h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
            <div class="absolute top-4 left-4 bg-[#4CAF50] text-white px-3 py-1 rounded-md text-sm font-bold tracking-wider">
              今日嚴選
            </div>
            <div class="absolute top-0 right-0 bg-[#E8A020] text-white px-4 py-1.5 rounded-bl-xl font-bold text-sm shadow-md">
              產地直送
            </div>
            <div class="absolute bottom-6 left-6 text-white">
              <p class="text-sm opacity-90 mb-1">ORIGIN STORY</p>
              <h3 class="text-2xl font-bold mb-2">看得到產地的健康</h3>
              <p class="text-white/80 text-sm">讓每一口都吃得安心無負擔</p>
            </div>
          </div>

          <div class="w-full md:w-[55%] flex flex-col gap-4">
            <div
              v-for="item in todayPickItems"
              :key="item.id"
              class="flex gap-4 p-4 bg-white rounded-xl hover:-translate-y-1 hover:shadow-md transition-all duration-300 border border-transparent hover:border-green-100"
            >
              <div class="w-24 h-24 md:w-32 md:h-32 flex-shrink-0 rounded-lg overflow-hidden relative">
                <img :src="item.image" :alt="item.name" class="w-full h-full object-cover" />
                <div v-if="item.origin" class="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-[10px] text-center py-0.5">
                  {{ item.origin }}
                </div>
              </div>
              <div class="flex flex-col justify-between flex-grow py-1">
                <div>
                  <h4 class="font-bold text-gray-800 text-base md:text-lg">{{ item.name }}</h4>
                  <p class="text-xs text-gray-500 mt-1 line-clamp-2">{{ item.description }}</p>
                </div>
                <div class="flex items-end justify-between mt-2 gap-4">
                  <div>
                    <span class="text-xs text-gray-400 line-through mr-2" v-if="item.originalPrice">${{ item.originalPrice }}</span>
                    <span class="text-lg font-bold text-[#E8A020]">${{ memberPrice(item) }}</span>
                  </div>
                  <button class="bg-[#4CAF50] hover:bg-green-600 text-white px-4 py-1.5 rounded text-sm font-medium transition-colors">
                    加入購物車
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="py-16 px-4 bg-white max-w-7xl mx-auto">
      <div class="flex justify-between items-end mb-8">
        <div class="flex items-center gap-3">
          <div class="w-1 h-8 bg-[#4CAF50] rounded-sm"></div>
          <h2 class="text-2xl font-bold text-[#4CAF50] flex items-center gap-2">
            <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M12 3.586a4 4 0 011.172 2.828V8h-1.586A4 4 0 018.758 6.828l-2.586-2.586a2 2 0 012.828-2.828l2.586 2.586zM4.686 15.314a2 2 0 11-2.828-2.828l6.586-6.586a4 4 0 012.828-1.172h1.586v1.586a4 4 0 01-1.172 2.828l-6.586 6.586z" clip-rule="evenodd"></path>
            </svg>
            當季商品
          </h2>
        </div>
      </div>

      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        <router-link
          v-for="item in seasonalProducts"
          :key="item.id"
          :to="`/products/${item.id}`"
          class="group bg-white rounded-xl overflow-hidden border border-gray-100 hover:shadow-lg transition-all duration-300 relative"
        >
          <div v-if="seasonalTag(item)" class="absolute top-2 left-2 bg-[#E8A020]/90 text-white text-xs font-bold px-2 py-1 rounded z-10 backdrop-blur-sm">
            {{ seasonalTag(item) }}
          </div>
          <div class="w-full h-[160px] md:h-[200px] overflow-hidden">
            <img :src="item.image" :alt="item.name" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
          </div>
          <div class="p-4 flex flex-col gap-2">
            <h4 class="font-bold text-gray-800">{{ item.name }}</h4>
            <div class="flex items-center gap-2">
              <span class="text-sm text-gray-400 line-through" v-if="item.originalPrice">${{ item.originalPrice }}</span>
              <span class="text-lg font-bold text-[#E8A020]">${{ memberPrice(item) }}</span>
            </div>
            <button class="w-full mt-2 border border-[#4CAF50] text-[#4CAF50] hover:bg-[#4CAF50] hover:text-white py-1.5 rounded transition-colors text-sm font-medium">
              加入購物車
            </button>
          </div>
        </router-link>
      </div>
    </section>

    <section class="py-16 px-4 bg-[#E8F5E8] overflow-hidden">
      <div class="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-10 md:gap-16">
        <div class="w-full md:w-1/2 relative z-10 pl-4 md:pl-8">
          <div class="absolute -top-10 -left-4 md:-left-8 text-[120px] text-[#4CAF50]/10 font-serif leading-none select-none">“</div>
          <p class="text-sm font-bold text-[#4CAF50] mb-2 tracking-widest uppercase">Brand Story</p>
          <h2 class="text-3xl md:text-4xl font-bold text-[#4CAF50] mb-6 leading-tight" v-html="formatHeroTitle(storyBanner.title)"></h2>
          <p class="text-gray-600 mb-8 leading-relaxed text-lg">
            {{ storyBanner.subtitle }}
          </p>
          <router-link :to="storyBanner.to" class="bg-[#4CAF50] text-white px-8 py-3 rounded-full hover:bg-green-700 transition-colors duration-300 font-bold shadow-md hover:shadow-lg">
            {{ storyBanner.cta }}
          </router-link>
        </div>
        <div class="w-full md:w-1/2 relative">
          <img :src="storyBanner.image" :alt="storyBanner.title" class="w-full h-auto rounded-2xl shadow-xl z-10 relative" />
          <div class="absolute -bottom-6 -right-6 w-3/4 h-3/4 bg-[#C8E6C9] rounded-2xl -z-10"></div>
        </div>
      </div>
    </section>

    <section class="py-16 px-4 bg-[#F7F5F0]">
      <div class="max-w-7xl mx-auto">
        <div class="flex justify-between items-end mb-8">
          <div class="flex items-center gap-3">
            <div class="w-1 h-8 bg-[#4CAF50] rounded-sm"></div>
            <div>
              <p class="text-xs text-gray-500 font-bold tracking-widest uppercase mb-1">Bundle</p>
              <h2 class="text-2xl font-bold text-[#4CAF50]">組合購專區</h2>
            </div>
          </div>
          <router-link to="/combo/FAMILY-SET" class="text-[#4CAF50] hover:text-green-700 font-medium flex items-center gap-1 text-sm md:text-base">
            查看全部
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
            </svg>
          </router-link>
        </div>

        <div class="flex overflow-x-auto snap-x snap-mandatory gap-4 md:gap-6 pb-6 hide-scrollbar">
          <router-link
            v-for="item in bundles"
            :key="item.id"
            :to="item.to"
            class="min-w-[280px] md:min-w-[320px] snap-start bg-white rounded-xl p-4 border border-gray-100 hover:shadow-lg transition-shadow duration-300 relative group cursor-pointer"
          >
            <div class="absolute top-3 right-3 bg-[#E8A020] text-white text-xs font-bold px-2 py-1 rounded-full z-10 shadow-sm">
              省 ${{ item.savedPrice }}
            </div>

            <div class="w-full h-[180px] rounded-lg overflow-hidden mb-4 bg-gray-50">
              <img :src="item.image" :alt="item.title" class="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform" />
            </div>
            <div class="text-xs text-[#4CAF50] font-bold mb-1 border border-[#4CAF50] inline-block px-2 py-0.5 rounded text-center">
              共 {{ item.itemCount }} 件商品
            </div>
            <h4 class="font-bold text-gray-800 text-lg mb-2">{{ item.title }}</h4>
            <p class="text-sm text-gray-500 mb-4 line-clamp-1">{{ item.subtitle }}</p>
            <div class="flex justify-between items-center mt-auto border-t border-gray-50 pt-3">
              <div>
                <span class="text-sm text-gray-400 line-through mr-1">${{ item.originalPrice }}</span>
                <span class="text-xl font-bold text-red-500">${{ item.price }}</span>
              </div>
              <div class="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-[#4CAF50] group-hover:text-white transition-colors">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                </svg>
              </div>
            </div>
          </router-link>
        </div>
      </div>
    </section>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { mockHomeLayouts, mockProducts } from '@/mock/data'
import { Product } from '@/types'

type TempCategoryCard = {
  id: string
  name: string
  desc: string
  color: string
  softColor: string
  iconKey: 'ambient' | 'chilled' | 'frozen' | 'fresh'
  eyebrow: string
  cta: string
  to: string
}

type BundleCard = {
  id: string
  title: string
  subtitle: string
  image: string
  to: string
  itemCount: number
  price: number
  originalPrice: number
  savedPrice: number
}

export default Vue.extend({
  name: 'HomeLayoutD',
  computed: {
    hero() {
      return mockHomeLayouts.d.hero
    },
    heroVisual(): string {
      return this.hero.image
    },
    tempCategories(): TempCategoryCard[] {
      const styles = [
        { color: '#8BC34A', softColor: '#F3F9EC', iconKey: 'ambient', eyebrow: 'Ambient', cta: '前往常溫區' },
        { color: '#29B6F6', softColor: '#EFF9FE', iconKey: 'chilled', eyebrow: 'Chilled', cta: '前往冷藏區' },
        { color: '#5C6BC0', softColor: '#F1F2FB', iconKey: 'frozen', eyebrow: 'Frozen', cta: '前往冷凍區' },
        { color: '#E8A020', softColor: '#FFF7E8', iconKey: 'fresh', eyebrow: 'Fresh Route', cta: '前往直送區' },
      ]

      return mockHomeLayouts.d.tempZoneCards.map((card, index) => ({
        id: card.id,
        name: card.label,
        desc: card.subtitle,
        to: card.to,
        color: styles[index]?.color || '#4CAF50',
        softColor: styles[index]?.softColor || '#F1F5F9',
        iconKey: (styles[index]?.iconKey as TempCategoryCard['iconKey']) || 'ambient',
        eyebrow: styles[index]?.eyebrow || 'Category',
        cta: styles[index]?.cta || '查看商品',
      }))
    },
    todayPick() {
      return mockHomeLayouts.d.todayPick
    },
    todayPickItems(): Product[] {
      return mockHomeLayouts.d.todayPickIds
        .map((id) => mockProducts.find((product) => product.id === id))
        .filter(Boolean) as Product[]
    },
    seasonalProducts(): Product[] {
      return mockProducts.slice(0, 4)
    },
    storyBanner() {
      return mockHomeLayouts.d.storyBanner
    },
    bundles(): BundleCard[] {
      return mockHomeLayouts.d.comboCards.map((card, index) => {
        const price = [899, 499, 699][index] || 599
        const originalPrice = [1080, 620, 820][index] || 760
        return {
          id: card.id,
          title: card.title,
          subtitle: card.subtitle,
          image: card.image,
          to: card.to,
          itemCount: [6, 4, 5][index] || 4,
          price,
          originalPrice,
          savedPrice: originalPrice - price,
        }
      })
    },
  },
  methods: {
    formatHeroTitle(title: string): string {
      return title.replace(/\n/g, '<br>')
    },
    memberPrice(product: Product): number {
      return product.memberPrice || product.price
    },
    seasonalTag(product: Product): string {
      if (product.tags && product.tags.length) return product.tags[0]
      if (product.isOrganic) return '有機認證'
      return ''
    },
  },
})
</script>

<style scoped>
.hide-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.hide-scrollbar::-webkit-scrollbar {
  display: none;
}

.tracking-widest {
  letter-spacing: 0.1em;
}
</style>
