<template>
  <div class="min-h-screen bg-gray-50 pb-16">
    <!-- ══ 主內容：側邊選單 + 內容 ══ -->
    <div class="max-w-7xl mx-auto px-4 pt-6 flex flex-col gap-4 lg:flex-row lg:gap-6 lg:items-start">

      <AccountSidebar active-key="credits" subtitle="會員" />

      <!-- ── 右側：購物金內容 ── -->
      <div class="flex-1 min-w-0 space-y-4">
        <AccountContentHeader
          title="購物金明細"
          subtitle="查看餘額、到期提醒與購物金異動紀錄。"
        />
        
        <!-- 頂部總覽卡片 -->
        <div class="grid gap-4 md:grid-cols-2">
          <div class="flex items-center gap-5 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <div class="h-14 w-14 select-none overflow-hidden rounded-2xl">
              <img :src="creditIcon" alt="" class="h-full w-full object-cover" />
            </div>
            <div>
              <p class="text-sm text-gray-400 font-medium mb-0.5">可用購物金餘額</p>
              <p class="text-3xl font-black text-brand-primary flex items-baseline gap-1">
                <span class="text-lg font-bold">$</span>
                {{ totalBalance.toLocaleString() }}
              </p>
            </div>
          </div>
          <div class="rounded-2xl border border-brand-accent/20 bg-brand-accent/5 p-6 shadow-sm">
            <p class="text-xs text-brand-accent font-bold mb-1 flex items-center gap-1.5">
              <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              即將到期金額
            </p>
            <p class="mt-2 text-3xl font-black text-gray-800">
              ${{ expiringAmount.toLocaleString() }}
            </p>
            <p class="mt-1 text-xs text-gray-400">
              最近到期日：{{ nearestExpiryDate || '無即將到期' }}
            </p>
          </div>
        </div>

        <!-- 篩選 Tab -->
        <div class="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
          <div class="flex flex-wrap gap-2">
            <button
              v-for="tab in tabs"
              :key="tab.value"
              class="rounded-full px-4 py-2 text-sm font-bold transition-all"
              :class="activeTab === tab.value
                ? 'bg-brand-primary text-white shadow-sm'
                : 'bg-brand-surface text-gray-500 hover:text-brand-primary'"
              @click="activeTab = tab.value"
            >
              {{ tab.label }}
            </button>
          </div>
        </div>

        <!-- 明細列表 -->
        <div v-if="filteredRecords.length > 0" class="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
          <div class="divide-y divide-gray-50">
            <div
              v-for="record in paginatedRecords"
              :key="record.id"
              class="p-5 flex items-center justify-between group hover:bg-gray-50/50 transition-colors"
            >
              <div class="flex-1 min-w-0 mr-4">
                <div class="flex items-center gap-2 mb-1">
                  <span class="text-xs font-bold px-2 py-0.5 rounded-md" :class="getTypeStyle(record.type)">
                    {{ getTypeName(record.type) }}
                  </span>
                  <span class="text-[11px] text-gray-400 font-mono">{{ record.date }}</span>
                </div>
                <h3 class="text-sm font-bold text-gray-800 truncate">
                  {{ record.summary }}
                </h3>
              </div>
              <div class="text-right flex-shrink-0">
                <p 
                  class="text-base font-black"
                  :class="recordAmountStyle(record)"
                >
                  {{ record.amount > 0 ? '+' : '' }}{{ record.amount.toLocaleString() }}
                </p>
                <p class="text-[10px] text-gray-400 mt-0.5">
                  {{ recordExpiryLabel(record) }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div
          v-if="filteredRecords.length > 0 && totalPages > 1"
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

        <!-- 空狀態 -->
        <div v-if="filteredRecords.length === 0" class="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-white px-6 py-24 text-center shadow-sm">
          <div class="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-brand-surface text-brand-primary">
            <svg class="h-9 w-9" viewBox="0 0 48 48" fill="none" aria-hidden="true">
              <path
                d="M15 13h18a6 6 0 0 1 6 6v16a6 6 0 0 1-6 6H15a6 6 0 0 1-6-6V19a6 6 0 0 1 6-6Z"
                stroke="currentColor"
                stroke-width="3"
                stroke-linejoin="round"
              />
              <path d="M15 13V9h16v4" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
              <path d="M18 25h12M18 31h8" stroke="currentColor" stroke-width="3" stroke-linecap="round" />
            </svg>
          </div>
          <h2 class="font-bold text-gray-700 text-lg mb-2">暫無購物金紀錄</h2>
          <p class="text-sm text-gray-400 mb-7">參與活動或消費回饋，即可獲得購物金！</p>
          <router-link to="/products" class="btn-primary px-8 py-3">
            去逛逛商品
          </router-link>
        </div>

        <!-- 注意事項 -->
        <div class="rounded-2xl border border-gray-100 bg-white/70 p-5">
          <h4 class="text-xs font-bold text-gray-500 mb-3 flex items-center gap-1.5">
            <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            購物金使用說明
          </h4>
          <ul class="text-[11px] text-gray-400 space-y-1.5 list-disc list-inside leading-relaxed">
            <li>購物金 1 點等同於新台幣 1 元。</li>
            <li>可用購物金會依活動與效期顯示，實際可用金額以結帳頁為準。</li>
            <li>每筆購物金發放皆有其有效期限，逾期未用畢之金額將自動歸零。</li>
            <li>若發生取消訂單、退貨等情事，折抵之購物金將於審核通過後退回原帳戶，效期不予展延。</li>
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

type RecordType = 'earn' | 'use' | 'expired'

interface WalletRecord {
  id:         number
  type:       RecordType
  date:       string
  summary:    string
  amount:     number
  expiryDate: string
}

export default Vue.extend({
  name: 'WalletView',
  components: { AccountSidebar, AccountContentHeader },
  created() {
    document.title = '購物金明細'
  },

  data() {
    return {
      activeTab: 'all' as RecordType | 'all',
      creditIcon: require('../../../images/我的購物金.png'),
      currentPage: 1,
      pageSize: 8,
      
      tabs: [
        { label: '全部',   value: 'all' },
        { label: '發放',   value: 'earn' },
        { label: '使用',   value: 'use' },
        { label: '已過期', value: 'expired' },
      ],

      records: [
        {
          id:         10,
          type:       'earn',
          date:       '2026-04-26 09:10',
          summary:    '加入會員禮購物金',
          amount:     50,
          expiryDate: '2026-07-31',
        },
        {
          id:         11,
          type:       'earn',
          date:       '2026-04-25 18:20',
          summary:    '訂單 #OG65432108 滿額回饋購物金',
          amount:     100,
          expiryDate: '2026-07-31',
        },
        {
          id:         12,
          type:       'earn',
          date:       '2026-04-24 13:40',
          summary:    '首購禮購物金',
          amount:     150,
          expiryDate: '2026-07-31',
        },
        {
          id:         13,
          type:       'earn',
          date:       '2026-04-23 11:05',
          summary:    '套餐加碼購物金',
          amount:     80,
          expiryDate: '2026-07-31',
        },
        {
          id:         1,
          type:       'earn',
          date:       '2026-04-20 10:30',
          summary:    '訂單 #OG65432108 消費回饋',
          amount:     58,
          expiryDate: '2027-04-20',
        },
        {
          id:         2,
          type:       'use',
          date:       '2026-04-18 15:22',
          summary:    '訂單 #OG98765432 折抵使用',
          amount:     -100,
          expiryDate: '',
        },
        {
          id:         3,
          type:       'earn',
          date:       '2026-04-15 09:00',
          summary:    '【綠色生活節】加碼回饋金',
          amount:     200,
          expiryDate: '2026-04-30', // 即將到期
        },
        {
          id:         4,
          type:       'earn',
          date:       '2026-04-01 12:00',
          summary:    '四月壽星專屬購物金',
          amount:     300,
          expiryDate: '2026-04-30', // 即將到期
        },
        {
          id:         5,
          type:       'use',
          date:       '2026-03-25 18:45',
          summary:    '訂單 #OG54321098 折抵使用',
          amount:     -50,
          expiryDate: '',
        },
        {
          id:         6,
          type:       'expired',
          date:       '2026-03-01 00:00',
          summary:    '跨年活動購物金已過期',
          amount:     -80,
          expiryDate: '2026-02-28',
        },
        {
          id:         7,
          type:       'earn',
          date:       '2026-02-20 11:10',
          summary:    '訂單 #OG11223344 消費回饋',
          amount:     42,
          expiryDate: '2027-02-20',
        },
        {
          id:         8,
          type:       'use',
          date:       '2026-02-12 13:30',
          summary:    '訂單 #OG66778899 折抵使用',
          amount:     -30,
          expiryDate: '',
        },
        {
          id:         9,
          type:       'earn',
          date:       '2026-01-30 09:45',
          summary:    '會員活動購物金',
          amount:     100,
          expiryDate: '2027-01-30',
        },
      ] as WalletRecord[],
    }
  },

  computed: {
    totalBalance(): number {
      return 900 
    },

    expiringAmount(): number {
      return this.expiringRecords.reduce((sum, record) => sum + record.amount, 0)
    },

    nearestExpiryDate(): string {
      return this.expiringRecords[0]?.expiryDate || ''
    },

    availableRecords(): WalletRecord[] {
      return this.records.filter(record => record.type === 'earn' && record.amount > 0)
    },

    expiringRecords(): WalletRecord[] {
      return this.availableRecords
        .filter(record => this.isExpiringSoon(record.expiryDate))
        .sort((a, b) => a.expiryDate.localeCompare(b.expiryDate))
    },

    filteredRecords(): WalletRecord[] {
      if (this.activeTab === 'all') return this.records
      return this.records.filter(r => r.type === this.activeTab)
    },
    paginatedRecords(): WalletRecord[] {
      const start = (this.currentPage - 1) * this.pageSize
      return this.filteredRecords.slice(start, start + this.pageSize)
    },
    totalPages(): number {
      return Math.ceil(this.filteredRecords.length / this.pageSize)
    },
  },

  watch: {
    activeTab() {
      this.currentPage = 1
    },
  },

  methods: {
    getTypeName(type: RecordType): string {
      const map: Record<RecordType, string> = {
        earn:    '發放',
        use:     '使用',
        expired: '已過期',
      }
      return map[type]
    },

    getTypeStyle(type: RecordType): string {
      const map: Record<RecordType, string> = {
        earn:    'bg-brand-surface text-brand-primary',
        use:     'bg-gray-100 text-gray-600',
        expired: 'bg-gray-100 text-gray-500',
      }
      return map[type]
    },

    recordAmountStyle(record: WalletRecord): string {
      if (record.type === 'earn' && record.amount > 0) return 'text-brand-primary'
      if (record.type === 'expired') return 'text-gray-400'
      return 'text-red-500'
    },

    isExpiringSoon(expiryDate: string): boolean {
      if (!expiryDate) return false
      const today = new Date('2026-04-15T00:00:00+08:00')
      const expiry = new Date(`${expiryDate}T23:59:59+08:00`)
      const days = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
      return days >= 0 && days <= 30
    },

    recordExpiryLabel(record: WalletRecord): string {
      if (record.type === 'use') return '折抵使用'
      if (record.type === 'expired') return `已於 ${record.expiryDate} 到期`
      return record.expiryDate ? `到期日：${record.expiryDate}` : '永久有效'
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
.btn-primary {
  @apply bg-brand-primary text-white rounded-xl hover:bg-brand-dark transition-colors shadow-sm active:scale-[0.98] font-bold;
}
</style>
