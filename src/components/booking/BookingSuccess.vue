<script lang="ts">
import { defineComponent } from 'vue'

import { Chip } from '@/components/chip'
import { ImageLazy } from '@/components/image'

export default defineComponent({
  name: 'BookingSuccess',
  components: {
    Chip,
    ImageLazy
  },
  props: {
    thumb: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    type: {
      type: String,
      required: true
    },
    showRedirect: {
      type: Boolean,
      default: false
    }
  }
})
</script>

<template>
  <div class="rent-success">
    <div>
      <h3 class="mb-6 text-2xl font-extrabold">Thank you!</h3>
      <p class="m-0 text-base font-semibold">Your bike is booked.</p>
    </div>
    <div class="mt-6">
      <image-lazy :src="thumb" class="rent-success__img" />
      <div class="mt-4">
        <h2 class="text-lg font-bold">{{ name }}</h2>
        <chip color="secondary" size="sm">{{ type }}</chip>
      </div>
    </div>
    <div v-if="showRedirect" class="mt-5">
      <router-link :to="{ name: 'home' }" class="button button--primary w-full">Go to Home Page</router-link>
    </div>
  </div>
</template>

<style scoped lang="scss">
.rent-success {
  padding: 39px 0;
  @apply .text-center;

  &__img {
    width: 185px;
  }
}
</style>
