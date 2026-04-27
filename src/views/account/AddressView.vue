<template>
  <div class="min-h-screen bg-brand-bg pb-16">
    <!-- ══ 主內容：側邊選單 + 內容 ══ -->
    <div class="max-w-7xl mx-auto px-4 pt-6 flex gap-6 items-start">

      <AccountSidebar active-key="addresses" subtitle="會員" />

      <!-- ── 右側：地址內容 ── -->
      <div class="flex-1 min-w-0 space-y-4">
        <AccountContentHeader
          title="常用地址"
          subtitle="管理常用收件地址，讓結帳更快速。"
          eyebrow="常用地址"
        />
        <!-- 新增地址按鈕 -->
        <button
          class="w-full bg-white border-2 border-dashed border-gray-200 rounded-2xl p-6 flex items-center justify-center gap-2 text-gray-500 hover:border-brand-primary hover:text-brand-primary transition-all group shadow-sm"
          @click="openAddModal"
        >
          <div class="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-brand-surface transition-colors">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
          </div>
          <span class="font-bold">新增收件地址</span>
        </button>

        <!-- 地址列表 -->
        <div v-if="addresses.length > 0" class="space-y-4">
          <div
            v-for="address in addresses"
            :key="address.id"
            class="bg-white rounded-2xl shadow-sm p-5 relative overflow-hidden transition-shadow hover:shadow-md"
          >
            <!-- 預設標籤 -->
            <div
              v-if="address.isDefault"
              class="absolute top-0 right-0 bg-brand-primary text-white text-[10px] px-3 py-1 rounded-bl-xl font-bold"
            >
              預設地址
            </div>

            <div class="flex justify-between items-start mb-3">
              <div>
                <div class="flex items-center gap-2 mb-1">
                  <span class="font-bold text-gray-800">{{ address.name }}</span>
                  <span class="text-sm text-gray-500">{{ address.phone }}</span>
                </div>
                <p class="text-sm text-gray-600 leading-relaxed">
                  {{ address.city }}{{ address.district }}{{ address.detail }}
                </p>
              </div>
            </div>

            <!-- 功能按鈕 -->
            <div class="flex items-center justify-end gap-4 mt-4 pt-4 border-t border-gray-50">
              <button
                v-if="!address.isDefault"
                class="text-sm text-brand-primary hover:text-brand-dark flex items-center gap-1.5 transition-colors mr-auto font-medium"
                @click="setDefault(address.id)"
              >
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                設為預設
              </button>
              <button
                class="text-sm text-gray-500 hover:text-brand-primary flex items-center gap-1.5 transition-colors font-medium"
                @click="editAddress(address)"
              >
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                編輯
              </button>
              <button
                class="text-sm text-gray-400 hover:text-red-500 flex items-center gap-1.5 transition-colors font-medium"
                @click="confirmDelete(address.id)"
              >
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                刪除
              </button>
            </div>
          </div>
        </div>

        <!-- 空狀態 -->
        <div v-else class="flex flex-col items-center justify-center py-24 text-center bg-white rounded-2xl shadow-sm">
          <div class="text-6xl mb-5 select-none grayscale opacity-20">📍</div>
          <h2 class="font-bold text-gray-700 text-lg mb-2">目前還沒有儲存的地址</h2>
          <p class="text-sm text-gray-400 mb-7">新增常用地址，結帳更快速！</p>
          <button @click="openAddModal" class="btn-primary px-8 py-3">
            新增地址
          </button>
        </div>
      </div>
    </div>

    <!-- ══ 地址編輯/新增 Modal ══ -->
    <transition name="fade">
      <div
        v-if="showModal"
        class="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50 backdrop-blur-sm"
        @click.self="closeModal"
      >
        <transition name="slide-up">
          <div
            v-if="showModal"
            class="bg-white w-full max-w-lg rounded-t-3xl sm:rounded-2xl overflow-hidden shadow-2xl"
          >
            <!-- Modal Header -->
            <div class="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
              <h2 class="text-lg font-bold text-gray-800">{{ isEditing ? '編輯地址' : '新增地址' }}</h2>
              <button class="text-gray-400 hover:text-gray-600" @click="closeModal">
                <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <!-- Modal Content -->
            <div class="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              <!-- 收件人 -->
              <div>
                <label class="form-label">收件人姓名 <span class="text-red-400">*</span></label>
                <input
                  v-model="form.name"
                  type="text"
                  class="form-input"
                  placeholder="請輸入收件人姓名"
                  :class="{ 'border-red-400': errors.name }"
                />
                <p v-if="errors.name" class="form-error">{{ errors.name }}</p>
              </div>

              <!-- 手機號碼 -->
              <div>
                <label class="form-label">手機號碼 <span class="text-red-400">*</span></label>
                <input
                  v-model="form.phone"
                  type="tel"
                  class="form-input"
                  placeholder="09xxxxxxxx"
                  maxlength="10"
                  :class="{ 'border-red-400': errors.phone }"
                />
                <p v-if="errors.phone" class="form-error">{{ errors.phone }}</p>
              </div>

              <!-- 城市/地區 -->
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="form-label">縣市 <span class="text-red-400">*</span></label>
                  <select
                    v-model="form.city"
                    class="form-input appearance-none"
                    :class="{ 'border-red-400': errors.city }"
                    @change="onCityChange"
                  >
                    <option value="" disabled>請選擇</option>
                    <option v-for="c in cityOptions" :key="c" :value="c">{{ c }}</option>
                  </select>
                  <p v-if="errors.city" class="form-error">{{ errors.city }}</p>
                </div>
                <div>
                  <label class="form-label">行政區 <span class="text-red-400">*</span></label>
                  <select
                    v-model="form.district"
                    class="form-input appearance-none"
                    :class="{ 'border-red-400': errors.district }"
                    :disabled="!form.city"
                  >
                    <option value="" disabled>請選擇</option>
                    <option v-for="d in districtOptions" :key="d" :value="d">{{ d }}</option>
                  </select>
                  <p v-if="errors.district" class="form-error">{{ errors.district }}</p>
                </div>
              </div>

              <!-- 詳細地址 -->
              <div>
                <label class="form-label">詳細地址 <span class="text-red-400">*</span></label>
                <textarea
                  v-model="form.detail"
                  class="form-input min-h-[80px]"
                  placeholder="街道門牌、樓層室號等"
                  :class="{ 'border-red-400': errors.detail }"
                ></textarea>
                <p v-if="errors.detail" class="form-error">{{ errors.detail }}</p>
              </div>

              <!-- 設為預設 -->
              <label class="flex items-center gap-2.5 cursor-pointer select-none w-fit py-2">
                <input
                  v-model="form.isDefault"
                  type="checkbox"
                  class="w-5 h-5 accent-brand-primary cursor-pointer rounded-lg"
                />
                <span class="text-sm font-medium text-gray-700">設為預設地址</span>
              </label>
            </div>

            <!-- Modal Footer -->
            <div class="p-6 border-t border-gray-100 bg-gray-50/50 flex gap-3">
              <button
                class="flex-1 py-3 border border-gray-200 rounded-xl font-bold text-gray-500 hover:bg-white transition-colors"
                @click="closeModal"
              >
                取消
              </button>
              <button
                class="flex-2 btn-primary flex-1 py-3 font-bold"
                @click="submitForm"
              >
                {{ isEditing ? '確認修改' : '儲存地址' }}
              </button>
            </div>
          </div>
        </transition>
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import AccountSidebar from '@/components/account/AccountSidebar.vue'
import AccountContentHeader from '@/components/account/AccountContentHeader.vue'
import { mockAddresses, SavedAddress } from '@/mock/addresses'

