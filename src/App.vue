<template>
  <div id="app" class="min-h-screen flex flex-col overflow-x-hidden bg-brand-bg">
    <AppHeader />
    <main class="flex-1 pt-[120px]">
      <router-view />
    </main>
    <AppFooter />
    <CartDrawer />
    <MobileNavDrawer />
    <PdfViewerModal :pdf-url="pdfViewerUrl" :pdf-title="pdfViewerTitle" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import AppHeader from '@/components/layout/AppHeader.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import CartDrawer from '@/components/cart/CartDrawer.vue'
import MobileNavDrawer from '@/components/layout/MobileNavDrawer.vue'
import PdfViewerModal from '@/components/content/PdfViewerModal.vue'

export default Vue.extend({
  name: 'App',
  components: { AppHeader, AppFooter, CartDrawer, MobileNavDrawer, PdfViewerModal },
  computed: {
    pdfViewerUrl(): string | null {
      return this.$store.getters['ui/pdfViewerUrl']
    },
    pdfViewerTitle(): string {
      return this.$store.getters['ui/pdfViewerTitle']
    },
  },
})
</script>
