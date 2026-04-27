<template>
  <div class="min-h-screen bg-brand-bg pb-16">
    <!-- ══ 主內容：側邊選單 + 內容 ══ -->
    <div class="max-w-7xl mx-auto px-4 pt-6 flex gap-6 items-start">

      <AccountSidebar active-key="credits" subtitle="會員" />

      <!-- ── 右側：購物金內容 ── -->
      <div class="flex-1 min-w-0 space-y-4">
        <AccountContentHeader
          title="購物金明細"
          subtitle="查看餘額、到期提醒與購物金異動紀錄。"
          eyebrow="購物金明細"
        />
        
        <!-- 頂部總覽卡片 -->
        <div class="bg-white rounded-2xl shadow-sm p-6 flex flex-wrap items-center justify-between gap-6 border border-brand-primary/5">
          <div class="flex items-center gap-5">
            <div class="w-14 h-14 rounded-2xl bg-brand-surface flex items-center justify-center text-3xl shadow-inner select-none">
              💰
            </div>
            <div>
              <p class="text-sm text-gray-400 font-medium mb-0.5">可用購物金餘額</p>
              <p class="text-3xl font-black text-brand-primary flex items-baseline gap-1">
                <span class="text-lg font-bold">$</span>
                {{ totalBalance.toLocaleString() }}
              </p>
            </div>
          </div>
          <div class="bg-red-50 rounded-xl px-5 py-3 border border-red-100 min-w-[200px]">
            <p class="text-xs text-red-600 font-bold mb-1 flex items-center gap-1.5">
              <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              即將到期
            </p>
            <p class="text-lg font-bold text-gray-800">
              ${{ expiringAmount.toLocaleString() }}
            </p>
            <p class="text-[11px] text-gray-400 mt-0.5">
              到期日：{{ expiringDate }}
            </p>
          </div>
        </div>

        <!-- 篩選 Tab -->
        <div class="bg-white rounded-2xl shadow-sm p-1.5 flex gap-1">
          <button
            v-for="tab in tabs"
            :key="tab.value"
            class="flex-1 py-2.5 text-sm font-bold transition-all rounded-xl"
            :class="activeTab === tab.value
              ? 'bg-brand-primary text-white shadow-md'
              : 'text-gray-400 hover:text-gray-600'"
            @click="activeTab = tab.value"
          >
            {{ tab.label }}
          </button>
        </div>

        <!-- 明細列表 -->
        <div v-if="filteredRecords.length > 0" class="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-50">
          <div class="divide-y divide-gray-50">
            <div
              v-for="record in filteredRecords"
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
                  :class="record.amount > 0 ? 'text-green-500' : 'text-red-500'"
                >
                  {{ record.amount > 0 ? '+' : '' }}{{ record.amount.toLocaleString() }}
                </p>
                <p class="text-[10px] text-gray-400 mt-0.5">
                  到期日：{{ record.expiryDate || '永久有效' }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- 空狀態 -->
        <div v-else class="flex flex-col items-center justify-center py-24 text-center bg-white rounded-2xl shadow-sm">
          <div class="text-6xl mb-5 select-none grayscale opacity-20">💰</div>
          <h2 class="font-bold text-gray-700 text-lg mb-2">目前沒有相關的購物金紀錄</h2>
          <p class="text-sm text-gray-400 mb-7">參與活動或消費回饋，即可獲得購物金！</p>
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
            購物金使用說明
          </h4>
          <ul class="text-[11px] text-gray-400 space-y-1.5 list-disc list-inside leading-relaxed">
            <li>購物金 1 點等同於新台幣 1 元。</li>
            <li>結帳時可自行輸入欲折抵之購物金金額，最高可折抵訂單總額之 100%。</li>
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
      
      tabs: [
        { label: '全部',   value: 'all' },
        { label: '發放',   value: 'earn' },
        { label: '使用',   value: 'use' },
        { label: '已過期', value: 'expired' },
      ],

      records: [
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
      ] as WalletRecord[],
    }
  },

  computed: {
    totalBalance(): number {
      // 模擬計算：總發放 - 總使用 - 總過期 (假資料中直接加總即可)
      // 在實際場景會由 API 提供
      return 900 
    },

    expiringAmount(): number {
      // 假資料中 4/30 到期的總和：200 + 300 = 500
      return 500
    },

    expiringDate(): string {
      return '2026-04-30'
    },

    filteredRecords(): WalletRecord[] {
      if (this.activeTab === 'all') return this.records
      return this.records.filter(r => r.type === this.activeTab)
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
        earn:    'bg-green-100 text-green-700',
        use:     'bg-blue-100 text-blue-700',
        expired: 'bg-gray-100 text-gray-500',
      }
      return map[type]
    },

  },
})
</script>

<style scoped>
.btn-primary {
  @apply bg-brand-primary text-white rounded-xl hover:bg-brand-dark transition-colors shadow-sm active:scale-[0.98] font-bold;
}
</style>
