<template>
  <footer class="bg-gray-800 text-gray-400 mt-20 relative">
    
    <!-- ── 質感回頂部導覽條 (Back to Top Bar) ── -->
    <div class="w-full bg-[#568133] h-10 relative group">
      <div class="max-w-7xl mx-auto px-4 h-full relative">
        <button 
          @click="scrollToTop"
          class="absolute -top-4 right-4 w-12 h-14 bg-[#568133] flex items-center justify-center transition-all duration-300 hover:-translate-y-1 active:scale-95 z-10 shadow-lg"
          style="clip-path: polygon(50% 0%, 100% 30%, 100% 100%, 0 100%, 0 30%);"
          title="回網頁最上方"
        >
          <svg class="w-6 h-6 text-white mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 15l7-7 7 7" />
          </svg>
        </button>
      </div>
    </div>

    <!-- ── Main Footer Content ── -->
    <div class="max-w-7xl mx-auto px-4 py-16">
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-8 lg:gap-6">
        <div>
          <h4 class="text-white font-black mb-6 text-base tracking-widest border-l-4 border-brand-primary pl-3">客服中心</h4>
          <ul class="space-y-3 text-sm font-medium text-gray-300">
            <li><router-link to="/faq" class="hover:text-brand-primary transition-colors">常見問題</router-link></li>
            <li><router-link to="/shopping-guide" class="hover:text-brand-primary transition-colors">購物須知</router-link></li>
            <li><router-link to="/contact" class="hover:text-brand-primary transition-colors">聯絡客服</router-link></li>
          </ul>
        </div>

        <div>
          <h4 class="text-white font-black mb-6 text-base tracking-widest border-l-4 border-brand-primary pl-3">會員服務</h4>
          <ul class="space-y-3 text-sm font-medium text-gray-300">
            <li><router-link to="/account/profile" class="hover:text-brand-primary transition-colors">會員資料</router-link></li>
            <li><router-link to="/account/orders" class="hover:text-brand-primary transition-colors">我的訂單</router-link></li>
            <li><router-link to="/member-terms" class="hover:text-brand-primary transition-colors">會員條款</router-link></li>
          </ul>
        </div>

        <div>
          <h4 class="text-white font-black mb-6 text-base tracking-widest border-l-4 border-brand-primary pl-3">認識統一生機</h4>
          <ul class="space-y-3 text-sm font-medium text-gray-300">
            <li><router-link to="/about" class="hover:text-brand-primary transition-colors">關於我們</router-link></li>
            <li><router-link to="/stores" class="hover:text-brand-primary transition-colors">特約店</router-link></li>
            <li><router-link to="/news" class="hover:text-brand-primary transition-colors">最新消息</router-link></li>
            <li><router-link to="/privacy" class="hover:text-brand-primary transition-colors">隱私權聲明</router-link></li>
            <li><a href="https://s1.myqr.com.tw/newshop/172" target="_blank" rel="noopener" class="hover:text-brand-primary transition-colors">有機店超市訂貨區</a></li>
          </ul>
        </div>

        <div>
          <h4 class="text-white font-black mb-6 text-base tracking-widest border-l-4 border-brand-primary pl-3">安心購</h4>
          <ul class="space-y-3 text-sm font-medium text-gray-300">
            <li><router-link to="/inspections" class="hover:text-brand-primary transition-colors">檢驗報告</router-link></li>
            <li><button type="button" class="hover:text-brand-primary transition-colors" @click="openPdf('/health-journal.pdf', '健康誌')">健康誌</button></li>
            <li><button type="button" class="hover:text-brand-primary transition-colors" @click="openPdf('/gift-catalog.pdf', '禮盒型錄')">禮盒型錄</button></li>
          </ul>
        </div>

        <div class="col-span-2 lg:col-span-3 border-l border-gray-700/50 pl-0 lg:pl-8">
          <h4 class="text-white font-black mb-6 text-base tracking-widest border-l-4 border-brand-primary pl-3">企業資訊</h4>
          <div class="text-sm font-medium text-gray-300 leading-7 space-y-0 mb-8">
            <p>統一企業集團</p>
            <p>統一生機開發股份有限公司</p>
            <p>免付費訂購電話：0800-777-000</p>
            <p>愛用者免付費電話：0800-880-988</p>
            <p>公司地址：桃園市中壢區定寧路15號1樓</p>
            <p>統一編號：16781797</p>
            <p>電話：03-434-0372</p>
            <p>傳真：03-434-0379</p>
            <p>食品業者登錄字號：H-116781797-00000-1</p>
            <p class="pt-3 mt-2 border-t border-gray-700/30">產品責任險：國泰世紀產物產品責任險單號碼1501字第14PD01573號</p>
          </div>

          <div class="pt-6 border-t border-gray-700/50">
            <p class="text-white font-black text-sm mb-4">追蹤動態</p>
            <div class="flex gap-3">
              <a href="#" title="Facebook" class="w-12 h-12 rounded-full bg-[#1877F2] flex items-center justify-center transition-all duration-200 hover:opacity-90">
                <svg class="w-5 h-5 fill-white" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </a>
              <router-link to="/contact" title="LINE 聯絡客服" class="w-12 h-12 overflow-hidden rounded-full bg-[#06C755] flex items-center justify-center transition-all duration-200 hover:opacity-90" @click.native.stop>
                <img :src="publicAsset('/line-icon.png')" alt="LINE" class="h-full w-full object-cover" />
              </router-link>
            </div>
          </div>
        </div>
      </div>

      <!-- Bottom Bar with Certification -->
      <div class="py-12 flex justify-center md:justify-end border-t border-gray-700/30 mt-12">
        <!-- Copyright -->
        <div class="text-center md:text-right">
          <p class="text-[11px] font-black tracking-widest text-gray-500">© {{ new Date().getFullYear() }} 統一企業集團，版權所有</p>
        </div>
      </div>
    </div>

    <!-- ── Right Floating Sidebar ── -->
    <div
      class="fixed right-4 bottom-6 block pointer-events-auto transition-all duration-200 lg:right-[20px] lg:bottom-[80px]"
      :class="isCartOpen ? 'z-30 opacity-0 pointer-events-none' : 'z-[1000] opacity-100'"
      style="border: 0.5px solid #E5E7EB; box-shadow: 0 4px 16px rgba(0,0,0,0.15); border-radius: 16px;"
    >
      <div class="flex flex-col items-center gap-2 bg-white p-2 rounded-[16px]">
        <div class="relative group">
          <button
            @click.stop="$store.dispatch('ui/openCartDrawer')"
            class="w-12 h-12 bg-[#2D6A2D] text-white rounded-xl flex items-center justify-center relative transition-all duration-200 hover:bg-[#4A9B4A] hover:scale-105"
            aria-label="開啟購物車"
            title="購物車"
          >
            <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.6" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.6 8H19M7 13H5.4M10 21a1 1 0 100-2 1 1 0 000 2zm8 0a1 1 0 100-2 1 1 0 000 2z" />
            </svg>
            <span
              v-if="cartCount > 0"
              class="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-[#E53935] text-white text-[10px] font-black rounded-full flex items-center justify-center shadow-sm border border-white"
            >
              {{ cartCount }}
            </span>
          </button>
          <span class="pointer-events-none absolute right-full mr-2 top-1/2 -translate-y-1/2 whitespace-nowrap rounded-md bg-gray-900 px-2 py-1 text-[10px] font-bold text-white opacity-0 shadow-lg transition-opacity duration-150 group-hover:opacity-100">
            購物車
          </span>
        </div>

        <div class="relative group">
          <a
            href="https://page.line.me/upoc?openQrModal=true"
            target="_blank"
            rel="noopener noreferrer"
            class="w-12 h-12 overflow-hidden bg-[#06C755] rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-105"
            aria-label="LINE 官方帳號"
            title="LINE 官方帳號"
          >
            <img :src="publicAsset('/line-icon.png')" alt="LINE" class="h-full w-full object-cover" />
          </a>
          <span class="pointer-events-none absolute right-full mr-2 top-1/2 -translate-y-1/2 whitespace-nowrap rounded-md bg-gray-900 px-2 py-1 text-[10px] font-bold text-white opacity-0 shadow-lg transition-opacity duration-150 group-hover:opacity-100">
            LINE 官方帳號
          </span>
        </div>

        <div class="relative group">
          <a
            href="https://www.facebook.com/UPOC1999/"
            target="_blank"
            rel="noopener noreferrer"
            class="w-12 h-12 bg-[#1877F2] text-white rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-105"
            aria-label="Facebook 粉絲頁"
            title="Facebook 粉絲頁"
          >
            <svg class="w-6 h-6" viewBox="0 0 24 24" fill="white">
              <path d="M13.397 20.997v-8.196h2.765l.411-3.209h-3.176V7.548c0-.926.258-1.56 1.587-1.56h1.684V3.127A22.336 22.336 0 0 0 14.201 3c-2.444 0-4.122 1.492-4.122 4.231v2.355H7.332v3.209h2.753v8.202h3.312z"/>
            </svg>
          </a>
          <span class="pointer-events-none absolute right-full mr-2 top-1/2 -translate-y-1/2 whitespace-nowrap rounded-md bg-gray-900 px-2 py-1 text-[10px] font-bold text-white opacity-0 shadow-lg transition-opacity duration-150 group-hover:opacity-100">
            Facebook 粉絲頁
          </span>
        </div>

        <div class="relative group">
          <button
            type="button"
            class="w-12 h-12 bg-transparent flex items-center justify-center transition-all duration-200 hover:scale-105"
            aria-label="健康誌"
            title="健康誌"
            @click.stop="openPdf('/health-journal.pdf', '健康誌')"
          >
            <img :src="publicAsset('/health-journal-icon.png')" alt="健康誌" class="max-h-full max-w-full object-contain" />
          </button>
          <span class="pointer-events-none absolute right-full mr-2 top-1/2 -translate-y-1/2 whitespace-nowrap rounded-md bg-gray-900 px-2 py-1 text-[10px] font-bold text-white opacity-0 shadow-lg transition-opacity duration-150 group-hover:opacity-100">
            健康誌
          </span>
        </div>

        <div class="relative group">
          <button
            type="button"
            class="w-12 h-12 bg-transparent flex items-center justify-center transition-all duration-200 hover:scale-105"
            aria-label="禮盒型錄"
            title="禮盒型錄"
            @click.stop="openPdf('/gift-catalog.pdf', '禮盒型錄')"
          >
            <img :src="publicAsset('/gift-catalog-icon.png')" alt="禮盒型錄" class="max-h-full max-w-full object-contain scale-110" />
          </button>
          <span class="pointer-events-none absolute right-full mr-2 top-1/2 -translate-y-1/2 whitespace-nowrap rounded-md bg-gray-900 px-2 py-1 text-[10px] font-bold text-white opacity-0 shadow-lg transition-opacity duration-150 group-hover:opacity-100">
            禮盒型錄
          </span>
        </div>

        <div
          v-if="showBackToTop"
          class="relative group"
        >
          <button
            type="button"
            class="w-12 h-12 bg-brand-primary text-white rounded-xl flex items-center justify-center transition-all duration-200 hover:bg-[#568133] hover:scale-105"
            aria-label="回到最上方"
            title="回到最上方"
            @click.stop="scrollToTop"
          >
            <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" />
            </svg>
          </button>
          <span class="pointer-events-none absolute right-full mr-2 top-1/2 -translate-y-1/2 whitespace-nowrap rounded-md bg-gray-900 px-2 py-1 text-[10px] font-bold text-white opacity-0 shadow-lg transition-opacity duration-150 group-hover:opacity-100">
            回到最上方
          </span>
        </div>
      </div>
    </div>
  </footer>
</template>

<script lang="ts">
import Vue from 'vue'
import { publicAssetPath } from '@/utils/public-path'

export default Vue.extend({
  name: 'AppFooter',
  data() {
    return {
      showBackToTop: false,
    }
  },
  computed: {
    cartCount(): number { return this.$store.getters['cart/totalCount'] || 0 },
    isCartOpen(): boolean { return this.$store.getters['ui/cartDrawerOpen'] },
  },
  mounted() {
    this.updateBackToTopVisibility()
    window.addEventListener('scroll', this.updateBackToTopVisibility, { passive: true })
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.updateBackToTopVisibility)
  },
  methods: {
    publicAsset(path: string): string {
      return publicAssetPath(path)
    },
    updateBackToTopVisibility() {
      this.showBackToTop = window.scrollY > 420
    },
    scrollToTop() {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    },
    openPdf(url: string, title: string) {
      this.$store.dispatch('ui/openPdfViewer', { url, title })
    },
  }
})
</script>

<style scoped>
.scrollbar-hide::-webkit-scrollbar { display: none; }
.scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
</style>
