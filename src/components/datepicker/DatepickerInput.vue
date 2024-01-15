<script lang="ts">
import { defineComponent } from 'vue'
import type { PropType } from 'vue'

import type { SelectedDates } from './types'

import { generateDatepickerDays } from '@/core/helpers/date'

import { Icon } from '@/components/icon'
import { MonthdayButton } from '@/components/datepicker/partials'

export default defineComponent({
  name: 'DatepickerInput',
  components: {
    Icon,
    MonthdayButton
  },
  props: {
    modelValue: {
      type: Object as PropType<SelectedDates>,
      required: true
    },
    allowSingleDay: {
      type: Boolean,
      default: true
    },
    allowPastDate: {
      type: Boolean,
      default: false
    }
  },
  emits: ['update:modelValue'],
  data: () => ({
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    selected: {
      start: null,
      end: null
    } as SelectedDates
  }),
  computed: {
    days() {
      return generateDatepickerDays(this.year, this.month, 35)
    },
    monthName() {
      return new Date(this.year, this.month, 0).toLocaleString('en-US', { month: 'long' })
    },
    disablePrevAction(): boolean {
      if (this.allowPastDate) {
        return false
      }

      return this.month <= new Date().getMonth() + 1
    }
  },
  watch: {
    selected: {
      handler(newDates) {
        if (!!newDates.start && !!newDates.end) {
          this.$emit('update:modelValue', Object.assign({}, newDates))
        }
      },
      deep: true
    }
  },
  mounted() {
    this.selected = this.modelValue
  },
  methods: {
    navigate(direction: 'PREV' | 'NEXT') {
      if (direction === 'PREV') {
        this.year = this.month === 1 ? this.year - 1 : this.year
        this.month = this.month > 1 ? this.month - 1 : 12
        return
      }

      this.year = this.month === 12 ? this.year + 1 : this.year
      this.month = this.month < 12 ? this.month + 1 : 1
    },
    setDate(date: string) {
      // Set start date
      if (!this.selected.start || !!this.selected.end) {
        this.selected.start = date
        this.selected.end = null
        return
      }

      // Switch dates if the end date is before the start
      if (date < this.selected.start) {
        this.selected.end = this.selected.start
        this.selected.start = date
        return
      }

      // Single day
      if (!this.allowSingleDay && date === this.selected.start) {
        return
      }

      this.selected.end = date
    }
  }
})
</script>

<template>
  <div class="datepicker">
    <div class="datepicker__wrapper">
      <div class="datepicker__header">
        <div class="current-month">
          <h3 class="current-month__label">{{ monthName }}</h3>
          <p class="current-month__year">{{ year }}</p>
        </div>
        <div class="navigation">
          <button
            :class="['navigation__button', { 'navigation__button--disabled': disablePrevAction }]"
            :disabled="disablePrevAction"
            @click="navigate('PREV')"
          >
            <div class="navigation__icon">
              <icon type="solid" size="2xl">chevron-left</icon>
            </div>
          </button>
          <button class="navigation__button" @click="navigate('NEXT')">
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
            <monthday-button
              v-for="day in days"
              :key="day"
              :current-month="month"
              :day="day"
              :selected="selected"
              @select="setDate"
            />
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
    cursor: pointer;

    &--disabled {
      opacity: 0.5;
      cursor: not-allowed;
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
</style>
