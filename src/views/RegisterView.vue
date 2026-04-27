<template>
  <div class="min-h-screen bg-brand-bg flex items-center justify-center px-4 py-12">
    <div class="w-full max-w-md">

      <!-- ══ Logo ══ -->
      <div class="text-center mb-8">
        <router-link to="/" class="inline-flex items-center gap-2 group">
          <span class="text-3xl select-none">🌿</span>
          <span class="text-xl font-bold text-brand-dark group-hover:text-brand-primary transition-colors">統一生機</span>
        </router-link>
        <p class="text-sm text-gray-500 mt-2">建立您的有機生活帳號</p>
      </div>

      <!-- ══ 主卡片 ══ -->
      <div class="bg-white rounded-2xl shadow-sm overflow-hidden">

        <!-- ── Tab 切換 ── -->
        <div class="flex border-b border-gray-100">
          <button
            v-for="tab in tabs"
            :key="tab.value"
            class="flex-1 py-4 text-sm font-semibold transition-colors relative"
            :class="activeTab === tab.value
              ? 'text-brand-primary'
              : 'text-gray-400 hover:text-gray-600'"
            @click="switchTab(tab.value)"
          >
            {{ tab.label }}
            <span
              class="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-primary transition-opacity"
              :class="activeTab === tab.value ? 'opacity-100' : 'opacity-0'"
            />
          </button>
        </div>

        <!-- ── 表單 ── -->
        <div class="p-7 space-y-4">

          <!-- 姓名 -->
          <div>
            <label class="form-label">姓名 <span class="text-red-400">*</span></label>
            <div class="relative">
              <span class="input-icon">
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </span>
              <input
                v-model="form.name"
                type="text"
                class="form-input pl-9"
                :class="{ 'border-red-400 ring-red-100': errors.name }"
                placeholder="王小明"
                autocomplete="name"
                @keyup.enter="submit"
              />
            </div>
            <p v-if="errors.name" class="form-error">{{ errors.name }}</p>
          </div>

          <!-- 信箱 / 手機號碼 -->
          <div>
            <label class="form-label">
              {{ activeTab === 'email' ? 'Email' : '手機號碼' }}
              <span class="text-red-400">*</span>
            </label>
            <div class="relative">
              <span class="input-icon">
                <svg v-if="activeTab === 'email'" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <svg v-else class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </span>
              <input
                v-if="activeTab === 'email'"
                v-model="form.email"
                type="email"
                class="form-input pl-9"
                :class="{ 'border-red-400 ring-red-100': errors.identifier }"
                placeholder="example@email.com"
                autocomplete="email"
                @keyup.enter="submit"
              />
              <input
                v-else
                v-model="form.phone"
                type="tel"
                class="form-input pl-9"
                :class="{ 'border-red-400 ring-red-100': errors.identifier }"
                placeholder="09xxxxxxxx"
                maxlength="10"
                autocomplete="tel"
                @keyup.enter="submit"
              />
            </div>
            <p v-if="errors.identifier" class="form-error">{{ errors.identifier }}</p>
          </div>

          <!-- 密碼 -->
          <div>
            <label class="form-label">密碼 <span class="text-red-400">*</span></label>
            <div class="relative">
              <span class="input-icon">
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </span>
              <input
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                class="form-input pl-9 pr-10"
                :class="{ 'border-red-400 ring-red-100': errors.password }"
                placeholder="至少 8 個字元"
                autocomplete="new-password"
                @keyup.enter="submit"
              />
              <button
                type="button"
                class="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                @click="showPassword = !showPassword"
              >
                <svg v-if="!showPassword" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <svg v-else class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>
              </button>
            </div>

            <!-- 密碼強度條 -->
            <div v-if="form.password" class="mt-2 space-y-1">
              <div class="flex gap-1">
                <div
                  v-for="i in 3"
                  :key="i"
                  class="h-1.5 flex-1 rounded-full transition-all duration-300"
                  :class="strengthBarClass(i)"
                />
              </div>
              <p class="text-xs font-medium" :class="strengthTextClass">{{ strengthLabel }}</p>
            </div>

            <p v-if="errors.password" class="form-error">{{ errors.password }}</p>
          </div>

          <!-- 確認密碼 -->
          <div>
            <label class="form-label">確認密碼 <span class="text-red-400">*</span></label>
            <div class="relative">
              <span class="input-icon">
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </span>
              <input
                v-model="form.confirmPassword"
                :type="showConfirm ? 'text' : 'password'"
                class="form-input pl-9 pr-10"
                :class="{ 'border-red-400 ring-red-100': errors.confirmPassword }"
                placeholder="再次輸入密碼"
                autocomplete="new-password"
                @keyup.enter="submit"
              />
              <!-- 密碼一致 icon -->
              <span
                v-if="form.confirmPassword"
                class="absolute inset-y-0 right-3 flex items-center pointer-events-none"
              >
                <svg v-if="passwordsMatch" class="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
                </svg>
                <svg v-else class="w-4 h-4 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </span>
            </div>
            <p v-if="errors.confirmPassword" class="form-error">{{ errors.confirmPassword }}</p>
          </div>

          <!-- 行銷電子報（選填） -->
          <label class="flex items-center gap-2.5 cursor-pointer select-none">
            <input
              v-model="form.subscribeNewsletter"
              type="checkbox"
              class="w-4 h-4 accent-brand-primary cursor-pointer"
            />
            <span class="text-sm text-gray-600">訂閱電子報，掌握最新有機優惠資訊</span>
          </label>

          <!-- 同意條款 -->
          <div class="bg-gray-50 rounded-xl p-4">
            <div class="max-h-24 overflow-y-auto text-xs text-gray-400 leading-relaxed mb-3 pr-1">
              <p class="font-semibold text-gray-600 mb-1">服務條款摘要</p>
              本服務由統一生機股份有限公司提供。會員應妥善保管帳號與密碼，不得將帳號轉讓或提供他人使用。本公司依個人資料保護法保護您的個人資料，僅用於訂單處理、會員服務與行銷通知（需另行同意）。若發現帳號遭到盜用，請立即聯繫客服。完整服務條款與隱私權政策請見官方網站，本公司保留修訂條款之權利，修訂後將於官網公告。
            </div>
            <label class="flex items-start gap-2.5 cursor-pointer select-none">
              <input
                v-model="form.agreeToTerms"
                type="checkbox"
                class="mt-0.5 w-4 h-4 accent-brand-primary cursor-pointer flex-shrink-0"
              />
              <span class="text-sm text-gray-700">
                我已詳閱並同意
                <router-link to="/privacy" class="text-brand-primary hover:underline">服務條款</router-link>
                及
                <router-link to="/privacy" class="text-brand-primary hover:underline">隱私權政策</router-link>
                <span class="text-red-400 ml-0.5">*</span>
              </span>
            </label>
            <p v-if="errors.agreeToTerms" class="form-error mt-1 ml-[26px]">{{ errors.agreeToTerms }}</p>
          </div>

          <!-- 送出按鈕 -->
          <button
            class="btn-primary w-full py-3 text-base font-bold flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
            :disabled="isLoading"
            @click="submit"
          >
            <svg v-if="isLoading" class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
            {{ isLoading ? '建立帳號中…' : '建立帳號' }}
          </button>

          <!-- 登入連結 -->
          <p class="text-center text-sm text-gray-500">
            已有帳號？
            <router-link to="/login" class="text-brand-primary font-semibold hover:underline">
              立即登入
            </router-link>
          </p>

        </div>
      </div>

      <!-- 返回首頁 -->
      <p class="text-center mt-5">
        <router-link to="/" class="text-xs text-gray-400 hover:text-gray-600 transition-colors inline-flex items-center gap-1">
          <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
          返回首頁
        </router-link>
      </p>

    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

