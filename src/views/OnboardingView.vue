<template>
  <div class="min-h-screen bg-brand-bg flex items-center justify-center px-4 py-12">
    <div class="w-full max-w-md">

      <!-- ══ 歡迎卡片 ══ -->
      <div class="bg-white rounded-2xl shadow-sm overflow-hidden mb-4">

        <!-- 品牌色頂條 -->
        <div class="h-1.5" :style="{ background: providerColor }" />

        <div class="p-7">

          <!-- 歡迎訊息 -->
          <div class="flex items-center gap-4 mb-6">
            <!-- Avatar 圈 -->
            <div
              class="w-14 h-14 rounded-full flex items-center justify-center text-white text-2xl flex-shrink-0 shadow"
              :style="{ background: providerColor }"
            >
              {{ providerIcon }}
            </div>
            <div>
              <p class="text-xs text-gray-400 font-medium mb-0.5">
                已透過 {{ providerLabel }} 登入
              </p>
              <h1 class="text-lg font-bold text-brand-dark leading-snug">
                歡迎，{{ displayName }}！
              </h1>
              <p class="text-sm text-gray-500">只需幾秒鐘，完成帳號設定</p>
            </div>
          </div>

          <!-- 進度點 -->
          <div class="flex items-center gap-2 mb-7">
            <div class="flex-1 h-1.5 rounded-full bg-brand-primary" />
            <div
              class="flex-1 h-1.5 rounded-full transition-colors duration-500"
              :class="phoneOrEmailFilled ? 'bg-brand-primary' : 'bg-gray-100'"
            />
            <div class="flex-1 h-1.5 rounded-full bg-gray-100" />
          </div>

          <!-- ── 欄位區塊 ── -->
          <div class="space-y-5">

            <!-- Email（第三方未提供時顯示） -->
            <div v-if="needEmail">
              <label class="form-label">
                Email
                <span class="text-gray-400 font-normal text-xs ml-1">（{{ providerLabel }} 未提供，請手動填寫）</span>
              </label>
              <div class="relative">
                <span class="input-icon">
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </span>
                <input
                  v-model="form.email"
                  type="email"
                  class="form-input pl-9"
                  :class="{ 'border-red-400 ring-red-100': errors.email }"
                  placeholder="example@email.com"
                  autocomplete="email"
                />
              </div>
              <p v-if="errors.email" class="form-error">{{ errors.email }}</p>
              <!-- 若已有 email 顯示帶入提示 -->
              <p v-else-if="prefillEmail" class="text-xs text-brand-primary mt-1 flex items-center gap-1">
                <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
                </svg>
                已從 {{ providerLabel }} 帶入
              </p>
            </div>

            <!-- Email 唯讀（第三方有提供） -->
            <div v-else>
              <label class="form-label">Email</label>
              <div class="flex items-center gap-2 border border-gray-100 bg-gray-50 rounded-xl px-3 py-2.5">
                <svg class="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span class="text-sm text-gray-700 flex-1">{{ form.email || '—' }}</span>
                <span class="text-xs text-brand-primary font-medium flex items-center gap-1">
                  <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
                  </svg>
                  已驗證
                </span>
              </div>
            </div>

            <!-- 手機號碼（選填） -->
            <div>
              <div class="flex items-center justify-between mb-1">
                <label class="form-label mb-0">手機號碼</label>
                <span class="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">選填</span>
              </div>
              <div class="relative">
                <span class="input-icon">
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </span>
                <input
                  v-model="form.phone"
                  type="tel"
                  class="form-input pl-9"
                  :class="{ 'border-red-400 ring-red-100': errors.phone }"
                  placeholder="09xxxxxxxx（可用於手機號碼登入）"
                  maxlength="10"
                />
              </div>
              <p v-if="errors.phone" class="form-error">{{ errors.phone }}</p>
              <p v-else class="text-xs text-gray-400 mt-1">
                填寫後可使用手機號碼登入，並接收訂單 SMS 通知
              </p>
            </div>

          </div>

          <!-- ── 操作按鈕 ── -->
          <div class="flex flex-col gap-3 mt-7">
            <button
              class="btn-primary w-full py-3 font-bold flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
              :disabled="isLoading"
              @click="complete"
            >
              <svg v-if="isLoading" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              {{ isLoading ? '儲存中…' : '完成設定，開始選購 🎉' }}
            </button>

            <button
              class="w-full py-2.5 text-sm text-gray-400 hover:text-gray-600 transition-colors"
              @click="skip"
            >
              略過，直接進入首頁
            </button>
          </div>

        </div>
      </div>

      <!-- 隱私說明 -->
      <p class="text-center text-xs text-gray-400 leading-relaxed px-2">
        您的資料依
        <router-link to="/privacy" class="text-brand-primary hover:underline">隱私權政策</router-link>
        保護，不會提供給第三方使用。
      </p>

    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

