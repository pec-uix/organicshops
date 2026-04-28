<template>
  <div class="min-h-screen bg-brand-bg pb-16">
    <!-- ══ 主內容：側邊選單 + 內容 ══ -->
    <div class="max-w-7xl mx-auto px-4 pt-6 flex gap-6 items-start">

      <AccountSidebar active-key="wishlist" />

      <!-- ── 右側：內容區 ── -->
      <div class="flex-1 min-w-0 space-y-4">
        <AccountContentHeader
          title="收藏清單"
          subtitle="收藏喜歡的商品，隨時回來查看。"
          eyebrow="收藏清單"
        />
        
        <!-- 商品格狀排列：統一使用 ProductCard 網格 RWD 3欄/2欄 -->
        <div v-if="wishlist.length > 0" class="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5 xl:gap-6 justify-items-center animate-fade-in">
          <div
            v-for="item in wishlist"
            :key="item.id"
            class="relative w-full"
          >
            <ProductCard
              :product="item"
              :show-wishlist-button="false"
            />

            <button
              class="absolute right-3 top-3 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-gray-400 shadow-sm transition-colors hover:bg-red-50 hover:text-red-500"
              @click.stop="removeWishlistItem(item.id)"
              :title="`移除 ${item.name}`"
            >
              <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div
              v-if="!item.inStock"
              class="absolute inset-0 z-10 flex items-center justify-center rounded-2xl bg-black/35 backdrop-blur-[1px]"
            >
              <span class="rounded-full bg-gray-800/80 px-4 py-1.5 text-xs font-black tracking-[0.2em] text-white">
                已售完
              </span>
            </div>
          </div>
        </div>

        <!-- 空狀態 -->
        <div v-else class="flex flex-col items-center justify-center py-24 text-center bg-white rounded-2xl shadow-sm">
          <div class="text-6xl mb-5 select-none grayscale opacity-20">❤️</div>
          <h2 class="font-bold text-gray-700 text-lg mb-2">目前沒有收藏商品</h2>
          <p class="text-sm text-gray-400 mb-7">看到心儀的商品，點擊愛心收藏起來吧！</p>
          <router-link to="/products" class="bg-brand-primary text-white px-8 py-3 rounded-xl font-bold hover:bg-brand-dark transition-all">
            去逛逛商品
          </router-link>
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
import { getWishlist, removeFromWishlist } from '@/utils/wishlist'

export default Vue.extend({
  name: 'WishlistView',
  components: { AccountSidebar, AccountContentHeader, ProductCard },
  created() {
    document.title = '收藏清單'
    this.syncWishlist()
  },
  data() {
    return {
      wishlist: [] as Product[],
    }
  },
  methods: {
    syncWishlist() {
      this.wishlist = getWishlist()
    },
    removeWishlistItem(itemId: string) {
      this.wishlist = removeFromWishlist(itemId)
    },
  },
})
</script>

<style scoped>
.animate-fade-in { animation: fadeIn 0.5s ease-out forwards; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
</style>
