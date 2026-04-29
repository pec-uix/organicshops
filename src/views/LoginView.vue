<template>
  <div class="min-h-screen bg-[#F8F9FA] flex items-center justify-center px-4 py-12">
    <div class="w-full max-w-5xl">
      <!-- ══ Logo ══ -->
      <div class="text-center mb-12">
        <router-link to="/" class="inline-flex flex-col items-center group">
          <div class="w-16 h-16 bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center text-4xl mb-3 group-hover:border-brand-primary transition-all">🌿</div>
          <h1 class="text-2xl font-serif font-black text-brand-dark tracking-widest">統一生機</h1>
        </router-link>
      </div>

      <!-- ── 雙軌分流容器 ── -->
      <div class="bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col lg:flex-row border border-gray-100">
        
        <!-- ▌左軌：會員登入區 -->
        <div class="flex-1 p-8 lg:p-16 border-b lg:border-b-0 lg:border-r border-gray-100">
          <div class="mb-10">
            <h2 class="text-2xl font-black text-gray-800 tracking-widest mb-2">會員登入</h2>
            <p class="text-sm font-bold text-brand-primary tracking-widest">選擇適合您的登入方式</p>
          </div>

          <div class="mb-6 grid grid-cols-2 gap-3 rounded-2xl bg-gray-50 p-1.5">
            <button
              v-for="tab in loginTabs"
              :key="tab.value"
              type="button"
              class="rounded-xl px-4 py-3 text-sm font-black transition-all"
              :class="activeTab === tab.value ? 'bg-white text-brand-primary shadow-sm' : 'text-gray-400 hover:text-gray-700'"
              @click="activeTab = tab.value"
            >
              {{ tab.label }}
            </button>
          </div>

          <form @submit.prevent="handleLogin" class="space-y-6">
            <div class="relative">
              <span class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
              </span>
              <input
                v-if="activeTab === 'email'"
                v-model="identifier"
                type="email"
                placeholder="電子信箱"
                class="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:ring-1 focus:ring-brand-primary outline-none transition-all"
              />
              <input
                v-else
                v-model="identifier"
                type="tel"
                placeholder="手機號碼"
                class="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:ring-1 focus:ring-brand-primary outline-none transition-all"
              />
            </div>
            <div class="relative">
              <span class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
              </span>
              <input v-model="password" type="password" placeholder="登入密碼" class="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:ring-1 focus:ring-brand-primary outline-none transition-all" />
            </div>
            <button type="submit" class="w-full py-4 bg-brand-primary text-white rounded-xl font-black tracking-[0.3em] shadow-lg shadow-brand-primary/20 hover:bg-brand-dark transition-all">登入會員</button>
          </form>

          <div class="mt-8 flex items-center justify-between text-xs font-bold">
            <router-link to="/register" class="text-gray-400 hover:text-brand-primary underline underline-offset-4">還不是會員？立即註冊</router-link>
            <router-link to="/contact" class="text-gray-400 hover:text-brand-primary">忘記密碼？</router-link>
          </div>

          <!-- 社交登入 -->
          <div class="mt-12 pt-8 border-t border-gray-50">
            <p class="text-[10px] font-black text-gray-300 text-center tracking-[0.4em] mb-6">第三方快速登入</p>
            <div class="grid grid-cols-2 gap-4">
              <button
                type="button"
                class="flex items-center justify-center rounded-2xl border border-[#1877F2]/20 bg-[#F5F8FF] px-4 py-4 transition-all hover:border-[#1877F2]/35 hover:bg-[#EEF4FF]"
                @click="startThirdPartyFlow('facebook')"
              >
                <span class="text-sm font-black tracking-[0.08em] text-[#1877F2]">Facebook</span>
              </button>
              <button
                type="button"
                class="flex items-center justify-center rounded-2xl border border-[#06C755]/20 bg-[#F2FFF7] px-4 py-4 transition-all hover:border-[#06C755]/35 hover:bg-[#EBFFF2]"
                @click="startThirdPartyFlow('line')"
              >
                <span class="text-sm font-black tracking-[0.12em] text-[#06C755]">LINE</span>
              </button>
              <button
                type="button"
                class="flex items-center justify-center rounded-2xl border border-[#DADCE0] bg-white px-4 py-4 transition-all hover:border-[#C4C7CC] hover:bg-[#FAFAFA]"
                @click="startThirdPartyFlow('google')"
              >
                <span class="text-sm font-black tracking-[0.04em] text-[#3C4043]">Google</span>
              </button>
              <button
                type="button"
                class="flex items-center justify-center rounded-2xl border border-[#F3C29D] bg-[#FFF8F2] px-4 py-4 transition-all hover:border-[#F0A971] hover:bg-[#FFF2E7]"
                @click="startThirdPartyFlow('openpoint')"
              >
                <span class="text-sm font-black tracking-[0.08em] text-[#E06422]">OPENPOINT</span>
              </button>
            </div>
          </div>
        </div>

        <!-- ▌右軌：訪客結帳專區 (高對比強調) -->
        <div class="flex-1 p-8 lg:p-16 bg-brand-surface/40 flex flex-col justify-center">
          <div class="mb-10">
            <h2 class="text-2xl font-black text-gray-800 tracking-widest mb-2">訪客快速結帳</h2>
            <p class="text-sm font-bold text-brand-primary tracking-widest">免註冊也能完成購買</p>
          </div>

          <div class="space-y-8">
            <p class="text-sm text-gray-500 leading-loose font-medium">
              不需要註冊會員也可完成購買。<br />
              只需提供收件資訊，我們將立即處理您的訂單。
            </p>

            <ul class="space-y-4">
              <li class="flex items-center gap-3 text-xs font-bold text-gray-400 italic">
                <span class="text-brand-primary">✓</span> 免設定密碼
              </li>
              <li class="flex items-center gap-3 text-xs font-bold text-gray-400 italic">
                <span class="text-brand-primary">✓</span> 極速下單流程
              </li>
              <li class="flex items-center gap-3 text-xs font-bold text-gray-400 italic">
                <span class="text-brand-primary">✓</span> 支援所有支付方式
              </li>
            </ul>

            <div class="pt-8">
              <button 
                @click="continueAsGuest"
                class="w-full py-5 bg-white border-2 border-brand-primary text-brand-primary rounded-xl font-black tracking-[0.4em] uppercase hover:bg-brand-primary hover:text-white transition-all shadow-xl shadow-brand-primary/5"
              >
                以訪客身份購買
              </button>
              <p class="text-[10px] text-gray-400 mt-4 text-center tracking-widest opacity-60">※ 訪客購買無法累積點數或使用折價券</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

type Provider = 'facebook' | 'line' | 'google' | 'openpoint'

export default Vue.extend({
  name: 'LoginView',
  data() {
    return {
      activeTab: 'email',
      identifier: '',
      password: '',
      loginTabs: [
        { value: 'email', label: '信箱' },
        { value: 'phone', label: '手機' },
      ],
    }
  },
  methods: {
    handleLogin() {
      this.$store.dispatch('auth/login', { email: this.identifier, password: this.password })
      const redirect = (this.$route.query.redirect as string) || '/'
      this.$router.push(redirect)
    },
    startThirdPartyFlow(provider: Provider) {
      this.$router.push((this.$route.query.redirect as string) || '/')
    },
    continueAsGuest() {
      // 導向結帳頁並帶入訪客模式 flag
      this.$router.push({ path: '/checkout', query: { mode: 'guest' } })
    }
  }
})
</script>
