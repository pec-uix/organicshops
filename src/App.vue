<template>
  <div id="app" class="min-h-screen flex flex-col overflow-x-hidden bg-brand-bg">
    <AppHeader />
    <main class="flex-1">
      <router-view />
    </main>
    <AppFooter />
    <CartDrawer />
    <MobileNavDrawer />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import AppHeader from '@/components/layout/AppHeader.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import CartDrawer from '@/components/cart/CartDrawer.vue'
import MobileNavDrawer from '@/components/layout/MobileNavDrawer.vue'

export default Vue.extend({
  name: 'App',
  components: { AppHeader, AppFooter, CartDrawer, MobileNavDrawer },
})
</script>
