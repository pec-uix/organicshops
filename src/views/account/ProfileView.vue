<template>
  <div class="min-h-screen bg-gray-50 pb-16">
    <!-- ══ 主內容：側邊選單 + 內容 ══ -->
    <div class="max-w-7xl mx-auto px-4 pt-6 flex flex-col gap-4 lg:flex-row lg:gap-6 lg:items-start">

      <AccountSidebar active-key="profile" subtitle="會員" />

      <!-- ── 右側：表單內容 ── -->
      <div class="flex-1 min-w-0 space-y-6">
        <AccountContentHeader
          title="修改會員資料"
          subtitle="管理基本資料、登入安全與社群帳號。"
          notice="日後您的中獎訊息、密碼查詢、會員重要訊息通知...等，將透過您的聯絡方式與您聯繫，請正確填寫，以維護您的權利。"
        />

        <!-- 1. 基本資料卡片 -->
        <section class="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
          <div class="p-6 space-y-6">
            <!-- 欄位網格 -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label class="form-label">帳號</label>
                <input v-model="form.memberNo" type="text" class="form-input bg-gray-50/50" disabled />
                <p class="field-hint">登入與會員識別使用。</p>
              </div>
              <div>
                <label class="form-label">姓名</label>
                <input v-model="form.name" type="text" class="form-input" placeholder="請輸入姓名" />
                <p class="field-hint">請填寫真實姓名，方便訂單與客服核對。</p>
              </div>
              <div>
                <label class="form-label">生日</label>
                <input
                  v-model="form.birthday"
                  type="date"
                  class="form-input"
                  :class="{ 'bg-gray-50/50': isBirthdayLocked }"
                  :disabled="isBirthdayLocked"
                />
                <p class="field-hint">欲修改生日請與服務人員聯繫。</p>
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
                <label class="form-label">行動電話</label>
                <input v-model="form.phone" type="tel" class="form-input bg-gray-50/50" disabled />
                <p class="field-hint">*請務必填寫正確資料，以利出貨時連絡。</p>
              </div>
              <div>
                <label class="form-label">電子信箱</label>
                <input v-model="form.email" type="email" class="form-input" placeholder="example@mail.com" />
                <p class="field-hint">訂單通知與活動訊息會寄送至此信箱。</p>
              </div>
              <div class="sm:col-span-2">
                <label class="form-label">電子發票手機條碼</label>
                <div class="flex flex-col gap-3 sm:flex-row">
                  <input v-model="form.invoiceCarrier" type="text" class="form-input" placeholder="請輸入手機條碼或自然人憑證載具" />
                  <a
                    :href="invoiceCarrierBindUrl"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="inline-flex shrink-0 items-center justify-center rounded-xl border border-brand-primary px-5 py-3 text-sm font-bold text-brand-primary transition-colors hover:bg-brand-surface"
                  >
                    會員載具歸戶
                  </a>
                </div>
                <p class="field-hint">可填寫常用發票載具，結帳時方便帶入。</p>
              </div>
              <div>
                <label class="form-label">縣市</label>
                <div class="relative">
                  <select
                    v-model="form.city"
                    class="form-input appearance-none pr-10"
                    @change="onCityChange"
                  >
                    <option value="" disabled>請選擇縣市</option>
                    <option v-for="city in cityOptions" :key="city" :value="city">{{ city }}</option>
                  </select>
                  <svg class="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
              <div>
                <label class="form-label">區域</label>
                <div class="relative">
                  <select
                    v-model="form.district"
                    class="form-input appearance-none pr-10"
                    :disabled="!form.city"
                    :class="{ 'bg-gray-50/50': !form.city }"
                  >
                    <option value="" disabled>請選擇區域</option>
                    <option v-for="district in districtOptions" :key="district" :value="district">{{ district }}</option>
                  </select>
                  <svg class="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
              <div class="sm:col-span-2">
                <label class="form-label">詳細地址</label>
                <input v-model="form.addressDetail" type="text" class="form-input" placeholder="請輸入詳細地址" />
                <p class="field-hint">*請務必填寫正確資料，以利貨品能順利送達。</p>
              </div>
            </div>
          </div>
        </section>

        <!-- 3. 修改密碼卡片 -->
        <section class="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
          <div class="px-6 py-4 border-b border-gray-50">
            <h2 class="font-bold text-gray-800">修改密碼</h2>
          </div>
          <div class="p-6 space-y-5">
            <div class="space-y-1 rounded-2xl border border-amber-100 bg-amber-50 px-4 py-3 text-xs font-medium leading-6 text-amber-700">
              <p>定期更新密碼可提升帳戶安全</p>
              <p>*要修改密碼時才需填入</p>
              <p>*密碼至少8碼，包含大小寫、數字、特殊符號。</p>
            </div>
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
                <label class="form-label">請再次輸入新密碼</label>
                <input v-model="passwordForm.confirm" type="password" class="form-input" placeholder="請再次輸入新密碼" />
              </div>
            </div>
          </div>
        </section>

        <!-- 4. 社群帳號綁定 -->
        <section class="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
          <div class="px-6 py-4 border-b border-gray-50">
            <h2 class="font-bold text-gray-800">社群帳號綁定</h2>
          </div>
          <div class="p-6">
            <div class="space-y-4">
              <div
                v-for="social in socialBindings"
                :key="social.type"
                class="flex flex-col gap-4 rounded-2xl border p-4 transition-all sm:flex-row sm:items-center sm:justify-between"
                :class="social.bound ? 'border-[#DCE8CB] bg-[#FBFDF8]' : 'border-gray-100 bg-white hover:border-gray-200'"
              >
                <div>
                  <div class="flex items-center gap-2">
                    <p class="text-sm font-bold text-gray-800">{{ social.name }}</p>
                    <span
                      class="rounded-full px-2.5 py-1 text-[11px] font-bold"
                      :class="social.bound ? 'bg-[#EAF4DD] text-[#6E9C35]' : 'bg-gray-100 text-gray-400'"
                    >
                      {{ social.bound ? '已綁定' : '未綁定' }}
                    </span>
                  </div>
                  <p class="mt-1 text-xs text-gray-400">
                    {{ social.bound ? social.account : '尚未連結此社群帳號' }}
                  </p>
                  <p v-if="social.type === 'uniopen'" class="mt-2 text-xs leading-6 text-gray-400">
                    如尚未有 uniopen 會員帳號請先至 uniopen 官方網站（www.uniopen.com）完成註冊，然後再回到此處綁定。
                  </p>
                </div>
                <button
                  type="button"
                  class="self-start rounded-full px-4 py-2 text-xs font-bold transition-all sm:self-auto"
                  :class="social.bound ? 'bg-white text-gray-500 border border-gray-200 hover:border-brand-primary hover:text-brand-primary' : 'bg-brand-primary text-white shadow-sm hover:bg-brand-dark'"
                  @click="toggleSocialBinding(social.type)"
                >
                  {{ social.bound ? '解除綁定' : '立即綁定' }}
                </button>
              </div>
            </div>
          </div>
        </section>

        <!-- 5. 優惠活動 -->
        <section class="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
          <div class="p-6 grid gap-4 sm:grid-cols-2">
            <label class="flex cursor-pointer items-start gap-3 rounded-2xl border border-gray-100 bg-gray-50/50 p-4 transition-colors hover:border-brand-primary/20 hover:bg-brand-surface/40">
              <input
                v-model="form.emailSubscribed"
                type="checkbox"
                class="mt-1 h-4 w-4 rounded border-gray-300 accent-brand-primary"
              />
              <span>
                <span class="block text-sm font-black text-gray-800">優惠活動</span>
                <span class="mt-1 block text-xs leading-6 text-gray-400">接收新品、會員優惠、節慶活動與訂單相關提醒。</span>
              </span>
            </label>
          </div>
        </section>

        <!-- 儲存按鈕 -->
        <div class="pt-4">
          <button @click="saveChanges" class="w-full btn-primary py-4 text-base shadow-sm">
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

