// mouse.js
import { ref, onMounted, onUnmounted, computed } from 'vue'
import type { Ref } from 'vue'

export function useScreenSize() {
  const currentWidth: Ref<number> = ref(window.innerWidth)

  function onResize() {
    currentWidth.value = window.innerWidth
  }

  const screenSize = computed<string>(() => {
    // Sizes based on CSS variables
    const sizes = [
      { size: 'sm', threshold: 640 },
      { size: 'md', threshold: 768 },
      { size: 'lg', threshold: 1024 },
      { size: 'xl', threshold: 1280 },
      { size: 'xxl', threshold: 1440 }
    ]

    const matchedSize = sizes.reverse().find((sizeObj) => currentWidth.value >= sizeObj.threshold)

    return matchedSize ? matchedSize.size : 'sm'
  })

  const isMobile = computed<boolean>(() => {
    return currentWidth.value <= 1280
  })

  onMounted(() => window.addEventListener('resize', onResize))
  onUnmounted(() => window.removeEventListener('resize', onResize))

  return { currentWidth, screenSize, isMobile }
}
