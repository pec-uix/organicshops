<template>
  <div class="min-h-screen bg-brand-bg pb-24">
    <section class="relative overflow-hidden bg-[#F0F4F1]">
      <img
        :src="contactBannerImage"
        alt="聯絡客服"
        class="absolute inset-0 h-full w-full object-cover opacity-90"
      />
      <div class="absolute inset-0 bg-gradient-to-r from-white/15 to-transparent"></div>
      <div class="relative z-10 mx-auto max-w-7xl px-4 py-14 lg:px-8 lg:py-20">
        <h1 class="text-3xl font-black leading-tight tracking-[0.16em] text-brand-dark lg:text-5xl">聯絡客服</h1>
        <p class="mt-5 max-w-2xl text-sm font-bold leading-[1.6] text-[#374151] lg:text-base">
          我們隨時準備好為您服務
        </p>
      </div>
    </section>

    <main class="mx-auto mt-12 max-w-6xl px-4">
      <div class="rounded-[2.5rem] border border-gray-50 bg-white p-8 shadow-sm lg:p-12">
          <div v-if="submitSuccess" class="mb-6 rounded-2xl border border-brand-primary/15 bg-brand-surface px-5 py-4">
            <p class="text-sm font-bold text-brand-primary">{{ submitSuccess }}</p>
            <div class="mt-3 flex flex-wrap gap-3 text-xs font-semibold">
              <router-link to="/faq" class="text-brand-primary transition-colors hover:text-brand-dark">先看常見問題</router-link>
              <router-link to="/account/orders" class="text-brand-primary transition-colors hover:text-brand-dark">查看會員訂單</router-link>
            </div>
          </div>

          <div class="mb-8">
            <h2 class="border-l-4 border-brand-primary pl-3 text-xl font-black text-gray-800">聯絡客服</h2>
            <p class="mt-3 max-w-3xl text-sm leading-7 text-gray-500">
              請留下正確聯絡資料與問題內容，方便客服依實際需求進行查詢與回覆。
            </p>
          </div>

          <form @submit.prevent="handleSubmit" class="space-y-6">
            <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label class="form-label">聯絡人 <span class="text-red-400">*</span></label>
                <input v-model="form.name" type="text" class="form-input" placeholder="請輸入姓名" />
                <p v-if="errors.name" class="mt-1 text-[10px] text-red-500">請填寫姓名</p>
              </div>
              <div>
                <label class="form-label">手機 <span class="text-red-400">*</span></label>
                <input v-model="form.phone" type="tel" class="form-input" placeholder="請輸入手機號碼" />
                <p v-if="errors.phone" class="mt-1 text-[10px] text-red-500">請填寫手機號碼</p>
              </div>
            </div>

            <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label class="form-label">電子信箱 <span class="text-red-400">*</span></label>
                <input v-model="form.email" type="email" class="form-input" placeholder="example@mail.com" />
                <p v-if="errors.email" class="mt-1 text-[10px] text-red-500">請填寫正確的 Email 格式</p>
              </div>
              <div>
                <label class="form-label">問題類型</label>
                <select v-model="form.type" class="form-input appearance-none">
                  <option value="" disabled>請選擇問題類型</option>
                  <option value="member">會員相關問題</option>
                  <option value="return">商品退換貨問題</option>
                  <option value="store">門市建議及回饋</option>
                  <option value="partner">廠商合作提案</option>
                  <option value="other">其他</option>
                </select>
              </div>
            </div>

            <div>
              <label class="form-label">問題與指教 <span class="text-red-400">*</span></label>
              <textarea
                v-model="form.content"
                rows="5"
                class="form-input"
                placeholder="請詳細說明您的問題與需求"
              ></textarea>
              <p v-if="errors.content" class="mt-1 text-[10px] text-red-500">請輸入問題內容</p>
            </div>

            <div class="rounded-2xl bg-gray-50 px-5 py-4">
              <label class="flex items-center gap-3 text-sm font-bold text-gray-700">
                <input
                  v-model="form.acceptPolicy"
                  type="checkbox"
                  class="h-4 w-4 rounded border-gray-300 text-brand-primary focus:ring-brand-primary/20"
                />
                <span>我已詳閱</span>
                <router-link to="/privacy" class="text-brand-primary hover:text-brand-dark hover:underline">個資條款</router-link>
              </label>
              <p v-if="errors.acceptPolicy" class="mt-1 text-[10px] text-red-500">請勾選個資條款</p>
            </div>

            <div class="rounded-2xl bg-gray-50 px-5 py-4 text-sm leading-7 text-gray-500">
              本公司業務負責之客服為聯繫、查詢所需，將於客訴事件或反應事項中蒐集客訴者的姓名、電話及E-MAIL等相關個人資料，本公司將於處理該客訴事件或反應事項必要範圍內提供予處理人員或廠商進行查證與聯繫用，並限於台灣地區使用。因處理該客訴事件或反應事項所蒐集之個資，將於該客訴事件處理完成半年後銷毀，台端得隨時來電主張個人資料保護法第三條規定之權利，以維護個資安全。台端有權拒絕提供個人資料，但請恕客服無法有效提供服務。
            </div>

            <div class="pt-2">
              <button
                type="submit"
                :disabled="isSubmitting"
                class="flex w-full items-center justify-center gap-3 rounded-2xl bg-brand-primary py-4 text-lg font-bold text-white shadow-xl shadow-brand-primary/20 transition-all hover:bg-brand-dark active:scale-[0.98]"
              >
                <span v-if="isSubmitting" class="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white"></span>
                {{ isSubmitting ? '送出中...' : '送出訊息' }}
              </button>
            </div>
          </form>
        </div>

      <div class="mt-8 grid gap-6 lg:grid-cols-2">
        <div class="rounded-[2rem] border border-gray-100 bg-white p-6 shadow-sm">
          <p class="text-xs font-black tracking-[0.2em] text-gray-400">客服專線</p>
          <p class="mt-2 text-lg font-black text-gray-800">0800-777-000</p>
          <p class="mt-2 text-xs leading-6 text-gray-500">週一至週五 08:00 - 18:00<br />國定例假日 08:30 - 17:30<br />週六及週日休假</p>
        </div>

        <div class="rounded-[2rem] border border-gray-100 bg-white p-6 shadow-sm">
          <div class="grid gap-6 lg:grid-cols-[minmax(0,1fr)_220px] lg:items-start">
            <div>
              <p class="text-xs font-black tracking-[0.2em] text-gray-400">LINE 客服</p>
              <p class="mt-2 text-lg font-black text-brand-dark">@upoc</p>
              <p class="mt-2 text-sm text-gray-600">官方帳號：統一生機</p>
            </div>

            <div class="flex flex-col items-center lg:items-end">
              <div class="flex items-center justify-center rounded-2xl bg-gray-50 p-4">
                <img :src="lineQrSrc" alt="LINE 客服 QR Code" class="h-36 w-36" />
              </div>
              <p class="mt-3 text-center text-xs text-gray-500 lg:text-right">掃描 QR code 加入官方 LINE</p>
            </div>
          </div>
        </div>
      </div>

      <div class="mt-8 rounded-[2rem] border border-brand-primary/20 bg-brand-surface p-8 shadow-sm">
        <h3 class="mb-2 font-bold text-brand-dark">常見問題</h3>
        <p class="mb-6 text-sm leading-relaxed text-gray-600">聯絡前可以先查看常見問題，常見的訂購、付款與配送資訊都已整理好。</p>
        <router-link
          to="/faq"
          class="inline-flex items-center gap-2 rounded-xl border border-brand-primary/20 bg-white px-4 py-2 text-xs font-bold text-brand-primary transition-colors hover:bg-brand-primary hover:text-white"
        >
          前往 FAQ
          <svg class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </router-link>
      </div>
    </main>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'ContactView',
  data() {
    return {
      contactBannerImage: require('../../images/背景圖.png'),
      form: {
        name: '',
        phone: '',
        email: '',
        type: '',
        content: '',
        acceptPolicy: false
      },
      errors: {
        name: false,
        phone: false,
        email: false,
        content: false,
        acceptPolicy: false
      },
      isSubmitting: false,
      submitSuccess: ''
    }
  },
  created() {
    const queryType = this.$route.query.type as string | undefined
    const allowedTypes = ['member', 'return', 'store', 'partner', 'other']
    if (queryType && allowedTypes.includes(queryType)) {
      this.form.type = queryType
    }
  },
  methods: {
    validate(): boolean {
      this.errors.name = !this.form.name.trim()
      this.errors.phone = !this.form.phone.trim()
      this.errors.email = !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.form.email)
      this.errors.content = !this.form.content.trim()
      this.errors.acceptPolicy = !this.form.acceptPolicy

      return !this.errors.name && !this.errors.phone && !this.errors.email && !this.errors.content && !this.errors.acceptPolicy
    },

    async handleSubmit() {
      if (!this.validate()) return

      this.isSubmitting = true
      this.submitSuccess = ''

      await new Promise(resolve => setTimeout(resolve, 1500))

      this.submitSuccess = '您的訊息已成功送出，客服人員將於 1-2 個工作天內透過 Email 與您聯繫。'

      this.form = {
        name: '',
        phone: '',
        email: '',
        type: '',
        content: '',
        acceptPolicy: false
      }
      this.isSubmitting = false
    }
  },
  computed: {
    lineQrSrc(): string {
      return `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent('https://line.me/R/ti/p/%40upoc')}`
    }
  }
})
</script>

<style scoped>
.form-label {
  @apply mb-2 block text-sm font-bold text-gray-700;
}
.form-input {
  @apply w-full rounded-2xl border border-gray-100 bg-gray-50/50 px-5 py-4 text-sm transition-all hover:bg-white focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20;
}
</style>