type RegisterTab = 'email' | 'phone'

export default Vue.extend({
  name: 'RegisterView',

  data() {
    return {
      activeTab:    'email' as RegisterTab,
      showPassword: false,
      showConfirm:  false,
      isLoading:    false,

      form: {
        name:                '',
        email:               '',
        phone:               '',
        password:            '',
        confirmPassword:     '',
        agreeToTerms:        false,
        subscribeNewsletter: false,
      },

      errors: {} as Record<string, string>,

      tabs: [
        { value: 'email', label: '信箱註冊' },
        { value: 'phone', label: '手機號碼註冊' },
      ],
    }
  },

  computed: {
    // ── 密碼強度（0 無、1 弱、2 中、3 強）──
    passwordStrength(): number {
      const p = this.form.password
      if (!p) return 0
      let score = 0
      if (p.length >= 8)                            score++
      if (/[a-z]/.test(p) && /[A-Z]/.test(p))      score++
      if (/\d/.test(p))                             score++
      if (/[^a-zA-Z0-9]/.test(p))                  score++
      // 對應 3 格
      if (score <= 1) return 1
      if (score <= 3) return 2
      return 3
    },

    strengthLabel(): string {
      return ['', '強度：弱', '強度：中', '強度：強'][this.passwordStrength]
    },

    strengthTextClass(): string {
      return ['', 'text-red-400', 'text-amber-500', 'text-green-600'][this.passwordStrength]
    },

    passwordsMatch(): boolean {
      return !!this.form.password && this.form.password === this.form.confirmPassword
    },
  },

  methods: {
    switchTab(tab: RegisterTab) {
      this.activeTab = tab
      this.errors    = {}
    },

    strengthBarClass(bar: number): string {
      const s = this.passwordStrength
      if (bar > s) return 'bg-gray-100'
      if (s === 1) return 'bg-red-400'
      if (s === 2) return 'bg-amber-400'
      return 'bg-green-500'
    },

    validate(): boolean {
      const e: Record<string, string> = {}

      if (!this.form.name.trim())
        e.name = '請輸入姓名'

      if (this.activeTab === 'email') {
        if (!this.form.email.trim())
          e.identifier = '請輸入 Email'
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.form.email))
          e.identifier = '請輸入正確的 Email 格式'
      } else {
        if (!this.form.phone.trim())
          e.identifier = '請輸入手機號碼'
        else if (!/^09\d{8}$/.test(this.form.phone))
          e.identifier = '請輸入正確手機號碼（09xxxxxxxx）'
      }

      if (!this.form.password)
        e.password = '請輸入密碼'
      else if (this.form.password.length < 8)
        e.password = '密碼至少需要 8 個字元'
      else if (this.passwordStrength < 2)
        e.password = '密碼強度太弱，請加入數字或大寫字母'

      if (!this.form.confirmPassword)
        e.confirmPassword = '請再次輸入密碼'
      else if (!this.passwordsMatch)
        e.confirmPassword = '兩次輸入的密碼不一致'

      if (!this.form.agreeToTerms)
        e.agreeToTerms = '請同意服務條款才能繼續'

      this.errors = e
      return Object.keys(e).length === 0
    },

    async submit() {
      if (!this.validate()) return
      this.isLoading = true

      await new Promise(resolve => setTimeout(resolve, 900))

      // 模擬建立帳號 → 自動登入
      const identifier = this.activeTab === 'email' ? this.form.email : this.form.phone
      await this.$store.dispatch('auth/login', {
        email:    identifier,
        password: this.form.password,
      })

      this.isLoading = false

      // 導到補充資料中介頁，並帶入名字
      this.$router.push({
        name:  'register-profile',
        query: { name: this.form.name },
      })
    },
  },
})
</script>

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
