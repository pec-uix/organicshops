<template>
  <div class="min-h-screen bg-brand-bg pb-16">
    <!-- ══ 主內容 ══ -->
    <div class="max-w-7xl mx-auto px-4 pt-6 flex gap-6 items-start">
      
      <AccountSidebar active-key="orders" :show-logout="false" />

      <!-- ── 右側：訂單詳情 (動態對應) ── -->
      <div v-if="currentOrder" class="flex-1 min-w-0 space-y-4 animate-fade-in">
        <AccountContentHeader
          title="訂單明細"
          :subtitle="`訂單編號：${orderId}`"
          eyebrow="訂單明細"
          back-to="/account/orders"
        />
        
        <!-- 1. 訂單狀態與進度 -->
        <section class="bg-white rounded-2xl shadow-sm p-8">
          <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-12">
            <div>
              <p class="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-1">訂單狀態</p>
              <h2 class="text-2xl font-serif font-black text-brand-primary tracking-widest italic">
                {{ statusLabels[currentOrder.status] }}
              </h2>
              <p v-if="showCancelCountdown" class="mt-2 text-sm font-bold text-red-600">
                {{ cancelCountdownLabel }}
              </p>
            </div>
            <div class="flex items-center gap-3">
              <button
                v-if="canCancelOrder"
                class="px-6 py-2 border border-red-200 rounded-sm text-xs font-bold text-red-600 hover:bg-red-50 transition-colors"
              >
                取消訂單
              </button>
              <button
                class="px-6 py-2 bg-brand-primary text-white rounded-sm text-xs font-black tracking-widest shadow-lg shadow-brand-primary/20"
                @click="goToContact"
              >
                聯絡客服
              </button>
            </div>
          </div>

          <!-- 視覺化進度條 -->
          <div class="relative px-4">
            <div class="absolute top-5 left-8 right-8 h-0.5 bg-gray-100"></div>
            <div class="absolute top-5 left-8 h-0.5 bg-brand-primary transition-all duration-1000" :style="{ width: progressWidth }"></div>
            <div class="relative flex justify-between">
              <div v-for="(step, idx) in orderSteps" :key="idx" class="flex flex-col items-center gap-3 relative z-10">
                <div class="w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all" 
                  :class="idx <= currentStatusIndex ? 'bg-brand-primary border-brand-primary text-white shadow-lg' : 'bg-white border-gray-100 text-gray-200'"
                >
                  <span v-if="idx < currentStatusIndex">✓</span>
                  <span v-else class="text-xs font-black">{{ idx + 1 }}</span>
                </div>
                <div class="text-center">
                  <p class="text-xs font-black tracking-widest" :class="idx <= currentStatusIndex ? 'text-gray-800' : 'text-gray-300'">{{ step.label }}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- 2. 商品明細 -->
        <section class="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div class="p-6 border-b border-gray-50 bg-gray-50/30">
              <h3 class="font-bold text-gray-800 flex items-center gap-2">
                <span>📦</span> 訂購商品（{{ currentOrder.items.length }}）
              </h3>
          </div>
          <div class="divide-y divide-gray-50">
            <div v-for="item in currentOrder.items" :key="item.id" class="p-6 flex items-center gap-6 group hover:bg-brand-surface/20 transition-colors">
              <div class="w-20 h-20 bg-gray-50 rounded-sm border border-gray-100 flex-shrink-0 overflow-hidden flex items-center justify-center">
                <img
                  v-if="itemProduct(item) && itemProduct(item).image"
                  :src="itemProduct(item).image"
                  class="w-full h-full object-cover"
                />
                <div v-else class="w-full h-full bg-gray-100 flex items-center justify-center text-xl font-black text-gray-400">
                  {{ placeholderText(item) }}
                </div>
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-black text-gray-800 mb-1 tracking-widest group-hover:text-brand-primary transition-colors">{{ itemName(item) }}</p>
                <p class="text-[11px] font-bold text-gray-400 uppercase tracking-tighter">{{ itemSpec(item) }}</p>
              </div>
              <div class="text-right flex flex-col items-end gap-1 min-w-[9rem]">
                <p class="text-sm font-black text-gray-700">單價 ${{ itemUnitPrice(item).toLocaleString() }}</p>
                <p class="text-[11px] font-bold text-gray-400 tracking-widest uppercase">數量：{{ item.qty }}</p>
                <p class="text-xs font-black text-brand-primary">小計 ${{ itemSubtotal(item).toLocaleString() }}</p>
              </div>
            </div>
          </div>
        </section>

        <!-- 3. 配送與費用 (雙欄) -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <section class="bg-white rounded-2xl shadow-sm p-6 space-y-6">
            <h3 class="font-bold text-gray-800 border-b border-gray-50 pb-4">配送資訊</h3>
            <div class="space-y-4">
              <div>
                <p class="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-1">配送地址</p>
                <p class="text-sm font-bold text-gray-600 leading-relaxed">王大明 0912-345-678<br />台北市大安區忠孝東路四段 100 號 5 樓</p>
              </div>
              <div>
                <p class="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-1">配送方式</p>
                <p class="text-sm font-bold text-gray-600">黑貓宅急便 ({{ currentOrder.tempZone === 'ambient' ? '常溫' : currentOrder.tempZone === 'frozen' ? '冷凍' : currentOrder.tempZone === 'fresh' ? '產地直送' : '冷藏' }})</p>
              </div>
            </div>
          </section>

          <section class="bg-white rounded-2xl shadow-sm p-6 space-y-6">
            <h3 class="font-bold text-gray-800 border-b border-gray-50 pb-4">付款資訊</h3>
            <div class="space-y-4">
              <div>
                <p class="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-1">付款方式</p>
                <p class="text-sm font-bold text-gray-600">{{ currentOrder.paymentMethod }}</p>
              </div>
              <div>
                <p class="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-1">付款狀態</p>
                <p class="text-sm font-bold" :class="paymentStatusClass">{{ currentOrder.paymentStatus }}</p>
              </div>
            </div>
          </section>

          <section class="bg-white rounded-2xl shadow-sm p-6 space-y-6 md:col-span-2">
            <h3 class="font-bold text-gray-800 border-b border-gray-50 pb-4">費用明細</h3>
            <div class="space-y-3">
              <div class="flex justify-between text-sm font-bold text-gray-400"><span>商品小計</span><span>${{ orderSubtotal.toLocaleString() }}</span></div>
              <div class="flex justify-between text-sm font-bold text-gray-400"><span>運費</span><span>${{ currentOrder.shippingFee.toLocaleString() }}</span></div>
              <div v-if="currentOrder.discount > 0" class="flex justify-between text-sm font-bold text-gray-400">
                <span>折扣</span>
                <span>-${{ currentOrder.discount.toLocaleString() }}</span>
              </div>
              <div class="pt-4 border-t border-gray-50 flex justify-between items-baseline">
                <span class="text-sm font-black text-gray-800 uppercase tracking-widest">總計</span>
                <span class="text-3xl font-serif font-black text-brand-primary tracking-tighter italic"><span class="text-sm not-italic mr-1">$</span>{{ orderTotal.toLocaleString() }}</span>
              </div>
            </div>
          </section>
        </div>
      </div>

      <!-- 錯誤狀態 -->
      <div v-else class="flex-1 py-24 text-center bg-white rounded-2xl shadow-sm">
        <p class="text-gray-400">找不到該訂單資訊，請返回重新選擇。</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import AccountSidebar from '@/components/account/AccountSidebar.vue'
