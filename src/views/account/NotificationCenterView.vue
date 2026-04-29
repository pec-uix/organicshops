<template>
  <div class="min-h-screen bg-brand-bg pb-16">
    <div class="max-w-7xl mx-auto px-4 pt-6 flex gap-6 items-start">
      <AccountSidebar active-key="notifications" subtitle="會員" />

      <div class="flex-1 min-w-0 space-y-6">
        <AccountContentHeader
          title="通知中心"
          subtitle="查看訂單、優惠、帳號與系統提醒。"
          eyebrow="通知中心"
        />

        <section class="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p class="text-sm text-gray-500">未讀通知</p>
              <p class="mt-1 text-3xl font-black text-gray-800">{{ unreadCount }}</p>
            </div>
            <div class="flex flex-col gap-3 lg:items-end">
              <button
                type="button"
                class="rounded-full border border-brand-primary px-4 py-2 text-sm font-bold text-brand-primary transition-all hover:bg-brand-surface disabled:cursor-not-allowed disabled:border-gray-200 disabled:text-gray-300"
                :disabled="unreadCount === 0"
                @click="markAllAsRead"
              >
                全部標記已讀
              </button>
              <div class="flex flex-wrap gap-3">
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
            </div>
          </div>
        </section>

        <section class="space-y-4">
          <article
            v-for="item in filteredNotifications"
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

          <div v-if="filteredNotifications.length === 0" class="rounded-2xl border border-dashed border-gray-200 bg-white px-6 py-16 text-center">
            <div class="text-4xl">🔔</div>
            <p class="mt-4 text-lg font-bold text-gray-700">目前沒有這個分類的通知</p>
            <p class="mt-2 text-sm text-gray-500">你可以切換其他分類查看。</p>
          </div>
        </section>
      </div>
    </div>

    <transition name="modal-fade">
      <div v-if="selectedNotification" class="fixed inset-0 z-[80] flex items-center justify-center bg-black/40 px-4 py-6" @click="closeDetail">
        <div class="w-full max-w-2xl overflow-hidden rounded-[2rem] bg-white shadow-2xl" @click.stop>
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
      activeFilter: '全部',
      selectedNotification: null as NotificationItem | null,
      notifications: [
        { id: 1, category: '訂單通知', title: '訂單 OG98765432 已完成付款', message: '我們已收到你的付款，正在安排商品備貨與出貨流程。', date: '2026.04.29 09:10', read: false, to: '/account/orders/OG98765432' },
        { id: 2, category: '配送通知', title: '你的包裹已出貨', message: '訂單 OG65432108 已由物流夥伴配送中，可前往訂單頁查看最新配送狀態。', date: '2026.04.28 14:35', read: false, to: '/account/orders/OG65432108' },
        { id: 3, category: '優惠通知', title: '會員首購禮已發送至帳戶', message: '你可於折價券頁查看並使用「會員首購禮」，結帳時可直接折抵。', date: '2026.04.27 10:00', read: true, to: '/account/coupons' },
        { id: 4, category: '系統通知', title: '會員條款已更新', message: '我們已更新會員服務條款內容，建議你前往查看最新版本。', date: '2026.04.26 08:30', read: true, to: '/member-terms' },
        { id: 5, category: '點數通知', title: 'OP 點數 120 點已入帳', message: '感謝本次消費，點數已匯入你的會員帳戶，可於結帳時折抵使用。', date: '2026.04.25 18:20', read: false, to: '/account/credits' },
      ] as NotificationItem[],
    }
  },
  computed: {
    filters(): string[] {
      const categories = this.notifications.map((item) => item.category)
      return ['全部', ...Array.from(new Set(categories))]
    },
    filteredNotifications(): NotificationItem[] {
      if (this.activeFilter === '全部') return this.notifications
      return this.notifications.filter((item) => item.category === this.activeFilter)
    },
    unreadCount(): number {
      return this.notifications.filter((item) => !item.read).length
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
