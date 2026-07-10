<template>
  <div class="min-h-screen bg-gray-50 pb-16">
    <div class="max-w-7xl mx-auto px-4 pt-6 flex flex-col gap-4 lg:flex-row lg:gap-6 lg:items-start">
      <AccountSidebar active-key="notifications" subtitle="會員" />

      <div class="flex-1 min-w-0 space-y-6">
        <AccountContentHeader
          title="通知中心"
          subtitle="查看訂單、優惠、帳號與會員提醒。"
        />

        <section class="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
          <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div class="flex flex-wrap gap-2">
              <button
                v-for="filter in filters"
                :key="filter"
                type="button"
                class="rounded-full px-4 py-2 text-sm font-bold transition-all"
                :class="activeFilter === filter ? 'bg-brand-primary text-white shadow-sm' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'"
                @click="activeFilter = filter"
              >
                {{ filter }}
              </button>
            </div>
            <button
              type="button"
              class="inline-flex items-center justify-center rounded-full border border-brand-primary px-4 py-2 text-sm font-bold text-brand-primary transition-all hover:bg-brand-surface disabled:cursor-not-allowed disabled:border-gray-200 disabled:text-gray-300"
              :disabled="unreadCount === 0"
              @click="markAllAsRead"
            >
              全部標記已讀
            </button>
          </div>
        </section>

        <section class="space-y-4">
          <article
            v-for="item in paginatedNotifications"
            :key="item.id"
            class="rounded-2xl border bg-white p-5 shadow-sm transition-all cursor-pointer"
            :class="item.read ? 'border-gray-100' : 'border-[#DCE8CB] bg-[#FCFEF9]'"
            @click="openDetail(item)"
          >
            <div class="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div class="min-w-0">
                <div class="flex flex-wrap items-center gap-2">
                  <span
                    class="rounded-full px-2.5 py-1 text-[11px] font-bold"
                    :class="item.read ? 'bg-gray-100 text-gray-400' : 'bg-[#EAF4DD] text-[#6E9C35]'"
                  >
                    {{ item.read ? '已讀' : '未讀' }}
                  </span>
                  <span class="rounded-full bg-brand-surface px-2.5 py-1 text-[11px] font-bold text-brand-primary">
                    {{ item.category }}
                  </span>
                  <span class="text-xs text-gray-300">{{ item.date }}</span>
                </div>
                <h2 class="mt-3 text-lg font-black text-gray-800">{{ item.title }}</h2>
                <p class="mt-2 text-sm leading-7 text-gray-500">{{ item.message }}</p>
                <div class="mt-4 inline-flex items-center gap-2 text-sm font-bold text-brand-primary">
                  查看詳情
                  <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
              <button
                type="button"
                class="rounded-full border px-4 py-2 text-xs font-bold transition-all"
                :class="item.read ? 'border-gray-200 text-gray-400' : 'border-brand-primary text-brand-primary hover:bg-brand-surface'"
                @click.stop="markAsRead(item.id)"
              >
                {{ item.read ? '已標記已讀' : '標記已讀' }}
              </button>
            </div>
          </article>

          <div v-if="filteredNotifications.length === 0" class="rounded-2xl border border-dashed border-gray-200 bg-white px-6 py-16 text-center shadow-sm">
            <div class="text-4xl">🔔</div>
            <p class="mt-4 text-lg font-bold text-gray-700">這個分類暫無通知</p>
            <p class="mt-2 text-sm text-gray-500">有新的提醒時會顯示在這裡。</p>
          </div>

          <div
            v-if="totalPages > 1"
            class="flex flex-col items-center justify-between gap-3 rounded-2xl border border-gray-100 bg-white px-4 py-3 shadow-sm sm:flex-row"
          >
            <p class="text-sm font-bold text-gray-400">
              第 {{ currentPage }} / {{ totalPages }} 頁
            </p>
            <div class="flex w-full gap-2 sm:w-auto">
              <button
                type="button"
                class="flex-1 rounded-full border border-gray-200 px-4 py-2 text-sm font-bold text-gray-500 transition-all hover:border-brand-primary hover:text-brand-primary disabled:cursor-not-allowed disabled:border-gray-100 disabled:text-gray-300 sm:flex-none"
                :disabled="currentPage === 1"
                @click="previousPage"
              >
                上一頁
              </button>
              <button
                type="button"
                class="flex-1 rounded-full border border-gray-200 px-4 py-2 text-sm font-bold text-gray-500 transition-all hover:border-brand-primary hover:text-brand-primary disabled:cursor-not-allowed disabled:border-gray-100 disabled:text-gray-300 sm:flex-none"
                :disabled="currentPage === totalPages"
                @click="nextPage"
              >
                下一頁
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>

    <transition name="modal-fade">
      <div v-if="selectedNotification" class="fixed inset-0 z-[80] flex items-center justify-center bg-black/40 px-4 py-6" @click="closeDetail">
        <div class="w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-xl" @click.stop>
          <div class="flex items-start justify-between border-b border-gray-100 px-6 py-5">
            <div class="pr-4">
              <div class="flex flex-wrap items-center gap-2">
                <span
                  class="rounded-full px-2.5 py-1 text-[11px] font-bold"
                  :class="selectedNotification.read ? 'bg-gray-100 text-gray-400' : 'bg-[#EAF4DD] text-[#6E9C35]'"
                >
                  {{ selectedNotification.read ? '已讀' : '未讀' }}
                </span>
                <span class="rounded-full bg-brand-surface px-2.5 py-1 text-[11px] font-bold text-brand-primary">
                  {{ selectedNotification.category }}
                </span>
                <span class="text-xs text-gray-300">{{ selectedNotification.date }}</span>
              </div>
              <h2 class="mt-4 text-2xl font-black leading-tight text-gray-800">{{ selectedNotification.title }}</h2>
            </div>
            <button type="button" class="rounded-full p-2 text-gray-300 hover:bg-gray-50 hover:text-gray-500" @click="closeDetail">
              <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div class="px-6 py-6">
            <p class="text-sm leading-8 text-gray-600">{{ selectedNotification.message }}</p>
          </div>

          <div class="flex flex-col gap-3 border-t border-gray-100 px-6 py-5 sm:flex-row sm:justify-end">
            <button
              type="button"
              class="rounded-full border border-gray-200 px-5 py-3 text-sm font-bold text-gray-500 hover:border-gray-300 hover:text-gray-700"
              @click="closeDetail"
            >
              關閉
            </button>
            <button
              v-if="!selectedNotification.read"
              type="button"
              class="rounded-full border border-brand-primary px-5 py-3 text-sm font-bold text-brand-primary hover:bg-brand-surface"
              @click="markCurrentAsRead"
            >
              標記已讀
            </button>
            <router-link
              v-if="selectedNotification.to"
              :to="selectedNotification.to"
              class="inline-flex items-center justify-center rounded-full bg-brand-primary px-5 py-3 text-sm font-bold text-white"
              @click.native="closeDetail"
            >
              前往查看
            </router-link>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import AccountSidebar from '@/components/account/AccountSidebar.vue'
