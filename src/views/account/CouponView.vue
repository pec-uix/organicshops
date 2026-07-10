<template>
  <div class="min-h-screen bg-gray-50 pb-16">
    <!-- ══ 主內容：側邊選單 + 內容 ══ -->
    <div class="max-w-7xl mx-auto px-4 pt-6 flex flex-col gap-4 lg:flex-row lg:gap-6 lg:items-start">

      <AccountSidebar active-key="coupons" subtitle="會員" />

      <!-- ── 右側：內容區 ── -->
      <div class="flex-1 min-w-0 space-y-4">
        <section class="rounded-2xl border border-gray-100 bg-white px-5 py-5 shadow-sm sm:px-6">
          <div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div class="min-w-0">
              <h1 class="type-page-title">
                折價券
              </h1>
              <p class="mt-2 type-muted text-gray-400">
                查看可使用、已使用與已過期的折價券。
              </p>
            </div>

            <div class="inline-flex min-w-[230px] items-center gap-3 self-start rounded-full border border-brand-primary/20 bg-brand-surface/50 px-4 py-2.5 shadow-sm">
              <div class="flex h-16 w-16 items-center justify-center rounded-full bg-brand-primary text-white shadow-sm">
                <svg class="h-10 w-10" viewBox="0 0 48 48" fill="none" aria-hidden="true">
                  <path
                    d="M8 15.5C8 12.46 10.46 10 13.5 10h21C37.54 10 40 12.46 40 15.5v4.1c-2.42.66-4.2 2.88-4.2 5.5s1.78 4.84 4.2 5.5v1.9c0 3.04-2.46 5.5-5.5 5.5h-21C10.46 38 8 35.54 8 32.5v-1.9c2.42-.66 4.2-2.88 4.2-5.5s-1.78-4.84-4.2-5.5v-4.1Z"
                    stroke="currentColor"
                    stroke-width="3"
                    stroke-linejoin="round"
                  />
                  <path d="M29.5 17.5 18.5 32.5" stroke="currentColor" stroke-width="3" stroke-linecap="round" />
                  <circle cx="18" cy="18" r="2.35" fill="currentColor" />
                  <circle cx="30" cy="32" r="2.35" fill="currentColor" />
                </svg>
              </div>
              <p class="whitespace-nowrap text-sm font-bold tracking-[0.12em] text-brand-primary">
                目前可用折價券 <span class="mx-1.5 text-4xl font-black tracking-normal text-brand-primary">{{ getCouponCount('available') }}</span> 張
              </p>
            </div>
          </div>
        </section>

        <!-- Tab 切換 -->
        <div class="flex gap-6 border-b border-slate-200 bg-transparent">
          <button
            v-for="tab in tabs"
            :key="tab.value"
            class="relative -mb-px flex items-center justify-center gap-2 px-1 pb-3 pt-2 text-sm transition-colors"
            :class="activeTab === tab.value
              ? 'border-b-2 border-brand-primary font-black text-brand-primary'
              : 'border-b-2 border-transparent font-bold text-slate-400 hover:text-slate-600'"
            @click="activeTab = tab.value"
          >
            <span>{{ tab.label }}</span>
            <span
              class="rounded-full px-2 py-0.5 text-[11px] font-black"
              :class="activeTab === tab.value ? 'bg-brand-surface text-brand-primary' : 'bg-slate-100 text-slate-400'"
            >
              {{ getCouponCount(tab.value) }}
            </span>
          </button>
        </div>

        <!-- 折價券列表 -->
        <div v-if="filteredCoupons.length > 0" class="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-2">
          <div
            v-for="coupon in filteredCoupons"
            :key="coupon.id"
            class="group relative flex overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
            :class="{ 'opacity-50': activeTab !== 'available' }"
          >
            <!-- 左側額度 -->
            <div class="flex w-32 flex-shrink-0 flex-col justify-center rounded-l-xl border-l border-t border-brand-primary/10 bg-brand-surface/40 px-4 py-3 sm:w-36">
              <div class="text-center">
                <div class="text-2xl font-bold tracking-tight text-brand-primary">
                  ${{ coupon.amount }}
                </div>
                <div class="mt-1.5 text-[11px] font-medium leading-5 text-slate-500">
                  <span class="block">
                    {{ coupon.condition.replace(' 可折抵', '').replace(' 可使用', '') }}
                  </span>
                  <span class="block">
                    {{ coupon.condition.includes('可折抵') ? '可折抵' : (coupon.condition.includes('可使用') ? '可使用' : '') }}
                  </span>
                </div>
                <span
                  v-if="isExpiringSoon(coupon.expiryDate) && activeTab === 'available'"
                  class="mt-2 inline-flex self-center rounded-full border border-red-100 bg-red-50 px-2 py-0.5 text-[10px] font-bold text-red-500"
                >
                  即將過期
                </span>
              </div>
            </div>

            <!-- 右側資訊 -->
            <div class="flex min-w-0 flex-1 items-start gap-4 bg-white px-6 py-3 ring-1 ring-inset ring-brand-primary/10">
              <div class="min-w-0 flex-1 space-y-1.5">
                <div class="flex items-start gap-3">
                  <h3 class="min-w-0 flex-1 text-lg font-bold leading-6 text-slate-800">
                    {{ coupon.title }}
                  </h3>
                </div>
                <p
                  class="text-xs leading-6"
                  :class="isExpiringSoon(coupon.expiryDate) && activeTab === 'available' ? 'font-medium text-red-600/90' : 'text-slate-400'"
                >
                  期限：{{ coupon.expiryDate }}
                </p>
                <div class="border-b border-slate-200"></div>
                <div class="space-y-1">
                  <p class="text-xs text-slate-500">
                    {{ coupon.condition }}
                  </p>
                  <div class="flex items-center justify-between gap-3">
                    <p class="flex min-w-0 items-center gap-1.5 text-xs text-slate-500">
                      <span>{{ coupon.scope === '全館商品' ? '適用全館商品' : '適用部分商品' }}</span>
                      <button
                        type="button"
                        class="inline-flex h-3.5 w-3.5 items-center justify-center rounded-full bg-slate-100 text-[10px] font-bold text-slate-500 transition-colors hover:bg-slate-200"
                        aria-label="適用範圍說明"
                        title="適用範圍說明"
                        @click.stop="openScopeRuleModal(coupon)"
                      >
                        !
                      </button>
                    </p>
                    <router-link
                      v-if="activeTab === 'available'"
                      to="/products"
                      class="inline-flex shrink-0 items-center whitespace-nowrap rounded-full bg-brand-primary px-5 py-2 text-xs font-bold text-white shadow-sm transition-colors hover:bg-brand-dark"
                    >
                      立即使用
                    </router-link>
                    <div
                      v-else
                      class="inline-flex shrink-0 items-center whitespace-nowrap rounded-full bg-slate-100 px-5 py-2 text-xs font-medium text-slate-400"
                    >
                      {{ activeTab === 'used' ? '已使用' : '已過期' }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 空狀態 -->
        <div v-else class="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-white px-6 py-24 text-center shadow-sm">
          <div class="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-brand-surface text-brand-primary">
            <svg class="h-9 w-9" viewBox="0 0 48 48" fill="none" aria-hidden="true">
              <path
                d="M8 15.5C8 12.46 10.46 10 13.5 10h21C37.54 10 40 12.46 40 15.5v4.1c-2.42.66-4.2 2.88-4.2 5.5s1.78 4.84 4.2 5.5v1.9c0 3.04-2.46 5.5-5.5 5.5h-21C10.46 38 8 35.54 8 32.5v-1.9c2.42-.66 4.2-2.88 4.2-5.5s-1.78-4.84-4.2-5.5v-4.1Z"
                stroke="currentColor"
                stroke-width="3"
                stroke-linejoin="round"
              />
              <path d="M29.5 17.5 18.5 32.5" stroke="currentColor" stroke-width="3" stroke-linecap="round" />
              <circle cx="18" cy="18" r="2.35" fill="currentColor" />
              <circle cx="30" cy="32" r="2.35" fill="currentColor" />
            </svg>
          </div>
          <h2 class="mb-2 text-lg font-bold text-gray-700">{{ emptyState.title }}</h2>
          <p class="mb-7 text-sm text-gray-400">{{ emptyState.description }}</p>
          <router-link to="/products" class="btn-primary px-8 py-3">
            {{ emptyState.actionText }}
          </router-link>
        </div>

        <!-- 注意事項 -->
        <div class="px-1 py-2">
          <h4 class="mb-2 flex items-center gap-1.5 text-xs font-bold text-slate-500">
            <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            使用說明與注意事項
          </h4>
          <ul class="list-inside list-disc space-y-1.5 text-xs leading-relaxed text-slate-500">
            <li>單筆訂單僅限使用一張折價券，不可與其他優惠券併用。</li>
            <li>折價券一經使用即失效，如發生退貨，原券恕不補發或折現。</li>
            <li>請於有效期限內完成訂單結帳，逾期視同放棄，恕不展延。</li>
            <li>統一生機保留活動最終解釋、變更及終止之權利。</li>
          </ul>
        </div>
      </div>
    </div>

    <transition name="modal-fade">
      <div
        v-if="scopeRuleCoupon"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6"
        @click.self="closeScopeRuleModal"
      >
        <div class="w-full max-w-lg rounded-2xl bg-white shadow-xl">
          <div class="flex items-start justify-between gap-4 border-b border-slate-100 px-5 py-4">
            <div>
              <p class="text-[11px] font-bold uppercase tracking-[0.2em] text-brand-primary">使用說明</p>
              <h3 class="mt-1 text-lg font-bold text-slate-800">{{ scopeRuleCoupon.title }}</h3>
            </div>
            <button type="button" class="rounded-full p-2 text-slate-400 hover:bg-slate-50 hover:text-slate-600" @click="closeScopeRuleModal">
              <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div class="space-y-4 px-5 py-4">
            <div class="rounded-xl bg-slate-50 px-4 py-3">
              <p class="text-xs font-bold text-slate-500">適用商品</p>
              <p class="mt-1 text-sm leading-6 text-slate-700">
                {{ scopeRuleCoupon.scope === '全館商品' ? '適用全館商品，結帳時可直接折抵。' : `適用${scopeRuleCoupon.scope}，結帳時請留意商品分類。` }}
              </p>
            </div>

            <div class="space-y-2">
              <p class="text-xs font-bold text-slate-500">折價券規則</p>
              <ul class="list-inside list-disc space-y-1.5 text-sm leading-6 text-slate-600">
                <li>單筆訂單僅限使用一張折價券，不可與其他優惠券併用。</li>
                <li>折價券一經使用即失效，如發生退貨，原券恕不補發或折現。</li>
                <li>請於有效期限內完成訂單結帳，逾期視同放棄，恕不展延。</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import AccountSidebar from '@/components/account/AccountSidebar.vue'

interface Coupon {
  id:         number
  title:      string
  amount:     number
  condition:  string
  expiryDate: string
  scope:      string
  status:     'available' | 'used' | 'expired'
  usedDate?:  string
}

// 取得相對日期的字串 (YYYY-MM-DD)
function getRelativeDate(days: number): string {
  const date = new Date()
  date.setDate(date.getDate() + days)
  return date.toISOString().split('T')[0]
}

export default Vue.extend({
  name: 'CouponView',
  components: { AccountSidebar },
  created() {
    document.title = '折價券'
  },

  data() {
    return {
      activeTab: 'available' as 'available' | 'used' | 'expired',
      scopeRuleCoupon: null as Coupon | null,
      
      tabs: [
        { label: '可使用', value: 'available' },
        { label: '已使用', value: 'used' },
        { label: '已過期', value: 'expired' },
      ],

      coupons: [
        {
          id:         1,
          title:      '新會員專屬禮金',
          amount:     100,
          condition:  '全館單筆滿 $1,000 可折抵',
          expiryDate: getRelativeDate(1), // 1天後過期 (應顯示紅色)
          scope:      '全館商品',
          status:     'available',
        },
        {
          id:         2,
          title:      '端午佳節慶祝券',
          amount:     50,
          condition:  '全館單筆滿 $500 可折抵',
          expiryDate: getRelativeDate(15),
          scope:      '冷凍/冷藏商品',
          status:     'available',
        },
        {
          id:         3,
          title:      '綠色生活節',
          amount:     200,
          condition:  '單筆滿 $1,500 可折抵',
          expiryDate: getRelativeDate(30),
          scope:      '有機蔬菜、在地水果',
          status:     'available',
        },
        {
          id:         4,
          title:      '會員首購禮',
          amount:     80,
          condition:  '會員首次下單不限金額',
          expiryDate: getRelativeDate(45),
          scope:      '全館商品',
          status:     'available',
        },
        {
          id:         5,
          title:      '春季購物回饋',
          amount:     150,
          condition:  '單筆滿 $1,200 可折抵',
          expiryDate: '2026-03-31',
          scope:      '全館商品',
          status:     'used',
          usedDate:   '2026-03-15',
        },
        {
          id:         6,
          title:      '跨年加碼優惠',
          amount:     80,
          condition:  '單筆滿 $800 可使用',
          expiryDate: '2025-12-31',
          scope:      '全館商品',
          status:     'expired',
        },
      ] as Coupon[],
    }
  },

  computed: {
    filteredCoupons(): Coupon[] {
      return this.coupons.filter(c => c.status === this.activeTab)
    },
    emptyState(): { title: string; description: string; actionText: string } {
      const states = {
        available: {
          title:       '目前沒有可使用折價券',
          description: '我們會不定期提供會員專屬優惠，歡迎先逛逛精選商品。',
          actionText:  '去逛逛商品',
        },
        used: {
          title:       '目前沒有已使用折價券',
          description: '使用過的折價券會保留在這裡，方便你回顧優惠紀錄。',
          actionText:  '查看商品',
        },
        expired: {
          title:       '目前沒有已過期折價券',
          description: '過期折價券會集中顯示在這裡，方便你確認使用期限。',
          actionText:  '查看商品',
        },
      }

      return states[this.activeTab]
    },
  },

  methods: {
    openScopeRuleModal(coupon: Coupon) {
      this.scopeRuleCoupon = coupon
    },

    closeScopeRuleModal() {
      this.scopeRuleCoupon = null
    },

    isExpiringSoon(expiryDate: string): boolean {
      const today = new Date()
      const expiry = new Date(expiryDate)
      const diffTime = expiry.getTime() - today.getTime()
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      return diffDays >= 0 && diffDays < 3
    },

    getCouponCount(status: string): number {
      return this.coupons.filter(c => c.status === status).length
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

.btn-primary {
  @apply bg-brand-primary text-white rounded-xl hover:bg-brand-dark transition-colors shadow-sm active:scale-[0.98] font-bold;
}
</style>
