import { describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'

import { DatepickerInput, type SelectedDates } from '@/components/datepicker'
import { mount } from '@vue/test-utils'

const FAKE_START_DATE = '2024-01-16'
const FAKE_END_DATE = '2024-01-20'

vi.useFakeTimers().setSystemTime(new Date(FAKE_START_DATE))

const selectedDate: SelectedDates = {
  start: FAKE_START_DATE,
  end: FAKE_END_DATE
}

vi.mock('@/composables/screenSize', () => ({
  useScreenSize: vi
    .fn()
    .mockReturnValueOnce({
      isMobile: true
    })
    .mockReturnValueOnce({
      isMobile: false
    })
    .mockReturnValueOnce({
      isMobile: false
    })
    .mockReturnValueOnce({
      isMobile: false
    })
    .mockReturnValueOnce({
      isMobile: false
    })
    .mockReturnValue({
      isMobile: true
    })
}))

describe('DatepickerInput', () => {
  it('renders correctly', async () => {
    const wrapper = mount(DatepickerInput, { props: { modelValue: { ...selectedDate } } })

    await nextTick()

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should have the default dates selected', async () => {
    const wrapper = mount(DatepickerInput, { props: { modelValue: { ...selectedDate } } })

    await nextTick()

    expect(wrapper.find('.monthday--start').text()).equals(FAKE_START_DATE.split('-')[2])
    expect(wrapper.findAll('.monthday--between')).toHaveLength(3)
    expect(wrapper.find('.monthday--end').text()).equals(FAKE_END_DATE.split('-')[2])
  })

  it('should have disabled dates based on the current day', async () => {
    const wrapper = mount(DatepickerInput, { props: { modelValue: { ...selectedDate } } })

    await nextTick()

    expect(wrapper.findAll('.monthday--disabled')).toHaveLength(15)
  })

  it('should be able to navigate to the next month', async () => {
    const wrapper = mount(DatepickerInput, { props: { modelValue: { ...selectedDate } } })

    await nextTick()

    expect(wrapper.find('.current-month__label').text()).toBe('January')

    await wrapper.find('.navigation__button:not(.navigation__button--disabled)').trigger('click')

    expect(wrapper.find('.current-month__label').text()).toBe('February')
  })

  it('should be able to select dates and receive the event', async () => {
    const wrapper = mount(DatepickerInput, { props: { modelValue: { ...selectedDate } } })

    await nextTick()

    const availableDates = wrapper.findAll(
      '.monthday:not(.monthday--diff-month,.monthday--between,.monthday--start,.monthday--end,.monthday--disabled)'
    )
    const startButton = availableDates[availableDates.length - 4]
    const endButton = availableDates[availableDates.length - 1]

    await startButton.trigger('click')
    await endButton.trigger('click')

    expect(wrapper.find('.monthday--start').text()).equals('28')
    expect(wrapper.find('.monthday--end').text()).equals('31')

    expect((wrapper.emitted()['update:modelValue'][1] as SelectedDates[])[0]).toMatchObject({
      start: '2024-01-28',
      end: '2024-01-31'
    })
  })

  it('should be able to select dates and trigger the emit when is mobile', async () => {
    const wrapper = mount(DatepickerInput, { props: { modelValue: { ...selectedDate } } })

    await nextTick()

    const availableDates = wrapper.findAll(
      '.monthday:not(.monthday--diff-month,.monthday--between,.monthday--start,.monthday--end,.monthday--disabled)'
    )
    const startButton = availableDates[availableDates.length - 4]
    const endButton = availableDates[availableDates.length - 1]

    await startButton.trigger('click')
    await endButton.trigger('click')

    await wrapper.find('button.button--secondary').trigger('click')

    expect((wrapper.emitted()['update:modelValue'][0] as SelectedDates[])[0]).toMatchObject({
      start: '2024-01-28',
      end: '2024-01-31'
    })
  })
})
