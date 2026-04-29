<template>
  <header class="bg-white border-b-2 border-gray-100 sticky top-0 z-50 shadow-sm">
    <!-- 頂部資訊列 -->
    <div class="bg-brand-primary text-white text-[11px] py-2 text-center font-black tracking-widest">
      全館滿 $1,500 免運費 ｜ 安心、有機、在地直送 🌿
    </div>

    <!-- 主導覽列 -->
    <div class="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between gap-6">
      <!-- 品牌標誌 -->
      <router-link to="/" class="flex items-center gap-3 flex-shrink-0 group rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/40">
        <div class="w-12 h-12 bg-brand-surface text-brand-primary rounded-md flex items-center justify-center text-3xl shadow-sm">
          🌿
        </div>
        <div class="leading-tight">
          <div class="text-brand-dark font-black text-2xl tracking-tighter group-hover:text-brand-primary transition-colors">
            統一生機
          </div>
          <p class="text-brand-secondary text-[10px] font-black tracking-widest mt-1">有機讓生命更生機</p>
        </div>
      </router-link>

      <!-- 主要選單 (強制單行排版) -->
      <nav class="hidden xl:flex items-center gap-2 flex-nowrap overflow-x-auto scrollbar-hide flex-1 justify-center px-4">
        <router-link
          v-for="cat in categories"
          :key="cat.id"
          :to="`/category/${cat.id}`"
          class="text-brand-dark font-black text-sm hover:text-brand-primary transition-colors py-2 px-3 whitespace-nowrap"
        >
          {{ cat.name }}
        </router-link>
      </nav>

      <!-- 功能操作區 (真實精品 Icon 導入) -->
      <div class="flex items-center gap-4 lg:gap-6 flex-shrink-0">
        <button
          class="md:hidden flex flex-col items-center text-gray-500 hover:text-brand-primary transition-colors group"
          style="-webkit-tap-highlight-color: transparent;"
          @click="toggleMobileSearch"
        >
          <div class="p-1 rounded-full group-hover:bg-brand-surface transition-colors">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
          </div>
          <span class="text-[10px] font-black mt-1">搜尋</span>
        </button>

        <!-- 搜尋 (新增輸入框連動) -->
        <div class="relative hidden md:flex items-center">
          <input 
            v-model="searchQuery" 
            type="text" 
            placeholder="搜尋商品..." 
            class="bg-brand-surface border-0 rounded-full px-4 py-2 text-xs w-40 focus:w-64 focus:ring-1 focus:ring-brand-primary outline-none transition-all duration-500"
            @keyup.enter="onSearch"
          />
          <button @click="onSearch" class="absolute right-3 text-gray-400 hover:text-brand-primary">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
          </button>
        </div>

        <!-- 會員中心 -->
        <router-link to="/account" class="flex flex-col items-center text-gray-500 hover:text-brand-primary transition-colors group rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/40" style="-webkit-tap-highlight-color: transparent;">
          <div class="p-1 rounded-full group-hover:bg-brand-surface transition-colors">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
            </svg>
          </div>
          <span class="text-[10px] font-black mt-1">會員中心</span>
        </router-link>

        <router-link to="/account/notifications" class="relative flex flex-col items-center text-gray-500 hover:text-brand-primary transition-colors group rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/40" style="-webkit-tap-highlight-color: transparent;">
          <div class="p-1 rounded-full group-hover:bg-brand-surface transition-colors relative">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0a3 3 0 11-6 0m6 0H9" />
            </svg>
            <span class="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] rounded-full h-4 min-w-[16px] px-1 flex items-center justify-center font-black border border-white shadow-sm">
              3
            </span>
          </div>
          <span class="text-[10px] font-black mt-1">通知中心</span>
        </router-link>

        <!-- 我的購物籃 -->
        <button
          class="relative flex flex-col items-center text-gray-500 hover:text-brand-primary transition-colors group"
          style="-webkit-tap-highlight-color: transparent;"
          @click="openCartDrawer"
        >
          <div class="p-1 rounded-full group-hover:bg-brand-surface transition-colors relative">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
            </svg>
            <span v-if="cartCount > 0" class="absolute -top-1 -right-1 bg-brand-accent text-white text-[9px] rounded-full h-4 w-4 flex items-center justify-center font-black border border-white shadow-sm">
              {{ cartCount }}
            </span>
          </div>
          <span class="text-[10px] font-black mt-1">我的購物籃</span>
        </button>

        <button
          class="md:hidden flex flex-col items-center text-brand-primary transition-colors"
          style="-webkit-tap-highlight-color: transparent;"
          @click="toggleMobileMenu"
        >
          <div class="h-11 w-11 rounded-full bg-brand-primary text-white flex items-center justify-center shadow-md transition-transform duration-300">
            <svg
              class="w-6 h-6 transition-transform duration-300"
              :class="isMenuOpen ? 'rotate-90' : ''"
              fill="none"
              stroke="currentColor"
              stroke-width="2.2"
              viewBox="0 0 24 24"
            >
              <path
                v-if="!isMenuOpen"
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M4 7h16M4 12h16M4 17h16"
              />
              <path
                v-else
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M6 6l12 12M18 6L6 18"
              />
            </svg>
          </div>
          <span class="text-[10px] font-black mt-1">選單</span>
        </button>
      </div>
    </div>

    <transition name="mobile-search">
      <div v-if="mobileSearchOpen" class="md:hidden border-t border-gray-100 bg-white px-4 py-4 shadow-inner">
        <div class="flex items-center gap-2">
          <input
            ref="mobileSearchInput"
            v-model="searchQuery"
            type="text"
            placeholder="搜尋商品、分類或關鍵字"
            class="min-w-0 flex-1 rounded-full border border-gray-200 bg-brand-surface px-4 py-3 text-sm font-medium outline-none focus:border-brand-primary"
            @keyup.enter="onSearch"
          />
          <button
            class="rounded-full bg-brand-primary px-4 py-3 text-xs font-black text-white"
            @click="onSearch"
          >
            搜尋
          </button>
        </div>
        <div class="mt-3 flex items-center justify-between text-[10px] font-black tracking-[0.2em] text-gray-400">
          <span>搜尋結果將直接顯示在商品列表</span>
          <button class="text-brand-primary" @click="mobileSearchOpen = false">收合</button>
        </div>
      </div>
    </transition>

    <!-- 行動版：輔助導覽列 (維持單行捲動) -->
    <div class="lg:hidden relative border-t border-gray-100 bg-brand-surface/50">
      <div class="pointer-events-none absolute left-0 top-0 bottom-0 z-10 flex items-center pl-2">
        <div class="flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-gray-400 shadow-sm">
          <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </div>
      </div>

      <div class="pointer-events-none absolute right-0 top-0 bottom-0 z-10 flex items-center pr-2">
        <div class="flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-gray-400 shadow-sm">
          <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>

      <div class="overflow-x-auto scrollbar-hide px-10 py-3 flex flex-nowrap gap-6 items-center">
      <router-link
        v-for="cat in categories"
        :key="'m-'+cat.id"
        :to="`/category/${cat.id}`"
        class="text-brand-dark font-black text-sm whitespace-nowrap active:text-brand-primary"
      >
        {{ cat.name }}
      </router-link>
      </div>
    </div>
  </header>
