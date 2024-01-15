<script lang="ts">
import { defineComponent } from 'vue'
import type { PropType } from 'vue'

import { formatDate } from '@/core/helpers/date'

import type { SelectedDates } from '@/components/datepicker'

export default defineComponent({
  name: 'MonthdayButton',
  props: {
    currentMonth: {
      type: Number,
      required: true
    },
    day: {
      type: String,
      required: true
    },
    selected: {
      type: Object as PropType<SelectedDates>,
      required: true
    }
  },
  emits: ['select'],
  computed: {
    isPastDate() {
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      return this.dateParse(this.day) < today
    },
    classList(): string[] {
      const classList: string[] = []
      const date = this.dateParse(this.day)

      // --- Base Classes

      // Different month
      if (date.getMonth() + 1 !== Number(this.currentMonth)) {
        classList.push('monthday--diff-month')
      }

      // Past date
      if (this.isPastDate) {
        classList.push('monthday--disabled')
      }

      // Do not apply styles if both dates are null
      if (!this.selected.start && !this.selected.end) {
        return classList
      }

      // --- Active classes
      const startDate = this.selected.start ? this.dateParse(this.selected.start) : null
      const endDate = this.selected.end ? this.dateParse(this.selected.end) : null

      // Start date
      if (startDate && date.getTime() === startDate.getTime()) {
        classList.push('monthday--start')

        // Start date - only start selected
        if (this.selected.start && !this.selected.end) {
          classList.push('monthday--start-only')
        }
      }

      // End date
      if (endDate && date.getTime() === endDate.getTime()) {
        classList.push('monthday--end')
      }

      // Between dates
      if (startDate && endDate && date.getTime() > startDate.getTime() && date.getTime() < endDate.getTime()) {
        classList.push('monthday--between')
      }

      return classList
    }
  },
  methods: {
    formatDate,
    selectDay() {
      this.$emit('select', this.day)
    },
    dateParse(date: string): Date {
      const [year, month, day] = date.split('-')
      return new Date(Number(year), Number(month) - 1, Number(day))
    }
  }
})
</script>

<template>
  <button :class="['monthday', classList]" :disabled="isPastDate" @click="selectDay">
    <span class="monthday__label">{{ formatDate(day, 'DD') }}</span>
  </button>
</template>

<style scoped lang="scss">
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

  &:hover:not(.monthday--start, .monthday--end, .monthday--between, &--disabled) {
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

    &-only {
      background: transparent;
    }
  }

  &--end {
    border-radius: 0 100% 100% 0;
  }

  &--start#{&}--end {
    background: transparent;
  }

  &--diff-month:not(&--start, &--end, &--single, &--between) {
    opacity: 0.4;
  }

  &--disabled {
    opacity: 0.4;
    cursor: not-allowed;
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
