import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'

import { mockBikeRentDetails } from '@/mocks'
import { CurrencyCode } from '@/core/config'

import { BookingPricing } from '@/components/booking'

const mockProps = { details: mockBikeRentDetails, currency: CurrencyCode.EUR }

describe('BookingPricing', () => {
  it('renders correctly', () => {
    const wrapper = mount(BookingPricing, { props: { ...mockProps } })

    expect(wrapper.html()).toMatchSnapshot()
  })
})
