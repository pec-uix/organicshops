<template>
  <div class="min-h-screen bg-brand-bg pb-16">
    <!-- ══ 主內容 ══ -->
    <div class="max-w-7xl mx-auto px-4 pt-6 flex gap-6 items-start">
      
      <AccountSidebar active-key="orders" />

      <!-- ── 右側：訂單內容 ── -->
      <div class="flex-1 min-w-0 space-y-6">
        <AccountContentHeader
          title="我的訂單"
          subtitle="查看目前訂單狀態與歷史訂單紀錄。"
          eyebrow="訂單紀錄"
        />
        
        <!-- 狀態 Tabs (動態計算數量) -->
        <div class="bg-white rounded-2xl shadow-sm overflow-hidden flex items-center border-b border-gray-50">
          <button
            v-for="tab in orderTabs"
            :key="tab.value"
            class="flex-1 py-4 text-sm font-bold transition-all relative"
            :class="activeTab === tab.value ? 'text-brand-primary' : 'text-gray-400 hover:text-gray-600'"
            @click="activeTab = tab.value"
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
            class="bg-white rounded-2xl shadow-sm p-5 md:p-6 transition-shadow hover:shadow-md border border-transparent hover:border-gray-100"
          >
            <div class="flex flex-col gap-4 border-b border-gray-50 pb-4 md:flex-row md:items-start md:justify-between">
              <div class="space-y-1">
                <p class="text-xs font-black tracking-widest text-gray-400">訂單編號</p>
                <p class="text-lg font-black text-gray-800">{{ order.id }}</p>
                <p class="text-sm text-gray-400">{{ order.date }}</p>
              </div>
              <span 
                class="inline-flex w-fit px-3 py-1 rounded-full text-[11px] font-bold tracking-widest border"
                :class="statusStyles[order.status]"
              >
                {{ statusLabels[order.status] }}
              </span>
            </div>

            <div class="mt-5 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div class="min-w-0 flex-1">
                <div class="flex items-center gap-3">
                  <div class="flex -space-x-2">
                    <div v-for="(img, idx) in order.images.slice(0, 3)" :key="idx" class="w-14 h-14 rounded-2xl border-2 border-white shadow-sm bg-gray-50 overflow-hidden">
                      <img :src="img" class="w-full h-full object-cover" />
                    </div>
                  </div>
                  <div v-if="order.itemCount > 3" class="h-10 min-w-[2.5rem] rounded-full bg-gray-100 px-2 flex items-center justify-center text-[11px] font-bold text-gray-400">
                    +{{ order.itemCount - 3 }}
                  </div>
                </div>
                <div class="mt-4 space-y-1">
                  <p class="text-base font-black text-gray-800">{{ order.firstItemName }}</p>
                  <p class="text-sm text-gray-500">共 {{ order.itemCount }} 項商品</p>
                </div>
              </div>

              <div class="flex flex-col gap-3 lg:items-end">
                <div class="rounded-2xl bg-gray-50 px-4 py-3 text-left lg:text-right">
                  <p class="text-xs font-bold text-gray-400 mb-1">訂單金額</p>
                  <p class="text-3xl font-black text-gray-800">${{ order.total.toLocaleString() }}</p>
                </div>
                <router-link :to="`/account/orders/${order.id}`" class="inline-flex items-center justify-center rounded-xl border border-brand-primary px-5 py-2.5 text-sm font-bold text-brand-primary hover:bg-brand-primary hover:text-white transition-all">
                  查看明細
                </router-link>
              </div>
            </div>
          </div>
        </div>

        <!-- 空狀態 -->
        <div v-else class="flex flex-col items-center justify-center py-24 bg-white rounded-2xl shadow-sm text-center">
          <div class="text-6xl mb-6 opacity-20 grayscale">📦</div>
          <h2 class="font-bold text-gray-700 text-lg mb-2">尚無相關訂單</h2>
                <p class="text-sm text-gray-400 mb-8">此狀態目前沒有訂單。</p>
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
      return mockOrders.map((order) => {
        const products = order.items
          .map((item) => this.itemProduct(item.productId))
          .filter(Boolean) as Product[]
        const itemKinds = order.items.length
        const images = products.map((product) => product.image).slice(0, 3)
        const firstItemName = itemKinds === 1 && products[0] ? products[0].name : `共 ${itemKinds} 項商品`
        const subtotal = order.items.reduce((sum, item) => sum + this.itemSubtotal(item.productId, item.qty), 0)
        const total = subtotal + order.shippingFee - (order.discount || 0)

        return {
          id: order.id,
          date: order.date,
          status: order.status,
          total,
          itemCount: itemKinds,
          firstItemName,
          images,
        }
      })
    },
    filteredOrders(): any[] {
      if (this.activeTab === 'all') return this.orders
      return this.orders.filter(o => o.status === this.activeTab)
    },
    orderTabs(): any[] {
      return [
        { label: '全部', value: 'all', count: this.orders.length },
        { label: '待付款', value: 'pending', count: this.orders.filter(o => o.status === 'pending').length },
        { label: '待出貨', value: 'processing', count: this.orders.filter(o => o.status === 'processing').length },
        { label: '已出貨', value: 'shipped', count: this.orders.filter(o => o.status === 'shipped').length },
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
    }
  }
})
</script>

<style scoped>
.animate-fade-in { animation: fadeIn 0.5s ease-out forwards; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }
</style>