const MOCK_CITIES: Record<string, string[]> = {
  '台北市': ['中正區', '大同區', '中山區', '松山區', '大安區', '萬華區', '信義區', '士林區', '北投區', '內湖區', '南港區', '文山區'],
  '新北市': ['板橋區', '三重區', '中和區', '永和區', '新莊區', '新店區', '樹林區', '鶯歌區', '三峽區', '淡水區', '汐止區', '瑞芳區'],
  '桃園市': ['桃園區', '中壢區', '平鎮區', '八德區', '楊梅區', '蘆竹區', '大溪區', '龍潭區', '龜山區', '大園區', '觀音區', '新屋區'],
  '台中市': ['中區', '東區', '南區', '西區', '北區', '北屯區', '西屯區', '南屯區', '太平區', '大里區', '霧峰區', '烏日區'],
}

export default Vue.extend({
  name: 'AddressView',
  components: { AccountSidebar, AccountContentHeader },
  created() {
    document.title = '常用地址'
  },

  data() {
    return {
      addresses: mockAddresses.map((address) => ({ ...address })) as SavedAddress[],

      showModal: false,
      isEditing: false,
      editingId: null as number | null,

      form: {
        name:      '',
        phone:     '',
        city:      '',
        district:  '',
        detail:    '',
        isDefault: false,
      },

      errors: {
        name:     '',
        phone:    '',
        city:     '',
        district: '',
        detail:   '',
      },

      cityOptions: Object.keys(MOCK_CITIES),
    }
  },

  computed: {
    districtOptions(): string[] {
      return this.form.city ? MOCK_CITIES[this.form.city] || [] : []
    },
  },

  methods: {
    onCityChange() {
      this.form.district = ''
    },

    setDefault(id: number) {
      this.addresses.forEach(a => {
        a.isDefault = a.id === id
      })
    },

    openAddModal() {
      this.isEditing = false
      this.editingId = null
      this.resetForm()
      this.showModal = true
    },

    editAddress(address: SavedAddress) {
      this.isEditing = true
      this.editingId = address.id
      this.form = { ...address }
      this.showModal = true
    },

    closeModal() {
      this.showModal = false
    },

    resetForm() {
      this.form = {
        name:      '',
        phone:     '',
        city:      '',
        district:  '',
        detail:    '',
        isDefault: false,
      }
      this.errors = {
        name:     '',
        phone:    '',
        city:     '',
        district: '',
        detail:   '',
      }
    },

    validate(): boolean {
      let valid = true
      this.errors = { name: '', phone: '', city: '', district: '', detail: '' }

      if (!this.form.name.trim()) {
        this.errors.name = '請輸入收件人姓名'
        valid = false
      }

      if (!this.form.phone.trim()) {
        this.errors.phone = '請輸入手機號碼'
        valid = false
      } else if (!/^09\d{8}$/.test(this.form.phone)) {
        this.errors.phone = '請輸入正確手機格式 (09xxxxxxxx)'
        valid = false
      }

      if (!this.form.city) {
        this.errors.city = '請選擇縣市'
        valid = false
      }

      if (!this.form.district) {
        this.errors.district = '請選擇行政區'
        valid = false
      }

      if (!this.form.detail.trim()) {
        this.errors.detail = '請輸入詳細地址'
        valid = false
      }

      return valid
    },

    submitForm() {
      if (!this.validate()) return

      if (this.form.isDefault) {
        // 如果設為預設，先將其他地址的預設取消
        this.addresses.forEach(a => a.isDefault = false)
      }

      if (this.isEditing && this.editingId) {
        const index = this.addresses.findIndex(a => a.id === this.editingId)
        if (index !== -1) {
          this.addresses.splice(index, 1, {
            ...this.form,
            id: this.editingId
          })
        }
      } else {
        const newId = this.addresses.length > 0
          ? Math.max(...this.addresses.map(a => a.id)) + 1
          : 1
        this.addresses.push({
          ...this.form,
          id: newId
        })
      }

      // 如果這是唯一的地址，強行設為預設
      if (this.addresses.length === 1) {
        this.addresses[0].isDefault = true
      }

      this.closeModal()
    },

    confirmDelete(id: number) {
      if (confirm('確定要刪除此地址嗎？')) {
        const index = this.addresses.findIndex(a => a.id === id)
        if (index !== -1) {
          const removed = this.addresses.splice(index, 1)[0]
          // 如果刪除的是預設地址且還有其他地址，將第一個設為預設
          if (removed.isDefault && this.addresses.length > 0) {
            this.addresses[0].isDefault = true
          }
        }
      }
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
.form-error {
  @apply text-xs text-red-500 mt-1.5 flex items-center gap-1;
}
.form-error::before {
  content: '⚠';
}

/* Transitions */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}

.slide-up-enter-active, .slide-up-leave-active {
  transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}
.slide-up-enter, .slide-up-leave-to {
  transform: translateY(100%);
}

@media (min-width: 640px) {
  .slide-up-enter, .slide-up-leave-to {
    transform: scale(0.95) translateY(20px);
    opacity: 0;
  }
}

/* 按鈕風格 */
.btn-primary {
  @apply bg-brand-primary text-white rounded-xl hover:bg-brand-dark transition-colors shadow-sm active:scale-[0.98] font-bold;
}
</style>