import AccountContentHeader from '@/components/account/AccountContentHeader.vue'
import { mockOrders, mockProducts } from '@/mock/data'
import { Product } from '@/types'

interface OrderItem {
  id: number
  productId: string
  qty: number
}

interface OrderMock {
  id: string
  date: string
  status: 'pending' | 'processing' | 'shipped' | 'completed'
  tempZone: 'ambient' | 'chilled' | 'frozen' | 'fresh'
  shippingFee: number
  discount: number
  paymentMethod: string
  paymentStatus: string
  createdAt: string
  items: OrderItem[]
}

const CANCEL_WINDOW_SECONDS = 30 * 60

export default Vue.extend({
  name: 'OrderDetailView',
  components: { AccountSidebar, AccountContentHeader },
  data() {
    return {
      now: Date.now(),
      timerId: null as number | null,
      statusLabels: { pending: '待付款', processing: '待出貨', shipped: '已出貨', completed: '已完成' } as any,
      orderSteps: [
        { label: '訂單送出', status: 'pending' },
        { label: '訂單確認', status: 'processing' },
        { label: '商品出貨', status: 'shipped' },
        { label: '訂單完成', status: 'completed' },
      ]
    }
  },
  mounted() {
    this.timerId = window.setInterval(() => {
      this.now = Date.now()
    }, 1000)
  },
  beforeDestroy() {
    if (this.timerId) window.clearInterval(this.timerId)
  },
  created() {
    document.title = '訂單明細'
  },
  computed: {
    orderId(): string { return this.$route.params.id },
    currentOrder(): any {
      return (mockOrders as OrderMock[]).find(o => o.id === this.orderId) || (mockOrders as OrderMock[])[1]
    },
    orderSubtotal(): number {
      return this.currentOrder.items.reduce((sum: number, item: OrderItem) => sum + this.itemSubtotal(item), 0)
    },
    orderTotal(): number {
      return this.orderSubtotal + this.currentOrder.shippingFee - (this.currentOrder.discount || 0)
    },
    currentStatusIndex(): number {
      const statusMap = { pending: 0, processing: 1, shipped: 2, completed: 3 } as any
      return statusMap[this.currentOrder.status] || 0
    },
    progressWidth(): string {
      return (this.currentStatusIndex / (this.orderSteps.length - 1)) * 100 + '%'
    },
    remainingCancelSeconds(): number {
      if (this.currentOrder.status !== 'pending' || !this.currentOrder.createdAt) return 0
      const createdAt = new Date(this.currentOrder.createdAt).getTime()
      const elapsed = Math.floor((this.now - createdAt) / 1000)
      return Math.max(0, CANCEL_WINDOW_SECONDS - elapsed)
    },
    showCancelCountdown(): boolean {
      return this.currentOrder.status === 'pending' && this.remainingCancelSeconds > 0
    },
    canCancelOrder(): boolean {
      return this.currentOrder.status === 'pending' && this.remainingCancelSeconds > 0
    },
    cancelCountdownLabel(): string {
      const minutes = Math.floor(this.remainingCancelSeconds / 60)
      const seconds = this.remainingCancelSeconds % 60
      return `取消訂單倒數 ${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
    },
    paymentStatusClass(): string {
      return this.currentOrder.paymentStatus === '已付款' ? 'text-emerald-600' : 'text-orange-500'
    }
  },
  methods: {
    goToContact(): void {
      this.$router.push({
        path: '/contact',
        query: { orderId: this.orderId }
      })
    },
    itemProduct(item: OrderItem): Product | undefined {
      return mockProducts.find((product) => product.id === item.productId)
    },
    itemName(item: OrderItem): string {
      const product = this.itemProduct(item)
      return product?.name || '未知商品'
    },
    itemSpec(item: OrderItem): string {
      const product = this.itemProduct(item)
      return product?.unit || '規格未提供'
    },
    itemUnitPrice(item: OrderItem): number {
      const product = this.itemProduct(item)
      return Math.round(product?.memberPrice ?? product?.originalPrice ?? product?.price ?? 0)
    },
    itemSubtotal(item: OrderItem): number {
      return this.itemUnitPrice(item) * item.qty
    },
    placeholderText(item: OrderItem): string {
      return this.itemName(item).charAt(0) || '商'
    }
  }
})
</script>

<style scoped>
.animate-fade-in { animation: fadeIn 0.5s ease-out forwards; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }
</style>
