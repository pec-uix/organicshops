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
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 lg:gap-6">
        
        <!-- Column 1: 客服中心 -->
        <div>
          <h4 class="text-white font-black mb-6 text-base tracking-widest border-l-4 border-brand-primary pl-3">客服中心</h4>
          <ul class="space-y-3 text-sm font-medium text-gray-300">
            <li><router-link to="/faq" class="hover:text-brand-primary transition-colors">常見問題</router-link></li>
            <li><router-link to="/shopping-guide" class="hover:text-brand-primary transition-colors">購物須知</router-link></li>
            <li><router-link to="/contact" class="hover:text-brand-primary transition-colors">聯絡客服</router-link></li>
          </ul>
        </div>

        <!-- Column 2: 會員專區 -->
        <div>
          <h4 class="text-white font-black mb-6 text-base tracking-widest border-l-4 border-brand-primary pl-3">會員專區</h4>
          <ul class="space-y-3 text-sm font-medium text-gray-300">
            <li><router-link to="/account/profile" class="hover:text-brand-primary transition-colors">會員資料</router-link></li>
            <li><router-link to="/account/orders" class="hover:text-brand-primary transition-colors">我的訂單</router-link></li>
            <li><router-link to="/privacy" class="hover:text-brand-primary transition-colors">會員條款</router-link></li>
          </ul>
        </div>

        <!-- Column 3: 品牌介紹 -->
        <div>
          <h4 class="text-white font-black mb-6 text-base tracking-widest border-l-4 border-brand-primary pl-3">品牌介紹</h4>
          <ul class="space-y-3 text-sm font-medium text-gray-300">
            <li><router-link to="/about" class="hover:text-brand-primary transition-colors">關於我們</router-link></li>
            <li><router-link to="/stores" class="hover:text-brand-primary transition-colors">特約店</router-link></li>
            <li><router-link to="/privacy" class="hover:text-brand-primary transition-colors">隱私權聲明</router-link></li>
            <li><router-link to="/news" class="hover:text-brand-primary transition-colors">最新消息</router-link></li>
          </ul>
        </div>

        <!-- Column 4: 安心購 -->
        <div>
          <h4 class="text-white font-black mb-6 text-base tracking-widest border-l-4 border-brand-primary pl-3">安心購</h4>
          <ul class="space-y-3 text-sm font-medium text-gray-300">
            <li><router-link to="/inspections" class="hover:text-brand-primary transition-colors">檢驗報告</router-link></li>
            <li><router-link to="/shopping-guide" class="hover:text-brand-primary transition-colors">食譜</router-link></li>
            <li><router-link to="/news" class="hover:text-brand-primary transition-colors">健康誌</router-link></li>
            <li><router-link to="/products" class="hover:text-brand-primary transition-colors">禮盒型錄</router-link></li>
          </ul>
        </div>

        <!-- Column 5: Corporate Info & Social -->
        <div class="col-span-2 lg:col-span-1 border-l border-gray-700/50 pl-0 lg:pl-8">
          <div class="text-[12px] md:text-[13px] leading-6 space-y-1.5 font-medium opacity-90 mb-8">
            <p class="text-white font-black text-base md:text-[17px] leading-tight mb-3 tracking-tight max-w-[16rem]">統一生機開發股份有限公司</p>
            <p>免付費訂購電話：0800-777-000</p>
            <p>公司地址：桃園市中壢區定寧路15號1樓</p>
            <p>愛用者免付費電話：0800-880-988</p>
            <p>董事長：郭慶峰</p>
            <p>聯絡客服信箱：service@organiclife.com.tw</p>
            <p>統一編號：16781797</p>
            <p>電話：03-434-0372 / 傳真：03-434-0379</p>
            <p>食品業者登錄字號：H-116781797-00000-1</p>
            <p class="pt-3 mt-2 border-t border-gray-700/30 text-[11px] md:text-[12px] leading-5">本公司商品已投保國泰世紀產物產品責任險單號碼1501字第14PD01573號</p>
          </div>

          <!-- Realistic Social Media Icons Row -->
          <div class="flex gap-4 pt-6 border-t border-gray-700/50">
            <!-- FB -->
            <router-link to="/news" title="最新消息" class="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group/sc transition-all hover:bg-[#1877F2]">
              <svg class="w-5 h-5 fill-gray-400 group-hover/sc:fill-white" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12.073-12-12.073s-12 5.446-12 12.073c0 5.991 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.951.925-1.951 1.874v2.251h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.065 24 12.073z"/></svg>
            </router-link>
            <!-- IG -->
            <router-link to="/about" title="品牌介紹" class="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group/sc transition-all hover:bg-[#E4405F]">
              <svg class="w-5 h-5 fill-gray-400 group-hover/sc:fill-white" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
            </router-link>
            <!-- LINE -->
            <router-link to="/contact" title="聯絡客服" class="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group/sc transition-all hover:bg-[#06C755]">
              <svg class="w-5 h-5 fill-gray-400 group-hover/sc:white" viewBox="0 0 24 24"><path d="M24 10.304c0-5.369-5.383-9.738-12-9.738-5.617 0-12 4.369-12 9.738 0 4.814 4.454 8.841 10.454 9.613.407.088.96.269 1.099.619.127.319.083.818.041 1.139l-.178 1.077c-.053.315-.259 1.233 1.118.672 1.378-.561 7.427-4.373 10.134-7.485 1.917-2.193 1.332-4.636 1.332-5.635zm-15.656 4.321c-.26 0-.472-.212-.472-.472v-3.766c0-.261.212-.473.472-.473.261 0 .473.212.473.473v3.293h2.355c.261 0 .472.213.472.473 0 .26-.211.472-.472.472h-2.828zm3.768 0c-.26 0-.472-.212-.472-.472v-3.766c0-.261.212-.473.472-.473.261 0 .473.212.473.473v3.766c0 .26-.212.472-.473.472zm2.353 0c-.261 0-.473-.212-.473-.472v-3.766c0-.261.212-.473.473-.473.003 0 .195.001.272.003l1.834 2.502v-2.032c0-.261.212-.473.472-.473.261 0 .473.212.473.473v3.766c0 .26-.212.472-.473.472h-.211l-1.895-2.585v2.11c0 .26-.212.472-.474.472zm6.13-.944c0 .261-.212.473-.473.473h-2.828c-.261 0-.473-.212-.473-.473v-3.766c0-.261.212-.473.473-.473.262 0 .473.212.473.473v1.414h2.355c.261 0 .473.212.473.473s-.212.472-.473.472h-2.355v1.414h2.355c.261 0 .473.212.473.473z"/></svg>
            </router-link>
            <!-- YT -->
            <router-link to="/stores" title="銷售通路" class="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group/sc transition-all hover:bg-[#FF0000]">
              <svg class="w-5 h-5 fill-gray-400 group-hover/sc:fill-white" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.016 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.016 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
            </router-link>
          </div>
        </div>
      </div>

      <!-- Bottom Bar with Certification -->
      <div class="py-12 flex flex-col md:flex-row items-center justify-between gap-8 border-t border-gray-700/30 mt-12">
        <!-- TWCA Badge -->
        <div class="flex items-center gap-4 group cursor-pointer grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all">
          <div class="bg-white p-2 rounded-full shadow-sm">
            <div class="w-14 h-14 border-4 border-blue-600 rounded-full flex flex-col items-center justify-center text-blue-600 leading-none">
              <span class="text-[7px] font-black uppercase">Secured By</span>
              <span class="text-base font-black tracking-tighter">TWCA</span>
              <span class="text-[6px] font-bold">臺灣網路認證</span>
            </div>
          </div>
          <div class="bg-gray-200 text-gray-800 px-3 py-1 rounded text-[10px] font-black font-mono">
            26/04/22
          </div>
        </div>

        <!-- Copyright -->
        <div class="text-center md:text-right">
          <p class="text-[11px] font-black tracking-widest mb-3 text-gray-500">© {{ new Date().getFullYear() }} 統一生機開發股份有限公司，版權所有</p>
          <div class="flex justify-center md:justify-end gap-6 opacity-30">
            <span class="text-[9px] font-bold border border-gray-400 px-1.5 rounded tracking-tighter">SSL 安全連線</span>
            <span class="text-[9px] font-bold border border-gray-400 px-1.5 rounded tracking-tighter">HACCP 認證</span>
            <span class="text-[9px] font-bold border border-gray-400 px-1.5 rounded tracking-tighter uppercase">ISO 22000</span>
          </div>
        </div>
      </div>
    </div>

    <!-- ── Right Floating Sidebar ── -->
    <div
      class="fixed right-[20px] bottom-[80px] z-[1000] pointer-events-auto"
      style="border: 0.5px solid #E5E7EB; box-shadow: 0 4px 16px rgba(0,0,0,0.15); border-radius: 16px;"
    >
      <div class="flex flex-col gap-2 bg-white p-2 rounded-[16px]">
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
          <router-link
            to="/contact"
            class="w-12 h-12 bg-[#00B900] text-white rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-105"
            aria-label="聯絡客服"
            title="LINE 聯絡客服"
            @click.native.stop
          >
            <span class="text-[11px] font-black tracking-tighter">LINE</span>
          </router-link>
          <span class="pointer-events-none absolute right-full mr-2 top-1/2 -translate-y-1/2 whitespace-nowrap rounded-md bg-gray-900 px-2 py-1 text-[10px] font-bold text-white opacity-0 shadow-lg transition-opacity duration-150 group-hover:opacity-100">
            LINE 聯絡客服
          </span>
        </div>

        <div class="relative group">
          <router-link
            to="/news"
            class="w-12 h-12 bg-white text-gray-700 rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-105 border border-gray-200"
            aria-label="最新消息"
            title="最新消息"
            @click.native.stop
          >
            <svg class="w-6 h-6 fill-current" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12.073-12-12.073s-12 5.446-12 12.073c0 5.991 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.951.925-1.951 1.874v2.251h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.065 24 12.073z"/>
            </svg>
          </router-link>
          <span class="pointer-events-none absolute right-full mr-2 top-1/2 -translate-y-1/2 whitespace-nowrap rounded-md bg-gray-900 px-2 py-1 text-[10px] font-bold text-white opacity-0 shadow-lg transition-opacity duration-150 group-hover:opacity-100">
            最新消息
          </span>
        </div>
      </div>
    </div>
  </footer>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'AppFooter',
  computed: {
    cartCount(): number { return this.$store.getters['cart/totalCount'] || 0 }
  },
  methods: {
    scrollToTop() {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }
})
</script>

<style scoped>
.scrollbar-hide::-webkit-scrollbar { display: none; }
.scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
</style>
