<template>
  <div class="bg-[url('@/assets/images/登入背景_1.png')] bg-cover bg-center bg-no-repeat min-h-screen w-full flex items-center justify-center p-4">
    <div class="bg-white/80 backdrop-blur-md border border-white/60 shadow-xl rounded-2xl w-full max-w-md p-8 md:p-10 flex flex-col items-center text-center transition-all">
      <div class="success-ring relative mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#76B82A]/10 text-[#76B82A]">
        <span class="success-ring-glow absolute inset-0 rounded-full" />
        <svg class="relative z-10 h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.75" d="M5 13l4 4L19 7" />
        </svg>
      </div>

      <h1 class="mb-2 text-xl font-bold tracking-wider text-gray-800">恭喜您，註冊成功！</h1>
      <p class="mb-8 text-sm leading-relaxed text-gray-500">歡迎加入統一生機，開啟您的健康有機生活。</p>

      <p class="mb-4 text-xs text-gray-400" aria-live="polite">
        將在 {{ countdown }} 秒後自動為您跳轉至首頁...
      </p>

      <button
        type="button"
        class="w-full py-3 rounded-xl bg-[#76B82A] text-white font-semibold text-sm shadow-md hover:bg-[#659e22] tracking-wide transition transform active:scale-[0.98]"
        @click="goHome"
      >
        立即前往首頁
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'RegisterSuccess',

  data() {
    return {
      countdown: 10,
      timerId: null as number | null,
    }
  },

  mounted() {
    this.timerId = window.setInterval(() => {
      if (this.countdown <= 1) {
        this.clearTimer()
        this.goHome()
        return
      }

      this.countdown -= 1
    }, 1000)
  },

  beforeDestroy() {
    this.clearTimer()
  },

  methods: {
    clearTimer() {
      if (this.timerId !== null) {
        window.clearInterval(this.timerId)
        this.timerId = null
      }
    },

    goHome() {
      this.clearTimer()
      this.$router.push('/')
    },
  },
})
</script>

<style scoped>
.success-ring-glow {
  border: 1px solid rgba(118, 184, 42, 0.18);
  animation: success-pulse 2.2s ease-in-out infinite;
}

@keyframes success-pulse {
  0% {
    transform: scale(1);
    opacity: 0.65;
  }
  70% {
    transform: scale(1.16);
    opacity: 0;
  }
  100% {
    transform: scale(1.16);
    opacity: 0;
  }
}
</style>