</template>

<script lang="ts">
import Vue from 'vue'
import { mockCategories } from '@/mock/data'

export default Vue.extend({
  name: 'AppHeader',
  data() {
    return { searchQuery: '', categories: mockCategories, mobileSearchOpen: false }
  },
  computed: {
    cartCount(): number { return this.$store.getters['cart/totalCount'] },
    isMenuOpen(): boolean { return this.$store.getters['ui/mobileMenuOpen'] },
  },
  methods: {
    openCartDrawer() { this.$store.dispatch('ui/openCartDrawer') },
    toggleMobileMenu() { this.$store.dispatch('ui/toggleMobileMenu') },
    goToSearch() {
      if (this.$route.path === '/search') {
        this.$router.replace({ path: '/search', query: { ...this.$route.query, _t: String(Date.now()) } }).catch(() => {})
        return
      }
      this.$router.push('/search').catch(() => {})
    },
    toggleMobileSearch() {
      this.mobileSearchOpen = !this.mobileSearchOpen
      if (this.mobileSearchOpen) {
        this.$store.dispatch('ui/closeMobileMenu')
        this.$nextTick(() => {
          const input = this.$refs.mobileSearchInput as HTMLInputElement | undefined
          input?.focus()
        })
      }
    },
    onSearch() {
      if (this.searchQuery.trim()) {
        this.mobileSearchOpen = false
        this.$router.push({ path: '/search', query: { q: this.searchQuery.trim() } }).catch(() => {})
      }
    },
  },
})
</script>

<style scoped>
.scrollbar-hide::-webkit-scrollbar { display: none; }
.scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }

.mobile-search-enter-active,
.mobile-search-leave-active {
  transition: all 0.2s ease;
}

.mobile-search-enter,
.mobile-search-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
