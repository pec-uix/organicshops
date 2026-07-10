<template>
  <div
    class="-mt-[120px] min-h-screen w-full bg-[linear-gradient(90deg,rgba(255,255,255,0.38),rgba(255,255,255,0.18)),url('@/assets/images/登入背景_1.png')] bg-cover bg-center bg-no-repeat px-4 pb-12 pt-[140px] md:pb-14 md:pt-[152px] lg:pb-20 lg:pt-[172px]"
  >
    <div class="mx-auto w-full max-w-lg">
      <!-- ── 會員登入卡片 ── -->
      <div class="mx-auto mt-4 w-full overflow-hidden rounded-2xl border border-white/60 bg-white/80 p-6 shadow-xl backdrop-blur-md sm:p-8 md:mt-0 md:p-8 lg:p-10">
          <h2 class="mb-8 block w-full text-center text-2xl font-bold tracking-wider text-[#2D3129]">會員登入</h2>

          <div class="mb-6 grid grid-cols-2 gap-3 rounded-2xl bg-gray-50 p-1.5 md:bg-white/55 md:shadow-inner">
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
                class="w-full rounded-xl border border-gray-100 bg-white py-4 pl-12 pr-4 text-sm outline-none transition-all focus:border-brand-primary focus:ring-1 focus:ring-brand-primary md:border-white/70 md:bg-white/80 md:shadow-sm"
              />
              <input
                v-else
                v-model="identifier"
                type="tel"
                placeholder="手機號碼"
                class="w-full rounded-xl border border-gray-100 bg-white py-4 pl-12 pr-4 text-sm outline-none transition-all focus:border-brand-primary focus:ring-1 focus:ring-brand-primary md:border-white/70 md:bg-white/80 md:shadow-sm"
              />
            </div>
            <div class="relative">
              <span class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
              </span>
              <input v-model="password" type="password" placeholder="登入密碼" class="w-full rounded-xl border border-gray-100 bg-white py-4 pl-12 pr-4 text-sm outline-none transition-all focus:border-brand-primary focus:ring-1 focus:ring-brand-primary md:border-white/70 md:bg-white/80 md:shadow-sm" />
            </div>
            <button type="submit" class="w-full rounded-xl bg-[#76B82A] py-3 text-center text-sm font-medium text-white shadow-md transition hover:bg-[#659e22]">登入會員</button>
          </form>

          <div class="mt-8 flex items-center justify-between">
            <router-link :to="{ path: '/register-agreement', query: registerRedirectQuery }" class="text-sm font-medium text-gray-500 underline underline-offset-4 transition-colors hover:text-[#76B82A]">還不是會員？立即註冊</router-link>
            <router-link to="/contact" class="text-sm font-medium text-gray-500 transition-colors hover:text-[#76B82A]">忘記密碼？</router-link>
          </div>

          <!-- 社交登入 -->
          <div class="mt-6">
            <div class="flex w-full items-center justify-center px-6 text-xs text-gray-400">
              <span class="h-[1px] flex-grow bg-gray-200/60"></span>
              <span class="px-4 font-medium tracking-[0.18em]">第三方快速登入</span>
              <span class="h-[1px] flex-grow bg-gray-200/60"></span>
            </div>
            <div class="mt-3 flex justify-center gap-4">
              <!-- Facebook -->
              <button type="button" class="flex h-12 w-12 items-center justify-center rounded-full border border-gray-100 bg-white shadow-sm transition-colors hover:bg-gray-50" @click="startThirdPartyFlow('facebook')">
                <svg class="h-5 w-5" viewBox="0 0 24 24" fill="#1877F2" xmlns="http://www.w3.org/2000/svg">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </button>
              <!-- LINE -->
              <button type="button" class="flex h-12 w-12 items-center justify-center rounded-full border border-gray-100 bg-white shadow-sm transition-colors hover:bg-gray-50" @click="startThirdPartyFlow('line')">
                <svg class="h-5 w-5" viewBox="0 0 24 24" fill="#06C755" xmlns="http://www.w3.org/2000/svg">
                  <path d="M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314zm-14.962 2.359c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63.349 0 .631.285.631.63v4.565zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.281.629-.629.629zm9.28-.629c0 .27-.174.51-.432.596a.64.64 0 01-.199.031c-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595a.65.65 0 01.194-.033c.195 0 .375.105.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.565zm2.97.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63h2.386c.349 0 .63.285.63.63 0 .349-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629z"/>
                </svg>
              </button>
              <!-- Google -->
              <button type="button" class="flex h-12 w-12 items-center justify-center rounded-full border border-gray-100 bg-white shadow-sm transition-colors hover:bg-gray-50" @click="startThirdPartyFlow('google')">
                <svg class="h-5 w-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
              </button>
              <!-- OPENPOINT -->
              <button type="button" class="flex h-12 w-12 items-center justify-center rounded-full border border-gray-100 bg-white shadow-sm transition-colors hover:bg-gray-50" @click="startThirdPartyFlow('openpoint')">
                <img src="@/assets/images/openpoint-star-icon.png" alt="OPENPOINT" class="h-5 w-5 rounded-full object-cover" />
              </button>
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
  computed: {
    registerRedirectQuery(): Record<string, string> {
      const redirect = this.safeRedirect(this.$route.query.redirect)
      return redirect ? { redirect } : {}
    },
  },
  methods: {
    safeRedirect(value: unknown): string {
      const redirect = Array.isArray(value) ? value[0] : value
      if (typeof redirect !== 'string') return ''
      if (!redirect.startsWith('/') || redirect.startsWith('//')) return ''
      if (redirect === '/login' || redirect.startsWith('/login?')) return ''
      if (redirect === '/register' || redirect.startsWith('/register?')) return ''
      return redirect
    },
    handleLogin() {
      this.$store.dispatch('auth/login', { email: this.identifier, password: this.password })
      const redirect = this.safeRedirect(this.$route.query.redirect) || '/'
      this.$router.push(redirect)
    },
    startThirdPartyFlow(provider: Provider) {
      this.$store.dispatch('auth/login', { email: `${provider}@example.com`, password: 'third-party' })
      this.$router.push(this.safeRedirect(this.$route.query.redirect) || '/')
    },
  }
})
</script>
