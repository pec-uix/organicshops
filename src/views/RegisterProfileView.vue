<template>
  <div class="min-h-screen bg-brand-bg flex items-center justify-center px-4 py-12">
    <div class="w-full max-w-lg">

      <!-- ══ 頂部進度 ══ -->
      <div class="text-center mb-8">
        <span class="inline-flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl bg-white shadow-sm">
          <img src="/logo.gif" alt="統一生機" class="h-full w-full object-contain" />
        </span>
        <h1 class="text-lg font-bold text-brand-dark mt-3 mb-1">補充個人資料</h1>
        <p class="text-sm text-gray-500">幫助我們提供更適合您的有機好物推薦（可跳過）</p>

        <!-- 步驟指示 -->
        <div class="flex items-center justify-center gap-2 mt-5">
          <div class="flex items-center gap-1.5">
            <div class="w-6 h-6 rounded-full bg-brand-primary flex items-center justify-center">
              <svg class="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <span class="text-xs text-brand-primary font-medium">建立帳號</span>
          </div>
          <div class="h-px w-8 bg-brand-primary" />
          <div class="flex items-center gap-1.5">
            <div class="w-6 h-6 rounded-full bg-brand-primary text-white flex items-center justify-center text-xs font-bold">2</div>
            <span class="text-xs text-brand-primary font-medium">補充資料</span>
          </div>
          <div class="h-px w-8 bg-gray-200" />
          <div class="flex items-center gap-1.5">
            <div class="w-6 h-6 rounded-full border-2 border-gray-200 text-gray-300 flex items-center justify-center text-xs font-bold">3</div>
            <span class="text-xs text-gray-400">完成</span>
          </div>
        </div>
      </div>

      <!-- ══ 主卡片 ══ -->
      <div class="bg-white rounded-2xl shadow-sm p-7 space-y-5">

        <!-- 基本資料 -->
        <section>
          <h2 class="text-sm font-bold text-gray-700 mb-4 flex items-center gap-2">
            <span class="w-5 h-5 bg-brand-surface rounded-full flex items-center justify-center text-brand-primary text-xs">👤</span>
            基本資料
          </h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">

            <!-- 暱稱 -->
            <div class="sm:col-span-2">
              <label class="form-label">暱稱 / 顯示名稱</label>
              <input
                v-model="form.displayName"
                type="text"
                class="form-input"
                :placeholder="defaultName"
              />
              <p class="text-xs text-gray-400 mt-1">留空則使用註冊姓名「{{ defaultName }}」</p>
            </div>

            <!-- 生日 -->
            <div>
              <label class="form-label">生日</label>
              <input
                v-model="form.birthday"
                type="date"
                class="form-input"
                :max="today"
              />
            </div>

            <!-- 性別 -->
            <div>
              <label class="form-label">性別</label>
              <div class="flex gap-2 mt-1">
                <label
                  v-for="g in genders"
                  :key="g.value"
                  class="flex-1 flex items-center justify-center gap-1.5 border rounded-xl py-2.5 text-sm cursor-pointer transition-all"
                  :class="form.gender === g.value
                    ? 'border-brand-primary bg-brand-surface text-brand-primary font-semibold'
                    : 'border-gray-200 text-gray-600 hover:border-gray-300'"
                >
                  <input v-model="form.gender" type="radio" :value="g.value" class="sr-only" />
                  <span>{{ g.icon }}</span>
                  <span>{{ g.label }}</span>
                </label>
              </div>
            </div>

            <!-- 居住縣市 -->
            <div class="sm:col-span-2">
              <label class="form-label">居住縣市</label>
              <select v-model="form.city" class="form-input">
                <option value="">請選擇（選填）</option>
                <option v-for="city in taiwanCities" :key="city" :value="city">{{ city }}</option>
              </select>
            </div>

          </div>
        </section>

        <div class="border-t border-gray-100" />

        <!-- 偏好商品分類 -->
        <section>
          <h2 class="text-sm font-bold text-gray-700 mb-1 flex items-center gap-2">
            <span class="w-5 h-5 bg-brand-surface rounded-full flex items-center justify-center text-brand-primary text-xs">🥦</span>
            偏好商品分類
          </h2>
          <p class="text-xs text-gray-400 mb-3 ml-7">選擇您感興趣的類別，我們將優先推薦相關商品</p>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="cat in categories"
              :key="cat.id"
              class="flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-sm transition-all"
              :class="form.preferredCategories.includes(cat.id)
                ? 'bg-brand-primary border-brand-primary text-white'
                : 'border-gray-200 text-gray-600 hover:border-brand-primary hover:text-brand-primary'"
              @click="toggleCategory(cat.id)"
            >
              <img v-if="isImageUrl(cat.icon)" :src="cat.icon" :alt="cat.name" class="h-5 w-5 rounded-full object-cover" />
              <span v-else>{{ cat.icon }}</span>
              <span>{{ cat.name }}</span>
            </button>
          </div>
        </section>

        <div class="border-t border-gray-100" />

        <!-- 行銷通知偏好 -->
        <section>
          <h2 class="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
            <span class="w-5 h-5 bg-brand-surface rounded-full flex items-center justify-center text-brand-primary text-xs">🔔</span>
            通知偏好
          </h2>
          <div class="space-y-2.5">
            <label
              v-for="pref in notificationPrefs"
              :key="pref.key"
              class="flex items-center gap-3 cursor-pointer select-none"
            >
              <input
                v-model="form.notifications"
                type="checkbox"
                :value="pref.key"
                class="w-4 h-4 accent-brand-primary cursor-pointer"
              />
              <div>
                <p class="text-sm text-gray-700">{{ pref.label }}</p>
                <p class="text-xs text-gray-400">{{ pref.desc }}</p>
              </div>
            </label>
          </div>
        </section>

        <!-- 操作按鈕 -->
        <div class="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            class="btn-outline py-3 flex-1 text-sm"
            @click="skip"
          >
            {{ redirectPath ? '跳過，返回結帳' : '跳過，直接進入首頁' }}
          </button>
          <button
            class="btn-primary py-3 flex-1 text-sm font-bold flex items-center justify-center gap-2 disabled:opacity-60"
            :disabled="isLoading"
            @click="save"
          >
            <svg v-if="isLoading" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
            {{ isLoading ? '儲存中…' : '儲存並開始購物 🎉' }}
          </button>
        </div>

      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'RegisterProfileView',

  data() {
    return {
      isLoading: false,

      form: {
        displayName:          '',
        birthday:             '',
        gender:               '' as string,
        city:                 '',
        preferredCategories:  [] as string[],
        notifications:        ['order', 'promo'] as string[],
      },

      genders: [
        { value: 'male',   icon: '👨', label: '男性' },
        { value: 'female', icon: '👩', label: '女性' },
        { value: 'other',  icon: '🙂', label: '不公開' },
      ],

      categories: [
        { id: 'fruits',    icon: '🍎', name: '蔬果' },
        { id: 'dairy',     icon: '🥛', name: '乳製品' },
        { id: 'meat',      icon: '🥩', name: '肉品海鮮' },
        { id: 'grain',     icon: '🌾', name: '五穀雜糧' },
        { id: 'snacks',    icon: '🍫', name: '有機零食' },
        { id: 'beverage',  icon: '🍵', name: '飲品茶葉' },
        { id: 'sauce',     icon: '🫙', name: '調味醬料' },
        { id: 'health',    icon: '💊', name: '保健食品' },
      ],

      notificationPrefs: [
        { key: 'order',  label: '訂單狀態通知', desc: '訂單確認、出貨、到貨提醒' },
        { key: 'promo',  label: '優惠活動通知', desc: '限時折扣、會員專屬優惠' },
        { key: 'restock',label: '補貨到貨通知', desc: '追蹤商品有貨時通知我' },
        { key: 'weekly', label: '每週好物精選', desc: '每週一封精選有機好物電子報' },
      ],

      taiwanCities: [
        '台北市', '新北市', '基隆市', '桃園市', '新竹市', '新竹縣',
        '苗栗縣', '台中市', '彰化縣', '南投縣', '雲林縣', '嘉義市',
        '嘉義縣', '台南市', '高雄市', '屏東縣', '宜蘭縣', '花蓮縣',
        '台東縣', '澎湖縣', '金門縣', '連江縣',
      ],
    }
  },

  computed: {
    defaultName(): string {
      return (this.$route.query.name as string) || '新會員'
    },

    today(): string {
      return new Date().toISOString().split('T')[0]
    },

    redirectPath(): string {
      return this.safeRedirect(this.$route.query.redirect)
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

    toggleCategory(id: string) {
      const idx = this.form.preferredCategories.indexOf(id)
      if (idx >= 0) {
        this.form.preferredCategories.splice(idx, 1)
      } else {
        this.form.preferredCategories.push(id)
      }
    },

    skip() {
      this.$router.push(this.redirectPath || '/')
    },

    async save() {
      this.isLoading = true
      // 模擬儲存資料
      await new Promise(resolve => setTimeout(resolve, 700))
      this.isLoading = false
      this.$router.push({ name: 'register-success' })
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
</style>
