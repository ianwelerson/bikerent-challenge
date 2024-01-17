import { describe, expect, it } from 'vitest'

import { SwipeModal } from '@/components/swipeModal'
import { mount } from '@vue/test-utils'

describe('SwipeModal', () => {
  it('renders correctly', () => {
    const wrapper = mount(SwipeModal)

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should render the slot content', () => {
    const wrapper = mount(SwipeModal, {
      slots: {
        default: 'My Content'
      }
    })

    expect(wrapper.text()).equal('My Content')
  })
})
