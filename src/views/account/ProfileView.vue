<template>
  <div class="min-h-screen bg-brand-bg pb-16">
    <!-- ══ 主內容：側邊選單 + 內容 ══ -->
    <div class="max-w-7xl mx-auto px-4 pt-6 flex gap-6 items-start">

      <AccountSidebar active-key="profile" :avatar-url="form.avatar" subtitle="會員" />

      <!-- ── 右側：表單內容 ── -->
      <div class="flex-1 min-w-0 space-y-6">
        <AccountContentHeader
          title="修改會員資料"
          subtitle="更新個人資料、登入資訊與社群綁定。"
          eyebrow="修改會員資料"
        />
        
        <!-- 1. 基本資料卡片 -->
        <section class="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div class="px-6 py-4 border-b border-gray-50 flex items-center gap-2">
            <span class="text-lg">👤</span>
            <h2 class="font-bold text-gray-800">基本資料</h2>
          </div>
          
          <div class="p-6 space-y-6">
            <!-- 大頭照 -->
            <div class="flex flex-col items-center sm:flex-row sm:items-center gap-5 pb-4 border-b border-gray-50">
              <div class="relative group">
                <div class="w-20 h-20 rounded-2xl bg-brand-surface flex items-center justify-center text-3xl overflow-hidden border-2 border-brand-surface group-hover:border-brand-primary/30 transition-colors">
                  <img v-if="form.avatar" :src="form.avatar" class="w-full h-full object-cover" />
                  <span v-else>{{ nameInitial }}</span>
                </div>
                <label class="absolute -bottom-1 -right-1 w-7 h-7 bg-white rounded-full shadow-md flex items-center justify-center cursor-pointer hover:text-brand-primary transition-colors border border-gray-100">
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <input type="file" class="hidden" accept="image/*" @change="handleAvatarChange" />
                </label>
              </div>
              <div class="text-center sm:text-left">
                <p class="text-sm font-bold text-gray-700">大頭照</p>
                <p class="text-xs text-gray-400 mt-1">建議尺寸 200x200 px，支援 JPG / PNG。</p>
              </div>
            </div>

            <!-- 欄位網格 -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label class="form-label">姓名</label>
                <input v-model="form.name" type="text" class="form-input" placeholder="請輸入姓名" />
              </div>
              <div>
                <label class="form-label">生日</label>
                <input v-model="form.birthday" type="date" class="form-input" />
              </div>
              <div>
                <label class="form-label">性別</label>
                <div class="flex gap-4 pt-2">
                  <label v-for="opt in genderOptions" :key="opt.value" class="flex items-center gap-2 cursor-pointer group">
                    <input v-model="form.gender" type="radio" :value="opt.value" class="w-4 h-4 accent-brand-primary" />
                    <span class="text-sm text-gray-600 group-hover:text-brand-primary transition-colors">{{ opt.label }}</span>
                  </label>
                </div>
              </div>
              <div>
                <label class="form-label">手機號碼</label>
                <input v-model="form.phone" type="tel" class="form-input bg-gray-50/50" disabled />
                <p class="text-[10px] text-gray-400 mt-1">手機號碼為帳號唯一識別，如需更換請聯繫客服。</p>
              </div>
              <div class="sm:col-span-2">
                <label class="form-label">電子信箱</label>
                <input v-model="form.email" type="email" class="form-input" placeholder="example@mail.com" />
              </div>
            </div>
          </div>
        </section>

        <!-- 2. 修改密碼卡片 -->
        <section class="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div class="px-6 py-4 border-b border-gray-50 flex items-center gap-2">
            <span class="text-lg">🔒</span>
            <h2 class="font-bold text-gray-800">修改密碼</h2>
          </div>
          <div class="p-6 space-y-5">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div class="sm:col-span-2">
                <label class="form-label">目前密碼</label>
                <input v-model="passwordForm.current" type="password" class="form-input" placeholder="請輸入目前的密碼" />
              </div>
              <div>
                <label class="form-label">新密碼</label>
                <input v-model="passwordForm.new" type="password" class="form-input" placeholder="至少 8 位字元" />
              </div>
              <div>
                <label class="form-label">確認新密碼</label>
                <input v-model="passwordForm.confirm" type="password" class="form-input" placeholder="請再次輸入新密碼" />
              </div>
            </div>
          </div>
        </section>

        <!-- 3. 社群帳號綁定 -->
        <section class="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div class="px-6 py-4 border-b border-gray-50 flex items-center gap-2">
            <span class="text-lg">🔗</span>
            <h2 class="font-bold text-gray-800">社群帳號綁定</h2>
          </div>
          <div class="p-6">
            <div class="space-y-4">
              <div v-for="social in socialBindings" :key="social.type" class="flex items-center justify-between p-4 rounded-xl border border-gray-50 hover:border-brand-primary/20 transition-all group">
                <div class="flex items-center gap-4">
                  <div class="w-10 h-10 rounded-full flex items-center justify-center text-xl grayscale group-hover:grayscale-0 transition-all bg-gray-50">
                    {{ social.icon }}
                  </div>
                  <div>
                    <p class="text-sm font-bold text-gray-800">{{ social.name }}</p>
                    <p class="text-xs text-gray-400">{{ social.bound ? '已綁定：' + social.account : '尚未綁定' }}</p>
                  </div>
                </div>
                <button 
                  class="text-xs font-bold px-4 py-1.5 rounded-full transition-all"
                  :class="social.bound ? 'text-gray-400 bg-gray-100 hover:bg-gray-200' : 'text-brand-primary border border-brand-primary hover:bg-brand-surface'"
                >
                  {{ social.bound ? '解除綁定' : '立即綁定' }}
                </button>
              </div>
            </div>
          </div>
        </section>

        <!-- 儲存按鈕 -->
        <div class="pt-4">
          <button @click="saveChanges" class="w-full btn-primary py-4 text-base shadow-lg shadow-brand-primary/20">
            儲存變更
          </button>
          <p v-if="saveNotice" class="mt-3 text-center text-sm font-medium text-brand-primary">
            {{ saveNotice }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import AccountSidebar from '@/components/account/AccountSidebar.vue'
import AccountContentHeader from '@/components/account/AccountContentHeader.vue'

export default Vue.extend({
  name: 'ProfileView',
  components: { AccountSidebar, AccountContentHeader },
  created() {
    document.title = '修改會員資料'
  },

  data() {
    return {
      form: {
        avatar:   '',
        name:     '王小明',
        birthday: '1990-01-01',
        gender:   'male',
        email:    'ming@example.com',
        phone:    '0912-345-678',
      },

      passwordForm: {
        current: '',
        new:     '',
        confirm: '',
      },

      genderOptions: [
        { label: '男性', value: 'male' },
        { label: '女性', value: 'female' },
        { label: '其他', value: 'other' },
        { label: '不便透露', value: 'none' },
      ],

      socialBindings: [
        { type: 'fb',     name: 'Facebook', icon: '🔵', bound: true,  account: 'Ming Wang' },
        { type: 'line',   name: 'LINE',     icon: '🟢', bound: true,  account: '小明' },
        { type: 'google', name: 'Google',   icon: '🔴', bound: false, account: '' },
      ],

      saveNotice: '',
    }
  },

  computed: {
    userName(): string {
      return this.$store.getters['auth/currentUser']?.name ?? this.form.name
    },

    nameInitial(): string {
      return this.userName.charAt(0)
    },
  },

  methods: {
    handleAvatarChange(e: Event) {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (event) => {
          this.form.avatar = event.target?.result as string
        }
        reader.readAsDataURL(file)
      }
    },

    saveChanges() {
      this.saveNotice = '會員資料已更新'
      window.setTimeout(() => { this.saveNotice = '' }, 2500)
    },

  },
})
</script>

<style scoped>
.form-label {
  @apply block text-sm font-bold text-gray-700 mb-1.5;
}
.form-input {
  @apply w-full border border-gray-200 rounded-xl px-4 py-3 text-sm
         focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary
         transition-all bg-gray-50/50 hover:bg-white;
}
.btn-primary {
  @apply bg-brand-primary text-white rounded-xl hover:bg-brand-dark transition-colors shadow-sm active:scale-[0.98] font-bold;
}
</style>
