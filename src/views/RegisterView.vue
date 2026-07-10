<template>
  <div class="-mt-[120px] min-h-screen w-full bg-[linear-gradient(90deg,rgba(255,255,255,0.38),rgba(255,255,255,0.18)),url('@/assets/images/登入背景_1.png')] bg-cover bg-center bg-no-repeat px-4 pb-12 pt-[140px] md:pb-14 md:pt-[152px] lg:pb-20 lg:pt-[172px]">
    <div class="mx-auto w-full max-w-2xl md:max-w-3xl">
      <div class="mx-auto mt-4 w-full overflow-hidden rounded-2xl border border-white/60 bg-white/80 p-6 shadow-xl backdrop-blur-md transition-all sm:p-8 md:mt-0 md:p-8 lg:p-10">
      <h1 class="mb-6 block w-full text-center text-2xl font-bold tracking-wider text-gray-800">會員註冊</h1>

      <div>
        <span class="mb-4 block text-center text-xs text-gray-500">使用社群帳號登入，快速又方便</span>
        <div class="mb-4 flex justify-center gap-4">
          <button type="button" class="flex h-12 w-12 items-center justify-center rounded-full border border-gray-100 bg-white shadow-sm transition-colors hover:bg-gray-50" @click="startThirdPartyFlow('facebook')">
            <svg class="h-5 w-5" viewBox="0 0 24 24" fill="#1877F2" xmlns="http://www.w3.org/2000/svg">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
          </button>
          <button type="button" class="flex h-12 w-12 items-center justify-center rounded-full border border-gray-100 bg-white shadow-sm transition-colors hover:bg-gray-50" @click="startThirdPartyFlow('line')">
            <svg class="h-5 w-5" viewBox="0 0 24 24" fill="#06C755" xmlns="http://www.w3.org/2000/svg">
              <path d="M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314zm-14.962 2.359c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63.349 0 .631.285.631.63v4.565zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.281.629-.629.629zm9.28-.629c0 .27-.174.51-.432.596a.64.64 0 01-.199.031c-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595a.65.65 0 01.194-.033c.195 0 .375.105.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.565zm2.97.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63h2.386c.349 0 .63.285.63.63 0 .349-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629z"/>
            </svg>
          </button>
          <button type="button" class="flex h-12 w-12 items-center justify-center rounded-full border border-gray-100 bg-white shadow-sm transition-colors hover:bg-gray-50" @click="startThirdPartyFlow('google')">
            <svg class="h-5 w-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
          </button>
          <button type="button" class="flex h-12 w-12 items-center justify-center rounded-full border border-gray-100 bg-white shadow-sm transition-colors hover:bg-gray-50" @click="startThirdPartyFlow('openpoint')">
            <img src="@/assets/images/openpoint-star-icon.png" alt="OPENPOINT" class="h-5 w-5 rounded-full object-cover" />
          </button>
        </div>
        <div class="my-4 w-full border-b border-gray-200/50"></div>
      </div>

      <div class="space-y-6">
        <div>
          <span class="mb-1 block border-l-4 border-[#76B82A] pl-3 text-left text-base font-bold text-gray-800">會員資料輸入</span>

          <label class="mb-2 flex items-center gap-1 text-sm font-semibold text-gray-700">身份</label>
          <div class="mb-2 flex flex-wrap gap-2">
            <button
              v-for="option in identityOptions"
              :key="option"
              type="button"
              class="rounded-xl px-4 py-2 text-sm transition"
              :class="form.identity === option ? 'bg-[#76B82A] text-white shadow-sm font-medium' : 'border border-gray-200 bg-white text-gray-500'"
              @click="form.identity = option"
            >
              {{ option }}
            </button>
          </div>
          <span class="mt-1 block text-left text-xs text-gray-400">請選擇您要註冊的身份</span>
        </div>

        <div>
          <label class="form-label">姓名</label>
          <input
            v-model="form.name"
            type="text"
            class="w-full bg-white/90 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#76B82A] transition"
            :class="{ 'border-red-400 ring-red-100': errors.name }"
            placeholder="王小明"
            autocomplete="name"
            @keyup.enter="submit"
          />
          <div class="mt-2 mb-4 flex items-center gap-4">
            <div class="flex shrink-0 gap-2">
              <button
                v-for="option in titleOptions"
                :key="option"
                type="button"
                class="rounded-lg px-3 py-1.5 text-xs transition"
                :class="form.title === option ? 'bg-[#76B82A] text-white shadow-sm' : 'border border-gray-200 bg-white text-gray-500 hover:bg-gray-50'"
                @click="form.title = option"
              >
                {{ option }}
              </button>
            </div>
            <span class="text-xs leading-relaxed text-gray-400">請填寫真實姓名，方便後續訂單與會員服務確認。可依偏好選擇稱謂。</span>
          </div>
          <p v-if="errors.name" class="form-error">{{ errors.name }}</p>
        </div>

        <div>
          <label class="form-label">電子信箱</label>
          <input
            v-model="form.email"
            type="email"
            class="w-full bg-white/90 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#76B82A] transition"
            :class="{ 'border-red-400 ring-red-100': errors.identifier }"
            placeholder="example@email.com"
            autocomplete="email"
            @keyup.enter="submit"
          />
          <div class="mt-2 mb-4">
            <button type="button" class="mb-1.5 inline-block rounded-lg bg-[#76B82A] px-3 py-1.5 text-xs text-white shadow-sm transition hover:bg-[#659e22]">
              檢查重複
            </button>
            <span class="block text-left text-xs leading-relaxed text-gray-400">日後您的中獎訊息、密碼查詢、會員重要訊息通知...等，將透過此信箱與您聯繫，請正確填寫，以維護您的權益</span>
          </div>
          <p v-if="errors.identifier" class="form-error">{{ errors.identifier }}</p>
        </div>

        <div>
          <label class="mb-2 block text-left text-sm font-semibold text-gray-700">行動電話</label>
          <input
            v-model="form.phone"
            type="tel"
            placeholder="請輸入行動電話"
            maxlength="10"
            autocomplete="tel"
            class="w-full bg-white/90 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#76B82A] transition"
            :class="{ 'border-red-400 ring-red-100': errors.phone }"
            @keyup.enter="submit"
          />
          <p v-if="errors.phone" class="form-error">{{ errors.phone }}</p>
        </div>

        <div class="grid gap-4 md:grid-cols-2">
          <div>
            <label class="form-label">密碼</label>
            <div class="relative">
              <input
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                class="form-input pr-10"
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
            <span class="block mt-1 text-xs text-gray-400">建議使用英文大小寫與數字，提升帳號安全性。</span>
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

          <div>
            <label class="form-label">確認密碼</label>
            <div class="relative">
              <input
                v-model="form.confirmPassword"
                :type="showConfirm ? 'text' : 'password'"
                class="form-input pr-10"
                :class="{ 'border-red-400 ring-red-100': errors.confirmPassword }"
                placeholder="再次輸入密碼"
                autocomplete="new-password"
                @keyup.enter="submit"
              />
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
            <span class="block mt-1 text-xs text-gray-400">請再次輸入密碼，確認兩次內容一致。</span>
            <p v-if="errors.confirmPassword" class="form-error">{{ errors.confirmPassword }}</p>
          </div>
        </div>

        <div>
          <div>
            <label class="form-label">生日</label>
            <input
              v-model="form.birthday"
              type="date"
              class="w-full bg-white/90 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#76B82A] transition"
            />
            <span class="mt-1 block text-left text-xs text-gray-400">請正確輸入，資料送出後將無法自行修改</span>
          </div>
        </div>

        <div>
          <label class="form-label">地址</label>
          <div class="grid gap-4 md:grid-cols-2">
            <select v-model="form.city" class="form-input">
              <option value="">請選擇縣市</option>
              <option v-for="city in cityOptions" :key="city" :value="city">{{ city }}</option>
            </select>
            <select v-model="form.district" class="form-input">
              <option value="">請選擇區域</option>
              <option v-for="district in districtOptions" :key="district" :value="district">{{ district }}</option>
            </select>
          </div>
          <input
            v-model="form.address"
            type="text"
            class="form-input mt-3"
            placeholder="詳細地址"
            autocomplete="street-address"
          />
        </div>

          <label class="flex items-center gap-2.5 cursor-pointer select-none">
            <input
              v-model="form.subscribeNewsletter"
              type="checkbox"
            class="h-4 w-4 cursor-pointer accent-[#76B82A]"
            />
            <span class="text-sm text-gray-600">訂閱電子報，掌握最新有機優惠資訊</span>
          </label>

        <div>
          <label class="flex cursor-pointer select-none items-start gap-2.5">
              <input
                v-model="form.agreeToTerms"
                type="checkbox"
              class="mt-0.5 h-4 w-4 flex-shrink-0 cursor-pointer accent-[#76B82A]"
              />
              <span class="text-sm text-gray-700">
                我已詳閱並同意
                <router-link to="/member-terms" class="text-brand-primary hover:underline">服務條款</router-link>
                及
                <router-link to="/privacy" class="text-brand-primary hover:underline">隱私權政策</router-link>
              </span>
            </label>
            <p v-if="errors.agreeToTerms" class="form-error mt-1 ml-[26px]">{{ errors.agreeToTerms }}</p>
        </div>

          <button
          class="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#76B82A] py-3.5 text-base font-semibold tracking-wide text-white shadow-md transition hover:bg-[#659e22] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
            :disabled="isLoading"
            @click="submit"
          >
            <svg v-if="isLoading" class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
            {{ isLoading ? '建立帳號中…' : '確認註冊並送出' }}
          </button>

          <p class="text-center text-sm text-gray-500">
            已有帳號？
            <router-link :to="{ path: '/login', query: redirectQuery }" class="text-brand-primary font-semibold hover:underline">
              立即登入
            </router-link>
          </p>
      </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

