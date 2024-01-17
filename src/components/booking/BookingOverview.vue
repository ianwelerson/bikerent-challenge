<script lang="ts">
import { defineComponent, type PropType } from 'vue'
import axios from 'axios'

import { CurrencyCode } from '@/core/config'

import { bike } from '@/core/api'
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
  methods: {
    async handleAddBooking() {
      this.loadingData()

      try {
        await bike.rent(this.rentDetails)

        this.$emit('booked')
      } catch (error) {
        if (axios.isAxiosError(error)) {
          this.updateErrorMessage(error.response?.data.message)
        }
      } finally {
        this.isLoading = false
      }
    },
    updateErrorMessage(message: string | null) {
      this.error = message
    },
    loadingData() {
      this.isLoading = true
      this.updateErrorMessage(null)
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
      @loading="loadingData"
      @updated="isLoading = false"
      @error="updateErrorMessage"
    />

    <button
      :class="['button button--primary w-full py-5', { 'btn-error': isLoading || !!error }]"
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

.btn-error {
  cursor: not-allowed;
}
</style>
