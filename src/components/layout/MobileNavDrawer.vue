<template>
  <transition name="drawer">
    <div v-if="isOpen" class="fixed inset-0 z-[100] lg:hidden">
      <!-- Backdrop -->
      <div class="absolute inset-0 bg-brand-dark/50 backdrop-blur-sm transition-opacity" @click="close"></div>
      
      <!-- Drawer Content -->
      <div class="absolute inset-y-0 left-0 w-[85%] max-w-sm bg-white shadow-2xl flex flex-col transform transition-transform duration-300">
        <!-- Header: Refined Branding -->
        <div class="px-6 py-6 border-b border-gray-100 flex items-center justify-between bg-brand-surface/20">
          <div class="flex flex-col">
            <span class="font-black text-brand-primary text-xl tracking-tighter italic leading-none">統一生機</span>
            <span class="text-[8px] font-bold text-gray-400 tracking-[0.3em] uppercase mt-1.5">Organic Life</span>
          </div>
          <button @click="close" class="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-brand-primary active:scale-90 transition-all">
            <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div class="flex-1 overflow-y-auto scrollbar-hide">
          <!-- 1. User Profile: Enhanced Spacing -->
          <div class="p-8 border-b border-gray-50">
            <div v-if="isLoggedIn" class="flex items-center gap-5">
              <div class="w-14 h-14 rounded-full bg-brand-primary text-white flex items-center justify-center font-black text-xl shadow-lg shadow-brand-primary/20 border-2 border-white">
                {{ nameInitial }}
              </div>
              <div class="min-w-0">
                <p class="text-base font-black text-gray-800 truncate">{{ userName }}</p>
                <p class="text-[10px] text-brand-primary font-bold uppercase tracking-widest mt-1">Premium Member</p>
              </div>
            </div>
            <div v-else class="text-center py-2">
              <h3 class="text-lg font-black text-gray-800 mb-4 tracking-tight">開啟您的有機生活</h3>
              <router-link to="/login" @click.native="close" class="w-full block bg-brand-primary text-white py-3.5 rounded-md text-xs font-black shadow-lg shadow-brand-primary/20 tracking-[0.2em] uppercase transition-transform active:scale-95">
                立即登入 / 註冊
              </router-link>
            </div>
          </div>

          <!-- 2. Core Navigation: Grouped & Spaced -->
          <div class="py-6">
            <p class="px-8 text-[10px] font-black text-gray-300 uppercase tracking-[0.3em] mb-4">線上購物 Collections</p>
            <nav class="space-y-1">
              <router-link
                v-for="cat in categories"
                :key="cat.id"
                :to="`/category/${cat.id}`"
                class="flex items-center justify-between px-8 py-4 group active:bg-brand-surface transition-colors"
                @click.native="close"
              >
                <div class="flex items-center gap-5">
                  <div class="h-10 w-10 overflow-hidden rounded-full border border-gray-100 bg-white shadow-sm">
                    <img v-if="isImageUrl(cat.icon)" :src="cat.icon" :alt="cat.name" class="h-full w-full object-cover" />
                    <span v-else class="flex h-full w-full items-center justify-center text-2xl opacity-80 group-hover:scale-110 transition-transform">{{ cat.icon }}</span>
                  </div>
                  <span class="text-sm font-bold text-gray-700 tracking-[0.1em] group-hover:text-brand-primary transition-colors">{{ cat.name }}</span>
                </div>
                <svg class="w-4 h-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7" /></svg>
              </router-link>
            </nav>
          </div>

          <!-- 3. Specialized Zones -->
          <div class="px-8 py-8 bg-brand-surface/30">
            <p class="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-5 text-center">專屬優惠專區</p>
            <div class="grid grid-cols-2 gap-4">
              <router-link to="/op-exchange" @click.native="close" class="bg-white p-5 rounded-md border border-brand-primary/10 flex flex-col items-center text-center shadow-sm hover:shadow-md transition-all active:scale-95">
                <span class="text-2xl mb-2">💰</span>
                <span class="text-[10px] font-black text-gray-800 tracking-widest">點數換購</span>
              </router-link>
              <router-link to="/event/SUMMER2026" @click.native="close" class="bg-white p-5 rounded-md border border-brand-primary/10 flex flex-col items-center text-center shadow-sm hover:shadow-md transition-all active:scale-95">
                <span class="text-2xl mb-2">🔥</span>
                <span class="text-[10px] font-black text-gray-800 tracking-widest">活動專區</span>
              </router-link>
            </div>
          </div>

          <!-- 4. Brand Services: Minimalist List -->
          <div class="py-10 space-y-1">
            <p class="px-8 text-[10px] font-black text-gray-300 uppercase tracking-[0.3em] mb-5">品牌服務 Information</p>
            <router-link v-for="item in staticLinks" :key="item.to" :to="item.to" @click.native="close" class="block px-8 py-3 text-sm font-bold text-gray-500 hover:text-brand-primary active:pl-10 transition-all">
              {{ item.label }}
            </router-link>
          </div>
        </div>

        <!-- Sticky Bottom CTA (Optional) -->
        <div class="p-6 border-t border-gray-100 bg-white">
          <div class="flex items-center justify-between text-gray-400 px-2">
            <router-link to="/stores" @click.native="close" class="text-[10px] font-black tracking-widest hover:text-brand-primary">通路據點</router-link>
            <span class="w-1 h-1 bg-gray-200 rounded-full"></span>
            <router-link to="/faq" @click.native="close" class="text-[10px] font-black tracking-widest hover:text-brand-primary">常見問題</router-link>
            <span class="w-1 h-1 bg-gray-200 rounded-full"></span>
            <router-link to="/privacy" @click.native="close" class="text-[10px] font-black tracking-widest hover:text-brand-primary">隱私政策</router-link>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import Vue from 'vue'
import { mockCategories } from '@/mock/data'

export default Vue.extend({
  name: 'MobileNavDrawer',
  data() {
    return {
      categories: mockCategories,
      staticLinks: [
        { to: '/about', label: '品牌故事' },
        { to: '/news', label: '健康誌 (品牌消息)' },
        { to: '/inspections', label: '安心檢驗報告' },
        { to: '/contact', label: '聯絡我們' }
      ]
    }
  },
  computed: {
    isOpen(): boolean { return this.$store.getters['ui/mobileMenuOpen'] },
    isLoggedIn(): boolean { return this.$store.getters['auth/isLoggedIn'] },
    userName(): string { return this.$store.getters['auth/currentUser']?.name ?? '會員' },
    nameInitial(): string { return this.userName.charAt(0) }
  },
  methods: {
    close() { this.$store.dispatch('ui/closeMobileMenu') },
    isImageUrl(value: string) {
      return /^https?:\/\//.test(value) || value.startsWith('/')
    }
  }
})
</script>

<style scoped>
.drawer-enter-active, .drawer-leave-active { transition: opacity 0.4s cubic-bezier(0.25, 0.8, 0.25, 1); }
.drawer-enter, .drawer-leave-to { opacity: 0; }
.drawer-enter-active div:last-child { transform: translateX(0); }
.drawer-enter div:last-child { transform: translateX(-100%); }
.drawer-leave-to div:last-child { transform: translateX(-100%); }

.scrollbar-hide::-webkit-scrollbar { display: none; }
.scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
</style>
