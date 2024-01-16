<script lang="ts">
import { useBikeStore, mapActions, mapState } from '@/core/store'
import { defineComponent } from 'vue'

import { API_USER_ID, CurrencyCode } from '@/core/config'

import { useScreenSize } from '@/composables'

import { LoadingSpinner } from '@/components/loading'
import { BikeImageSelector, BikeSpecs, type BikeSpecsProps, BikePrice, BikeBookmark } from '@/components/bike'
import { Chip } from '@/components/chip'
import { ImageLazy } from '@/components/image'

import { BreadcrumbsLayout } from '@/components/layout'
import { NotFound } from '@/components/error'

import { DatepickerInput } from '@/components/datepicker'
import { SwipeModal } from '@/components/swipeModal'
import { BookingOverview, BookingSuccess, BookingAddressMap } from '@/components/booking'

import type { BikeRentDetails } from '@/core/api/modules/typings/bike'

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
    BikeBookmark,
    NotFound,
    ImageLazy,
    DatepickerInput,
    SwipeModal,
    BookingOverview,
    BookingSuccess
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
    date: {
      start: new Date().toISOString().split('T')[0],
      end: new Date().toISOString().split('T')[0]
    },
    rentCompleted: false,
    screenSize: useScreenSize()
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
    rentDetails(): BikeRentDetails {
      return {
        bikeId: this.id!, // We can use the non-null assertion operator because if the id is null, the rentDetails will not be used by the component
        userId: API_USER_ID, // TODO: Get this from the API when we have the login screen implemented
        dateFrom: this.date.start,
        dateTo: this.date.end
      }
    },
    contentWrapperComponent() {
      return this.screenSize.isMobile ? 'swipe-modal' : 'div'
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
    backHome() {
      this.$router.push({ name: 'home' })
    },
    bookedHandle() {
      this.rentCompleted = true
    }
  }
})
</script>

<template>
  <div v-if="hasData && !screenSize.isMobile" class="absolute top-0 left-0 pl-2">
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
      <component :is="contentWrapperComponent" color-scheme="white" @close="backHome">
        <div class="grid gap-x-6 grid-cols-1">
          <div>
            <div :class="['p-8', { card: !screenSize.isMobile }]">
              <bike-image-selector :images="images" class="mb-8" />

              <div :class="['bike-details', { 'bike-details--mobile': screenSize.isMobile }]">
                <bike-specs :specs="specs" />

                <div v-if="!screenSize.isMobile" class="divider" />

                <article class="bike-details__descrtiption relative">
                  <div class="flex">
                    <div>
                      <h2 class="font-extrabold text-2xl mb-1 lg:mb-0 lg:text-4xl">{{ data!.name }}</h2>
                      <chip color="secondary" size="sm">{{ data!.type }}</chip>
                    </div>

                    <div v-if="!screenSize.isMobile" class="ml-auto">
                      <bike-bookmark v-model:active="isBookmarked" :width="60" size="2xl" outlined />
                    </div>
                  </div>

                  <p>{{ data!.description }}</p>
                </article>

                <section class="bike-details__pricing relative">
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

                <div class="bike-details__location w-full relative">
                  <h4 class="text-base lg:text-2xl font-extrabold mb-4">Full adress after booking</h4>
                  <booking-address-map :address="mockAddress" />
                </div>
              </div>
            </div>
          </div>

          <div v-if="screenSize.isMobile" class="rent-action">
            <div class="rent-action__content">
              <bike-bookmark v-model:active="isBookmarked" :width="60" size="2xl" outlined />
              <router-link :to="{ name: 'booking', params: { id } }" class="button button--secondary w-full py-5 ml-2"
                >Rent Bike</router-link
              >
            </div>
          </div>

          <div v-if="!screenSize.isMobile">
            <div class="card p-8">
              <booking-success v-if="rentCompleted" :thumb="images[0]" :name="data!.name" :type="data!.type" />
              <div v-else>
                <section class="">
                  <h3 class="text-2xl font-extrabold mb-2">Select date and time</h3>

                  <div class="">
                    <datepicker-input v-model="date" />
                  </div>
                </section>

                <section class="mt-5">
                  <booking-overview :rent-details="rentDetails" @booked="bookedHandle" />
                </section>
              </div>
            </div>
          </div>
        </div>
      </component>
    </template>
  </div>
</template>

<style lang="scss" scoped>
.page--details {
  position: relative;

  .grid {
    @include breakpoint('xl') {
      grid-template-columns: minmax(400px, 67%) 1fr;
    }
  }
}

.rent-action {
  position: fixed;
  bottom: 0;
  width: 100%;
  background-color: get-theme-color('primary');

  @apply .p-6;

  &__content {
    color: white;
    display: flex;
    justify-content: space-between;
  }
}

.bike-details {
  @include max-breakpoint('xl') {
    &--mobile {
      position: relative;

      @apply .pb-22;

      &::before {
        content: '';
        width: 100vw;
        height: 100%;
        background-color: get-theme-color('primary');
        position: absolute;
        left: -2rem;
        bottom: -2rem;
        border-radius: $border-radius-lg $border-radius-lg 0 0;
        z-index: 0;
      }
    }

    &__descrtiption {
      @apply .mt-3;
    }

    &__pricing,
    &__descrtiption,
    &__location {
      color: get-theme-color('white');
    }
  }
}
</style>
