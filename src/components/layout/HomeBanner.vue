<template>
  <div class="relative overflow-hidden group" :class="containerClass">
    <!-- ── 背景與圖片 ── -->
    <div class="absolute inset-0 z-0">
      <img :src="image" :alt="title" class="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
      <!-- 品牌色遮罩 (柔化圖片並提升文字易讀性) -->
      <div 
        class="absolute inset-0 bg-gradient-to-r from-brand-dark/40 to-transparent"
        v-if="overlay"
      ></div>
    </div>

    <!-- ── 文字內容區 ── -->
    <div 
      class="relative z-10 h-full flex flex-col justify-center px-6 lg:px-16 space-y-4"
      :class="size === 'small' ? 'px-5 lg:px-6 space-y-2' : ''"
    >
      <div v-if="tag" class="inline-block self-start px-3 py-0.5 bg-brand-primary text-white text-[9px] font-black uppercase tracking-[0.3em] rounded-none shadow-sm">
        {{ tag }}
      </div>
      
      <h2 
        class="font-serif font-black text-white leading-tight tracking-widest drop-shadow-sm"
        :class="titleClass"
      >
        <span v-html="formattedTitle"></span>
      </h2>
      
      <p 
        v-if="subtitle && size !== 'small'" 
        class="text-white/80 font-serif italic text-sm tracking-widest max-w-sm line-clamp-2"
      >
        {{ subtitle }}
      </p>

      <div class="pt-4" :class="size === 'small' ? 'pt-2' : ''">
        <router-link
          v-if="to"
          :to="to"
          class="inline-block rounded-xl px-6 py-3 bg-white text-brand-dark text-[10px] font-black tracking-[0.28em] uppercase border border-white hover:bg-brand-primary hover:text-white hover:border-brand-primary transition-all duration-500 shadow-sm"
          :class="size === 'small' ? 'px-6 py-2' : ''"
        >
          {{ cta }}
        </router-link>
        <button
          v-else
          class="rounded-xl px-6 py-3 bg-white text-brand-dark text-[10px] font-black tracking-[0.28em] uppercase border border-white hover:bg-brand-primary hover:text-white hover:border-brand-primary transition-all duration-500 shadow-sm"
          :class="size === 'small' ? 'px-6 py-2' : ''"
        >
          {{ cta }}
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'

export default Vue.extend({
  name: 'HomeBanner',
  props: {
    size:     { type: String as PropType<'large' | 'medium' | 'small'>, default: 'large' },
    image:    { type: String, required: true },
    tag:      { type: String, default: '' },
    title:    { type: String, required: true },
    subtitle: { type: String, default: '' },
    cta:      { type: String, default: '立即選購' },
    to:       { type: String, default: '' },
    overlay:  { type: Boolean, default: true }
  },
  computed: {
    containerClass(): string {
      const base = 'rounded-2xl shadow-sm'
      if (this.size === 'large')  return `${base} w-full h-[360px] sm:h-[400px] lg:h-[520px]`
      if (this.size === 'medium') return `${base} w-full h-[280px] lg:h-[380px]`
      if (this.size === 'small')  return `${base} w-full h-[220px] lg:h-[260px]`
      return base
    },
    titleClass(): string {
      if (this.size === 'large')  return 'text-4xl lg:text-6xl'
      if (this.size === 'medium') return 'text-3xl lg:text-4xl'
      if (this.size === 'small')  return 'text-xl lg:text-2xl'
      return 'text-2xl'
    },
    formattedTitle(): string {
      // 支援 \n 換行
      return this.title.replace(/\n/g, '<br />')
    }
  }
})
</script>
