<script lang="ts">
import { useBikeStore, mapActions, mapState } from '@/core/store'
import { defineComponent } from 'vue'

import { LoadingSpinner } from '@/components/loading'
import { BikeImageSelector, BikeSpecs, type BikeSpecsProps, BikePrice, BikeBookmark } from '@/components/bike'
import { Chip } from '@/components/chip'
import { ImageLazy } from '@/components/image'
import { BookingAddressMap, BookingPricing } from '@/components/booking'
import { CurrencyCode } from '@/core/config'

import { BreadcrumbsLayout } from '@/components/layout'
import { NotFound } from '@/components/error'

import type { BikeRentDetails } from '@/core/api/modules/typings/bike'
// import { bike } from '@/core/api'

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
    NotFound,
    ImageLazy
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
    isBookmarked: false,
    // STEP_1: Create a date object to hold the start and end dates
    date: {
      start: '2024-01-13',
      end: '2024-01-16'
    },
    loading: false,
    rentCompleted: false,
    // TO_REMOVE: These are mock dates to be used during the development
    mockDates: {
      one: {
        start: '2024-01-13',
        end: '2024-01-16'
      },
      two: {
        start: '2024-02-10',
        end: '2024-02-20'
      }
    }
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
    },
    // STEP_2: Create a computed to hold the bike rent details
    rentDetails(): BikeRentDetails {
      return {
        bikeId: this.id!, // We can use the non-null assertion operator because if the id is null, the rentDetails will not be used by the component
        userId: 603, // TODO: Get this from the API
        dateFrom: this.date.start,
        dateTo: this.date.end
      }
    }
  },
  watch: {
    date() {
      this.loading = true
    }
  },
  async beforeMount() {
    if (!this.data) {
      this.isLoading = true
      await this.fetchBikeList()
      this.isLoading = false
    }
  },
  methods: {
    ...mapActions(useBikeStore, { fetchBikeList: 'fetchList' }),
    async handleAddBooking() {
      this.loading = true

      try {
        // TODO: Remove mock and use the real API - Using mock to avoid hit the API
        // await bike.amount(this.rentDetails)
        await new Promise<void>((resolve) => {
          setTimeout(() => {
            resolve()
          }, 2000)
        })

        this.rentCompleted = true
      } catch (error) {
        //
      } finally {
        this.loading = false
      }
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
            <template v-if="rentCompleted">
              <div class="rent-summary">
                <div>
                  <h3 class="mb-6 text-2xl font-extrabold">Thank you!</h3>
                  <p class="m-0 text-base font-semibold">Your bike is booked.</p>
                </div>
                <div class="mt-6">
                  <image-lazy :src="images[0]" class="rent-summary__img" />
                  <div class="mt-4">
                    <h2 class="text-lg font-bold">{{ data!.name }}</h2>
                    <chip color="secondary" size="sm">{{ data!.type }}</chip>
                  </div>
                </div>
              </div>
            </template>
            <template v-else>
              <h3 class="text-base mb-4">Booking Overview</h3>

              <!-- TO_REMOVE: This is a date change mock - replace with the real calendar -->
              <button @click="date = mockDates.one">Mock three days</button>
              <button @click="date = mockDates.two">Mock ten days</button>

              <div class="divider" />

              <booking-pricing :currency="currency" :details="rentDetails" class="mb-8" @updated="loading = false" />

              <button class="button button--primary w-full py-5" :disabled="loading" @click="handleAddBooking">
                <loading-spinner v-if="loading" />
                <template v-else>Add to booking</template>
              </button>
            </template>
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

.rent-summary {
  padding: 39px 0;
  @apply .text-center;

  &__img {
    width: 185px;
  }
}
</style>
