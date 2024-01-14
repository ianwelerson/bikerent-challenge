<script lang="ts">
import { defineComponent } from 'vue'

import { Icon } from '@/components/icon'

export default defineComponent({
  name: 'DatepickerInput',
  components: {
    Icon
  },
  emits: ['update:date'],
  data: () => ({
    month: 'March',
    year: 2022,
    days: [
      '2023-12-31',
      '2024-01-01',
      '2024-01-02',
      '2024-01-03',
      '2024-01-04',
      '2024-01-05',
      '2024-01-06',
      '2024-01-07',
      '2024-01-08',
      '2024-01-09',
      '2024-01-10',
      '2024-01-11',
      '2024-01-12',
      '2024-01-13',
      '2024-01-14',
      '2024-01-15',
      '2024-01-16',
      '2024-01-17',
      '2024-01-18',
      '2024-01-19',
      '2024-01-20',
      '2024-01-21',
      '2024-01-22',
      '2024-01-23',
      '2024-01-24',
      '2024-01-25',
      '2024-01-26',
      '2024-01-27',
      '2024-01-28',
      '2024-01-29',
      '2024-01-30',
      '2024-01-31',
      '2024-02-01',
      '2024-02-02',
      '2024-02-03'
    ],
    allowPrev: false,
    allowNext: true,
    date: {
      start: null as string | null,
      end: null as string | null
    }
  }),
  watch: {
    date: {
      handler(newDates) {
        if (!!newDates.start && !!newDates.end) {
          this.$emit('update:date', Object.assign({}, newDates))
        }
      },
      deep: true
    }
  },
  methods: {
    navigate(direction: 'PREV' | 'NEXT') {
      /* eslint-disable no-console */
      console.log(direction)
    },
    setDate(date: string) {
      // Set start date
      if (!this.date.start || !!this.date.end) {
        this.date.start = date
        this.date.end = null
        return
      }

      // Switch dates if the end date is before the start
      if (date < this.date.start) {
        this.date.end = this.date.start
        this.date.start = date
        return
      }

      // Clear dates
      if (!this.date.end && date === this.date.start) {
        this.date.end = null
        this.date.start = null
        return
      }

      this.date.end = date
    },
    monthdayClassList(dateString: string): string[] {
      const classList: string[] = []
      const date = new Date(dateString)

      if (!this.date.start && !this.date.end) {
        return classList
      }

      const startDate = this.date.start ? new Date(this.date.start) : null
      const endDate = this.date.end ? new Date(this.date.end) : null

      // Start date
      if (startDate && date.getTime() === startDate.getTime()) {
        classList.push('monthday--start')
      }

      // Start date - remove light bg
      if (this.date.start && !this.date.end) {
        classList.push('monthday--start-no-bg')
      }

      // End date
      if (endDate && date.getTime() === endDate.getTime()) {
        classList.push('monthday--end')
      }

      // Between dates
      if (startDate && endDate && date >= startDate && date <= endDate) {
        classList.push('monthday--between')
      }

      return classList
    },
    formatDay(dateString: string) {
      return dateString.split('-')[2]
    }
  }
})
</script>

<template>
  <div class="datepicker">
    <div class="datepicker__wrapper">
      <div class="datepicker__header">
        <div class="current-month">
          <h3 class="current-month__label">{{ month }}</h3>
          <p class="current-month__year">{{ year }}</p>
        </div>
        <div class="navigation">
          <button
            :class="['navigation__button', { 'navigation__button--allowed': allowPrev }]"
            :disabled="!allowPrev"
            @click="navigate('PREV')"
          >
            <div class="navigation__icon">
              <icon type="solid" size="2xl">chevron-left</icon>
            </div>
          </button>
          <button
            :class="['navigation__button', { 'navigation__button--allowed': allowNext }]"
            :disabled="!allowNext"
            @click="navigate('NEXT')"
          >
            <div class="navigation__icon">
              <icon type="solid" size="2xl">chevron-right</icon>
            </div>
          </button>
        </div>
      </div>
      <div class="datepicker__calendar">
        <div class="calendar">
          <div class="calendar__header">
            <div class="weekday">
              <p class="weekday__label">Su</p>
            </div>
            <div class="weekday">
              <p class="weekday__label">Mo</p>
            </div>
            <div class="weekday">
              <p class="weekday__label">Tu</p>
            </div>
            <div class="weekday">
              <p class="weekday__label">We</p>
            </div>
            <div class="weekday">
              <p class="weekday__label">Th</p>
            </div>
            <div class="weekday">
              <p class="weekday__label">Fr</p>
            </div>
            <div class="weekday">
              <p class="weekday__label">Sa</p>
            </div>
          </div>
          <div class="calendar__days">
            <button v-for="day in days" :key="day" :class="['monthday', monthdayClassList(day)]" @click="setDate(day)">
              <span class="monthday__label">{{ formatDay(day) }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.datepicker {
  background-color: get-theme-color('primary');
  color: get-theme-color('white');
  border-radius: $border-radius-xl;

  &__wrapper {
    @apply .pt-6, .px-6, .pb-10;
  }

  &__header {
    display: flex;
    justify-content: space-between;
  }

  &__calendar {
    @apply .mt-10;
  }
}

.current-month {
  &__label {
    @apply .font-extrabold, .text-2xl;
  }

  &__year {
    @apply .m-0, .font-semibold, .text-base;

    opacity: 0.5;
  }
}

.navigation {
  &__button {
    @apply .p-3;

    outline: none;
    background: transparent;
    border: 1px solid get-theme-color('white');
    border-radius: $border-radius-lg;
    opacity: 0.5;
    cursor: not-allowed;

    &--allowed {
      cursor: pointer;
      opacity: 1;
    }
  }

  &__button:first-child {
    @apply .mr-2;
  }

  &__icon {
    height: 24px;
    width: 24px;
    color: get-theme-color('white');
  }
}

.calendar {
  &__header {
    display: flex;
  }

  &__days {
    @apply .mt-5;

    margin-left: -10px;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
  }
}

.weekday {
  flex: 1;

  &__label {
    @apply .m-0, .font-bold, .text-base;

    opacity: 0.5;
  }
}

.monthday {
  width: calc(100% / 7);
  height: 40px;
  box-sizing: border-box;
  outline: none;
  background: transparent;
  border: solid 1px transparent;
  color: get-theme-color('white');
  display: flex;
  justify-content: center;
  align-items: center;

  &:not(:nth-last-child(-n + 7)) {
    margin-bottom: 2px;
  }

  &:not(&--disabled) {
    cursor: pointer;
  }

  &:hover:not(.monthday--start, .monthday--end, .monthday--between) {
    border-color: get-theme-color('white');
    border-radius: 100%;
  }

  &--between {
    background: #c1cff24d; // on-primary with 30% of opacity
  }

  &--start,
  &--end {
    background: #c1cff24d; // on-primary with 30% of opacity
    padding: 0;
    border: 0;

    .monthday__label {
      background: get-theme-color('white');
      color: get-theme-color('primary');
      border-radius: 100%;
    }
  }

  &--start {
    border-radius: 100% 0 0 100%;

    &-no-bg {
      background: transparent;
    }
  }

  &--end {
    border-radius: 0 100% 100% 0;
  }

  &__label {
    @apply .font-semibold, .text-base;

    line-height: 1;
    height: 100%;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>
