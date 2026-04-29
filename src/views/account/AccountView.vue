<template>
  <div class="min-h-screen bg-brand-bg pb-16">
    <!-- ══ 主內容：側邊選單 + 帳戶總覽 ══ -->
    <div class="max-w-7xl mx-auto px-4 pt-6 flex gap-6 items-start">

      <AccountSidebar active-key="account" subtitle="會員" />

      <!-- ── 右側：內容區 (符合 AddressView 原則) ── -->
      <div class="flex-1 min-w-0 space-y-4">
        <AccountContentHeader
          title="會員中心"
          subtitle="查看會員資產、訂單紀錄與常用功能。"
          eyebrow="會員中心"
        />
        
        <!-- 1. 會員等級與晉升 -->
        <section class="mb-6 rounded-xl border border-gray-100 bg-gradient-to-br from-[#FFF8EA] via-white to-[#F7FBF4] p-6 shadow-sm">
          <div class="mb-4 flex items-end justify-between gap-4">
            <div>
              <h3 class="mb-1 text-sm text-gray-500">目前等級</h3>
              <div class="flex items-center">
                <span class="mr-2 text-2xl font-bold text-[#E8A020]">{{ currentLevel.label }}</span>
                <span class="text-[#E8A020] text-xl leading-none">👑</span>
              </div>
            </div>
            <div class="text-right text-xs text-gray-400">
              再 <span class="font-bold text-[#2D6A2D]">{{ ordersToNext }}</span> 筆訂單升級至
              <span class="font-bold text-[#2D6A2D]">{{ nextLevel ? nextLevel.label : currentLevel.label }}</span>
            </div>
          </div>

          <div class="relative h-3 w-full overflow-hidden rounded-full bg-gray-100">
            <div
              class="absolute left-0 top-0 h-full rounded-full bg-gradient-to-r from-[#2D6A2D] to-[#4A8A4A] transition-all duration-500"
              :style="{ width: levelProgress + '%' }"
            ></div>
          </div>
          <div class="mt-2 flex justify-between text-xs text-gray-400">
            <span>升級進度 {{ levelProgress }}%</span>
            <span>{{ nextLevel ? nextLevel.label : currentLevel.label }}</span>
          </div>
        </section>

        <!-- 2. 資產三格卡片 -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 items-stretch">
          <div
            v-for="asset in memberAssets"
            :key="asset.label"
            class="h-full bg-white p-5 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
          >
            <div class="flex items-center justify-between mb-3">
              <div
                class="w-10 h-10 rounded-full flex items-center justify-center text-xl"
                :class="asset.iconBgClass || 'bg-[#F7F5F0] text-[#2D6A2D]'"
              >
                {{ asset.icon }}
              </div>
              <span
                v-if="asset.footerClass === 'text-red-600'"
                class="text-[10px] bg-red-50 text-red-500 px-2 py-0.5 rounded-full border border-red-100"
              >
                {{ asset.footer }}
              </span>
            </div>
            <div>
              <div class="text-gray-500 text-sm">{{ asset.label }}</div>
              <div class="text-2xl font-black text-gray-800 mt-1">
                <span v-if="asset.unit === '$'" class="text-sm mr-0.5">$</span>{{ asset.value.toLocaleString() }}
                <span v-if="asset.unit === 'pts'" class="text-xs text-gray-400 font-normal ml-1">1 點折 1 元</span>
                <span v-if="asset.unit === 'pcs'" class="text-xs text-gray-400 font-normal ml-1">張可用</span>
              </div>
            </div>
            <p v-if="asset.footerClass !== 'text-red-600'" class="mt-3 text-[10px] font-medium" :class="asset.footerClass || 'text-gray-300'">
              {{ asset.footer }}
            </p>
          </div>
        </div>

        <!-- 3. 待出貨快捷卡 -->
        <router-link
          to="/account/orders"
          class="group mb-6 flex cursor-pointer items-center justify-between rounded-xl border border-gray-100 bg-white p-4 shadow-sm transition-colors hover:border-[#2D6A2D]"
        >
          <div class="flex items-center">
            <div class="mr-4 h-8 w-2 rounded-full bg-[#2D6A2D]"></div>
            <div>
            <h3 class="text-lg font-bold text-gray-800">前往訂單查詢</h3>
            <p class="mt-1 text-sm text-gray-400">查看待出貨訂單與最新訂單狀態</p>
            </div>
          </div>
          <div class="flex items-center">
            <div class="mr-3 flex h-7 w-7 items-center justify-center rounded-full bg-red-500 text-sm font-bold text-white shadow-lg shadow-red-200">
              {{ pendingShipmentCount }}
            </div>
            <span class="text-gray-300 transition-transform group-hover:translate-x-1 group-hover:text-[#2D6A2D]">›</span>
          </div>
        </router-link>

        <!-- 4. 功能入口九宮格 -->
        <section class="bg-white rounded-2xl shadow-sm p-6">
          <div class="flex items-center justify-between mb-5">
            <h3 class="text-lg font-bold text-gray-800">功能入口</h3>
            <p class="text-[10px] font-black text-gray-300 uppercase tracking-widest">9 格</p>
          </div>
          <div class="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <router-link
              v-for="item in quickActions.filter(action => !action.actionKey)"
              :key="item.label"
              :to="item.to || '/'"
              class="group bg-white p-6 rounded-xl border border-gray-50 flex flex-col items-center justify-center cursor-pointer hover:bg-[#F7F5F0] hover:shadow-inner transition-all duration-300"
            >
              <div class="mb-3 text-2xl text-gray-400 group-hover:text-[#2D6A2D] group-hover:scale-110 transition-transform">
                <svg v-if="item.iconKey === 'orders'" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M3 7h18M6 7l1 13h10l1-13M9 11h6" />
                </svg>
                <svg v-else-if="item.iconKey === 'notifications'" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M15 17h5l-1.4-1.4A2 2 0 0118 14.2V11a6 6 0 10-12 0v3.2a2 2 0 01-.6 1.4L4 17h5m6 0a3 3 0 11-6 0m6 0H9" />
                </svg>
                <svg v-else-if="item.iconKey === 'addresses'" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M12 21s6-4.35 6-10a6 6 0 10-12 0c0 5.65 6 10 6 10z" />
                  <circle cx="12" cy="11" r="2.5" fill="none" stroke="currentColor" stroke-width="1.8" />
                </svg>
                <svg v-else-if="item.iconKey === 'coupons'" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M4 7a2 2 0 012-2h12a2 2 0 012 2v2a2 2 0 000 4v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2a2 2 0 000-4V7z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M9 9h.01M15 15h.01" />
                </svg>
                <svg v-else-if="item.iconKey === 'credits'" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M12 6v12m4-9a3 3 0 00-3-3H10a3 3 0 000 6h4a3 3 0 010 6h-2a3 3 0 01-3-3" />
                </svg>
                <svg v-else-if="item.iconKey === 'wishlist'" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M12 21s-7-4.6-9-9.4C1.5 8 3.3 5 6.7 5c1.9 0 3.1 1 4.3 2.5C12.2 6 13.5 5 15.3 5 18.7 5 20.5 8 21 11.6c-2 4.8-9 9.4-9 9.4z" />
                </svg>
                <svg v-else-if="item.iconKey === 'profile'" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M15.232 5.232a3 3 0 114.243 4.243L8 21H3v-5l12.232-10.768z" />
                </svg>
                <svg v-else-if="item.iconKey === 'password'" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M12 17v2m-7-8V9a7 7 0 1114 0v2m-12 0h10a2 2 0 012 2v7H3v-7a2 2 0 012-2z" />
                </svg>
                <svg v-else-if="item.iconKey === 'op'" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M12 3l7 7-7 11-7-11 7-7z" />
                </svg>
                <svg v-else class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M10 17l5-5-5-5m5 5H3m14 7h4V4h-4" />
                </svg>
              </div>
              <span class="text-sm font-medium text-gray-600 group-hover:text-[#2D6A2D] transition-colors">{{ item.label }}</span>
            </router-link>
            <button
              v-for="item in quickActions.filter(action => action.actionKey)"
              :key="item.label"
              type="button"
              class="group bg-white p-6 rounded-xl border border-gray-50 flex flex-col items-center justify-center cursor-pointer hover:bg-[#F7F5F0] hover:shadow-inner transition-all duration-300"
              @click="handleQuickAction(item.actionKey)"
            >
              <div class="mb-3 text-2xl text-gray-400 group-hover:text-[#2D6A2D] group-hover:scale-110 transition-transform">
                <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M10 17l5-5-5-5m5 5H3m14 7h4V4h-4" />
                </svg>
              </div>
              <span class="text-sm font-medium text-gray-600 group-hover:text-[#2D6A2D] transition-colors">{{ item.label }}</span>
            </button>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { User } from '@/types'
