<template>
  <section class="rounded-2xl border border-gray-100 bg-white px-5 py-5 shadow-sm sm:px-6">
    <div class="flex items-start justify-between gap-4">
      <div class="min-w-0 flex items-start gap-3">
        <router-link
          v-if="backTo"
          :to="backTo"
          class="mt-0.5 text-gray-400 hover:text-brand-primary transition-colors lg:hidden"
        >
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </router-link>
        <div class="min-w-0">
          <p v-if="eyebrow" class="type-eyebrow text-brand-primary mb-2">
            {{ eyebrow }}
          </p>
          <h1 class="type-page-title">
            {{ title }}
          </h1>
          <p v-if="subtitle" class="mt-2 type-muted text-gray-400">
            {{ subtitle }}
          </p>
          <p v-if="notice" class="mt-3 max-w-3xl text-xs font-medium leading-6 text-gray-500">
            {{ notice }}
          </p>
        </div>
      </div>
      <router-link
        v-if="actionText && actionTo"
        :to="actionTo"
        class="inline-flex flex-shrink-0 items-center rounded-xl border border-brand-primary/20 px-4 py-2 text-xs font-bold text-brand-primary transition-colors hover:bg-brand-surface"
      >
        {{ actionText }}
      </router-link>
    </div>
  </section>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'AccountContentHeader',
  props: {
    title: { type: String, required: true },
    subtitle: { type: String, default: '' },
    notice: { type: String, default: '' },
    eyebrow: { type: String, default: '' },
    backTo: { type: String, default: '/account' },
    actionText: { type: String, default: '' },
    actionTo: { type: String, default: '' },
  },
})
</script>
