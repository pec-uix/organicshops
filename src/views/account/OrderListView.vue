<template>
  <div class="min-h-screen bg-gray-50 pb-16">
    <!-- ══ 主內容 ══ -->
    <div class="max-w-7xl mx-auto px-4 pt-6 flex flex-col gap-4 lg:flex-row lg:gap-6 lg:items-start">
      
      <AccountSidebar active-key="orders" />

      <!-- ── 右側：訂單內容 ── -->
      <div class="flex-1 min-w-0 space-y-6">
        <AccountContentHeader
          title="我的訂單"
          subtitle="追蹤訂單進度、配送資訊與過往購買紀錄。"
        />

        <!-- 訂單查詢 -->
        <section class="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            <div>
              <label class="form-label">起始日期</label>
              <input v-model="searchDateFrom" type="date" class="form-input" />
            </div>
            <div>
              <label class="form-label">結束日期</label>
              <input v-model="searchDateTo" type="date" class="form-input" />
            </div>
            <div>
              <label class="form-label">訂單狀況</label>
              <select v-model="searchStatus" class="form-input appearance-none">
                <option v-for="tab in orderTabs" :key="tab.value" :value="tab.value">
                  {{ tab.label }}
                </option>
              </select>
            </div>
            <div>
              <label class="form-label">訂單編號</label>
              <input v-model.trim="searchOrderId" type="text" class="form-input uppercase" placeholder="請輸入訂單編號" />
            </div>
            <div class="flex items-end gap-3">
              <button
                type="button"
                class="h-12 flex-1 rounded-xl bg-brand-primary px-4 text-sm font-bold text-white shadow-sm transition-colors hover:bg-brand-dark"
                @click="applyOrderFilters"
              >
                搜尋
              </button>
            </div>
          </div>
        </section>
        
        <!-- 狀態 Tabs (動態計算數量) -->
        <div class="flex items-center overflow-x-auto rounded-2xl border border-gray-100 bg-white shadow-sm">
          <button
            v-for="tab in orderTabs"
            :key="tab.value"
            class="relative min-w-[5.5rem] flex-1 flex-shrink-0 py-4 text-sm font-bold transition-all"
            :class="activeTab === tab.value ? 'text-brand-primary' : 'text-gray-400 hover:text-gray-600'"
            @click="selectOrderTab(tab.value)"
          >
            {{ tab.label }}
            <span v-if="tab.count > 0" class="ml-1 text-[10px] bg-gray-100 px-1.5 py-0.5 rounded-full">{{ tab.count }}</span>
            <span v-if="activeTab === tab.value" class="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-primary"></span>
          </button>
        </div>

        <!-- 訂單列表 -->
        <div v-if="filteredOrders.length > 0" class="space-y-4 animate-fade-in">
          <div 
            v-for="order in filteredOrders" 
            :key="order.id"
            class="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition-shadow hover:shadow-md md:p-5"
          >
            <div class="flex flex-col gap-2 border-b border-gray-100 pb-3 md:flex-row md:items-center md:justify-between">
              <div class="flex flex-wrap items-center gap-x-3 gap-y-1">
                <span class="text-xs font-black tracking-widest text-gray-400">訂單編號</span>
                <span class="text-base font-black text-gray-800">{{ order.id }}</span>
              </div>
              <span 
                class="inline-flex w-fit px-3 py-1 rounded-full text-[11px] font-bold tracking-widest border"
                :class="statusStyles[order.status]"
              >
                {{ statusLabels[order.status] }}
              </span>
            </div>

            <div class="mt-4 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div class="flex min-w-0 flex-1 flex-col gap-3 sm:flex-row sm:items-center">
                <div class="h-16 w-16 flex-shrink-0 overflow-hidden rounded-2xl border border-gray-100 bg-gray-50 shadow-sm">
                  <img v-if="order.mainImage" :src="order.mainImage" class="h-full w-full object-cover" />
                </div>
                <div class="min-w-0">
                  <h3 class="truncate text-base font-bold text-slate-800">{{ order.productSummary }}</h3>
                  <div class="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-slate-500">
                    <span>共 {{ order.unitCount }} 件商品</span>
                    <span class="text-slate-300">|</span>
                    <span>{{ order.paymentMethod }}</span>
                    <span class="text-slate-300">|</span>
                    <span class="rounded bg-slate-100 px-1.5 py-0.5 text-xs text-slate-600">{{ order.deliverySummary }}</span>
                  </div>
                </div>
              </div>

              <div class="flex flex-col gap-3 border-t border-gray-100 pt-3 sm:flex-row sm:items-center sm:justify-between lg:min-w-[19rem] lg:flex-col lg:items-end lg:border-t-0 lg:pt-0">
                <div class="flex items-baseline gap-2 lg:justify-end">
                  <span class="text-xs font-bold text-gray-400">訂單金額</span>
                  <span class="text-2xl font-black text-gray-800">${{ order.total.toLocaleString() }}</span>
                </div>
                <p v-if="order.discountTotal > 0" class="-mt-2 text-xs font-bold text-brand-primary lg:text-right">
                  已含折抵 ${{ order.discountTotal.toLocaleString() }}
                </p>
                <div class="flex w-full flex-col gap-2 sm:w-auto sm:flex-row lg:justify-end">
                  <router-link
                    v-if="order.status === 'pending'"
                    to="/checkout"
                    class="inline-flex items-center justify-center rounded-xl bg-brand-primary px-5 py-2.5 text-sm font-bold text-white shadow-sm transition-colors hover:bg-brand-dark"
                  >
                    前往付款
                  </router-link>
                  <button
                    v-if="canReorder(order.status)"
                    type="button"
                    class="inline-flex items-center justify-center rounded-xl bg-brand-primary px-5 py-2.5 text-sm font-bold text-white shadow-sm transition-colors hover:bg-brand-dark"
                    @click="reorder(order)"
                  >
                    再買一次
                  </button>
                  <router-link
                    :to="`/account/orders/${order.id}`"
                    class="inline-flex items-center justify-center rounded-xl border border-brand-primary px-5 py-2.5 text-sm font-bold text-brand-primary transition-all hover:bg-brand-primary hover:text-white"
                  >
                    查看更多
                  </router-link>
                </div>
              </div>
            </div>

            <div v-if="isOrderExpanded(order.id)" class="mt-5 border-t border-gray-100 pt-4">
              <div class="space-y-3">
                <div
                  v-for="item in order.items"
                  :key="item.id"
                  class="flex flex-col gap-3 rounded-xl bg-gray-50 p-3 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div class="flex min-w-0 gap-3">
                    <div class="h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl border border-gray-100 bg-white">
                      <img v-if="item.image" :src="item.image" class="h-full w-full object-cover" />
                    </div>
                    <div class="min-w-0 flex-1">
                      <p class="break-words text-sm font-black leading-6 text-gray-800">{{ item.name }}</p>
                      <p class="mt-1 text-xs font-bold text-gray-400">商品型號 {{ item.model }}</p>
                      <p class="mt-1 text-xs font-bold text-gray-400">{{ item.spec }}</p>
                      <p class="mt-1 text-xs font-bold text-gray-400">數量 {{ item.qty }}</p>
                    </div>
                  </div>
                  <div class="grid grid-cols-2 gap-4 text-sm sm:w-[12.5rem] sm:flex-shrink-0 sm:gap-6">
                    <div class="text-right">
                      <p class="text-[11px] font-bold text-gray-400">單價</p>
                      <p class="mt-1 font-black text-gray-700 tabular-nums">${{ item.unitPrice.toLocaleString() }}</p>
                    </div>
                    <div class="text-right">
                      <p class="text-[11px] font-bold text-gray-400">小計</p>
                      <p class="mt-1 font-black text-gray-800 tabular-nums">${{ item.subtotal.toLocaleString() }}</p>
                    </div>
                  </div>
                </div>
                <div
                  v-for="gift in order.gifts"
                  :key="`gift-${order.id}-${gift.productId || gift.name}`"
                  class="flex flex-col gap-3 rounded-xl bg-brand-surface/30 p-3 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div class="flex min-w-0 gap-3">
                    <div class="flex h-16 w-16 flex-shrink-0 items-center justify-center overflow-hidden rounded-xl border border-brand-primary/10 bg-white">
                      <span class="text-lg font-black text-brand-primary">贈</span>
                    </div>
                    <div class="min-w-0 flex-1">
                      <div class="flex flex-wrap items-center gap-2">
                        <p class="break-words text-sm font-black leading-6 text-gray-800">{{ gift.name }}</p>
                        <span class="rounded-full bg-brand-primary/10 px-2 py-0.5 text-[11px] font-bold text-brand-primary">{{ gift.description || '贈品' }}</span>
                      </div>
                      <p class="mt-1 text-xs font-bold text-gray-400">商品型號 {{ gift.productId || '未填寫' }}</p>
                      <p class="mt-1 text-xs font-bold text-gray-400">{{ gift.spec || '規格未提供' }}</p>
                      <p class="mt-1 text-xs font-bold text-gray-400">數量 {{ gift.quantity }}</p>
                    </div>
                  </div>
                  <div class="grid grid-cols-2 gap-4 text-sm sm:w-[12.5rem] sm:flex-shrink-0 sm:gap-6">
                    <div class="text-right">
                      <p class="text-[11px] font-bold text-gray-400">單價</p>
                      <p class="mt-1 font-black text-gray-700 tabular-nums">$0</p>
                    </div>
                    <div class="text-right">
                      <p class="text-[11px] font-bold text-gray-400">小計</p>
                      <p class="mt-1 font-black text-gray-800 tabular-nums">$0</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <button
              type="button"
              class="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 text-sm font-bold text-gray-500 transition-all hover:border-brand-primary hover:bg-brand-surface hover:text-brand-primary"
              :aria-expanded="isOrderExpanded(order.id) ? 'true' : 'false'"
              @click="toggleOrder(order.id)"
            >
              <span>{{ isOrderExpanded(order.id) ? '收合商品明細' : '展開商品明細' }}</span>
              <span
                class="accordion-caret"
                :class="{ 'accordion-caret--expanded': isOrderExpanded(order.id) }"
                aria-hidden="true"
              ></span>
            </button>
          </div>
        </div>

        <!-- 空狀態 -->
        <div v-else class="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-white px-6 py-24 text-center shadow-sm">
          <div class="text-6xl mb-6 opacity-20 grayscale">📦</div>
          <h2 class="font-bold text-gray-700 text-lg mb-2">尚無相關訂單</h2>
          <p class="text-sm text-gray-400 mb-8">這個分類暫時沒有訂單紀錄。</p>
          <router-link to="/products" class="btn-primary px-8 py-3 text-sm font-bold">
            去逛逛商品
          </router-link>
        </div>
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

