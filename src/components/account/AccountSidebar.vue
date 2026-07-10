<template>
  <div class="w-full lg:w-52 lg:flex-shrink-0">
    <section class="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm lg:hidden">
      <div class="bg-brand-primary px-4 py-4">
        <div class="mb-2.5 text-left">
          <p class="text-[11px] font-black tracking-widest text-white/80">會員中心</p>
          <p class="mt-1 mb-2.5 truncate text-xl font-black text-white">{{ userName }}，您好</p>
        </div>
        <div class="flex min-w-0 items-center justify-start gap-2">
          <p class="truncate text-sm font-bold text-white/80">{{ memberRoleLabel }}</p>
          <span
            v-for="badge in displayMemberBadges"
            :key="badge"
            class="flex flex-shrink-0 items-center rounded-full bg-white/20 px-2.5 py-0.5 text-[9px] font-black text-white/90 backdrop-blur"
          >
            {{ badge }}
          </span>
        </div>
      </div>

      <nav class="flex gap-2 overflow-x-auto px-3 py-3">
        <router-link
          v-for="item in sidebarLinks"
          :key="item.key"
          :to="item.to"
          class="flex flex-shrink-0 items-center gap-1 rounded-full px-3 py-2.5 text-xs font-bold transition-colors"
          :class="item.key === activeKey
            ? 'bg-brand-surface text-brand-primary'
            : 'bg-white text-gray-500 hover:bg-gray-50'"
        >
          <span class="flex h-6 w-8 flex-shrink-0 items-center justify-center rounded-md bg-white">
            <img :src="sidebarIconSrc(item.iconKey)" alt="" class="h-auto w-8 max-w-none object-contain" />
          </span>
          {{ item.label }}
        </router-link>
        <button
          v-if="showLogout"
          class="flex flex-shrink-0 items-center gap-1 rounded-full bg-white px-3 py-2.5 text-xs font-bold text-red-500 hover:bg-red-50"
          @click="logout"
        >
          <span class="flex h-6 w-8 flex-shrink-0 items-center justify-center rounded-md bg-white">
            <img :src="sidebarIconSrc('logout')" alt="" class="h-auto w-8 max-w-none object-contain" />
          </span>
          登出
        </button>
      </nav>
    </section>

    <aside class="hidden lg:block w-52 sticky top-24">
      <div class="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        <div class="bg-brand-primary px-4 py-5">
          <div class="mb-2.5 text-left">
            <p class="text-[11px] font-black tracking-widest text-white/80">會員中心</p>
            <p class="mt-1 mb-2.5 truncate text-xl font-black text-white">{{ userName }}，您好</p>
          </div>
          <div class="flex min-w-0 items-center justify-start gap-2">
            <p class="truncate text-sm font-bold text-white/80">{{ memberRoleLabel }}</p>
            <span
              v-for="badge in displayMemberBadges"
              :key="badge"
              class="flex flex-shrink-0 items-center rounded-full bg-white/20 px-2.5 py-0.5 text-[9px] font-black text-white/90 backdrop-blur"
            >
              {{ badge }}
            </span>
          </div>
        </div>
        <nav class="py-2.5">
          <router-link
            v-for="item in sidebarLinks"
            :key="item.key"
            :to="item.to"
            class="flex items-center gap-2.5 px-4 py-3 text-sm transition-colors"
            :class="item.key === activeKey
              ? 'bg-brand-surface text-brand-primary font-semibold border-r-2 border-brand-primary'
              : 'text-gray-600 hover:bg-gray-50'"
          >
            <span class="flex h-6 w-8 flex-shrink-0 items-center justify-center rounded-md bg-white">
              <img :src="sidebarIconSrc(item.iconKey)" alt="" class="h-auto w-8 max-w-none object-contain" />
            </span>
            {{ item.label }}
          </router-link>
          <button
            v-if="showLogout"
            class="mt-2 flex w-full items-center gap-2.5 border-t border-gray-100 px-4 py-3.5 text-sm text-red-500 transition-colors hover:bg-red-50"
            @click="logout"
          >
            <span class="flex h-6 w-8 flex-shrink-0 items-center justify-center rounded-md bg-white">
              <img :src="sidebarIconSrc('logout')" alt="" class="h-auto w-8 max-w-none object-contain" />
            </span>
            登出
          </button>
        </nav>
      </div>
    </aside>
  </div>
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
    memberBadges(): string[] {
      return this.$store.getters['auth/currentUser']?.memberBadges || []
    },
    displayMemberBadges(): string[] {
      const tierLabel = this.$store.getters['auth/currentUser']?.memberTierLabel
      const identityLabels = ['一般會員', '生機員工', '統一生機員工', '集團員工', '統一關係企業員工']
      const badges = this.memberBadges.filter(badge => !identityLabels.includes(badge))

      if (tierLabel && !badges.includes(tierLabel)) {
        badges.push(tierLabel)
      }

      return badges
    },
    memberRoleLabel(): string {
      const role = this.$store.getters['auth/currentUser']?.memberRoleLabel || ''
      if (role === '統一生機員工' || role === '生機員工') return '統一生機員工'
      if (role === '統一關係企業員工' || role === '集團員工') return '統一關係企業員工'
      return '一般會員'
    },
    sidebarLinks(): Array<{ key: string; to: string; iconKey: string; label: string }> {
      if ((this.customLinks as Array<unknown>).length > 0) {
        return this.customLinks as Array<{ key: string; to: string; iconKey: string; label: string }>
      }
      return [
        { key: 'account', iconKey: 'account', label: '會員中心', to: '/account' },
        { key: 'orders', iconKey: 'orders', label: '我的訂單', to: '/account/orders' },
        { key: 'coupons', iconKey: 'coupons', label: '折價券', to: '/account/coupons' },
        { key: 'credits', iconKey: 'credits', label: '購物金明細', to: '/account/credits' },
        { key: 'wishlist', iconKey: 'wishlist', label: '收藏清單', to: '/account/wishlist' },
        { key: 'addresses', iconKey: 'addresses', label: '常用地址', to: '/account/addresses' },
        { key: 'profile', iconKey: 'profile', label: '修改會員資料', to: '/account/profile' },
        { key: 'notifications', iconKey: 'notifications', label: '通知中心', to: '/account/notifications' },
        { key: 'help', iconKey: 'help', label: '購物須知', to: '/shopping-guide' },
      ]
    },
  },
  methods: {
    sidebarIconSrc(iconKey: string): string {
      const icons: { [key: string]: string } = {
        account: require('../../../images/會員中心.png'),
        orders: require('../../../images/我的訂單.png'),
        coupons: require('../../../images/折價券.png'),
        credits: require('../../../images/購物金明細.png'),
        wishlist: require('../../../images/收藏清單.png'),
        addresses: require('../../../images/常用地址.png'),
        profile: require('../../../images/修改會員資料.png'),
        notifications: require('../../../images/通知中心.png'),
        help: require('../../../images/購物須知.png'),
        logout: require('../../../images/登出.png'),
      }

      return icons[iconKey] || icons.account
    },
    logout() {
      this.$store.dispatch('auth/logout')
      this.$router.push('/')
    },
  },
})
</script>