import AccountContentHeader from '@/components/account/AccountContentHeader.vue'

interface NotificationItem {
  id: number
  category: string
  title: string
  message: string
  date: string
  read: boolean
  to?: string
}

export default Vue.extend({
  name: 'NotificationCenterView',
  components: { AccountSidebar, AccountContentHeader },
  data() {
    return {
      activeFilter: '個人通知',
      currentPage: 1,
      pageSize: 8,
      selectedNotification: null as NotificationItem | null,
      notifications: [
        { id: 1, category: '個人通知', title: '訂單 OG98765432 尚待付款', message: '這筆訂單尚未完成付款，可前往訂單明細查看付款資訊與訂單內容。', date: '2026.04.29 09:10', read: false, to: '/account/orders/OG98765432' },
        { id: 2, category: '個人通知', title: '訂單 OG65432108 配送資訊更新', message: '你的訂單已進入備貨流程，預計到貨與配送資訊可於訂單明細查看。', date: '2026.04.28 14:35', read: false, to: '/account/orders/OG65432108' },
        { id: 3, category: '活動通知', title: '會員首購禮已發送至帳戶', message: '你可於折價券頁查看並使用會員首購禮，結帳時可直接折抵符合條件的商品。', date: '2026.04.27 10:00', read: true, to: '/account/coupons' },
        { id: 4, category: '重要訊息', title: '會員條款已更新', message: '會員服務條款已更新，建議你查看最新內容，了解會員權益與服務規範。', date: '2026.04.26 08:30', read: true, to: '/member-terms' },
        { id: 5, category: '個人通知', title: 'OP 點數 120 點已入帳', message: '感謝本次消費，點數已匯入你的會員帳戶，可於結帳時折抵使用。', date: '2026.04.25 18:20', read: false, to: '/account/credits' },
        { id: 6, category: '個人通知', title: '購物金即將到期', message: '你的部分購物金將於月底到期，可於購物金明細查看可用餘額與到期日。', date: '2026.04.24 12:00', read: true, to: '/account/credits' },
        { id: 7, category: '個人通知', title: '常用地址已更新', message: '你的預設收件地址已更新，結帳時會優先帶入最新常用地址。', date: '2026.04.23 16:40', read: true, to: '/account/addresses' },
        { id: 8, category: '個人通知', title: '收藏商品補貨提醒', message: '你收藏的商品已有庫存，可前往收藏清單查看並加入購物車。', date: '2026.04.22 11:25', read: false, to: '/account/wishlist' },
        { id: 9, category: '個人通知', title: '訂單 OG44321987 已出貨', message: '你的訂單已交由物流夥伴配送，請留意配送通知與收件資訊。', date: '2026.04.21 15:10', read: true, to: '/account/orders/OG44321987' },
        { id: 10, category: '活動通知', title: '綠色生活節優惠開始', message: '精選商品限時優惠中，符合條件可搭配會員折價券使用。', date: '2026.04.20 10:30', read: true, to: '/products' },
        { id: 11, category: '重要訊息', title: '帳號安全提醒', message: '建議定期確認會員資料與聯絡方式，確保訂單與通知可正常送達。', date: '2026.04.19 09:00', read: false, to: '/account/profile' },
      ] as NotificationItem[],
    }
  },
  computed: {
    filters(): string[] {
      return ['活動通知', '個人通知', '重要訊息']
    },
    filteredNotifications(): NotificationItem[] {
      return this.notifications.filter((item) => item.category === this.activeFilter)
    },
    paginatedNotifications(): NotificationItem[] {
      const start = (this.currentPage - 1) * this.pageSize
      return this.filteredNotifications.slice(start, start + this.pageSize)
    },
    totalPages(): number {
      return Math.ceil(this.filteredNotifications.length / this.pageSize)
    },
    unreadCount(): number {
      return this.notifications.filter((item) => !item.read).length
    },
  },
  watch: {
    activeFilter() {
      this.currentPage = 1
    },
  },
  methods: {
    markAsRead(id: number) {
      const target = this.notifications.find((item) => item.id === id)
      if (target) target.read = true
    },
    openDetail(item: NotificationItem) {
      this.selectedNotification = item
    },
    closeDetail() {
      this.selectedNotification = null
    },
    markCurrentAsRead() {
      if (!this.selectedNotification) return
      this.markAsRead(this.selectedNotification.id)
    },
    markAllAsRead() {
      this.notifications.forEach((item) => {
        item.read = true
      })
    },
    previousPage() {
      if (this.currentPage > 1) this.currentPage--
    },
    nextPage() {
      if (this.currentPage < this.totalPages) this.currentPage++
    },
  },
})
</script>

<style scoped>
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.2s ease;
}

.modal-fade-enter,
.modal-fade-leave-to {
  opacity: 0;
}
</style>
