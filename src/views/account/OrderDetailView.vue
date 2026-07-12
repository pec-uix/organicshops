<template>
  <div class="min-h-screen bg-gray-50 pb-16">
    <!-- ══ 主內容 ══ -->
    <div class="max-w-7xl mx-auto px-4 pt-6 flex flex-col gap-4 lg:flex-row lg:gap-6 lg:items-start">
      
      <AccountSidebar active-key="orders" :show-logout="false" />

      <!-- ── 右側：訂單詳情 (動態對應) ── -->
      <div v-if="currentOrder" class="flex-1 min-w-0 space-y-4 animate-fade-in">
        <AccountContentHeader
          title="訂單明細"
          :subtitle="`訂單編號：${orderId}`"
          back-to="/account/orders"
        />

        <!-- 1. 訂單狀態與進度 -->
        <section class="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-8">
          <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-12">
            <div>
              <p class="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-1">訂單狀態</p>
              <h2 class="text-2xl font-black leading-tight text-gray-800">
                {{ statusLabels[currentOrder.status] }}
              </h2>
              <p v-if="showCancelCountdown" class="mt-2 text-sm font-bold text-red-600">
                {{ cancelCountdownLabel }}
              </p>
            </div>
            <div class="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
              <button
                v-if="canCancelOrder"
                class="rounded-xl border border-red-200 px-6 py-2 text-sm font-bold text-red-600 transition-colors hover:bg-red-50"
              >
                取消訂單
              </button>
              <router-link
                v-if="isPendingOrder"
                to="/checkout"
                class="inline-flex items-center justify-center rounded-xl bg-brand-primary px-6 py-2 text-sm font-bold text-white shadow-sm transition-colors hover:bg-brand-dark"
              >
                前往付款
              </router-link>
              <button
                v-else
                type="button"
                class="inline-flex items-center justify-center rounded-xl bg-brand-primary px-6 py-2 text-sm font-bold text-white shadow-sm transition-colors hover:bg-brand-dark"
                @click="reorderCurrentOrder"
              >
                再買一次
              </button>
              <button
                class="rounded-xl border border-brand-primary px-6 py-2 text-sm font-bold text-brand-primary transition-all hover:bg-brand-primary hover:text-white"
                @click="goToContact"
              >
                聯絡客服
              </button>
            </div>
          </div>

          <div
            v-if="showCancelRefundInfo"
            class="mb-8 grid gap-3 rounded-2xl border border-red-100 bg-red-50/60 p-4 sm:grid-cols-3"
          >
            <div>
              <p class="text-[10px] font-black text-red-300 uppercase tracking-widest mb-1">取消時間</p>
              <p class="text-sm font-bold text-red-700">{{ displayValue(currentOrder.cancelledAt) }}</p>
            </div>
            <div>
              <p class="text-[10px] font-black text-red-300 uppercase tracking-widest mb-1">取消原因</p>
              <p class="text-sm font-bold text-red-700">{{ displayValue(currentOrder.cancelReason) }}</p>
            </div>
            <div>
              <p class="text-[10px] font-black text-red-300 uppercase tracking-widest mb-1">退款狀態</p>
              <p class="text-sm font-bold text-red-700">{{ displayValue(currentOrder.refundStatus) }}</p>
            </div>
          </div>

          <!-- 視覺化進度條 -->
          <div class="overflow-x-auto pb-1">
            <div class="relative min-w-[34rem] px-4">
              <div class="absolute top-5 left-8 right-8 h-0.5 bg-gray-100"></div>
              <div class="absolute top-5 left-8 h-0.5 bg-brand-primary transition-all duration-1000" :style="{ width: progressWidth }"></div>
              <div class="relative flex justify-between">
              <div v-for="(step, idx) in orderSteps" :key="idx" class="flex flex-col items-center gap-3 relative z-10">
                <div class="w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all" 
                  :class="idx <= currentStatusIndex ? 'bg-brand-primary border-brand-primary text-white shadow-sm' : 'bg-white border-gray-100 text-gray-200'"
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
          </div>
        </section>

        <!-- 2. 訂單資料 -->
        <section class="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
          <h3 class="border-b border-gray-50 pb-4 font-bold text-gray-800">訂單資料</h3>
          <div class="mt-5 rounded-xl bg-gray-50 p-4">
            <dl class="grid gap-3 md:grid-cols-2">
              <div v-for="field in orderInfoFields" :key="field.label" class="grid gap-1 sm:grid-cols-[7rem,1fr] sm:gap-4">
                <dt class="text-xs font-bold text-gray-400">{{ field.label }}</dt>
                <dd class="text-sm font-bold leading-6 text-gray-700">{{ field.value }}</dd>
              </div>
            </dl>
          </div>
          <div class="mt-4 grid gap-4 md:grid-cols-2">
            <div class="rounded-xl bg-gray-50 p-4">
              <h4 class="text-sm font-black text-gray-800">訂購人資訊</h4>
              <dl class="mt-4 space-y-3">
                <div v-for="field in purchaserFields" :key="field.label" class="grid gap-1 sm:grid-cols-[7rem,1fr] sm:gap-4">
                  <dt class="text-xs font-bold text-gray-400">{{ field.label }}</dt>
                  <dd class="text-sm font-bold leading-6 text-gray-700">{{ field.value }}</dd>
                </div>
              </dl>
            </div>
            <div class="rounded-xl bg-gray-50 p-4">
              <h4 class="text-sm font-black text-gray-800">收件人資訊</h4>
              <dl class="mt-4 space-y-3">
                <div v-for="field in recipientFields" :key="field.label" class="grid gap-1 sm:grid-cols-[7rem,1fr] sm:gap-4">
                  <dt class="text-xs font-bold text-gray-400">{{ field.label }}</dt>
                  <dd class="text-sm font-bold leading-6 text-gray-700">{{ field.value }}</dd>
                </div>
              </dl>
            </div>
          </div>
        </section>

        <!-- 3. 商品明細 -->
        <section class="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
          <div class="p-6 border-b border-gray-50 bg-gray-50/30">
              <h3 class="font-bold text-gray-800 flex items-center gap-2">
                <span>📦</span> 訂購商品（{{ currentOrder.items.length }}）
              </h3>
          </div>
          <div class="divide-y divide-gray-50">
            <div v-for="item in currentOrder.items" :key="item.id" class="p-5 sm:p-6 transition-colors hover:bg-brand-surface/20">
              <div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-6">
                <div class="w-20 h-20 bg-gray-50 rounded-xl border border-gray-100 flex-shrink-0 overflow-hidden flex items-center justify-center">
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
                  <div class="flex flex-wrap items-center gap-2">
                    <p class="text-sm font-black text-gray-800 tracking-widest">{{ itemName(item) }}</p>
                    <span v-if="isComboItem(item)" class="rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-bold text-gray-500">組合商品</span>
                  </div>
                  <p class="mt-1 text-[11px] font-bold text-gray-400 uppercase tracking-tighter">商品型號 {{ itemModel(item) }}</p>
                  <p v-if="!isComboItem(item)" class="mt-1 text-[11px] font-bold text-gray-400 uppercase tracking-tighter">{{ itemSpec(item) }}</p>
                </div>
                <div class="flex w-full flex-col gap-1 text-left sm:w-auto sm:min-w-[9rem] sm:items-end sm:text-right">
                  <p class="text-sm font-black text-gray-700">{{ itemPriceLabel(item) }}</p>
                  <p class="text-[11px] font-bold text-gray-400 tracking-widest uppercase">{{ isComboItem(item) ? '組合數量' : '數量' }}：{{ item.qty }}</p>
                  <p class="text-xs font-black text-gray-800">小計 ${{ itemSubtotal(item).toLocaleString() }}</p>
                </div>
              </div>

              <div v-if="isComboItem(item)" class="mt-5 overflow-x-auto rounded-xl border border-gray-100 bg-white">
                <div class="min-w-[34rem]">
                  <div class="grid grid-cols-[5.5rem,1fr,7rem,3rem] gap-3 border-b border-gray-100 px-4 py-3 text-[11px] font-black text-gray-400">
                    <span>商品型號</span>
                    <span>商品名稱</span>
                    <span>規格</span>
                    <span class="text-right">數量</span>
                  </div>
                  <div class="divide-y divide-gray-100">
                    <div
                      v-for="component in item.comboItems"
                      :key="component.productId"
                      class="grid grid-cols-[5.5rem,1fr,7rem,3rem] gap-3 px-4 py-3 text-xs font-bold text-gray-600"
                    >
                      <span class="text-gray-400">{{ component.productId.toUpperCase() }}</span>
                      <span class="min-w-0 break-words text-gray-800">{{ componentName(component) }}</span>
                      <span class="text-gray-500">{{ componentSpec(component) }}</span>
                      <span class="text-right text-gray-800">{{ component.qty }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              v-for="gift in giftRows"
              :key="`gift-${gift.name}`"
              class="p-5 sm:p-6 transition-colors hover:bg-brand-surface/20"
            >
              <div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-6">
                <div class="w-20 h-20 bg-brand-surface/50 rounded-xl border border-brand-primary/10 flex-shrink-0 overflow-hidden flex items-center justify-center">
                  <span class="text-xl font-black text-brand-primary">贈</span>
                </div>
                <div class="flex-1 min-w-0">
                  <div class="flex flex-wrap items-center gap-2">
                    <p class="text-sm font-black text-gray-800 tracking-widest">{{ gift.name }}</p>
                    <span class="rounded-full bg-brand-primary/10 px-2 py-0.5 text-[11px] font-bold text-brand-primary">{{ gift.description || '贈品' }}</span>
                  </div>
                  <p class="mt-1 text-[11px] font-bold text-gray-400 uppercase tracking-tighter">商品型號 {{ displayValue(gift.productId).toUpperCase() }}</p>
                  <p class="mt-1 text-[11px] font-bold text-gray-400 uppercase tracking-tighter">{{ displayValue(gift.spec) }}</p>
                </div>
                <div class="flex w-full flex-col gap-1 text-left sm:w-auto sm:min-w-[9rem] sm:items-end sm:text-right">
                  <p class="text-sm font-black text-gray-700">$0</p>
                  <p class="text-[11px] font-bold text-gray-400 tracking-widest uppercase">數量：{{ gift.quantity }}</p>
                  <p class="text-xs font-black text-gray-800">小計 $0</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- 4. 配送與費用 (雙欄) -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <section class="space-y-6 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <h3 class="font-bold text-gray-800 border-b border-gray-50 pb-4">配送資訊</h3>
            <div class="space-y-4">
              <div>
                <p class="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-1">配送地址</p>
                <p class="text-sm font-bold text-gray-600 leading-relaxed">
                  {{ displayValue(currentOrder.recipientName) }} {{ displayValue(currentOrder.recipientMobile) }}<br />
                  {{ displayValue(currentOrder.recipientAddress) }}
                </p>
              </div>
              <div>
                <p class="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-1">配送方式</p>
                <p class="text-sm font-bold text-gray-600">黑貓宅急便 ({{ currentOrder.tempZone === 'ambient' ? '常溫' : currentOrder.tempZone === 'frozen' ? '冷凍' : currentOrder.tempZone === 'fresh' ? '產地直送' : '冷藏' }})</p>
              </div>
              <div>
                <p class="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-1">貨運單號</p>
                <p class="text-sm font-bold text-gray-600">{{ displayValue(currentOrder.trackingNo) }}</p>
              </div>
              <div>
                <p class="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-1">預計到貨</p>
                <p class="text-sm font-bold text-gray-600">{{ formattedDesiredDeliveryDate }}</p>
              </div>
              <div>
                <p class="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-1">指定送達時段</p>
                <p class="text-sm font-bold text-gray-600">{{ displayValue(currentOrder.deliveryTimeSlot) }}</p>
              </div>
              <div>
                <p class="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-1">備註</p>
                <p class="text-sm font-bold text-gray-600">{{ displayValue(currentOrder.note) }}</p>
              </div>
            </div>
          </section>

          <section class="space-y-6 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
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
              <div v-if="currentOrder.paymentDeadline">
                <p class="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-1">付款期限</p>
                <p class="text-sm font-bold text-gray-600">{{ currentOrder.paymentDeadline }}</p>
              </div>
              <div>
                <p class="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-1">刷卡結果</p>
                <p class="text-sm font-bold text-gray-600">{{ displayValue(currentOrder.cardResult) }}</p>
              </div>
              <div>
                <p class="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-1">交易序號</p>
                <p class="text-sm font-bold text-gray-600">{{ displayValue(currentOrder.transactionNo) }}</p>
              </div>
              <div>
                <p class="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-1">發票種類</p>
                <p class="text-sm font-bold text-gray-600">{{ displayValue(currentOrder.invoiceType) }}</p>
              </div>
              <div>
                <p class="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-1">發票寄送方式</p>
                <p class="text-sm font-bold text-gray-600">{{ displayValue(currentOrder.invoiceDelivery) }}</p>
              </div>
            </div>
          </section>

          <section class="space-y-6 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm md:col-span-2">
            <h3 class="font-bold text-gray-800 border-b border-gray-50 pb-4">費用明細</h3>
            <div class="space-y-3">
              <div class="flex justify-between text-sm font-bold text-gray-400"><span>商品小計</span><span>${{ orderSubtotal.toLocaleString() }}</span></div>
              <div class="flex justify-between text-sm font-bold text-gray-400"><span>運費</span><span>${{ currentOrder.shippingFee.toLocaleString() }}</span></div>
              <div class="rounded-xl bg-gray-50 p-4">
                <div class="flex items-center justify-between gap-4">
                  <span class="text-sm font-black text-gray-800">折抵明細</span>
                  <span v-if="discountRows.length === 0" class="text-sm font-bold text-gray-400">未使用折抵</span>
                </div>
                <div v-if="discountRows.length > 0" class="mt-3 space-y-2">
                  <div
                    v-for="row in discountRows"
                    :key="row.key"
                    class="flex flex-col gap-1 text-sm font-bold text-gray-500 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <span>{{ row.label }}</span>
                    <span class="text-brand-primary">-${{ row.amount.toLocaleString() }}</span>
                  </div>
                </div>
              </div>
              <div v-if="creditRewardRows.length" class="rounded-xl bg-brand-surface/40 p-4">
                <div class="mb-3">
                  <span class="text-sm font-black text-gray-800">購物金回饋</span>
                </div>
                <div
                  v-for="row in creditRewardRows"
                  :key="row.title"
                  class="flex flex-col gap-1 text-sm font-bold text-gray-500 sm:flex-row sm:items-center sm:justify-between"
                >
                  <span>{{ row.title }}<span v-if="row.description" class="ml-1 text-xs text-gray-400">｜{{ row.description }}</span></span>
                  <span class="text-brand-primary">+${{ row.amount.toLocaleString() }}</span>
                </div>
              </div>
              <div v-if="opRewardRows.length" class="rounded-xl bg-brand-accent/5 p-4 ring-1 ring-brand-accent/10">
                <div class="mb-3 flex items-center justify-between gap-4">
                  <span class="text-sm font-black text-gray-800">OP 點回饋</span>
                  <span class="text-sm font-black text-brand-accent">+{{ opRewardTotal.toLocaleString() }} 點</span>
                </div>
                <div
                  v-for="row in opRewardRows"
                  :key="row.title"
                  class="flex flex-col gap-1 text-sm font-bold text-gray-500 sm:flex-row sm:items-center sm:justify-between"
                >
                  <span>{{ row.title }}<span v-if="row.description" class="ml-1 text-xs text-gray-400">｜{{ row.description }}</span></span>
                  <span class="text-brand-accent">+{{ row.amount.toLocaleString() }} 點</span>
                </div>
              </div>
              <div v-if="deliveryBenefitRecords.length" class="rounded-xl bg-white p-4 ring-1 ring-brand-primary/10">
                <div class="mb-3 text-sm font-black text-gray-800">超商取貨優惠</div>
                <div
                  v-for="record in deliveryBenefitRecords"
                  :key="record.title"
                  class="flex flex-col gap-1 text-sm font-bold text-gray-500 sm:flex-row sm:items-center sm:justify-between"
                >
                  <span>{{ record.title }}<span v-if="record.description" class="ml-1 text-xs text-gray-400">｜{{ record.description }}</span></span>
                  <span class="text-brand-primary">已套用</span>
                </div>
              </div>
              <div class="pt-4 border-t border-gray-50 flex justify-between items-baseline">
                <span class="text-sm font-black text-gray-800 uppercase tracking-widest">總計</span>
                <span class="text-3xl font-black text-gray-800"><span class="mr-1 text-sm">$</span>{{ orderTotal.toLocaleString() }}</span>
              </div>
            </div>
          </section>
        </div>
      </div>

      <!-- 錯誤狀態 -->
      <div v-else class="flex-1 rounded-2xl border border-dashed border-gray-200 bg-white px-6 py-24 text-center shadow-sm">
        <p class="text-gray-400">找不到該訂單資訊，請返回重新選擇。</p>
        <router-link to="/account/orders" class="mt-6 inline-flex rounded-xl bg-brand-primary px-6 py-3 text-sm font-bold text-white hover:bg-brand-dark">
          返回我的訂單
        </router-link>
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
  comboName?: string
  comboSubtotal?: number
  comboItems?: Array<{
    productId: string
    qty: number
  }>
}

