<script lang="ts">
import { defineComponent } from 'vue'

import { useScreenSize } from '@/composables'

import { Icon } from '@/components/icon'

export default defineComponent({
  name: 'HeaderLayout',
  components: {
    Icon
  },
  props: {
    isHome: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      screenSize: useScreenSize()
    }
  },
  computed: {
    btnColorClass() {
      if (!this.screenSize.isMobile) {
        return 'button--primary'
      }

      return this.isHome ? 'button--primary' : 'button--secondary'
    }
  }
})
</script>

<template>
  <header :class="['header container mx-auto', { 'header--home': isHome, 'header--mobile': screenSize.isMobile }]">
    <div class="header__content mx-auto md:px-24 py-10">
      <div class="container mx-auto">
        <div class="header__wrapper">
          <h1 v-if="!(screenSize.isMobile && !isHome)" class="header__title mr-auto xl:my-0 text-3xl font-extrabold">
            <router-link :to="{ name: 'home' }">Bike Rental</router-link>
          </h1>

          <div class="navigation ml-auto">
            <router-link :to="{ name: 'home' }" :class="['navigation__menu-button button button--text', btnColorClass]">
              <icon type="solid" size="2xl">bars</icon>
            </router-link>
            <nav class="menu">
              <menu class="menu menu--inline">
                <li>
                  <a href="#" :class="['button button--text font-semibold', btnColorClass]"
                    >Manhattan <icon type="solid" size="lg">location-dot</icon></a
                  >
                </li>
                <li>
                  <a href="#" :class="['button button--text font-semibold menu__desktop-only', btnColorClass]"
                    >Log in</a
                  >
                </li>
                <li><a href="#" class="button button--secondary font-semibold menu__desktop-only">Sign up</a></li>
              </menu>
            </nav>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<style lang="scss" scoped>
.header {
  position: relative;

  &__wrapper {
    display: flex;
    align-items: center;

    @include max-breakpoint('xl') {
      flex-direction: column-reverse;
      justify-content: flex-end;
    }
  }

  &__title {
    @apply .px-6;

    @include breakpoint('xl') {
      @apply .text-5xl, .px-0;
    }
  }
}

.navigation {
  @include max-breakpoint('xl') {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  &__menu-button {
    @include breakpoint('xl') {
      display: none;
    }
  }
}

.menu {
  &--inline {
    @include max-breakpoint('xl') {
      display: flex;
      flex-direction: row-reverse;
    }
  }

  &__desktop-only {
    display: none;

    @include breakpoint('xl') {
      display: flex;
    }
  }
}
</style>
