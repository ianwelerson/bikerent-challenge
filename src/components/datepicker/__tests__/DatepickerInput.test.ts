import { describe, expect, it } from 'vitest'
import { nextTick } from 'vue'

import { DatepickerInput, type SelectedDates } from '@/components/datepicker'
import { mount } from '@vue/test-utils'

import { formatDate } from '@/core/helpers/date'

const startDate = new Date()
const endDate = new Date()
endDate.setDate(endDate.getDate() + 5)

const selectedDate: SelectedDates = {
  start: startDate.toISOString().split('T')[0],
  end: endDate.toISOString().split('T')[0]
}

describe('DatepickerInput', () => {
  it('renders correctly', async () => {
    const wrapper = mount(DatepickerInput, { props: { modelValue: { ...selectedDate } } })

    await nextTick()

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should have the default dates selected', async () => {
    const wrapper = mount(DatepickerInput, { props: { modelValue: { ...selectedDate } } })

    await nextTick()

    expect(wrapper.find('.monthday--start').text()).equals(formatDate(selectedDate.start!, 'DD'))
    expect(wrapper.findAll('.monthday--between')).toHaveLength(4)
    expect(wrapper.find('.monthday--end').text()).equals(formatDate(selectedDate.end!, 'DD'))
  })

  it('should have disabled dates based on the current day', async () => {
    const wrapper = mount(DatepickerInput, { props: { modelValue: { ...selectedDate } } })

    await nextTick()

    expect(wrapper.findAll('.monthday--disabled')).toHaveLength(Number(formatDate(selectedDate.start!, 'DD')) - 1)
  })

  it('should be able to navigate to the next month', async () => {
    const wrapper = mount(DatepickerInput, { props: { modelValue: { ...selectedDate } } })
    const currentMonth = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0).toLocaleString('en-US', {
      month: 'long'
    })
    const nextMonth = new Date(startDate.getFullYear(), startDate.getMonth() + 2, 0).toLocaleString('en-US', {
      month: 'long'
    })

    await nextTick()

    expect(wrapper.find('.current-month__label').text()).toBe(currentMonth)

    await wrapper.find('.navigation__button:not(.navigation__button--disabled)').trigger('click')

    expect(wrapper.find('.current-month__label').text()).toBe(nextMonth)
  })

  it('should be able to select dates and receive the event', async () => {
    const wrapper = mount(DatepickerInput, { props: { modelValue: { ...selectedDate } } })

    await nextTick()

    const availableDates = wrapper.findAll(
      '.monthday:not(.monthday--diff-month,.monthday--between,.monthday--start,.monthday--end,.monthday--disabled)'
    )
    const startButton = availableDates[availableDates.length - 4]
    const endButton = availableDates[availableDates.length - 1]

    startButton.trigger('click')
    endButton.trigger('click')

    await nextTick()

    expect(wrapper.find('.monthday--start').text()).equals(startButton.text())
    expect(wrapper.find('.monthday--end').text()).equals(endButton.text())

    expect(wrapper.props('modelValue')).toMatchObject({
      start: new Date(startDate.getFullYear(), startDate.getMonth(), Number(startButton.text()))
        .toISOString()
        .split('T')[0],
      end: new Date(startDate.getFullYear(), startDate.getMonth(), Number(endButton.text())).toISOString().split('T')[0]
    })
  })
})
