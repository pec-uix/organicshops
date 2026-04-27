<template>
  <div class="min-h-screen bg-brand-bg pb-24">
    <!-- ══ 頁首 ══ -->
    <div class="bg-white border-b border-gray-100 sticky top-0 z-10">
      <div class="max-w-7xl mx-auto px-4 py-6 text-center">
        <h1 class="text-2xl lg:text-3xl font-black text-gray-800">聯絡客服</h1>
        <p class="text-sm text-gray-400 mt-1">我們隨時準備好為您服務</p>
      </div>
    </div>

    <div class="max-w-5xl mx-auto px-4 mt-12">
      <div class="flex flex-col lg:flex-row gap-12 items-start">
        
        <!-- 左側：聯繫資訊 -->
        <div class="w-full lg:w-80 space-y-6">
          <div class="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-50">
            <h2 class="font-bold text-gray-800 mb-6 flex items-center gap-2">
              <span class="w-1 h-5 bg-brand-primary rounded-full"></span>
              服務專線
            </h2>
            <div class="space-y-4">
              <div class="flex items-start gap-3">
                <span class="text-xl">📞</span>
                <div>
                  <p class="text-sm font-bold text-gray-700">(02) 2659-0808</p>
                  <p class="text-[10px] text-gray-400">週一至週五 09:00 - 18:00</p>
                </div>
              </div>
              <div class="flex items-start gap-3">
                <span class="text-xl">✉️</span>
                <div>
                  <p class="text-sm font-bold text-gray-700">service@organiclife.com.tw</p>
                  <p class="text-[10px] text-gray-400">我們將於 24 小時內回覆</p>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-brand-primary p-8 rounded-[2rem] text-white shadow-lg shadow-brand-primary/20">
            <h3 class="font-bold mb-2">常見問題</h3>
            <p class="text-xs opacity-80 leading-relaxed mb-6">在聯絡我們之前，您可以先看看常見問題，或許能快速找到答案。</p>
            <router-link to="/faq" class="inline-flex items-center gap-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-xl text-xs font-bold transition-all border border-white/20">
              前往 FAQ
              <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </router-link>
          </div>
        </div>

        <!-- 右側：表單 -->
        <div class="flex-1 bg-white rounded-[2.5rem] shadow-sm p-8 lg:p-12 border border-gray-50">
          <div v-if="submitSuccess" class="mb-6 rounded-2xl border border-brand-primary/15 bg-brand-surface px-5 py-4">
            <p class="text-sm font-bold text-brand-primary">{{ submitSuccess }}</p>
            <div class="mt-3 flex flex-wrap gap-3 text-xs font-semibold">
              <router-link to="/faq" class="text-brand-primary hover:text-brand-dark transition-colors">先看常見問題</router-link>
              <router-link to="/account/orders" class="text-brand-primary hover:text-brand-dark transition-colors">查看會員訂單</router-link>
            </div>
          </div>
          <form @submit.prevent="handleSubmit" class="space-y-6">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label class="form-label">您的姓名 <span class="text-red-400">*</span></label>
                <input v-model="form.name" type="text" class="form-input" placeholder="請輸入姓名" />
                <p v-if="errors.name" class="text-[10px] text-red-500 mt-1">請填寫姓名</p>
              </div>
              <div>
                <label class="form-label">電子信箱 <span class="text-red-400">*</span></label>
                <input v-model="form.email" type="email" class="form-input" placeholder="example@mail.com" />
                <p v-if="errors.email" class="text-[10px] text-red-500 mt-1">請填寫正確的 Email 格式</p>
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label class="form-label">問題類型 <span class="text-red-400">*</span></label>
                <select v-model="form.type" class="form-input appearance-none">
                  <option value="order">訂單與付款相關</option>
                  <option value="delivery">物流配送進度</option>
                  <option value="return">退換貨申請</option>
                  <option value="member">會員帳號與點數</option>
                  <option value="other">其他諮詢</option>
                </select>
              </div>
              <div>
                <label class="form-label">訂單編號</label>
                <input v-model="form.orderId" type="text" class="form-input" placeholder="OGxxxxxxxx" />
              </div>
            </div>

            <div>
              <label class="form-label">諮詢內容 <span class="text-red-400">*</span></label>
              <textarea v-model="form.content" rows="5" class="form-input" placeholder="請詳細說明您的問題，我們將盡快為您解答..."></textarea>
              <p v-if="errors.content" class="text-[10px] text-red-500 mt-1">請輸入諮詢內容</p>
            </div>

            <div class="pt-4">
              <button 
                type="submit" 
                :disabled="isSubmitting"
                class="w-full bg-brand-primary text-white py-4 rounded-2xl font-bold text-lg shadow-xl shadow-brand-primary/20 hover:bg-brand-dark transition-all active:scale-[0.98] flex items-center justify-center gap-3"
              >
                <span v-if="isSubmitting" class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                {{ isSubmitting ? '送出中...' : '送出訊息' }}
              </button>
            </div>
          </form>
        </div>

      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'ContactView',
  data() {
    return {
      form: {
        name: '',
        email: '',
        type: 'order',
        orderId: '',
        content: ''
      },
      errors: {
        name: false,
        email: false,
        content: false
      },
      isSubmitting: false,
      submitSuccess: ''
    }
  },
  created() {
    const queryType = this.$route.query.type as string | undefined
    const queryOrderId = this.$route.query.orderId as string | undefined
    if (queryType && ['order', 'delivery', 'return', 'member', 'other'].includes(queryType)) {
      this.form.type = queryType
    }
    if (queryOrderId) {
      this.form.orderId = queryOrderId
    }
    if (queryType === 'member') {
      this.form.content = '您好，我想諮詢定期訂閱或會員相關服務。'
    }
  },
  methods: {
    validate(): boolean {
      this.errors.name = !this.form.name.trim()
      this.errors.content = !this.form.content.trim()
      this.errors.email = !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.form.email)
      
      return !this.errors.name && !this.errors.email && !this.errors.content
    },

    async handleSubmit() {
      if (!this.validate()) return

      this.isSubmitting = true
      this.submitSuccess = ''
      
      // 模擬 API 請求
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      this.submitSuccess = '您的訊息已成功送出，客服人員將於 1-2 個工作天內透過 Email 與您聯繫。'
      
      // 重設表單
      this.form = { name: '', email: '', type: 'order', orderId: '', content: '' }
      this.isSubmitting = false
    }
  }
})
</script>

<style scoped>
.form-label {
  @apply block text-sm font-bold text-gray-700 mb-2;
}
.form-input {
  @apply w-full bg-gray-50/50 border border-gray-100 rounded-2xl px-5 py-4 text-sm 
         focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary
         transition-all hover:bg-white;
}
</style>
