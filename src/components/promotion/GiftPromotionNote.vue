<template>
  <div v-if="hasContent" class="rounded-2xl border border-brand-primary/10 bg-brand-surface/30" :class="wrapperSpacingClass">
    <div class="flex items-start gap-2.5">
      <span class="inline-flex shrink-0 items-center rounded-full bg-brand-surface px-2 py-0.5 text-[10px] font-black leading-none text-brand-primary">
        贈品
      </span>
      <div class="min-w-0 flex-1">
        <p class="font-bold text-gray-800" :class="compact ? 'text-xs leading-5 sm:text-sm sm:leading-6' : 'text-sm leading-6'">
          {{ message || progressText }}
        </p>
        <p v-if="message && progressText" class="mt-1 text-xs font-semibold leading-5 text-rose-400">
          {{ progressText }}
        </p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'GiftPromotionNote',
  props: {
    message: {
      type: String,
      default: '',
    },
    progressText: {
      type: String,
      default: '',
    },
    compact: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    hasContent(): boolean {
      return Boolean(this.message || this.progressText)
    },
    wrapperSpacingClass(): string {
      return this.compact ? 'px-3 py-2.5' : 'px-4 py-3'
    },
  },
})
</script>