interface SocialBinding {
  type: string
  name: string
  bound: boolean
  account: string
}

const CITY_DISTRICTS: Record<string, string[]> = {
  '台北市': ['中正區', '大同區', '中山區', '松山區', '大安區', '萬華區', '信義區', '士林區', '北投區', '內湖區', '南港區', '文山區'],
  '新北市': ['板橋區', '三重區', '中和區', '永和區', '新莊區', '新店區', '樹林區', '鶯歌區', '三峽區', '淡水區', '汐止區', '瑞芳區'],
  '桃園市': ['桃園區', '中壢區', '平鎮區', '八德區', '楊梅區', '蘆竹區', '大溪區', '龍潭區', '龜山區', '大園區', '觀音區', '新屋區'],
  '台中市': ['中區', '東區', '南區', '西區', '北區', '北屯區', '西屯區', '南屯區', '太平區', '大里區', '霧峰區', '烏日區'],
  '台南市': ['中西區', '東區', '南區', '北區', '安平區', '安南區', '永康區', '歸仁區', '新化區', '仁德區'],
  '高雄市': ['新興區', '前金區', '苓雅區', '鹽埕區', '鼓山區', '前鎮區', '三民區', '左營區', '楠梓區', '鳳山區'],
}

export default Vue.extend({
  name: 'ProfileView',
  components: { AccountSidebar, AccountContentHeader },
  created() {
    document.title = '修改會員資料'
  },

  data() {
    return {
      form: {
        memberNo: 'OGM-2026-0008',
        name:     '皮克敏',
        birthday: '1990-01-01',
        gender:   'male',
        email:    'ming@example.com',
        phone:    '0912345678',
        invoiceCarrier: '/ABC1234',
        city: '台南市',
        district: '永康區',
        addressDetail: '中正路301號',
        emailSubscribed: true,
      },

      passwordForm: {
        current: '',
        new:     '',
        confirm: '',
      },

      genderOptions: [
        { label: '男性', value: 'male' },
        { label: '女性', value: 'female' },
        { label: '不便透露', value: 'none' },
      ],

      socialBindings: [
        { type: 'fb', name: 'Facebook', bound: true, account: 'Ming Wang' },
        { type: 'line', name: 'LINE', bound: true, account: '小明' },
        { type: 'google', name: 'Google', bound: false, account: '' },
        { type: 'uniopen', name: 'uniopen', bound: false, account: '' },
      ] as SocialBinding[],

      saveNotice: '',
      invoiceCarrierBindUrl: 'https://www.einvoice.nat.gov.tw/portal/btc/btc103w/main/ZXlKaGJHY2lPaUpJVXpJMU5pSXNJblI1Y0NJNklrcFhWQ0o5LlkzaE5WR2N6SWl3aVkyRnlaRjlpWVc0aU9pSXhOamM0TVRjNU55SXNJbUpoWTJ0ZmRYSnNJam9pYUhSMGNITTZMeTkzZDNjdWIzSm5ZVzVwWTNOb2IzQnpMbU5qTDNKbFgzWmxhR2xqYkdVdVlYTm9lQ0lzSW1OaGNtUmZkSGx3WlNJNklsSlZZM2ROUkVVeUlpd2lkRzlyWlc0aU9pSlJWR040VFZSbk15SXNJbVY0Y0NJNk1UYzRNekEwT0RjMk5YMGV5SmpZWEprWDI1dmN5STZJa05oY21ST2IzTkVWRTk3WTJGeVpGOXpaWEU5SnpFbkxDQmpZWEpmYm04eFBTZFJWR040VFZSbk15Y3NJR05oY21SZmJtOHlQU2RSVkdONFRWUm5NMDFSUFQwbmZTSXNJbU5oY21SZmJtOHlJam9pVVZSamVFMVVaek5OVVQwOUlpd2ljMjkxY21ObFJuVnVZeUk2SWtKVVF6RXdNMGtpTENKallYSmtYMjV2TVNJNklsRlUuQUEwcjk5WjB5ZlgxTFhkQVJIVkZvTURlWjFCRGttZmhtTjlodnhQYzFoOA==',
    }
  },

  computed: {
    isBirthdayLocked(): boolean {
      return Boolean(this.form.birthday)
    },
    cityOptions(): string[] {
      return Object.keys(CITY_DISTRICTS)
    },
    districtOptions(): string[] {
      return this.form.city ? CITY_DISTRICTS[this.form.city] || [] : []
    },

  },

  methods: {
    onCityChange() {
      if (!this.districtOptions.includes(this.form.district)) {
        this.form.district = ''
      }
    },
    saveChanges() {
      this.saveNotice = '會員資料已更新'
      window.setTimeout(() => { this.saveNotice = '' }, 2500)
    },

    toggleSocialBinding(type: string) {
      const social = this.socialBindings.find(item => item.type === type)
      if (!social) return

      social.bound = !social.bound
      social.account = social.bound ? this.defaultSocialAccount(type) : ''
    },

    defaultSocialAccount(type: string): string {
      const accountMap: Record<string, string> = {
        fb: 'Ming Wang',
        line: '小明',
        google: this.form.email,
        uniopen: 'uniopen 會員',
      }
      return accountMap[type] || this.form.email
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
.field-hint {
  @apply mt-1 text-xs leading-6 text-gray-400;
}
.btn-primary {
  @apply bg-brand-primary text-white rounded-xl hover:bg-brand-dark transition-colors shadow-sm active:scale-[0.98] font-bold;
}
</style>
