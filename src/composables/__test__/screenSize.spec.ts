import { describe, expect, it } from 'vitest'

import { useScreenSize } from '@/composables'

describe('useScreenSize', () => {
  it('should return the screen sizes', () => {
    const { currentWidth, screenSize, isMobile } = useScreenSize()

    expect(currentWidth.value).toBe(1024)
    expect(screenSize.value).toBe('lg')
    expect(isMobile.value).toBe(true)
  })
})
