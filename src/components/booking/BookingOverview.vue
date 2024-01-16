<script lang="ts">
import { defineComponent, type PropType } from 'vue'
import axios from 'axios'

import { CurrencyCode } from '@/core/config'

// import { bike } from '@/core/api'
import type { BikeRentDetails } from '@/core/api/modules/typings/bike'

import { BookingPricing } from '@/components/booking'
import { LoadingSpinner } from '@/components/loading'

export default defineComponent({
  name: 'BookingOverview',
  components: {
    BookingPricing,
    LoadingSpinner
  },
  props: {
    rentDetails: {
      type: Object as PropType<BikeRentDetails>,
      required: true
    }
  },
  emits: ['booked'],
  data: () => ({
    currency: CurrencyCode.EUR,
    isLoading: false,
    error: null as string | null
  }),
  watch: {
    isLoading() {
      this.error = null
    }
  },
  methods: {
    errorHandle(message: string | null) {
      this.error = message
    },
    async handleAddBooking() {
      this.isLoading = true

      try {
        // await bike.rent(this.rentDetails)
        await new Promise((resolve) => {
          setTimeout(() => {
            resolve(null)
          }, 3000)
        })
        this.$emit('booked')
      } catch (error) {
        if (axios.isAxiosError(error)) {
          this.errorHandle(error.response?.data.message)
        }
      } finally {
        this.isLoading = false
      }
    }
  }
})
</script>

<template>
  <div>
    <h3 class="text-base mb-4">Booking Overview</h3>

    <div class="divider" />

    <booking-pricing
      :currency="currency"
      :details="rentDetails"
      class="mb-8"
      @updated="isLoading = false"
      @error="errorHandle"
    />

    <button
      :class="['button button--primary w-full py-5', { 'btn-disabled': isLoading || !!error }]"
      :disabled="isLoading || !!error"
      @click="handleAddBooking"
    >
      <loading-spinner v-if="isLoading" />
      <div v-else-if="!!error" class="error-message">{{ error }}</div>
      <template v-else>Add to booking</template>
    </button>
  </div>
</template>

<style scoped lang="scss">
.error-message {
  color: get-theme-color('error');
}
</style>
