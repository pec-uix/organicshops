<template>
  <aside class="hidden lg:block w-52 flex-shrink-0 sticky top-24">
    <div class="bg-white rounded-2xl shadow-sm overflow-hidden">
      <div class="bg-brand-primary px-4 py-5 text-center">
        <div class="w-12 h-12 rounded-full bg-white/20 border-2 border-white/40 flex items-center justify-center text-white font-bold text-xl mx-auto mb-2 select-none overflow-hidden">
          <img v-if="avatarUrl" :src="avatarUrl" class="w-full h-full object-cover" />
          <span v-else>{{ nameInitial }}</span>
        </div>
        <p class="text-white font-semibold text-sm truncate">{{ userName }}</p>
        <p class="text-white/60 text-xs mt-0.5">{{ subtitle }}</p>
      </div>
      <nav class="py-2">
        <router-link
          v-for="item in sidebarLinks"
          :key="item.key"
          :to="item.to"
          class="flex items-center gap-3 px-4 py-2.5 text-sm transition-colors"
          :class="item.key === activeKey
            ? 'bg-brand-surface text-brand-primary font-semibold border-r-2 border-brand-primary'
            : 'text-gray-600 hover:bg-gray-50'"
        >
          <span class="text-base w-5 text-center">{{ item.icon }}</span>
          {{ item.label }}
        </router-link>
        <button
          v-if="showLogout"
          class="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors mt-1 border-t border-gray-100"
          @click="logout"
        >
          <span class="text-base w-5 text-center">🚪</span>
          登出
        </button>
      </nav>
    </div>
  </aside>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'AccountSidebar',
  props: {
    activeKey: { type: String, required: true },
    subtitle: { type: String, default: '會員' },
    avatarUrl: { type: String, default: '' },
    showLogout: { type: Boolean, default: true },
    customLinks: { type: Array, default: () => [] },
  },
  computed: {
    userName(): string {
      return this.$store.getters['auth/currentUser']?.name ?? '會員'
    },
    nameInitial(): string {
      return this.userName.charAt(0)
    },
    sidebarLinks(): Array<{ key: string; to: string; icon: string; label: string }> {
      if ((this.customLinks as Array<unknown>).length > 0) {
        return this.customLinks as Array<{ key: string; to: string; icon: string; label: string }>
      }
      return [
        { key: 'account', icon: '🏠', label: '會員中心', to: '/account' },
        { key: 'orders', icon: '📦', label: '我的訂單', to: '/account/orders' },
        { key: 'addresses', icon: '📍', label: '常用地址', to: '/account/addresses' },
        { key: 'coupons', icon: '🎟', label: '折價券', to: '/account/coupons' },
        { key: 'credits', icon: '💰', label: '購物金明細', to: '/account/credits' },
        { key: 'wishlist', icon: '❤️', label: '收藏清單', to: '/account/wishlist' },
        { key: 'profile', icon: '✏️', label: '修改會員資料', to: '/account/profile' },
      ]
    },
  },
  methods: {
    logout() {
      this.$store.dispatch('auth/logout')
      this.$router.push('/')
    },
  },
})
</script>
