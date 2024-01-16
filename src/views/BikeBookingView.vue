<script lang="ts">
import { defineComponent } from 'vue'
import { useBikeStore, mapState, mapActions } from '@/core/store'

import { API_USER_ID, CurrencyCode } from '@/core/config'

import type { BikeRentDetails } from '@/core/api/modules/typings/bike'

import { useScreenSize } from '@/composables'

import { Icon } from '@/components/icon'
import { BookingOverview, BookingSuccess } from '@/components/booking'
import { SwipeModal } from '@/components/swipeModal'
import { DatepickerInput } from '@/components/datepicker'
import { ImageLazy } from '@/components/image'
import { Chip } from '@/components/chip'
import { BikePrice } from '@/components/bike'
import { LoadingSpinner } from '@/components/loading'

export default defineComponent({
  name: 'BikeBookingView',
  components: {
    Icon,
    BookingOverview,
    SwipeModal,
    DatepickerInput,
    ImageLazy,
    Chip,
    BikePrice,
    LoadingSpinner,
    BookingSuccess
  },
  data: () => ({
    currency: CurrencyCode.EUR,
    date: {
      start: new Date().toISOString().split('T')[0],
      end: new Date().toISOString().split('T')[0]
    },
    calendarVisible: false,
    isDataLoading: false,
    showSuccessModal: false,
    isMobile: useScreenSize().isMobile
  }),
  computed: {
    ...mapState(useBikeStore, ['getBikeById']),
    id(): number | null {
      const { id } = this.$route.params || {}

      return Number(id) || null
    },
    data() {
      return (this.id && this.getBikeById(this.id)) || null
    },
    images(): string[] {
      return this.data?.imageUrls || []
    },
    rentDetails(): BikeRentDetails {
      return {
        bikeId: this.id!, // We can use the non-null assertion operator because if the id is null, the rentDetails will not be used by the component
        userId: API_USER_ID, // TODO: Get this from the API when we have the login screen implemented
        dateFrom: this.date.start,
        dateTo: this.date.end
      }
    },
    monthText() {
      const { start, end } = this.date

      const formatDate = (dateString: string) => {
        const [year, month, day] = dateString.split('-')
        const formattedMonth = new Date(Number(year), Number(month), 0).toLocaleString('en-US', { month: 'long' })
        return `${formattedMonth}/${day}`
      }

      const formattedStart = formatDate(start)
      const formattedEnd = formatDate(end)

      return `From ${formattedStart} to ${formattedEnd}`
    }
  },
  watch: {
    date() {
      this.toggleCalendar()
    },
    isMobile(value) {
      if (!value) {
        this.redirectToDetails()
      }
    }
  },
  mounted() {
    if (!this.isMobile) {
      this.redirectToDetails()
    }
  },
  async beforeMount() {
    if (!this.data) {
      this.isDataLoading = true
      await this.fetchBikeList()
      this.isDataLoading = false
    }
  },
  methods: {
    ...mapActions(useBikeStore, { fetchBikeList: 'fetchList' }),
    bookedHandle() {
      this.showSuccessModal = true
    },
    toggleCalendar() {
      this.calendarVisible = !this.calendarVisible
    },
    redirectToDetails() {
      this.$router.push({ name: 'details', params: { id: this.id } })
    }
  }
})
</script>

<template>
  <div class="bike-booking">
    <template v-if="isDataLoading">
      <div class="text-center my-32">
        <loading-spinner />
      </div>
    </template>

    <div v-else class="bike-booking__wrapper">
      <div class="bike-booking__header">
        <router-link :to="{ name: 'details', params: { id } }" class="back-button">
          <div class="back-button__icon">
            <icon type="solid" size="2xl">chevron-left</icon>
          </div>
        </router-link>
        <h1 class="text-3xl ml-6 font-extrabold">Booking</h1>
      </div>
      <div class="bike-booking__content">
        <div class="mt-6 bike-summary">
          <image-lazy :src="images[0]" class="bike-summary__img" />
          <div class="bike-summary__data">
            <h2 class="text-lg font-bold">{{ data!.name }}</h2>
            <chip color="secondary" size="sm" class="mt-1">{{ data!.type }}</chip>
            <bike-price :price="data!.rate" :currency="currency" rate="daily" class="mt-1" />
          </div>
        </div>
        <div class="mt-6">
          <h3 class="text-2xl font-extrabold">Select date and time</h3>
          <button class="calendar-button" @click="toggleCalendar">
            <icon type="solid" size="xl" class="calendar-button__icon">calendar-days</icon>
            <span class="ml-2">{{ monthText }}</span>
          </button>
        </div>
        <div class="mt-6">
          <booking-overview :rent-details="rentDetails" @booked="bookedHandle" />
        </div>
      </div>
    </div>

    <div v-if="calendarVisible">
      <swipe-modal :top-spacing="240" color-scheme="primary" @close="toggleCalendar">
        <datepicker-input v-model="date" />
      </swipe-modal>
    </div>
    <div v-if="showSuccessModal" class="success-modal">
      <div class="success-modal__content">
        <booking-success :thumb="images[0]" :name="data!.name" :type="data!.type" show-redirect />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.bike-booking {
  &__wrapper {
  }

  &__header {
    display: flex;
    align-items: center;
  }
}

.back-button {
  @apply .p-3;

  outline: none;
  background: transparent;
  border: 1px solid get-theme-color('gray');
  border-radius: $border-radius-lg;
  cursor: pointer;
  width: 52px;
  height: 52px;
  display: flex;
  justify-content: center;
  align-items: center;

  &__icon {
    color: get-theme-color('black');
  }
}

.calendar-button {
  width: 100%;
  background: transparent;
  border-radius: $border-radius-lg;
  border: 1px solid get-theme-color('gray');
  cursor: pointer;
  text-align: left;

  @apply .p-4, .text-base, .mt-4;

  &__icon {
    color: get-theme-color('primary');
  }
}

.bike-summary {
  width: 100%;
  background: transparent;
  border-radius: $border-radius-lg;
  border: 1px solid get-theme-color('gray');
  display: flex;
  flex-wrap: wrap;
  align-items: center;

  @apply .p-3;

  &__data {
    flex: 1;

    @apply .ml-3;
  }

  &__img {
    flex: 1;
    max-width: 30%;
    object-fit: contain;
  }
}

.success-modal {
  position: fixed;
  z-index: 20;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;

  &__content {
    position: relative;
    background: get-theme-color('background');
    z-index: 40;
    border-radius: $border-radius-lg;

    @apply .px-10;
  }

  &::before {
    content: '';
    width: 100vw;
    height: 100vh;
    background: get-theme-color('black');
    opacity: 0.5;
    position: absolute;
    top: 0;
    left: 0;
  }
}
</style>
