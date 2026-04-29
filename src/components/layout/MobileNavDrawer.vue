<template>
  <transition
    enter-active-class="transition-opacity duration-300 ease-in-out"
    leave-active-class="transition-opacity duration-300 ease-in-out"
    enter-class="opacity-0"
    leave-to-class="opacity-0"
  >
    <div v-if="isOpen" class="fixed inset-0 z-[100] md:hidden">
      <div class="absolute inset-0 bg-black/50" @click="close"></div>

      <transition
        enter-active-class="transform transition duration-300 ease-in-out"
        leave-active-class="transform transition duration-300 ease-in-out"
        enter-class="-translate-x-full"
        enter-to-class="translate-x-0"
        leave-class="translate-x-0"
        leave-to-class="-translate-x-full"
      >
        <aside
          v-if="isOpen"
          class="absolute inset-y-0 left-0 flex w-[86%] max-w-sm flex-col bg-white shadow-2xl"
        >
          <div
            class="flex items-center justify-between px-5 py-5 text-white"
            style="background: linear-gradient(135deg, #1B4332, #2D6A2D);"
          >
            <div class="min-w-0">
              <div class="text-2xl font-black tracking-tight">統一生機</div>
              <p class="mt-1 text-[10px] font-bold tracking-[0.28em] text-white/75">ORGANIC LIFE</p>
            </div>
            <button
              class="flex h-10 w-10 items-center justify-center rounded-full text-white/90 transition-colors hover:bg-white/10"
              @click="close"
            >
              <svg class="h-6 w-6" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </div>

          <div class="flex-1 overflow-y-auto scrollbar-hide bg-white pb-36">
            <div class="border-b border-gray-100 px-5 py-5">
              <div v-if="isLoggedIn" class="rounded-2xl bg-brand-surface px-4 py-4">
                <p class="text-[10px] font-black tracking-[0.18em] text-brand-primary">MEMBER</p>
                <div class="mt-2 flex items-center gap-3">
                  <div class="flex h-11 w-11 items-center justify-center rounded-full bg-brand-primary text-base font-black text-white">
                    {{ nameInitial }}
                  </div>
                  <div class="min-w-0">
                    <p class="truncate text-base font-black text-brand-dark">{{ userName }}</p>
                    <p class="mt-1 text-xs font-bold text-gray-400">歡迎回來</p>
                  </div>
                </div>
              </div>
              <div v-else class="rounded-2xl bg-brand-surface px-4 py-4">
                <p class="text-base font-black text-brand-dark">開啟您的有機生活</p>
                <p class="mt-1 text-xs font-bold text-gray-400">登入後可查看會員專屬優惠與訂單資訊</p>
              </div>
            </div>

            <div class="border-b border-gray-100 px-5 py-5">
              <p class="mb-3 text-[10px] font-black tracking-[0.22em] text-gray-300">快捷功能</p>
              <div class="grid grid-cols-3 gap-3">
                <router-link
                  to="/account"
                  class="flex flex-col items-center gap-2 rounded-2xl border border-gray-100 bg-white px-3 py-4 text-center transition-colors hover:bg-brand-surface"
                  @click.native="close"
                >
                  <svg class="h-5 w-5 text-brand-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                  </svg>
                  <span class="text-xs font-black text-gray-600">會員中心</span>
                </router-link>

                <router-link
                  to="/account/notifications"
                  class="relative flex flex-col items-center gap-2 rounded-2xl border border-gray-100 bg-white px-3 py-4 text-center transition-colors hover:bg-brand-surface"
                  @click.native="close"
                >
                  <svg class="h-5 w-5 text-brand-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 17h5l-1.4-1.4A2 2 0 0118 14.2V11a6 6 0 10-12 0v3.2a2 2 0 01-.6 1.4L4 17h5m6 0a3 3 0 11-6 0m6 0H9" />
                  </svg>
                  <span class="text-xs font-black text-gray-600">通知中心</span>
                  <span class="absolute right-3 top-3 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-black text-white">3</span>
                </router-link>

                <button
                  type="button"
                  class="relative flex flex-col items-center gap-2 rounded-2xl border border-gray-100 bg-white px-3 py-4 text-center transition-colors hover:bg-brand-surface"
                  @click="openCartFromMenu"
                >
                  <svg class="h-5 w-5 text-brand-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                  </svg>
                  <span class="text-xs font-black text-gray-600">我的購物籃</span>
                  <span
                    v-if="cartCount > 0"
                    class="absolute right-3 top-3 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-brand-accent px-1 text-[9px] font-black text-white"
                  >
                    {{ cartCount }}
                  </span>
                </button>
              </div>
            </div>

            <nav>
              <div
                v-for="item in categories"
                :key="item.id"
                class="border-b border-[#E5E7EB]"
              >
                <div
                  class="flex items-center justify-between py-4 pr-4 transition-colors hover:bg-[#E8F5E8]"
                  :class="isActiveCategory(item.id) ? 'border-l-[3px] border-brand-primary bg-[#E8F5E8]/70 pl-[17px]' : 'pl-5'"
                >
                  <router-link
                    :to="`/category/${item.id}`"
                    class="flex min-w-0 flex-1 items-center gap-3"
                    :class="isActiveCategory(item.id) ? 'text-brand-primary' : 'text-gray-700'"
                    @click.native="close"
                  >
                    <span class="h-10 w-10 shrink-0 overflow-hidden rounded-full border border-gray-100 bg-white shadow-sm">
                      <img v-if="isImageUrl(item.icon)" :src="item.icon" :alt="item.name" class="h-full w-full object-cover" />
                      <span v-else class="flex h-full w-full items-center justify-center text-xl">{{ item.icon }}</span>
                    </span>
                    <span class="truncate text-[15px] font-black tracking-[0.06em]">{{ item.name }}</span>
                  </router-link>

                  <button
                    v-if="hasChildren(item.id)"
                    class="ml-3 flex h-9 w-9 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-white"
                    @click.stop="toggleSubmenu(item.id)"
                  >
                    <svg
                      class="h-4 w-4 transition-transform duration-300"
                      :class="openSubmenu === item.id ? 'rotate-90 text-brand-primary' : ''"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2.2"
                      viewBox="0 0 24 24"
                    >
                      <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>

                <transition
                  enter-active-class="transition-all duration-300 ease-in-out overflow-hidden"
                  leave-active-class="transition-all duration-300 ease-in-out overflow-hidden"
                  enter-class="max-h-0 opacity-0"
                  enter-to-class="max-h-48 opacity-100"
                  leave-class="max-h-48 opacity-100"
                  leave-to-class="max-h-0 opacity-0"
                >
                  <div
                    v-if="hasChildren(item.id) && openSubmenu === item.id"
                    class="bg-[#F7FAF7]"
                  >
                    <router-link
                      v-for="child in childMenuMap[item.id]"
                      :key="child.to"
                      :to="child.to"
                      class="block border-t border-[#E5E7EB] py-3 pl-[72px] pr-5 text-sm font-bold text-gray-500 transition-colors hover:bg-[#E8F5E8] hover:text-brand-primary"
                      @click.native="close"
                    >
                      {{ child.label }}
                    </router-link>
                  </div>
                </transition>
              </div>
            </nav>

            <div class="border-t border-dashed border-gray-200 px-5 py-5">
              <p class="mb-3 text-[10px] font-black tracking-[0.22em] text-gray-300">品牌服務</p>
              <div class="space-y-1">
                <router-link
                  v-for="item in staticLinks"
                  :key="item.to"
                  :to="item.to"
                  class="block rounded-xl px-3 py-3 text-sm font-bold text-gray-500 transition-colors hover:bg-[#E8F5E8] hover:text-brand-primary"
                  @click.native="close"
                >
                  {{ item.label }}
                </router-link>
              </div>
            </div>
          </div>

          <div class="absolute inset-x-0 bottom-0 border-t border-gray-100 bg-white p-4">
            <div v-if="isLoggedIn" class="space-y-3">
              <div class="rounded-2xl bg-brand-surface px-4 py-3">
                <p class="text-xs font-bold text-gray-400 tracking-[0.16em]">MEMBER</p>
                <p class="mt-1 text-base font-black text-brand-dark">{{ userName }}</p>
              </div>
              <router-link
                to="/account"
                class="flex w-full items-center justify-center rounded-xl bg-brand-primary px-4 py-3 text-sm font-black text-white shadow-md"
                @click.native="close"
              >
                前往會員中心
              </router-link>
            </div>

            <div v-else class="grid grid-cols-2 gap-3">
              <router-link
                to="/login"
                class="flex items-center justify-center rounded-xl bg-brand-primary px-4 py-3 text-sm font-black text-white shadow-md"
                @click.native="close"
              >
                登入
              </router-link>
              <router-link
                to="/register"
                class="flex items-center justify-center rounded-xl bg-brand-primary px-4 py-3 text-sm font-black text-white shadow-md"
                @click.native="close"
              >
                註冊
              </router-link>
            </div>
          </div>
        </aside>
      </transition>
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
      openSubmenu: null as string | null,
      childMenuMap: {
        fresh: [],
        frozen: [],
        nuts: [],
        grains: [],
        pantry: [],
        elderly: [],
        beverage: [],
      } as Record<string, Array<{ label: string; to: string }>>,
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
    cartCount(): number { return this.$store.getters['cart/totalCount'] || 0 },
    nameInitial(): string { return this.userName.charAt(0) }
  },
  watch: {
    $route() {
      this.openSubmenu = null
    }
  },
  methods: {
    close() { this.$store.dispatch('ui/closeMobileMenu') },
    openCartFromMenu() {
      this.close()
      this.$store.dispatch('ui/openCartDrawer')
    },
    hasChildren(categoryId: string) {
      return (this.childMenuMap[categoryId] || []).length > 0
    },
    toggleSubmenu(categoryId: string) {
      this.openSubmenu = this.openSubmenu === categoryId ? null : categoryId
    },
    isActiveCategory(categoryId: string) {
      return this.$route.path.startsWith(`/category/${categoryId}`)
    },
    isImageUrl(value: string) {
      return /^https?:\/\//.test(value) || value.startsWith('/')
    }
  }
})
</script>

<style scoped>
.scrollbar-hide::-webkit-scrollbar { display: none; }
.scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
</style>
