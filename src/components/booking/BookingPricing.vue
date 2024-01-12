<script lang="ts">
import { PRICING_SERVICE_FEE } from '@/core/config'
import { defineComponent, type PropType } from 'vue'
import { Icon } from '@/components/icon/'
import type { CurrencyCode } from '@/core/config'
import { formatCurrency } from '@/core/helpers/currency'

export default defineComponent({
  name: 'BookingPricing',
  components: { Icon },
  props: {
    price: {
      type: Number,
      required: true
    },
    currency: {
      type: String as PropType<CurrencyCode>,
      required: true
    }
  },
  computed: {
    serviceFee(): number {
      return this.price * PRICING_SERVICE_FEE
    },
    total(): number {
      return this.price + this.serviceFee
    }
  },
  methods: {
    formatPrice(value: number): String {
      return formatCurrency(value, this.currency)
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
      <div class="text-right">{{ formatPrice(price) }}</div>

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
