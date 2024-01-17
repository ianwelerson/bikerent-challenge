import { beforeEach, describe, expect, it, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'

import { mockBikeRentDetails, mockRentAmount } from '@/mocks'
import { CurrencyCode } from '@/core/config'
import { formatCurrency } from '@/core/helpers/currency'

import { BookingPricing } from '@/components/booking'
import { amount } from '@/core/api/modules/bike'
import { nextTick } from 'vue'

const mockProps = { details: mockBikeRentDetails, currency: CurrencyCode.EUR }

vi.mock('@/core/api/modules/bike', () => ({
  amount: vi.fn().mockReturnValue({
    ...mockRentAmount
  })
}))

describe('BookingPricing', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders correctly', () => {
    const wrapper = mount(BookingPricing, { props: { ...mockProps } })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should show the correct booking values', async () => {
    const wrapper = mount(BookingPricing, { props: { ...mockProps } })

    await flushPromises()

    expect(wrapper.text()).toContain(formatCurrency(mockRentAmount.fee, CurrencyCode.EUR))
  })

  it('should call the API after prop booking details update', async () => {
    const wrapper = mount(BookingPricing, { props: { ...mockProps } })

    await nextTick()
    expect(amount).toHaveBeenCalledTimes(1)

    wrapper.setProps({
      details: {
        userId: 1,
        bikeId: 999,
        dateFrom: '2024-01-01',
        dateTo: '2024-01-10'
      }
    })

    await nextTick()
    expect(amount).toHaveBeenCalledTimes(2)
  })
})
