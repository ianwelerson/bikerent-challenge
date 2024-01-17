<script lang="ts">
import { VueElement, defineComponent } from 'vue'

export default defineComponent({
  name: 'SwipeModal',
  props: {
    colorScheme: {
      type: String,
      default: 'white',
      validator: (value: string) => ['primary', 'white'].includes(value)
    },
    topSpacing: {
      type: Number,
      default: 120
    }
  },
  emits: ['close'],
  data: () => ({
    touchstart: 0,
    modalInititalPosition: 0,
    modalElement: null as VueElement | null,
    modalCloseAction: null as VueElement | null
  }),
  mounted() {
    this.modalElement = this.$refs['swipe-modal'] as VueElement
    this.modalCloseAction = this.$refs['swipe-close'] as VueElement

    this.modalCloseAction.addEventListener('touchstart', this.onTouchStart)
    this.modalCloseAction.addEventListener('touchend', this.onTouchEnd)

    this.modalElement.style.marginTop = `${this.topSpacing}px`
  },
  onBeforeUnmount() {
    this.modalCloseAction?.removeEventListener('touchstart', this.onTouchStart)
    this.modalCloseAction?.removeEventListener('touchend', this.onTouchEnd)
  },
  methods: {
    onTouchStart(event: TouchEvent) {
      this.touchstart = event.changedTouches[0].screenY
      this.modalInititalPosition = event.changedTouches[0].clientY
      this.modalCloseAction?.addEventListener('touchmove', this.onTouchMove)
    },
    onTouchEnd(event: TouchEvent) {
      if (this.modalElement) {
        this.modalElement.style.marginTop = `${this.topSpacing}px`
      }

      this.modalCloseAction?.removeEventListener('touchmove', this.onTouchMove)

      if (event.changedTouches[0].screenY - this.touchstart > 100) {
        this.closeModal()
      }
    },
    closeModal() {
      this.$emit('close')
    },
    onTouchMove(event: TouchEvent) {
      const distanceMoved = event.touches[0].clientY - this.modalInititalPosition
      const newMargin = distanceMoved > 0 ? this.topSpacing + distanceMoved : this.topSpacing // Ensure the movement is only to bottom
      if (this.modalElement) {
        this.modalElement.style.marginTop = `${newMargin}px`
      }
    }
  }
})
</script>

<template>
  <div :class="['swipe-modal', `swipe-modal--${colorScheme}`]">
    <div ref="swipe-modal" class="swipe-modal__wrapper">
      <div ref="swipe-close" class="swipe-modal__close"></div>
      <div class="swipe-modal__content">
        <slot />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.swipe-modal {
  overscroll-behavior: none;
  position: fixed;
  left: 0;
  bottom: 0;
  height: 100vh;
  width: 100vw;
  z-index: 100;
  overflow: hidden;

  &::before {
    content: '';
    width: 100%;
    height: 100%;
    position: absolute;
    background: get-theme-color('black');
    opacity: 0.6;
    z-index: -1;
  }

  &__wrapper {
    height: 100%;
    width: 100%;
    border-radius: $border-radius-xl $border-radius-xl 0 0;
    display: flex;
    flex-direction: column;
  }

  &__close {
    padding: 12px 0 17px 0;
    width: 100%;
    align-self: center;
    position: relative;

    &::after {
      content: '';
      border-radius: 4px;
      width: 50px;
      height: 4px;
      position: absolute;
      left: 50%;
      transform: translate(-50%, 0);
      background: #d9d9d9; // Color missing in the varialble list
    }
  }

  &--primary {
    .swipe-modal__wrapper {
      background: get-theme-color('primary');
    }

    .swipe-modal__close {
      &::after {
        background: get-theme-color('white');
      }
    }
  }

  &--white {
    .swipe-modal__wrapper {
      background: get-theme-color('background');
    }

    .swipe-modal__close {
      &::after {
        background: #d9d9d9; // Color missing in the varialble list
      }
    }
  }

  &__content {
    overflow: auto;
    padding-bottom: 120px;
  }
}
</style>
