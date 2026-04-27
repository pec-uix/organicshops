<template>
  <ProductListView />
</template>

<script lang="ts">
import Vue from 'vue'
import ProductListView from '@/views/ProductListView.vue'

export default Vue.extend({
  name: 'SearchView',
  components: { ProductListView },
})
</script>