export default Vue.extend({
  name: 'OrderListView',
  components: { AccountSidebar, AccountContentHeader },
  created() {
    document.title = '我的訂單'
  },
  data() {
    return {
      activeTab: 'all',
      searchStatus: 'all',
      searchDateFrom: '',
      searchDateTo: '',
      searchOrderId: '',
      dateFrom: '',
      dateTo: '',
      orderIdQuery: '',
      expandedOrderIds: [] as string[],
      statusStyles: {
        pending:    'text-orange-400 border-orange-100 bg-orange-50/30',
        processing: 'text-blue-400 border-blue-100 bg-blue-50/30',
        shipped:    'text-brand-primary border-brand-primary/20 bg-brand-surface',
        completed:  'text-gray-400 border-gray-100 bg-gray-50',
        cancelled:  'text-red-500 border-red-100 bg-red-50/60',
      } as any,
      statusLabels: {
        pending: '待付款', processing: '待出貨', shipped: '已出貨', completed: '已完成', cancelled: '已取消'
      } as any
    }
  },
  computed: {
    orders(): any[] {
      return mockOrders.map((rawOrder) => {
        const order = rawOrder as any
        const orderItems = order.items as any[]
        const products = orderItems
          .map((item) => this.itemProduct(item.productId))
          .filter(Boolean) as Product[]
        const itemKinds = orderItems.reduce((sum: number, item: any) => sum + (item.comboItems?.length || 1), 0)
        const unitCount = orderItems.reduce((sum: number, item: any) => {
          if (item.comboItems?.length) {
            return sum + item.comboItems.reduce((comboSum: number, comboItem: any) => comboSum + comboItem.qty, 0)
          }
          return sum + item.qty
        }, 0)
        const mainImage = products[0]?.image || ''
        const firstItemName = orderItems[0]?.comboName || products[0]?.name || `共 ${itemKinds} 項商品`
        const subtotal = orderItems.reduce((sum: number, item: any) => sum + this.orderItemSubtotal(item), 0)
        const discountTotal = this.orderDiscountTotal(order)
        const total = subtotal + order.shippingFee - discountTotal
        const items = orderItems.map((item) => {
          const product = this.itemProduct(item.productId)
          const unitPrice = this.itemUnitPrice(item.productId)

          return {
            id: item.id,
            productId: item.productId,
            name: product?.name || '商品',
            image: product?.image || '',
            qty: item.qty,
            model: this.orderItemModel(item),
            spec: this.orderItemSpec(item),
            unitPrice,
            subtotal: this.orderItemSubtotal(item),
          }
        })

        return {
          id: order.id,
          date: order.date,
          status: order.status,
          paymentMethod: order.paymentMethod,
          deliverySummary: this.deliverySummary(order.tempZone),
          total,
          discountTotal,
          itemCount: itemKinds,
          unitCount,
          productSummary: itemKinds === 1 ? firstItemName : `${firstItemName}等 ${itemKinds} 項商品`,
          mainImage,
          items,
          gifts: order.gifts || [],
        }
      })
    },
    filteredOrders(): any[] {
      return this.orders.filter((order) => {
        const matchesStatus = this.activeTab === 'all' || order.status === this.activeTab
        const matchesOrderId = !this.orderIdQuery || order.id.toLowerCase().includes(this.orderIdQuery.toLowerCase())
        const orderDate = this.orderDateValue(order.date)
        const matchesDateFrom = !this.dateFrom || orderDate >= this.dateFrom
        const matchesDateTo = !this.dateTo || orderDate <= this.dateTo
        return matchesStatus && matchesOrderId && matchesDateFrom && matchesDateTo
      })
    },
    orderTabs(): any[] {
      return [
        { label: '全部', value: 'all', count: this.orders.length },
        { label: '待付款', value: 'pending', count: this.orders.filter(o => o.status === 'pending').length },
        { label: '待出貨', value: 'processing', count: this.orders.filter(o => o.status === 'processing').length },
        { label: '已完成', value: 'completed', count: this.orders.filter(o => o.status === 'completed').length },
        { label: '已取消', value: 'cancelled', count: this.orders.filter(o => o.status === 'cancelled').length },
      ]
    }
  },
  methods: {
    itemProduct(productId: string): Product | undefined {
      return mockProducts.find((product) => product.id === productId)
    },
    itemUnitPrice(productId: string): number {
      const product = this.itemProduct(productId)
      return Math.round(product?.memberPrice ?? product?.originalPrice ?? product?.price ?? 0)
    },
    itemSubtotal(productId: string, qty: number): number {
      return this.itemUnitPrice(productId) * qty
    },
    orderItemSubtotal(item: any): number {
      if (item.comboSubtotal) return item.comboSubtotal
      return this.itemSubtotal(item.productId, item.qty)
    },
    orderItemModel(item: any): string {
      if (Array.isArray(item.comboItems) && item.comboItems.length > 0) {
        return item.comboItems.map((component: any) => component.productId.toUpperCase()).join(' / ')
      }
      return item.productId.toUpperCase()
    },
    orderItemSpec(item: any): string {
      if (Array.isArray(item.comboItems) && item.comboItems.length > 0) return '組合商品'
      const product = this.itemProduct(item.productId)
      return product?.unit || '規格未提供'
    },
    orderDiscountTotal(order: any): number {
      const detailTotal = [
        order.couponDiscount,
        order.couponCodeDiscount,
        order.couponCodeShippingDiscount,
        order.memberDiscount,
        order.autoPercentDiscount,
        order.autoAmountDiscount,
        order.pointDiscount,
        order.creditDiscount,
      ].reduce((sum: number, amount: number | undefined) => sum + (amount || 0), 0)
      return detailTotal > 0 ? detailTotal : (order.discount || 0)
    },
    deliverySummary(tempZone: string): string {
      const labels: Record<string, string> = {
        ambient: '常溫配送',
        chilled: '冷藏配送',
        frozen: '冷凍配送',
        fresh: '生鮮配送',
      }
      return labels[tempZone] || '宅配'
    },
    orderDateValue(date: string): string {
      return date.split(' ')[0].replace(/\//g, '-')
    },
    resetOrderFilters() {
      this.activeTab = 'all'
      this.searchStatus = 'all'
      this.searchDateFrom = ''
      this.searchDateTo = ''
      this.searchOrderId = ''
      this.dateFrom = ''
      this.dateTo = ''
      this.orderIdQuery = ''
    },
    applyOrderFilters() {
      this.activeTab = this.searchStatus
      this.dateFrom = this.searchDateFrom
      this.dateTo = this.searchDateTo
      this.orderIdQuery = this.searchOrderId
    },
    selectOrderTab(status: string) {
      this.activeTab = status
      this.searchStatus = status
    },
    isOrderExpanded(orderId: string): boolean {
      return this.expandedOrderIds.includes(orderId)
    },
    canReorder(status: string): boolean {
      return ['processing', 'shipped', 'completed'].includes(status)
    },
    reorder(order: any) {
      order.items.forEach((item: any) => {
        const product = this.itemProduct(item.productId)
        if (!product) return
        this.$store.dispatch('cart/addItem', {
          ...product,
          quantity: item.qty,
        })
      })
      this.$store.dispatch('ui/openCartDrawer')
    },
    toggleOrder(orderId: string) {
      if (this.isOrderExpanded(orderId)) {
        this.expandedOrderIds = this.expandedOrderIds.filter((id) => id !== orderId)
        return
      }

      this.expandedOrderIds = [...this.expandedOrderIds, orderId]
    }
  }
})
</script>

<style scoped>
.animate-fade-in { animation: fadeIn 0.5s ease-out forwards; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }
.btn-primary {
  @apply bg-brand-primary text-white rounded-xl hover:bg-brand-dark transition-colors shadow-sm active:scale-[0.98];
}
.accordion-caret {
  display: inline-block;
  width: 0;
  height: 0;
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  border-top: 6px solid currentColor;
  transform-origin: center;
  transition: transform 0.2s ease;
}
.accordion-caret--expanded {
  transform: rotate(180deg);
}
.form-label {
  @apply mb-2 block text-xs font-bold text-gray-500;
}
.form-input {
  @apply h-12 w-full rounded-xl border border-gray-200 bg-white px-4 text-sm font-medium text-gray-700 outline-none transition-all placeholder:text-gray-300 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10;
}
</style>
