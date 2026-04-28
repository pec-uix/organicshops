<template>
  <div class="min-h-screen bg-[#F7F5F0]">
    <section class="mx-auto max-w-7xl px-4 py-6 md:py-8">
      <div class="layout-a-hero relative overflow-hidden rounded-[2rem] bg-white shadow-[0_20px_60px_rgba(45,106,45,0.12)]">
        <transition name="layout-a-fade" mode="out-in">
          <div :key="currentHero.id" class="absolute inset-0">
            <img :src="currentHero.image" :alt="currentHero.title" class="h-full w-full object-cover" />
            <div class="absolute inset-0 bg-gradient-to-r from-[#2D6A2D]/70 via-[#2D6A2D]/35 to-transparent"></div>
            <div class="absolute inset-0 flex items-center">
              <div class="max-w-2xl px-6 py-10 text-white md:px-12">
                <div class="mb-4 inline-flex rounded-full bg-[#E8A020] px-4 py-1 text-[10px] font-black tracking-[0.35em] text-white">
                  {{ currentHero.tag }}
                </div>
                <h1 class="text-3xl font-black leading-tight tracking-wider md:text-5xl" v-html="currentHero.title"></h1>
                <p class="mt-4 max-w-lg text-sm leading-7 text-white/90 md:text-base">
                  {{ currentHero.subtitle }}
                </p>
                <router-link
                  :to="currentHero.to"
                  class="mt-8 inline-flex items-center rounded-xl bg-white px-6 py-3 text-xs font-black tracking-[0.25em] text-[#2D6A2D] shadow-lg transition-transform hover:scale-[1.02]"
                >
                  {{ currentHero.cta }}
                </router-link>
              </div>
            </div>
          </div>
        </transition>

        <button
          type="button"
          aria-label="上一張"
          class="absolute left-4 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-[#2D6A2D] shadow-lg transition hover:bg-white"
          @click="prevHeroSlide"
        >
          ‹
        </button>
        <button
          type="button"
          aria-label="下一張"
          class="absolute right-4 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-[#2D6A2D] shadow-lg transition hover:bg-white"
          @click="nextHeroSlide"
        >
          ›
        </button>

        <div class="absolute bottom-4 left-0 right-0 z-20 flex justify-center gap-2">
          <button
            v-for="(slide, index) in heroSlides"
            :key="slide.id"
            type="button"
            class="h-2.5 rounded-full transition-all duration-300"
            :class="index === currentHeroIndex ? 'w-8 bg-white shadow-md' : 'w-2.5 bg-white/50 hover:bg-white/80'"
            :aria-label="`切換到第 ${index + 1} 張`"
            @click="goToHeroSlide(index)"
          />
        </div>
      </div>
    </section>

    <section class="mx-auto max-w-7xl px-4 py-4 md:py-6">
      <div class="grid layout-a-temp-zone gap-4">
        <router-link
          v-for="zone in tempZones"
          :key="zone.key"
          :to="zone.to"
          class="rounded-2xl border border-white bg-white px-5 py-4 shadow-sm transition-transform hover:-translate-y-0.5"
        >
          <p class="text-sm font-black tracking-widest text-[#2D6A2D]">{{ zone.label }}</p>
          <p class="mt-2 text-sm text-[#1F2937]">{{ zone.note }}</p>
        </router-link>
      </div>
    </section>

    <section class="mx-auto max-w-7xl px-4 py-4 md:py-6">
      <div class="flex gap-4 overflow-x-auto pb-2">
        <router-link
          v-for="cat in categories"
          :key="cat.id"
          :to="`/category/${cat.id}`"
          class="flex min-w-[88px] flex-col items-center gap-2 rounded-2xl bg-white p-3 shadow-sm transition hover:-translate-y-0.5"
        >
          <div class="h-14 w-14 overflow-hidden rounded-full border border-[#E8A020]/20 bg-[#F7F5F0]">
            <img :src="cat.icon" :alt="cat.name" class="h-full w-full object-cover" />
          </div>
          <span class="text-center text-xs font-bold tracking-widest text-[#1F2937]">{{ cat.name }}</span>
        </router-link>
      </div>
    </section>

    <section class="mx-auto max-w-7xl px-4 py-4 md:py-6">
      <div class="mb-6 flex items-end justify-between gap-4">
        <div>
          <p class="text-[10px] font-black tracking-[0.35em] text-[#2D6A2D]">FEATURED PICKS</p>
          <h2 class="mt-2 text-2xl font-black tracking-widest text-[#1F2937]">精選商品</h2>
        </div>
        <router-link to="/products" class="text-xs font-black tracking-[0.25em] text-[#E8A020]">
          查看全部
        </router-link>
      </div>
      <div class="layout-a-grid gap-4">
        <ProductCard v-for="product in featuredProducts" :key="product.id" :product="product" />
      </div>
    </section>

    <section class="bg-white">
      <div class="mx-auto max-w-7xl px-4 py-6 md:py-8">
        <div class="grid gap-6 md:grid-cols-[1.2fr_1fr]">
          <div class="overflow-hidden rounded-[2rem] border border-[#2D6A2D]/10 bg-[#F7F5F0] shadow-sm">
            <div class="relative h-64 md:h-72">
              <img :src="comboBanner.image" :alt="comboBanner.title" class="h-full w-full object-cover" />
              <div class="absolute inset-0 bg-gradient-to-r from-[#2D6A2D]/60 via-[#2D6A2D]/25 to-transparent"></div>
              <div class="absolute inset-0 flex flex-col justify-center px-8 text-white">
                <p class="text-[10px] font-black tracking-[0.35em] text-[#E8A020]">{{ comboBanner.tag }}</p>
                <h3 class="mt-3 text-3xl font-black leading-tight tracking-widest" v-html="comboBanner.title"></h3>
                <p class="mt-3 max-w-lg text-sm leading-7 text-white/90">{{ comboBanner.subtitle }}</p>
                <router-link :to="comboBanner.to" class="mt-6 w-fit rounded-xl bg-white px-6 py-3 text-xs font-black tracking-[0.25em] text-[#2D6A2D]">
                  {{ comboBanner.cta }}
                </router-link>
              </div>
            </div>
          </div>
          <div class="grid gap-4">
            <router-link
              v-for="card in comboCards"
              :key="card.id"
              :to="card.to"
              class="overflow-hidden rounded-2xl border border-[#2D6A2D]/10 bg-white shadow-sm transition hover:-translate-y-0.5"
            >
              <div class="flex h-full items-center gap-4 p-4">
                <div class="h-20 w-20 overflow-hidden rounded-2xl bg-[#F7F5F0]">
                  <img :src="card.image" :alt="card.title" class="h-full w-full object-cover" />
                </div>
                <div>
                  <p class="text-[10px] font-black tracking-[0.35em] text-[#2D6A2D]">組合購專區</p>
                  <h3 class="mt-1 text-lg font-black text-[#1F2937]">{{ card.title }}</h3>
                  <p class="mt-2 text-sm text-[#1F2937]/70">{{ card.subtitle }}</p>
                </div>
              </div>
            </router-link>
          </div>
        </div>
      </div>
    </section>

    <section class="bg-[#F7F5F0]">
      <div class="mx-auto max-w-7xl px-4 py-6 md:py-8">
        <div class="overflow-hidden rounded-[2rem] border border-[#2D6A2D]/10 bg-white shadow-sm">
          <div class="grid gap-0 md:grid-cols-[1fr_1.2fr]">
            <div class="flex flex-col justify-center p-8 md:p-10">
              <p class="text-[10px] font-black tracking-[0.35em] text-[#E8A020]">{{ opBanner.tag }}</p>
              <h3 class="mt-3 text-3xl font-black leading-tight tracking-widest text-[#1F2937]" v-html="opBanner.title"></h3>
              <p class="mt-4 text-sm leading-7 text-[#1F2937]/70">{{ opBanner.subtitle }}</p>
              <router-link :to="opBanner.to" class="mt-6 w-fit rounded-xl bg-[#2D6A2D] px-6 py-3 text-xs font-black tracking-[0.25em] text-white">
                {{ opBanner.cta }}
              </router-link>
            </div>
            <div class="min-h-[220px] md:min-h-[280px]">
              <img :src="opBanner.image" :alt="opBanner.title" class="h-full w-full object-cover" />
            </div>
          </div>
        </div>
      </div>
    </section>

  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import ProductCard from '@/components/product/ProductCard.vue'
