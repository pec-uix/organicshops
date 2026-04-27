<template>
  <div class="min-h-screen bg-brand-bg pb-24 font-sans text-gray-800">
    <!-- ══ 主內容 ══ -->
    <div class="max-w-7xl mx-auto px-4 pt-6 flex gap-6 items-start">
      <AccountSidebar
        active-key="op-exchange"
        :subtitle="isLoggedIn ? 'OP 會員專區' : '登入後查看點數'"
        :show-logout="isLoggedIn"
        :custom-links="accountLinks"
      />

      <div class="flex-1 min-w-0 space-y-6">
        <AccountContentHeader
          title="OP 點數換購"
          subtitle="查看可用點數並以專屬加購價兌換指定商品。"
          eyebrow="OpenPoint Exchange"
        />
        <!-- 點數總覽卡片 -->
        <div class="bg-gradient-to-br from-orange-500 to-amber-500 rounded-2xl p-8 shadow-xl shadow-orange-100 relative overflow-hidden border border-white/20">
          <div class="relative z-10 flex flex-wrap items-center justify-between gap-8 text-white">
            <div v-if="isLoggedIn">
              <p class="text-[10px] font-black opacity-80 mb-2 tracking-[0.3em] uppercase">OpenPoint Balance</p>
              <div class="flex items-baseline gap-2">
                <span class="text-5xl font-black italic tracking-tighter">{{ userPoints.toLocaleString() }}</span>
                <span class="text-sm font-black">POINTS</span>
              </div>
              <p class="text-[10px] opacity-70 mt-3 font-bold">點數效期至：2026-12-31</p>
            </div>
            <div v-else class="space-y-4">
              <p class="text-[10px] font-black opacity-80 mb-1 tracking-[0.3em] uppercase text-white">Identity Check</p>
              <h2 class="text-3xl font-black italic tracking-tighter">請先登入會員</h2>
              <p class="text-xs opacity-70 font-bold max-w-sm">登入後即可查看您的可用點數、兌換紀錄，並享受專屬的點數加購優惠。</p>
              <router-link to="/login" class="inline-block bg-white text-orange-600 px-10 py-3 rounded-md font-black text-sm uppercase tracking-widest shadow-xl hover:scale-105 transition-all">
                立即登入會員
              </router-link>
            </div>
          </div>
          <div class="absolute -right-10 -bottom-10 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
        </div>

        <!-- 換購列表：統一使用 ProductCard 網格 RWD 3欄/2欄 -->
        <div class="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5 xl:gap-6 justify-items-center">
          <ProductCard 
            v-for="item in exchangeItems" 
            :key="item.id" 
            :product="item"
            :available-op-points="userPoints"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import ProductCard from '@/components/product/ProductCard.vue'
import { Product } from '@/types'
import AccountSidebar from '@/components/account/AccountSidebar.vue'
import AccountContentHeader from '@/components/account/AccountContentHeader.vue'

export default Vue.extend({
  name: 'OPExchangeView',
  components: { AccountSidebar, AccountContentHeader, ProductCard },
  data() {
    return {
      userPoints: 1250,
      exchangeItems: [
        { 
          id: 'EX01', name: '原味綜合堅果隨手包 (10入)', 
          image: 'https://images.unsplash.com/photo-1536620453324-a213e37d5268?auto=format&fit=crop&q=80&w=800', 
          price: 350, originalPrice: 350, memberPrice: 250, requiredOpPoints: 100,
          inStock: true, categoryId: 'nuts', tempZone: 'ambient', unit: '25g x 10包', origin: '產地嚴選', isOrganic: true, description: '', tags: []
        },
        { 
          id: 'EX02', name: '菊花枸杞銀耳露 (6瓶裝)', 
          image: 'https://images.unsplash.com/photo-1544787210-2827255cb39e?auto=format&fit=crop&q=80&w=800', 
          price: 390, originalPrice: 390, memberPrice: 350, requiredOpPoints: 150,
          inStock: true, categoryId: 'drinks', tempZone: 'chilled', unit: '295ml x 6瓶', origin: '台灣', isOrganic: true, description: '', tags: []
        },
        { 
          id: 'EX03', name: '統一生機有機枸杞原汁', 
          image: 'https://images.unsplash.com/photo-1610348725531-843dff563e2c?auto=format&fit=crop&q=80&w=800', 
          price: 1200, originalPrice: 1200, memberPrice: 900, requiredOpPoints: 300,
          inStock: true, categoryId: 'health', tempZone: 'ambient', unit: '30ml x 10入', origin: '產地直送', isOrganic: true, description: '', tags: []
        },
        { 
          id: 'EX04', name: '有機堅果禮盒', 
          image: 'https://images.unsplash.com/photo-1517935706615-2717063c2225?auto=format&fit=crop&q=80&w=800', 
          price: 1680, originalPrice: 1680, memberPrice: 1490, requiredOpPoints: 1500,
          inStock: true, categoryId: 'gift', tempZone: 'ambient', unit: '綜合禮盒', origin: '台灣', isOrganic: true, description: '', tags: []
        },
      ] as Product[],
    }
  },
  computed: {
    isLoggedIn(): boolean { return this.$store.getters['auth/isLoggedIn'] },
    accountLinks(): Array<{ key: string; to: string; icon: string; label: string }> {
      return [
        { key: 'account', to: '/account', icon: '🏠', label: '會員中心' },
        { key: 'orders', to: '/account/orders', icon: '📦', label: '我的訂單' },
        { key: 'credits', to: '/account/credits', icon: '💰', label: '購物金明細' },
        { key: 'op-exchange', to: '/op-exchange', icon: '🔶', label: '點數換購' },
        { key: 'wishlist', to: '/account/wishlist', icon: '❤️', label: '收藏清單' },
      ]
    },
  }
})
</script>
