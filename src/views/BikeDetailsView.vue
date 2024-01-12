<script lang="ts">
import { useBikeStore, mapActions, mapState } from '@/core/store'
import { defineComponent } from 'vue'

import { LoadingSpinner } from '@/components/loading'
import { BikeImageSelector, BikeSpecs, type BikeSpecsProps, BikePrice, BikeBookmark } from '@/components/bike'
import { Chip } from '@/components/chip'
import { BookingAddressMap, BookingPricing } from '@/components/booking'
import { CurrencyCode } from '@/core/config'

import { BreadcrumbsLayout } from '@/components/layout'
import { NotFound } from '@/components/error'

export default defineComponent({
  name: 'BikeDetailsView',
  components: {
    BreadcrumbsLayout,
    LoadingSpinner,
    BikeImageSelector,
    BikeSpecs,
    BikePrice,
    Chip,
    BookingAddressMap,
    BookingPricing,
    BikeBookmark,
    NotFound
  },
  metaInfo() {
    const { name } = this.data || {}

    return {
      title: name ? `${name} - BikeRent Vue` : 'Details - BikeRent Vue'
    }
  },
  data: () => ({
    isLoading: false,
    currency: CurrencyCode.EUR,
    mockAddress: '745 Atlantic Ave, Boston, MA 02111, United States',
    isBookmarked: false
  }),
  computed: {
    ...mapState(useBikeStore, ['getBikeById']),
    hasData() {
      return !!this.data
    },
    id() {
      const { id } = this.$route.params || {}

      return Number(id) || null
    },
    data() {
      return (this.id && this.getBikeById(this.id)) || null
    },
    images() {
      return this.data?.imageUrls || []
    },
    specs(): BikeSpecsProps {
      const { bodySize, maxLoad, ratings } = this.data || {}

      return {
        bodySize,
        maxLoad,
        ratings
      }
    }
  },
  watch: {},
  async beforeMount() {
    if (!this.data) {
      this.isLoading = true
      await this.fetchBikeList()
      this.isLoading = false
    }
  },
  methods: {
    ...mapActions(useBikeStore, { fetchBikeList: 'fetchList' }),
    handleAddBooking() {
      // TODO: add booking action

      // eslint-disable-next-line no-console
      console.log('booking action')
    }
  }
})
</script>

<template>
  <div v-if="hasData" class="absolute top-0 left-0 pl-2">
    <breadcrumbs-layout theme="primary" :breadcrumbs="[{ name: data!.name }]" />
  </div>

  <div class="page page--details">
    <template v-if="isLoading">
      <div class="text-center my-32">
        <loading-spinner />
      </div>
    </template>
    <template v-else-if="!hasData">
      <not-found />
    </template>
    <template v-else>
      <div class="grid gap-x-6 grid-cols-1">
        <div>
          <div class="card p-8">
            <bike-image-selector :images="images" class="mb-8" />

            <bike-specs :specs="specs" />

            <div class="divider" />

            <article>
              <div class="flex">
                <div>
                  <h2 class="font-extrabold text-4xl">{{ data!.name }}</h2>
                  <chip color="secondary" size="sm">{{ data!.type }}</chip>
                </div>

                <div class="ml-auto">
                  <bike-bookmark v-model:active="isBookmarked" :width="60" size="2xl" outlined />
                </div>
              </div>

              <p>{{ data!.description }}</p>
            </article>

            <section class="pricing">
              <div class="divider" />
              <div class="flex">
                <div class="font-semibold">Day</div>
                <bike-price :price="data!.rate" :currency="currency" rate="daily" class="ml-auto" />
              </div>
              <div class="flex">
                <div class="font-semibold">Week</div>
                <bike-price :price="data!.rate * 7" :currency="currency" rate="weekly" class="ml-auto" />
              </div>
              <div class="divider" />
            </section>

            <div class="w-full">
              <h4 class="text-2xl font-extrabold mb-4">Full adress after booking</h4>
              <booking-address-map :address="mockAddress" />
            </div>
          </div>
        </div>

        <div>
          <div class="card p-8">
            <h3 class="text-base mb-4">Booking Overview</h3>

            <div class="divider" />

            <booking-pricing :price="data!.rate" :currency="currency" class="mb-8" />

            <button class="button button--primary w-full py-5" @click="handleAddBooking">Add to booking</button>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<style lang="scss" scoped>
.page--details {
  position: relative;

  .grid {
    @include breakpoint('lg') {
      grid-template-columns: minmax(400px, 67%) 1fr;
    }
  }
}
</style>