import { mockCategories, mockHomeLayouts, mockProducts } from '@/mock/data'
import { Product, Category } from '@/types'

export default Vue.extend({
  name: 'HomeLayoutA',
  components: { ProductCard },
  data() {
    return {
      heroSlides: mockHomeLayouts.a.heroSlides,
      currentHeroIndex: 0,
      heroTimer: null as number | null,
      tempZones: mockHomeLayouts.a.tempZones,
      comboBanner: {
        tag: 'Bundle Offer',
        title: '家庭常備箱\n一次備齊一週餐桌',
        subtitle: '精選生鮮、雜糧與人氣商品，適合第一次選購或固定補貨。',
        image: `${process.env.BASE_URL || '/'}site-assets/breakfast.png`,
        cta: '查看組合商品',
        to: '/combo/FAMILY-SET',
      },
      comboCards: mockHomeLayouts.a.comboCards,
      opBanner: mockHomeLayouts.a.opBanner,
    }
  },
  computed: {
    categories(): Category[] {
      return mockCategories.slice(0, 7)
    },
    featuredProducts(): Product[] {
      return mockHomeLayouts.a.featuredProductIds
        .map((id) => mockProducts.find((product) => product.id === id))
        .filter(Boolean) as Product[]
    },
    currentHero(): { id: string; tag: string; title: string; subtitle: string; image: string; cta: string; to: string } {
      return this.heroSlides[this.currentHeroIndex]
    },
  },
  mounted() {
    this.startHeroTimer()
  },
  beforeDestroy() {
    if (this.heroTimer) window.clearInterval(this.heroTimer)
  },
  methods: {
    startHeroTimer() {
      if (this.heroTimer) window.clearInterval(this.heroTimer)
      this.heroTimer = window.setInterval(() => {
        this.nextHeroSlide()
      }, 5000)
    },
    nextHeroSlide() {
      this.currentHeroIndex = (this.currentHeroIndex + 1) % this.heroSlides.length
      this.startHeroTimer()
    },
    prevHeroSlide() {
      this.currentHeroIndex = (this.currentHeroIndex - 1 + this.heroSlides.length) % this.heroSlides.length
      this.startHeroTimer()
    },
    goToHeroSlide(index: number) {
      this.currentHeroIndex = index
      this.startHeroTimer()
    },
  },
})
</script>

<style scoped>
.layout-a-hero {
  height: 600px;
}

.layout-a-temp-zone {
  grid-template-columns: repeat(4, minmax(0, 1fr));
}

.layout-a-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
}

@media (max-width: 1279px) {
  .layout-a-hero {
    height: 420px;
  }

  .layout-a-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 767px) {
  .layout-a-hero {
    height: 60vh;
  }

  .layout-a-temp-zone {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .layout-a-grid {
    grid-template-columns: 1fr;
  }
}

.layout-a-fade-enter-active,
.layout-a-fade-leave-active {
  transition: opacity 0.45s ease, transform 0.45s ease;
}

.layout-a-fade-enter,
.layout-a-fade-leave-to {
  opacity: 0;
  transform: scale(0.99);
}
</style>
