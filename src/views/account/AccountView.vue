<template>
  <div class="min-h-screen bg-gray-50 pb-16">
    <!-- ══ 主內容：側邊選單 + 帳戶總覽 ══ -->
    <div class="max-w-7xl mx-auto px-4 pt-6 flex flex-col gap-4 lg:flex-row lg:gap-6 lg:items-start">

      <AccountSidebar active-key="account" subtitle="會員" />

      <!-- ── 右側：內容區 (符合 AddressView 原則) ── -->
      <div class="flex-1 min-w-0 space-y-4">
        <!-- 2. 會員等級與晉升 -->
        <section
          class="rounded-2xl border border-gray-100 bg-white shadow-sm"
          :class="isVipMember ? 'p-4 sm:px-6 sm:py-5' : 'p-5 sm:p-6'"
        >
          <div v-if="isVipMember" class="space-y-4">
            <div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div class="min-w-0">
                <h3 class="mb-1 text-sm text-gray-500">會員等級</h3>
                <div class="flex flex-wrap items-center gap-3">
                  <p class="text-3xl font-black text-[#E8A020]">{{ levelLabel }}</p>
                  <p class="text-sm font-bold text-gray-700">您已是 VIP 會員</p>
                </div>
                <p class="mt-1 text-xs font-medium text-gray-500">目前享有 VIP 專屬權益</p>
              </div>
              <div
                class="self-start rounded-full bg-brand-surface px-3 py-1 text-xs font-bold text-brand-primary"
              >
                10% 購物金回饋
              </div>
            </div>

            <div class="grid grid-cols-1 gap-2 sm:grid-cols-2">
              <div
                v-for="benefit in vipBenefits"
                :key="benefit"
                class="flex items-center rounded-lg bg-gray-50/80 p-3.5 text-xs font-bold text-gray-700"
              >
                <span class="mr-2.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-surface text-brand-primary">
                  <svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 20 20" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.2" d="M5 10.5l3 3L15 7" />
                  </svg>
                </span>
                <span>{{ benefit }}</span>
              </div>
            </div>
          </div>

          <div v-else class="space-y-4">
            <div class="mb-5">
              <h3 class="mb-1 text-sm text-gray-500">會員等級</h3>
              <p class="text-3xl font-black text-gray-800">
                {{ levelLabel }}
              </p>
            </div>

            <div
              v-if="isNearVip"
              class="rounded-xl border border-[#E6EFE0] bg-brand-surface/40 px-4 py-3"
            >
              <p class="text-sm font-bold text-brand-primary">您即將升級 VIP！</p>
              <p class="mt-1 text-xs font-bold text-brand-primary">
                再消費 {{ formatCurrency(remainingSpent) }}，或再完成 {{ remainingPurchaseCount }} 筆滿 {{ formatCurrency(memberData.qualifiedPurchaseMinAmount) }} 的訂單，即可升級 VIP 並享有 10% 購物金回饋。
              </p>
            </div>
            <div v-else>
              <p class="text-sm font-bold text-gray-600">達成任一條件即可升級 VIP</p>
            </div>

            <div class="space-y-5">
              <div>
                <div class="mb-1 flex items-end justify-between gap-4 text-xs font-bold text-gray-500">
                  <span>年度累積消費金額</span>
                  <span class="text-right tabular-nums">{{ formatCurrency(memberData.annualSpent) }} / {{ formatCurrency(memberData.vipSpentTarget) }}</span>
                </div>
                <div class="h-2 overflow-hidden rounded-full bg-gray-100">
                  <div
                    class="h-full rounded-full bg-brand-primary transition-all duration-500"
                    :style="{ width: spentProgress + '%' }"
                  ></div>
                </div>
                <p class="mt-2 text-[11px] font-medium text-gray-400">
                  還差 {{ formatCurrency(remainingSpent) }} 可達成 VIP
                </p>
              </div>

              <div>
                <div class="mb-1 flex items-end justify-between gap-4 text-xs font-bold text-gray-500">
                  <span>年度有效消費次數</span>
                  <span class="text-right tabular-nums">{{ memberData.qualifiedPurchaseCount }} / {{ memberData.vipPurchaseTarget }} 次</span>
                </div>
                <div class="h-2 overflow-hidden rounded-full bg-gray-100">
                  <div
                    class="h-full rounded-full bg-brand-primary transition-all duration-500"
                    :style="{ width: purchaseProgress + '%' }"
                  ></div>
                </div>
                <p class="mt-2 text-[11px] font-medium text-gray-400">
                  還差 {{ remainingPurchaseCount }} 筆滿 {{ formatCurrency(memberData.qualifiedPurchaseMinAmount) }} 的訂單可達成 VIP
                </p>
              </div>
            </div>

            <div>
              <p class="text-[11px] font-medium leading-5 text-gray-400">
                有效消費次數僅計算單筆訂單滿 {{ formatCurrency(memberData.qualifiedPurchaseMinAmount) }} 的消費。
              </p>
            </div>
          </div>
        </section>

        <!-- 3. 資產三格卡片 -->
        <div class="mb-4 grid w-full grid-cols-1 items-stretch gap-4 md:grid-cols-3">
          <div
            v-for="asset in memberAssets"
            :key="asset.label"
            class="flex h-full min-h-[280px] flex-col justify-between rounded-2xl border border-gray-100 bg-white px-5 pb-5 pt-6 shadow-sm transition-shadow hover:shadow-md"
          >
            <div class="mb-5 flex items-center justify-between">
              <div
                class="flex h-14 w-14 items-center justify-center rounded-full"
                :class="asset.iconBgClass || 'bg-[#F7F5F0] text-[#2D6A2D]'"
              >
                <img
                  :src="assetIconSrc(asset.iconKey)"
                  :alt="asset.label"
                  :class="asset.iconKey === 'op' ? 'h-auto w-[58px] max-w-none' : 'h-auto w-20 max-w-none'"
                />
              </div>
              <span
                v-if="asset.footerClass === 'text-red-600'"
                class="text-[10px] bg-red-50 text-red-500 px-2 py-0.5 rounded-full border border-red-100"
              >
                {{ asset.footer }}
              </span>
            </div>
            <div class="pt-1">
              <div class="text-gray-500 text-sm">{{ asset.label }}</div>
              <div class="text-2xl font-black text-gray-800 mt-1">
                <span v-if="asset.unit === '$'" class="text-sm mr-0.5">$</span>{{ asset.value.toLocaleString() }}
                <span v-if="asset.unit === 'pts'" class="text-xs text-gray-400 font-normal ml-1">點</span>
              </div>
              <p class="mt-2 text-xs leading-5 text-gray-400">{{ asset.description }}</p>
            </div>
            <div class="mt-auto flex justify-end pt-4">
              <router-link
                v-if="asset.to"
                :to="asset.to"
                class="text-xs font-bold text-brand-primary underline-offset-4 decoration-brand-primary hover:text-brand-primary hover:underline focus:text-brand-primary focus:underline focus:outline-none"
              >
                查看明細
              </router-link>
            </div>
          </div>
        </div>

        <!-- 4. 最新消息 -->
        <section class="mt-6 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <div class="mb-2 flex items-center justify-between border-b border-gray-100 pb-3">
            <h3 class="text-lg font-bold text-gray-800">最新消息</h3>
            <router-link
              to="/news"
              class="text-sm font-bold text-brand-primary hover:text-brand-dark"
            >
              查看更多 &gt;
            </router-link>
          </div>

          <div>
            <router-link
              v-for="news in latestNews"
              :key="news.title"
              :to="news.to"
              class="flex flex-col gap-2 border-b border-gray-100 py-3 last:border-0 sm:flex-row sm:items-center sm:justify-between"
            >
              <div class="flex min-w-0 items-center">
                <span class="mr-3 shrink-0 rounded-full border border-brand-primary px-2 py-0.5 text-xs font-bold text-brand-primary">
                  {{ news.category }}
                </span>
                <span class="truncate text-sm font-medium text-gray-700 hover:text-brand-primary">
                  {{ news.title }}
                </span>
              </div>
              <span class="ml-4 shrink-0 text-sm text-gray-400 sm:text-right">{{ news.date }}</span>
            </router-link>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import AccountSidebar from '@/components/account/AccountSidebar.vue'

