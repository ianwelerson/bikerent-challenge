import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'

import { mockIntersectionObserver } from '@/core/helpers/tests'
import { mockedBike } from '@/mocks'

import { BookingSuccess } from '@/components/booking'

const BIKE_DATA = {
  thumb: mockedBike.cardImage!,
  name: mockedBike.name,
  type: mockedBike.type
}

describe('BookingSuccess', () => {
  vi.stubGlobal('IntersectionObserver', mockIntersectionObserver)

  it('renders correctly', () => {
    const wrapper = mount(BookingSuccess, {
      props: { ...BIKE_DATA }
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should hide the redirect button when showRedirect is false', () => {
    const wrapper = mount(BookingSuccess, {
      props: { ...BIKE_DATA }
    })

    expect(wrapper.find('.button--primary').exists()).toBeFalsy()
  })

  it('should show the redirect button', async () => {
    const wrapper = mount(BookingSuccess, {
      props: {
        ...BIKE_DATA,
        showRedirect: true
      }
    })

    expect(wrapper.find('.button--primary').exists()).toBeTruthy()
  })
})
