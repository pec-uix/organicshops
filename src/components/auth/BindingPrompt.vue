<template>
  <transition name="modal-fade">
    <div v-if="visible" class="fixed inset-0 z-50 flex items-end sm:items-center justify-center px-4 pb-4 sm:pb-0">

      <!-- 遮罩 -->
      <div class="absolute inset-0 bg-black/50" @click="$emit('close')" />

      <!-- 對話框 -->
      <div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">

        <!-- 頂部色條 -->
        <div class="h-1.5 w-full" :style="{ background: providerColor }" />

        <!-- 內容 -->
        <div class="p-6">

          <!-- Provider Logo + 標題 -->
          <div class="flex items-center gap-3 mb-5">
            <div
              class="w-11 h-11 rounded-xl flex items-center justify-center text-white text-lg flex-shrink-0 shadow-sm"
              :style="{ background: providerColor }"
            >
              <component :is="'span'">{{ providerIcon }}</component>
            </div>
            <div>
              <p class="text-xs text-gray-400 font-medium uppercase tracking-wide">{{ providerLabel }} 登入</p>
              <h3 class="font-bold text-gray-800 text-base leading-snug">偵測到相同 Email</h3>
            </div>
          </div>

          <!-- 說明文字 -->
          <div class="bg-amber-50 border border-amber-100 rounded-xl px-4 py-3 mb-5">
            <p class="text-sm text-amber-800 leading-relaxed">
              <strong class="font-mono text-amber-900 break-all">{{ email }}</strong>
              <br />
              此 Email 已有統一生機帳號。
            </p>
          </div>

          <p class="text-sm text-gray-600 leading-relaxed mb-5">
            您可以選擇將 <strong class="text-gray-800">{{ providerLabel }}</strong>
            綁定至現有帳號，下次可直接使用 {{ providerLabel }} 快速登入；
            或建立一個全新的獨立帳號。
          </p>

          <!-- 按鈕 -->
          <div class="flex flex-col gap-2.5">
            <!-- 綁定 -->
            <button
              class="w-full py-3 rounded-xl text-white font-bold text-sm flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.98] transition-all"
              :style="{ background: providerColor }"
              @click="$emit('bind')"
            >
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
              綁定 {{ providerLabel }} 至現有帳號
            </button>

            <!-- 建立新帳號 -->
            <button
              class="w-full py-3 rounded-xl border-2 border-gray-200 text-gray-700 font-semibold text-sm hover:border-gray-300 hover:bg-gray-50 active:scale-[0.98] transition-all"
              @click="$emit('create-new')"
            >
              建立全新帳號
            </button>

            <!-- 取消 -->
            <button
              class="w-full py-2 text-xs text-gray-400 hover:text-gray-600 transition-colors"
              @click="$emit('close')"
            >
              取消，返回登入頁
            </button>
          </div>

        </div>

        <!-- 底部提示 -->
        <div class="px-6 pb-5">
          <p class="text-xs text-gray-400 text-center">
            不確定使用哪個帳號？請聯繫
            <router-link to="/contact" class="text-brand-primary hover:underline">客服中心</router-link>
          </p>
        </div>

      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import Vue from 'vue'

type Provider = 'facebook' | 'line' | 'google' | 'openpoint'

const PROVIDER_META: Record<Provider, { label: string; color: string; icon: string }> = {
  facebook:  { label: 'Facebook',  color: '#1877F2', icon: '' },
  line:      { label: 'LINE',      color: '#06C755', icon: '💚' },
  google:    { label: 'Google',    color: '#4285F4', icon: '' },
  openpoint: { label: 'OPENPOINT', color: '#F55B00', icon: '🔶' },
}

export default Vue.extend({
  name: 'BindingPrompt',

  props: {
    /** 控制顯示/隱藏 */
    visible: {
      type:    Boolean,
      default: false,
    },
    /** 已存在的 Email */
    email: {
      type:    String,
      default: '',
    },
    /** 第三方登入來源 */
    provider: {
      type:      String as () => Provider,
      default:   'google',
      validator: (v: string) => ['facebook', 'line', 'google', 'openpoint'].includes(v),
    },
  },

  computed: {
    providerLabel(): string {
      return PROVIDER_META[this.provider as Provider]?.label ?? this.provider
    },
    providerColor(): string {
      return PROVIDER_META[this.provider as Provider]?.color ?? '#888'
    },
    providerIcon(): string {
      return PROVIDER_META[this.provider as Provider]?.icon ?? '🔗'
    },
  },
})
</script>

<!--
  使用方式（父元件）：
  ─────────────────────────────────────────
  <BindingPrompt
    :visible="showBinding"
    email="user@example.com"
    provider="google"
    @bind="handleBind"
    @create-new="handleCreateNew"
    @close="showBinding = false"
  />

  事件：
    @bind        → 使用者選擇綁定現有帳號
    @create-new  → 使用者選擇建立新帳號
    @close       → 使用者取消
  ─────────────────────────────────────────
-->

<style scoped>
.modal-fade-enter-active,
.modal-fade-leave-active { transition: opacity 0.2s; }
.modal-fade-enter,
.modal-fade-leave-to    { opacity: 0; }

.modal-fade-enter-active .relative,
.modal-fade-leave-active .relative { transition: transform 0.25s ease; }
.modal-fade-enter        .relative  { transform: translateY(24px); }
.modal-fade-leave-to     .relative  { transform: translateY(24px); }
</style>