export default Vue.extend({
  name: 'AccountView',
  components: { AccountSidebar },
  data() {
      return {
      memberData: {
        annualSpent: 10500,
        vipSpentTarget: 15000,
        qualifiedPurchaseCount: 8,
        vipPurchaseTarget: 12,
        qualifiedPurchaseMinAmount: 1200,
        credits: 900,
        creditsExpiry: '06/30',
        opPoints: 1250,
        couponCount: 3,
      },
    }
  },
  computed: {
    currentUser(): { memberLevel?: 'normal' | 'vip'; memberTierLabel?: string } | null {
      return this.$store.getters['auth/currentUser']
    },
    isVipMember(): boolean {
      return this.currentUser?.memberLevel === 'vip' || this.currentUser?.memberTierLabel === 'VIP'
    },
    levelLabel(): string {
      return this.isVipMember ? 'VIP' : '一般會員'
    },
    spentProgress(): number {
      return Math.min(100, Math.round((this.memberData.annualSpent / this.memberData.vipSpentTarget) * 100))
    },
    purchaseProgress(): number {
      return Math.min(100, Math.round((this.memberData.qualifiedPurchaseCount / this.memberData.vipPurchaseTarget) * 100))
    },
    remainingSpent(): number {
      return Math.max(0, this.memberData.vipSpentTarget - this.memberData.annualSpent)
    },
    remainingPurchaseCount(): number {
      return Math.max(0, this.memberData.vipPurchaseTarget - this.memberData.qualifiedPurchaseCount)
    },
    isNearVip(): boolean {
      return this.remainingSpent <= 1000 || this.remainingPurchaseCount <= 2
    },
    vipBenefits(): string[] {
      return [
        '滿 $1,200 享 10% 購物金回饋',
        '生日購物金 $200',
        'VIP 首筆 9 折優惠',
        'VIP 專屬商品價格',
      ]
    },
    memberAssets(): any[] {
      return [
        {
          label: 'OP 點數',
          value: this.memberData.opPoints,
          unit: 'pts',
          iconKey: 'op',
          iconBgClass: 'bg-[#FFF9E6] text-[#E8A020]',
          description: '查看 OPENPOINT 點數與可參與活動。',
          to: '/op-exchange',
        },
        {
          label: '我的購物金',
          value: this.memberData.credits,
          unit: '$',
          iconKey: 'credits',
          footer: `最近 ${this.memberData.creditsExpiry} 到期`,
          footerClass: 'text-red-600',
          iconBgClass: 'bg-[#F7F5F0] text-[#2D6A2D]',
          description: '可查看到期日、發放紀錄與使用紀錄。',
          to: '/account/credits',
        },
        {
          label: '專屬折價券',
          value: this.memberData.couponCount,
          unit: 'pcs',
          iconKey: 'coupons',
          iconBgClass: 'bg-[#E9F0E9] text-[#2D6A2D]',
          description: '查看可用折價券、優惠內容與使用期限。',
          to: '/account/coupons',
        },
      ]
    },
    latestNews(): Array<{ category: string; title: string; date: string; to: string }> {
      return [
        {
          category: '公告',
          title: '2026年6-8月健康誌P5 01178蜜棗乾售價誤植',
          date: '2026/06/02',
          to: '/news',
        },
        {
          category: '活動',
          title: '╭°★結帳滿額贈★°╮↘最划算!',
          date: '2026/06/01',
          to: '/news',
        },
        {
          category: '活動',
          title: '即日起至6/30新會員首購滿599元送飲冷水壺1.5L',
          date: '2026/05/20',
          to: '/news',
        },
      ]
    }
  },
  methods: {
    assetIconSrc(iconKey: string): string {
      const icons: { [key: string]: string } = {
        credits: require('../../../images/我的購物金.png'),
        op: require('../../../images/open.png'),
        coupons: require('../../../images/專屬折價券.png'),
      }

      return icons[iconKey] || icons.credits
    },
    formatCurrency(value: number): string {
      return `$${value.toLocaleString()}`
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
