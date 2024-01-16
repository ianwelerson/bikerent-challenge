<script lang="ts">
import { defineComponent } from 'vue'

import { HeaderLayout } from '@/components/layout'

export default defineComponent({
  name: 'App',
  components: {
    HeaderLayout
  },
  metaInfo() {
    return {
      title: 'BikeRent Vue'
    }
  },
  computed: {
    isHome(): boolean {
      return this.$route.name === 'home'
    }
  }
})
</script>

<template>
  <metainfo>
    <template #title="{ content }">{{ content }}</template>
  </metainfo>

  <header-layout :is-home="isHome" />

  <main :class="['main container mx-auto md:px-24', { 'main--home': isHome }]">
    <div class="main__content pt-12">
      <router-view />
    </div>
  </main>
</template>