import AccountSidebar from '@/components/account/AccountSidebar.vue'
import AccountContentHeader from '@/components/account/AccountContentHeader.vue'

interface LevelDef {
  key: string; label: string; icon: string; minOrders: number
}

const LEVELS: LevelDef[] = [
  { key: 'general',  label: '一般會員', icon: '🌱', minOrders: 0 },
  { key: 'gold',     label: '黃金會員', icon: '⭐', minOrders: 5 },
  { key: 'platinum', label: '白金會員', icon: '💎', minOrders: 10 },
  { key: 'diamond',  label: '鑽石會員', icon: '💠', minOrders: 20 },
]

export default Vue.extend({
  name: 'AccountView',
  components: { AccountSidebar, AccountContentHeader },
  data() {
      return {
      memberData: { totalOrders: 7, pendingShipments: 2, credits: 900, creditsExpiry: '06/30', opPoints: 1250, couponCount: 3 },
      quickActions: [
        { to: '/account/notifications', iconKey: 'notifications', label: '通知中心' },
        { to: '/account/orders',    iconKey: 'orders', label: '我的訂單' },
        { to: '/account/addresses', iconKey: 'addresses', label: '常用地址' },
        { to: '/account/coupons',   iconKey: 'coupons', label: '折價券' },
        { to: '/account/credits',   iconKey: 'credits', label: '購物金明細' },
        { to: '/account/wishlist',  iconKey: 'wishlist', label: '收藏清單' },
        { to: '/account/profile',   iconKey: 'profile', label: '修改會員資料' },
        { to: '/account/password',  iconKey: 'password', label: '修改密碼' },
        { to: '/op-exchange',       iconKey: 'op', label: 'OP點數' },
        { iconKey: 'logout', label: '登出', actionKey: 'logout' },
      ],
    }
  },
  computed: {
    user(): User | null { return this.$store.getters['auth/currentUser'] },
    nameInitial(): string { return this.user?.name?.charAt(0) ?? 'M' },
    currentLevel(): LevelDef {
      const orders = this.memberData.totalOrders
      let level = LEVELS[0]
      for (const lv of LEVELS) { if (orders >= lv.minOrders) level = lv }
      return level
    },
    nextLevel(): LevelDef | null {
      const orders = this.memberData.totalOrders
      if (orders < 5) return LEVELS[1]
      if (orders < 10) return LEVELS[2]
      if (orders < 20) return LEVELS[3]
      return null
    },
    ordersToNext(): number {
      if (!this.nextLevel) return 0
      return this.nextLevel.minOrders - this.memberData.totalOrders
    },
    levelProgress(): number {
      const next = this.nextLevel
      if (!next) return 100
      return Math.min(100, Math.round((this.memberData.totalOrders / next.minOrders) * 100))
    },
    memberAssets(): any[] {
      return [
        { label: '我的購物金', value: this.memberData.credits, unit: '$', icon: '💰', footer: `將於 ${this.memberData.creditsExpiry} 到期`, footerClass: 'text-red-600', iconBgClass: 'bg-[#F7F5F0] text-[#2D6A2D]' },
        { label: 'OP 點數', value: this.memberData.opPoints, unit: 'pts', icon: '🔶', footer: '1 點折 1 元', iconBgClass: 'bg-[#FFF9E6] text-[#E8A020]' },
        { label: '專屬折價券', value: this.memberData.couponCount, unit: 'pcs', icon: '🎟', footer: '3 張可用', iconBgClass: 'bg-[#E9F0E9] text-[#2D6A2D]' },
      ]
    },
    pendingShipmentCount(): number {
      return this.memberData.pendingShipments
    }
  },
  methods: {
    handleQuickAction(actionKey: string) {
      if (actionKey === 'logout') this.logout()
    },
    logout() {
      this.$store.dispatch('auth/logout')
      this.$router.push('/')
    }
  }
})
</script>

<style scoped>
.grid-cols-3 > div {
  aspect-ratio: 1 / 0.75;
}
.custom-icon-bg {
  @apply transition-colors duration-300;
  background: #F7F5F0;
}
.group:hover .custom-icon-bg {
  background: #E9F0E9;
}
</style>
