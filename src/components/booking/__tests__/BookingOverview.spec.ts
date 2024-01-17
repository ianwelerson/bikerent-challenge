import { beforeEach, describe, expect, it, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'

import { mockBikeRentDetails, mockedBikeReturnDetails } from '@/mocks'

import { BookingOverview } from '@/components/booking'
import { rent } from '@/core/api/modules/bike'

const mockProps = { rentDetails: mockBikeRentDetails }

vi.mock('@/core/api/modules/bike', () => ({
  rent: vi.fn().mockReturnValue({
    ...mockedBikeReturnDetails
  })
}))

describe('BookingOverview', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders correctly', () => {
    const wrapper = mount(BookingOverview, { props: { ...mockProps } })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should be able to rent a bike', async () => {
    const wrapper = mount(BookingOverview, { props: { ...mockProps } })

    await wrapper.find('.button--primary').trigger('click')

    await flushPromises()

    expect(rent).toHaveBeenCalledTimes(1)
    expect(wrapper.emitted().booked).toBeTruthy()
  })
})
