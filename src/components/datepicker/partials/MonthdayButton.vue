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
    },
    allowPast: {
      type: Boolean,
      required: true
    }
  },
  emits: ['select'],
  computed: {
    isPastDate(): boolean {
      const today = new Date()

      return this.dateParse(this.day) < today
    },
    disablePastDate(): boolean {
      return !this.allowPast && this.isPastDate
    },
    classList(): string[] {
      const classList: string[] = []
      const buttonDate = this.dateParse(this.day)

      // --- Base Classes

      // Different month
      if (buttonDate.getMonth() + 1 !== Number(this.currentMonth)) {
        classList.push('monthday--diff-month')
      }

      // Past date
      if (this.disablePastDate) {
        classList.push('monthday--disabled')
      }

      // Return base classes if there's no start and end
      if (!this.selected.start && !this.selected.end) {
        return classList
      }

      // --- Interaction classes

      const selectedStart = this.selected.start ? this.dateParse(this.selected.start) : null
      const selectedDate = this.selected.end ? this.dateParse(this.selected.end) : null
      const isStartDate = selectedStart && buttonDate.getTime() === selectedStart.getTime()
      const isBetween =
        selectedStart &&
        buttonDate.getTime() > selectedStart.getTime() &&
        selectedDate &&
        buttonDate.getTime() < selectedDate.getTime()
      const isEndDate = selectedDate && buttonDate.getTime() === selectedDate.getTime()

      // Start date - base
      if (isStartDate) {
        classList.push('monthday--start')
      }

      // Start date - only start selected
      if (isStartDate && !this.selected.end) {
        classList.push('monthday--start-only')
      }

      // End date
      if (isEndDate) {
        classList.push('monthday--end')
      }

      // Between dates
      if (isBetween) {
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
  <button :class="['monthday', classList]" :disabled="disablePastDate" @click="selectDay">
    <span class="monthday__label">{{ formatDate(day, 'DD') }}</span>
  </button>
</template>

<style scoped lang="scss">
.monthday {
  width: calc(100% / 7);
  aspect-ratio: 1 / 1;
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

  &--between#{&}--diff-month {
    .monthday__label {
      opacity: 0.4;
    }
  }
}
</style>
