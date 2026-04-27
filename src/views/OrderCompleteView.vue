<template>
  <div class="min-h-screen bg-brand-bg py-10 px-4">
    <div class="max-w-2xl mx-auto space-y-5">

      <!-- ══ 成功圖示 + 標題 ══ -->
      <div class="bg-white rounded-2xl shadow-sm p-8 text-center">
        <div class="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5 success-pulse">
          <svg class="w-10 h-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 class="text-2xl font-bold text-brand-dark mb-2">訂單已送出！</h1>
        <p class="text-gray-500 text-sm leading-relaxed">
          感謝您的訂購，我們已收到您的訂單，將盡快為您處理。<br />
          確認信已寄送至您的 Email，請注意查收。
        </p>
      </div>

      <!-- ══ 訂單資訊 ══ -->
      <div class="bg-white rounded-2xl shadow-sm p-6">
        <h2 class="font-bold text-gray-800 mb-4 flex items-center gap-2">
          <span class="text-xl">🧾</span>訂單資訊
        </h2>
        <dl class="space-y-3">
          <div class="flex justify-between items-center">
            <dt class="text-sm text-gray-500">訂單編號</dt>
            <dd class="font-mono font-bold text-brand-primary tracking-wide">{{ orderNumber }}</dd>
          </div>
          <div class="flex justify-between items-center">
            <dt class="text-sm text-gray-500">訂單日期</dt>
            <dd class="text-sm font-medium text-gray-800">{{ orderDate }}</dd>
          </div>
          <div class="flex justify-between items-center">
            <dt class="text-sm text-gray-500">付款方式</dt>
            <dd class="text-sm font-medium text-gray-800">{{ paymentLabel }}</dd>
          </div>
          <div class="flex justify-between items-center pt-3 border-t border-gray-100">
            <dt class="font-semibold text-gray-800">訂單總金額</dt>
            <dd class="text-2xl font-bold text-brand-primary">${{ formattedTotal }}</dd>
          </div>
        </dl>
      </div>

      <!-- ══ 30 分鐘取消倒數 ══ -->
      <transition name="slide-down">
        <div v-if="!cancelled" class="bg-white rounded-2xl shadow-sm p-6">
          <div class="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 class="font-bold text-gray-800 mb-1">取消訂單</h2>
              <p v-if="secondsLeft > 0" class="text-sm text-gray-500">訂單送出後 30 分鐘內可申請取消</p>
              <p v-else class="text-sm text-gray-400">取消時間已過，如需退換貨請聯繫客服</p>
            </div>

            <!-- 倒數 + 按鈕 -->
            <div v-if="secondsLeft > 0" class="flex items-center gap-3">
              <div class="text-center">
                <div
                  class="font-mono text-lg font-bold px-4 py-2 rounded-xl border transition-colors"
                  :class="secondsLeft <= 300
                    ? 'bg-red-50 border-red-300 text-red-600'
                    : 'bg-amber-50 border-amber-200 text-amber-700'"
                >
                  {{ countdownDisplay }}
                </div>
                <p class="text-xs text-gray-400 mt-1">剩餘時間</p>
              </div>
              <button
                class="px-5 py-2.5 rounded-xl border-2 border-red-400 text-red-500 text-sm font-semibold hover:bg-red-50 active:scale-95 transition-all"
                @click="showCancelConfirm = true"
              >
                取消訂單
              </button>
            </div>

            <!-- 時限已過 -->
            <div v-else class="flex items-center gap-2 text-gray-400 text-sm">
              <svg class="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              已超過取消時限
            </div>
          </div>

          <!-- 倒數進度條 -->
          <div v-if="secondsLeft > 0" class="mt-4">
            <div class="h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                class="h-full rounded-full transition-all duration-1000"
                :class="secondsLeft <= 300 ? 'bg-red-400' : 'bg-amber-400'"
                :style="{ width: countdownPercent + '%' }"
              />
            </div>
          </div>
        </div>
      </transition>

      <!-- ══ 訂單已取消 ══ -->
      <transition name="fade">
        <div v-if="cancelled" class="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
          <div class="text-4xl mb-3 select-none">❌</div>
          <h2 class="font-bold text-red-700 text-lg mb-2">訂單已取消</h2>
          <p class="text-sm text-red-500 leading-relaxed">
            訂單 <strong class="font-mono">{{ orderNumber }}</strong> 已成功取消。<br />
            退款將於 3–5 個工作天內退回原付款帳戶。
          </p>
        </div>
      </transition>

      <!-- ══ 配送資訊摘要 ══ -->
      <div class="bg-white rounded-2xl shadow-sm p-6">
        <h2 class="font-bold text-gray-800 mb-4 flex items-center gap-2">
          <span class="text-xl">📦</span>配送資訊
        </h2>
        <dl class="space-y-3">
          <div class="flex justify-between items-center">
            <dt class="text-sm text-gray-500">配送方式</dt>
            <dd class="text-sm font-medium text-gray-800">{{ deliveryLabel }}</dd>
          </div>
          <div class="flex justify-between items-center">
            <dt class="text-sm text-gray-500">收件人</dt>
            <dd class="text-sm font-medium text-gray-800">{{ receiverName }}</dd>
          </div>
          <div v-if="deliveryAddress" class="flex justify-between items-start gap-4">
            <dt class="text-sm text-gray-500 flex-shrink-0">收件地址</dt>
            <dd class="text-sm font-medium text-gray-800 text-right">{{ deliveryAddress }}</dd>
          </div>
          <div class="flex justify-between items-center">
            <dt class="text-sm text-gray-500">預計到貨</dt>
            <dd class="text-sm font-medium text-brand-primary font-semibold">{{ estimatedDelivery }}</dd>
          </div>
        </dl>

        <!-- 配送進度條 -->
        <div class="mt-5 pt-4 border-t border-gray-100">
          <div class="flex items-start justify-between">
            <div
              v-for="(stage, idx) in deliveryStages"
              :key="idx"
              class="flex flex-col items-center flex-1"
            >
              <!-- 連線 + 圓點 row -->
              <div class="flex items-center w-full">
                <div
                  class="h-0.5 flex-1 transition-colors"
                  :class="idx === 0 ? 'opacity-0' : (idx <= currentStageIdx ? 'bg-brand-primary' : 'bg-gray-200')"
                />
                <div
                  class="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 border-2 transition-all text-xs"
                  :class="idx <= currentStageIdx
                    ? 'bg-brand-primary border-brand-primary text-white'
                    : 'bg-white border-gray-200 text-gray-300'"
                >
                  <svg v-if="idx < currentStageIdx" class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
                  </svg>
                  <span v-else>{{ idx + 1 }}</span>
                </div>
                <div
                  class="h-0.5 flex-1 transition-colors"
                  :class="idx === deliveryStages.length - 1 ? 'opacity-0' : (idx < currentStageIdx ? 'bg-brand-primary' : 'bg-gray-200')"
                />
              </div>
              <span
                class="text-xs mt-1.5 text-center leading-tight px-1"
                :class="idx <= currentStageIdx ? 'text-brand-primary font-medium' : 'text-gray-300'"
              >{{ stage }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- ══ 操作按鈕 ══ -->
      <div class="flex flex-col sm:flex-row gap-3">
        <router-link to="/products" class="btn-primary py-3.5 flex-1 text-center text-sm font-semibold">
          繼續購物
        </router-link>
        <router-link to="/account/orders" class="btn-outline py-3.5 flex-1 text-center text-sm font-semibold">
          前往會員中心查看訂單
        </router-link>
      </div>

      <!-- 客服資訊 -->
      <p class="text-center text-xs text-gray-400 pb-4">
        如有問題，請聯繫客服專線
        <a href="tel:0800777000" class="text-brand-primary hover:underline">0800-777-000</a>
        或 Email
        <a href="mailto:service@organiclife.com.tw" class="text-brand-primary hover:underline">service@organiclife.com.tw</a>
      </p>

    </div>

    <!-- ══ 取消確認 Modal ══ -->
    <transition name="modal-fade">
      <div v-if="showCancelConfirm" class="fixed inset-0 z-50 flex items-center justify-center px-4">
        <div class="absolute inset-0 bg-black/40" @click="showCancelConfirm = false" />
        <div class="relative bg-white rounded-2xl shadow-xl p-7 max-w-sm w-full">
          <div class="text-5xl text-center mb-4 select-none">⚠️</div>
          <h3 class="text-lg font-bold text-gray-800 text-center mb-2">確定要取消訂單？</h3>
          <p class="text-sm text-gray-500 text-center mb-6 leading-relaxed">
            訂單 <strong class="font-mono text-brand-primary">{{ orderNumber }}</strong> 將被取消，<br />
            退款將於 3–5 個工作天內退回原付款帳戶。
          </p>
          <div class="flex gap-3">
            <button
              class="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition-colors"
              @click="showCancelConfirm = false"
            >
              先不要
            </button>
            <button
              class="flex-1 py-2.5 bg-red-500 text-white rounded-xl text-sm font-bold hover:bg-red-600 active:scale-95 transition-all"
              @click="confirmCancel"
            >
              確認取消
            </button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

const DELIVERY_LABELS: Record<string, string> = {
  'home-hct': '黑貓宅急便',
  'home-bf':  '新竹貨運',
  'cvs-711':  '7-ELEVEN 超商取貨',
}

const DELIVERY_ETA: Record<string, string> = {
  'home-hct': '2–3 個工作天',
  'home-bf':  '3–5 個工作天',
  'cvs-711':  '3–5 個工作天',
}

const PAYMENT_LABELS: Record<string, string> = {
  'credit':             '信用卡一次付清',
  'credit-installment': '信用卡分期付款',
  'linepay':            'LINE Pay',
  'icash':              'icash Pay',
  'cod':                '貨到付款',
  'cvs-cod':            '超商貨到付款',
}

const CANCEL_SECONDS = 30 * 60  // 30 分鐘

export default Vue.extend({
  name: 'OrderCompleteView',

  data() {
    return {
      secondsLeft:       CANCEL_SECONDS,
      countdownTimer:    null as ReturnType<typeof setInterval> | null,
      cancelled:         false,
      showCancelConfirm: false,

      deliveryStages:  ['訂單確認', '備貨中', '已出貨', '配送中', '已送達'],
      currentStageIdx: 1,  // 模擬目前在「備貨中」
    }
  },

  computed: {
    // ── 從 route query 取資料 ──
    orderNumber(): string {
      return (this.$route.query.orderNumber as string) || `OG${Date.now().toString().slice(-8)}`
    },

    orderDate(): string {
      const raw = this.$route.query.orderDate as string
      const d = raw ? new Date(Number(raw)) : new Date()
      const pad = (n: number) => String(n).padStart(2, '0')
      return `${d.getFullYear()}/${pad(d.getMonth() + 1)}/${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`
    },

    total(): string {
      return (this.$route.query.total as string) || '0'
    },

    formattedTotal(): string {
      return Number(this.total).toLocaleString()
    },

    deliveryMethod(): string {
      return (this.$route.query.delivery as string) || ''
    },

    deliveryLabel(): string {
      return DELIVERY_LABELS[this.deliveryMethod] || this.deliveryMethod || '—'
    },

    estimatedDelivery(): string {
      return DELIVERY_ETA[this.deliveryMethod] || '3–5 個工作天'
    },

    receiverName(): string {
      return (this.$route.query.receiverName as string) || '—'
    },

    deliveryAddress(): string {
      return (this.$route.query.address as string) || ''
    },

    paymentMethod(): string {
      return (this.$route.query.payment as string) || ''
    },

    paymentLabel(): string {
      return PAYMENT_LABELS[this.paymentMethod] || this.paymentMethod || '—'
    },

    // ── 倒數計時 ──
    countdownDisplay(): string {
      const m = Math.floor(this.secondsLeft / 60)
      const s = this.secondsLeft % 60
      return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
    },

    countdownPercent(): number {
      return (this.secondsLeft / CANCEL_SECONDS) * 100
    },
  },

  mounted() {
    this.countdownTimer = setInterval(() => {
      if (this.secondsLeft > 0) {
        this.secondsLeft--
      } else {
        this.stopTimer()
      }
    }, 1000)
  },

  beforeDestroy() {
    this.stopTimer()
  },

  methods: {
    stopTimer() {
      if (this.countdownTimer !== null) {
        clearInterval(this.countdownTimer)
        this.countdownTimer = null
      }
    },

    confirmCancel() {
      this.showCancelConfirm = false
      this.cancelled = true
      this.stopTimer()
      this.secondsLeft = 0
    },
  },
})
</script>

<style scoped>
/* 成功圓圈 pulse */
@keyframes success-pulse {
  0%   { box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.4); }
  70%  { box-shadow: 0 0 0 16px rgba(34, 197, 94, 0); }
  100% { box-shadow: 0 0 0 0 rgba(34, 197, 94, 0); }
}
.success-pulse {
  animation: success-pulse 1.6s ease-out 2;
}

/* Modal 淡入淡出 */
.modal-fade-enter-active,
.modal-fade-leave-active { transition: opacity 0.2s; }
.modal-fade-enter,
.modal-fade-leave-to    { opacity: 0; }

/* 區塊淡入 */
.fade-enter-active,
.fade-leave-active { transition: opacity 0.3s; }
.fade-enter,
.fade-leave-to    { opacity: 0; }

/* 取消區塊滑出 */
.slide-down-leave-active { transition: all 0.35s ease; }
.slide-down-leave-to     { opacity: 0; transform: translateY(-8px); }
</style>