type Provider = 'facebook' | 'line' | 'google' | 'openpoint'
const THIRD_PARTY_SETUP_KEY = 'organicshops.thirdPartySetupProviders'

const PROVIDER_META: Record<Provider, { label: string; color: string; icon: string }> = {
  facebook:  { label: 'Facebook',  color: '#1877F2', icon: '📘' },
  line:      { label: 'LINE',      color: '#06C755', icon: '💚' },
  google:    { label: 'Google',    color: '#4285F4', icon: '🔵' },
  openpoint: { label: 'OPENPOINT', color: '#F55B00', icon: '🔶' },
}

export default Vue.extend({
  name: 'OnboardingView',

  data() {
    return {
      isLoading: false,
      form: {
        email: '',
        phone: '',
      },
      errors: {} as Record<string, string>,
    }
  },

  computed: {
    // ── route query 取值 ──
    provider(): Provider {
      return (this.$route.query.provider as Provider) || 'google'
    },

    /** 第三方帶入的顯示名稱 */
    displayName(): string {
      return (this.$route.query.name as string) || '新會員'
    },

    /** 第三方帶入的 email（可能為空，如 LINE 不一定提供） */
    prefillEmail(): string {
      return (this.$route.query.email as string) || ''
    },

    /** 需要手動填 email（第三方未提供） */
    needEmail(): boolean {
      return !this.prefillEmail
    },

    providerLabel(): string {
      return PROVIDER_META[this.provider]?.label ?? this.provider
    },

    providerColor(): string {
      return PROVIDER_META[this.provider]?.color ?? '#888'
    },

    providerIcon(): string {
      return PROVIDER_META[this.provider]?.icon ?? '🔗'
    },

    /** 判斷進度條第 2 格是否填入 */
    phoneOrEmailFilled(): boolean {
      return !!this.form.phone || (this.needEmail && !!this.form.email) || !!this.prefillEmail
    },
  },

  created() {
    // 把第三方帶入的 email 預填進表單
    if (this.prefillEmail) {
      this.form.email = this.prefillEmail
    }
  },

  methods: {
    markProviderSetupComplete() {
      if (typeof window === 'undefined') return
      try {
        const raw = window.localStorage.getItem(THIRD_PARTY_SETUP_KEY)
        const current = raw ? JSON.parse(raw) : []
        const providers = Array.isArray(current) ? current : []
        if (!providers.includes(this.provider)) {
          providers.push(this.provider)
          window.localStorage.setItem(THIRD_PARTY_SETUP_KEY, JSON.stringify(providers))
        }
      } catch {
        window.localStorage.setItem(THIRD_PARTY_SETUP_KEY, JSON.stringify([this.provider]))
      }
    },

    validate(): boolean {
      const e: Record<string, string> = {}

      // Email 驗證（只在需要手動填寫時）
      if (this.needEmail && this.form.email) {
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.form.email)) {
          e.email = '請輸入正確的 Email 格式'
        }
      }

      // 手機驗證（有填才驗）
      if (this.form.phone && !/^09\d{8}$/.test(this.form.phone)) {
        e.phone = '請輸入正確手機號碼（09xxxxxxxx）'
      }

      this.errors = e
      return Object.keys(e).length === 0
    },

    async complete() {
      if (!this.validate()) return
      this.isLoading = true

      // 模擬儲存補充資料
      await new Promise(resolve => setTimeout(resolve, 700))

      this.markProviderSetupComplete()
      this.isLoading = false
      this.$router.push('/')
    },

    skip() {
      this.markProviderSetupComplete()
      this.$router.push('/')
    },
  },
})
</script>

<!--
  路由呼叫範例（第三方登入後跳轉）：

  this.$router.push({
    name: 'onboarding',
    query: {
      provider: 'google',          // 'facebook' | 'line' | 'google' | 'openpoint'
      name:     'John Doe',        // 第三方帳號顯示名稱
      email:    'john@gmail.com',  // 若第三方有提供 email 則帶入；若無則留空，頁面會顯示輸入欄
    },
  })
-->

<style scoped>
.form-label {
  @apply block text-sm font-medium text-gray-700 mb-1;
}
.form-input {
  @apply w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm
         focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-brand-primary
         transition-shadow bg-white;
}
.form-error {
  @apply text-xs text-red-500 mt-1 flex items-center gap-1;
}
.form-error::before {
  content: '⚠';
}
.input-icon {
  @apply absolute inset-y-0 left-3 flex items-center text-gray-400 pointer-events-none;
}
</style>