interface OrderGift {
  name: string
  quantity: number
  description?: string
  productId?: string
  spec?: string
}

interface OrderCreditReward {
  title: string
  amount: number
  description?: string
}

interface OrderDeliveryBenefitRecord {
  title: string
  description?: string
}

interface OrderOpRewardRecord {
  title: string
  amount: number
  description?: string
}

interface OrderMock {
  id: string
  date: string
  status: 'pending' | 'processing' | 'shipped' | 'completed' | 'cancelled'
  tempZone: 'ambient' | 'chilled' | 'frozen' | 'fresh'
  shippingFee: number
  discount: number
  couponTitle?: string
  couponDiscount?: number
  couponCode?: string
  couponCodeDiscount?: number
  couponCodeShippingDiscount?: number
  memberDiscountTitle?: string
  memberDiscount?: number
  autoPercentDiscountTitle?: string
  autoPercentDiscount?: number
  autoAmountDiscountTitle?: string
  autoAmountDiscount?: number
  creditDiscount?: number
  pointDiscount?: number
  paymentMethod: string
  paymentStatus: string
  createdAt: string
  purchaserName?: string
  purchaserAddress?: string
  purchaserPhone?: string
  purchaserMobile?: string
  recipientName?: string
  recipientAddress?: string
  recipientPhone?: string
  recipientMobile?: string
  cardResult?: string
  transactionNo?: string
  invoiceType?: string
  invoiceDelivery?: string
  trackingNo?: string
  note?: string
  desiredDeliveryDate?: string
  deliveryTimeSlot?: string
  paymentDeadline?: string
  cancelledAt?: string
  cancelReason?: string
  refundStatus?: string
  gifts?: OrderGift[]
  creditRewards?: OrderCreditReward[]
  deliveryBenefitRecords?: OrderDeliveryBenefitRecord[]
  opRewardRecords?: OrderOpRewardRecord[]
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
      statusLabels: { pending: '待付款', processing: '待出貨', shipped: '已出貨', completed: '已完成', cancelled: '已取消' } as any,
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
      return (mockOrders as OrderMock[]).find(o => o.id === this.orderId)
    },
    orderSubtotal(): number {
      return this.currentOrder.items.reduce((sum: number, item: OrderItem) => sum + this.itemSubtotal(item), 0)
    },
    orderTotal(): number {
      return this.orderSubtotal + this.currentOrder.shippingFee - this.totalDiscount
    },
    totalDiscount(): number {
      const detailTotal = this.discountRows.reduce((sum: number, row: { amount: number }) => sum + row.amount, 0)
      return detailTotal > 0 ? detailTotal : (this.currentOrder.discount || 0)
    },
    discountRows(): Array<{ key: string; label: string; amount: number }> {
      const rows: Array<{ key: string; label: string; amount: number }> = []
      if ((this.currentOrder.couponDiscount || 0) > 0) {
        rows.push({
          key: 'coupon',
          label: `折價券：${this.currentOrder.couponTitle || '會員折價券'}`,
          amount: this.currentOrder.couponDiscount,
        })
      }
      if ((this.currentOrder.couponCodeDiscount || 0) > 0) {
        rows.push({
          key: 'coupon-code',
          label: `優惠碼：${this.currentOrder.couponCode || '已套用優惠碼'}`,
          amount: this.currentOrder.couponCodeDiscount,
        })
      }
      if ((this.currentOrder.couponCodeShippingDiscount || 0) > 0) {
        rows.push({
          key: 'coupon-code-shipping',
          label: `優惠碼：${this.currentOrder.couponCode || '免運優惠碼'}`,
          amount: this.currentOrder.couponCodeShippingDiscount,
        })
      }
      if ((this.currentOrder.memberDiscount || 0) > 0) {
        rows.push({
          key: 'member-discount',
          label: this.currentOrder.memberDiscountTitle || '會員優惠折抵',
          amount: this.currentOrder.memberDiscount,
        })
      }
      if ((this.currentOrder.autoPercentDiscount || 0) > 0) {
        rows.push({
          key: 'auto-percent',
          label: this.currentOrder.autoPercentDiscountTitle || '滿額自動折扣',
          amount: this.currentOrder.autoPercentDiscount,
        })
      }
      if ((this.currentOrder.autoAmountDiscount || 0) > 0) {
        rows.push({
          key: 'auto-amount',
          label: this.currentOrder.autoAmountDiscountTitle || '滿額自動折價',
          amount: this.currentOrder.autoAmountDiscount,
        })
      }
      if ((this.currentOrder.pointDiscount || 0) > 0) {
        rows.push({
          key: 'point',
          label: 'OP 點數折抵',
          amount: this.currentOrder.pointDiscount,
        })
      }
      if ((this.currentOrder.creditDiscount || 0) > 0) {
        rows.push({
          key: 'credit',
          label: '購物金折抵',
          amount: this.currentOrder.creditDiscount,
        })
      }
      if (rows.length === 0 && (this.currentOrder.discount || 0) > 0) {
        rows.push({
          key: 'discount',
          label: '訂單折抵',
          amount: this.currentOrder.discount,
        })
      }
      return rows
    },
    currentStatusIndex(): number {
      const statusMap = { pending: 0, processing: 1, shipped: 2, completed: 3, cancelled: 0 } as any
      return statusMap[this.currentOrder.status] || 0
    },
    progressWidth(): string {
      return (this.currentStatusIndex / (this.orderSteps.length - 1)) * 100 + '%'
    },
    formattedDesiredDeliveryDate(): string {
      const raw = this.currentOrder.desiredDeliveryDate || ''
      return raw ? raw.replace(/-/g, '/') : ''
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
    isPendingOrder(): boolean {
      return this.currentOrder.status === 'pending'
    },
    showCancelRefundInfo(): boolean {
      return this.currentOrder.status === 'cancelled'
    },
    orderInfoFields(): Array<{ label: string; value: string }> {
      return [
        { label: '訂單編號', value: this.currentOrder.id },
        { label: '下單時間', value: this.displayValue(this.currentOrder.date) },
      ]
    },
    giftRows(): OrderGift[] {
      return this.currentOrder.gifts || []
    },
    creditRewardRows(): OrderCreditReward[] {
      return this.currentOrder.creditRewards || []
    },
    creditRewardTotal(): number {
      return this.creditRewardRows.reduce((sum, row) => sum + row.amount, 0)
    },
    opRewardRows(): OrderOpRewardRecord[] {
      return this.currentOrder.opRewardRecords || []
    },
    opRewardTotal(): number {
      return this.opRewardRows.reduce((sum, row) => sum + row.amount, 0)
    },
    deliveryBenefitRecords(): OrderDeliveryBenefitRecord[] {
      return this.currentOrder.deliveryBenefitRecords || []
    },
    cancelCountdownLabel(): string {
      const minutes = Math.floor(this.remainingCancelSeconds / 60)
      const seconds = this.remainingCancelSeconds % 60
      return `取消訂單倒數 ${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
    },
    paymentStatusClass(): string {
      return this.currentOrder.paymentStatus === '已付款' ? 'text-emerald-600' : 'text-orange-500'
    },
    purchaserFields(): Array<{ label: string; value: string }> {
      return [
        { label: '訂購人姓名', value: this.displayValue(this.currentOrder.purchaserName) },
        { label: '訂購人地址', value: this.displayValue(this.currentOrder.purchaserAddress) },
        { label: '市內電話', value: this.displayValue(this.currentOrder.purchaserPhone) },
        { label: '行動電話', value: this.displayValue(this.currentOrder.purchaserMobile) },
      ]
    },
    recipientFields(): Array<{ label: string; value: string }> {
      return [
        { label: '收件人姓名', value: this.displayValue(this.currentOrder.recipientName) },
        { label: '收件人地址', value: this.displayValue(this.currentOrder.recipientAddress) },
        { label: '市內電話', value: this.displayValue(this.currentOrder.recipientPhone) },
        { label: '行動電話', value: this.displayValue(this.currentOrder.recipientMobile) },
      ]
    }
  },
  methods: {
    goToContact(): void {
      this.$router.push({
        path: '/contact',
        query: { orderId: this.orderId }
      })
    },
    reorderCurrentOrder(): void {
      this.currentOrder.items.forEach((item: OrderItem) => {
        const product = this.itemProduct(item)
        if (!product) return
        this.$store.dispatch('cart/addItem', {
          ...product,
          quantity: item.qty,
        })
      })
      this.$store.dispatch('ui/openCartDrawer')
    },
    itemProduct(item: OrderItem): Product | undefined {
      return mockProducts.find((product) => product.id === item.productId)
    },
    itemName(item: OrderItem): string {
      if (this.isComboItem(item)) return item.comboName || '組合商品'
      const product = this.itemProduct(item)
      return product?.name || '未知商品'
    },
    itemSpec(item: OrderItem): string {
      const product = this.itemProduct(item)
      return product?.unit || '規格未提供'
    },
    itemModel(item: OrderItem): string {
      if (this.isComboItem(item)) {
        return (item.comboItems || []).map((component) => component.productId.toUpperCase()).join(' / ')
      }
      return item.productId.toUpperCase()
    },
    isComboItem(item: OrderItem): boolean {
      return Array.isArray(item.comboItems) && item.comboItems.length > 0
    },
    componentProduct(component: { productId: string }): Product | undefined {
      return mockProducts.find((product) => product.id === component.productId)
    },
    componentName(component: { productId: string }): string {
      const product = this.componentProduct(component)
      return product?.name || '未知商品'
    },
    componentSpec(component: { productId: string }): string {
      const product = this.componentProduct(component)
      return product?.unit || '規格未提供'
    },
    itemUnitPrice(item: OrderItem): number {
      const product = this.itemProduct(item)
      return Math.round(product?.memberPrice ?? product?.originalPrice ?? product?.price ?? 0)
    },
    itemPriceLabel(item: OrderItem): string {
      if (this.isComboItem(item)) return `組合價 $${this.itemSubtotal(item).toLocaleString()}`
      return `單價 $${this.itemUnitPrice(item).toLocaleString()}`
    },
    itemSubtotal(item: OrderItem): number {
      if (this.isComboItem(item)) return item.comboSubtotal || 0
      return this.itemUnitPrice(item) * item.qty
    },
    placeholderText(item: OrderItem): string {
      return this.itemName(item).charAt(0) || '商'
    },
    displayValue(value?: string): string {
      return value && value.trim() ? value : '未填寫'
    }
  }
})
</script>

<style scoped>
.animate-fade-in { animation: fadeIn 0.5s ease-out forwards; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }
</style>
