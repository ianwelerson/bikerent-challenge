<script lang="ts">
import { defineComponent, type PropType } from 'vue'
import axios from 'axios'
import { Icon } from '@/components/icon/'
import { formatCurrency } from '@/core/helpers/currency'
import { bike } from '@/core/api'

import type { CurrencyCode } from '@/core/config'
import type { BikeRentDetails } from '@/core/api/modules/typings/bike'

export default defineComponent({
  name: 'BookingPricing',
  components: { Icon },
  props: {
    currency: {
      type: String as PropType<CurrencyCode>,
      required: true
    },
    details: {
      type: Object as PropType<BikeRentDetails>,
      required: true
    }
  },
  emits: ['loading', 'updated', 'error'],
  data: () => ({
    subtotal: 0,
    serviceFee: 0,
    total: 0
  }),
  watch: {
    details() {
      this.updatePrice()
    }
  },
  mounted() {
    this.updatePrice()
  },
  methods: {
    formatPrice(value: number): String {
      return formatCurrency(value, this.currency)
    },
    async updatePrice() {
      this.$emit('loading')

      try {
        const { rentAmount, fee, totalAmount } = await bike.amount(this.details)

        this.subtotal = rentAmount
        this.serviceFee = fee
        this.total = totalAmount
      } catch (error) {
        if (axios.isAxiosError(error)) {
          this.$emit('error', error.response?.data.message)
        }
      } finally {
        this.$emit('updated')
      }
    }
  }
})
</script>

<template>
  <section class="booking-pricing">
    <div class="grid grid-cols-2 gap-y-3 text-sm">
      <div class="flex items-center">
        Subtotal
        <icon type="solid" size="xs" class="ml-1">circle-info</icon>
      </div>
      <div class="text-right">{{ formatPrice(subtotal) }}</div>

      <div class="flex items-center">
        Service Fee
        <icon type="solid" size="xs" class="ml-1">circle-info</icon>
      </div>
      <div class="text-right">{{ formatPrice(serviceFee) }}</div>

      <div class="flex items-center text-base">Total</div>
      <div class="text-right text-2xl font-bold">{{ formatPrice(total) }}</div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.booking-pricing {
  position: relative;
}
</style>
