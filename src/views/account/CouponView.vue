<template>
  <div class="min-h-screen bg-brand-bg pb-16">
    <!-- ══ 主內容：側邊選單 + 內容 ══ -->
    <div class="max-w-7xl mx-auto px-4 pt-6 flex gap-6 items-start">

      <AccountSidebar active-key="coupons" subtitle="會員" />

      <!-- ── 右側：內容區 ── -->
      <div class="flex-1 min-w-0 space-y-4">
        <AccountContentHeader
          title="折價券"
          subtitle="查看可使用、已使用與已過期的折價券。"
          eyebrow="折價券"
        />
        
        <!-- Tab 切換 -->
        <div class="bg-white rounded-2xl shadow-sm p-1.5 flex gap-1">
          <button
            v-for="tab in tabs"
            :key="tab.value"
            class="flex-1 py-2.5 text-sm font-bold transition-all rounded-xl relative"
            :class="activeTab === tab.value
              ? 'bg-brand-primary text-white shadow-md'
              : 'text-gray-400 hover:text-gray-600'"
            @click="activeTab = tab.value"
          >
            {{ tab.label }}
            <span v-if="getCouponCount(tab.value) > 0 && activeTab !== tab.value" class="ml-1 text-[10px] opacity-60">
              ({{ getCouponCount(tab.value) }})
            </span>
          </button>
        </div>

        <!-- 折價券列表 -->
        <div v-if="filteredCoupons.length > 0" class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-4">
          <div
            v-for="coupon in filteredCoupons"
            :key="coupon.id"
            class="bg-white rounded-2xl shadow-sm overflow-hidden flex border border-gray-50 group transition-all hover:shadow-md h-32"
            :class="{ 'opacity-60 grayscale-[0.3]': activeTab !== 'available' }"
          >
            <!-- 左側額度 -->
            <div
              class="w-28 flex flex-col items-center justify-center p-4 text-white relative flex-shrink-0"
              :class="activeTab === 'available' ? 'bg-brand-primary' : 'bg-gray-400'"
            >
              <!-- 鋸齒裝飾 -->
              <div class="absolute inset-y-0 -right-1 w-2 flex flex-col justify-around py-1">
                <div v-for="i in 6" :key="i" class="w-2 h-2 rounded-full bg-white"></div>
              </div>
              
              <div class="text-[10px] font-medium opacity-80 mb-0.5">OFF</div>
              <div class="flex items-baseline">
                <span class="text-sm font-bold mr-0.5">$</span>
                <span class="text-3xl font-black">{{ coupon.amount }}</span>
              </div>
            </div>

            <!-- 右側資訊 -->
            <div class="flex-1 p-4 flex flex-col justify-between min-w-0">
              <div class="min-w-0">
                <h3 class="font-bold text-gray-800 truncate text-sm mb-1">
                  {{ coupon.title }}
                </h3>
                <p class="text-[11px] text-gray-500 mb-2 leading-tight truncate">
                  {{ coupon.condition }}
                </p>
                <div class="space-y-0.5">
                  <p class="text-[10px] text-gray-400 truncate">
                    適用：{{ coupon.scope }}
                  </p>
                  <p
                    class="text-[10px] flex items-center gap-1"
                    :class="isExpiringSoon(coupon.expiryDate) && activeTab === 'available' ? 'text-red-500 font-bold' : 'text-gray-400'"
                  >
                    期限：{{ coupon.expiryDate }}
                    <span v-if="isExpiringSoon(coupon.expiryDate) && activeTab === 'available'">(即將過期)</span>
                  </p>
                </div>
              </div>

              <div class="flex justify-end">
                <router-link
                  v-if="activeTab === 'available'"
                  to="/products"
                  class="text-[10px] font-bold text-brand-primary border border-brand-primary/30 px-3 py-1 rounded-full hover:bg-brand-surface transition-colors"
                >
                  立即使用
                </router-link>
                <span v-else class="text-[10px] font-bold text-gray-400 italic">
                  {{ activeTab === 'used' ? '已使用' : '已過期' }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- 空狀態 -->
        <div v-else class="flex flex-col items-center justify-center py-24 text-center bg-white rounded-2xl shadow-sm">
          <div class="text-6xl mb-5 select-none grayscale opacity-20">🎟️</div>
          <h2 class="font-bold text-gray-700 text-lg mb-2">目前沒有可用的折價券</h2>
          <p class="text-sm text-gray-400 mb-7">別擔心！我們會不定期發送專屬優惠。</p>
          <router-link to="/products" class="btn-primary px-8 py-3">
            去逛逛商品
          </router-link>
        </div>

        <!-- 注意事項 -->
        <div class="bg-white/50 rounded-2xl p-5 border border-gray-100/50">
          <h4 class="text-xs font-bold text-gray-500 mb-3 flex items-center gap-1.5">
            <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            使用說明與注意事項
          </h4>
          <ul class="text-[11px] text-gray-400 space-y-1.5 list-disc list-inside leading-relaxed">
            <li>單筆訂單僅限使用一張折價券，不可與其他優惠券併用。</li>
            <li>折價券一經使用即失效，如發生退貨，原券恕不補發或折現。</li>
            <li>請於有效期限內完成訂單結帳，逾期視同放棄，恕不展延。</li>
            <li>統一生機保留活動最終解釋、變更及終止之權利。</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import AccountSidebar from '@/components/account/AccountSidebar.vue'
import AccountContentHeader from '@/components/account/AccountContentHeader.vue'

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
  components: { AccountSidebar, AccountContentHeader },
  created() {
    document.title = '折價券'
  },

  data() {
    return {
      activeTab: 'available' as 'available' | 'used' | 'expired',
      
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
  },

  methods: {
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
.btn-primary {
  @apply bg-brand-primary text-white rounded-xl hover:bg-brand-dark transition-colors shadow-sm active:scale-[0.98] font-bold;
}
</style>