type RegisterTab = 'email' | 'phone'
type Provider = 'facebook' | 'line' | 'google' | 'openpoint'

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
        title:               '先生',
        identity:            '一般民眾',
        email:               '',
        phone:               '',
        password:            '',
        confirmPassword:     '',
        birthday:            '',
        promoPreference:     'yes',
        city:                '',
        district:            '',
        address:             '',
        agreeToTerms:        false,
        subscribeNewsletter: false,
      },

      errors: {} as Record<string, string>,

      tabs: [
        { value: 'email', label: '信箱註冊' },
        { value: 'phone', label: '手機號碼註冊' },
      ],
      identityOptions: ['一般民眾', '統一生機員工', '統一關係企業員工'],
      titleOptions: ['先生', '小姐'],
      promoOptions: [
        { value: 'yes', label: '參加' },
        { value: 'no', label: '不參加' },
      ],
      cityOptions: ['台北市', '新北市', '桃園市', '台中市', '台南市', '高雄市'],
      districtMap: {
        台北市: ['中正區', '大安區', '信義區', '松山區'],
        新北市: ['板橋區', '新店區', '中和區', '永和區'],
        桃園市: ['桃園區', '中壢區', '平鎮區', '八德區'],
        台中市: ['西屯區', '北屯區', '南屯區', '西區'],
        台南市: ['中西區', '東區', '安平區', '永康區'],
        高雄市: ['苓雅區', '左營區', '鼓山區', '三民區'],
      } as Record<string, string[]>,
    }
  },

  computed: {
    redirectQuery(): Record<string, string> {
      const redirect = this.safeRedirect(this.$route.query.redirect)
      return redirect ? { redirect } : {}
    },

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

    districtOptions(): string[] {
      return this.districtMap[this.form.city] || []
    },
  },

  watch: {
    'form.city'() {
      this.form.district = ''
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

      if (!this.form.phone.trim())
        e.phone = '請輸入行動電話'
      else if (!/^09\d{8}$/.test(this.form.phone))
        e.phone = '請輸入正確手機號碼（09xxxxxxxx）'

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
      const redirect = this.safeRedirect(this.$route.query.redirect)
      this.$router.push({
        name:  'register-profile',
        query: redirect ? { name: this.form.name, redirect } : { name: this.form.name },
      })
    },

    startThirdPartyFlow(provider: Provider) {
      this.$store.dispatch('auth/login', { email: `${provider}@example.com`, password: 'third-party' })
      const redirect = this.safeRedirect(this.$route.query.redirect)
      this.$router.push(redirect || '/')
    },
  },
})
</script>

<style scoped>
.form-label {
  @apply block text-sm font-medium text-gray-700 mb-1;
}
.form-input {
  @apply w-full bg-white/90 border border-gray-200 rounded-xl px-4 py-3 text-sm
         focus:outline-none focus:border-[#76B82A] transition;
}
.form-error {
  @apply text-xs text-red-500 mt-1 flex items-center gap-1;
}
.form-error::before {
  content: '';
}
</style>
