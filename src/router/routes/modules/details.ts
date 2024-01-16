import type { RouteRecordRaw } from 'vue-router'

export default [
  {
    path: '/details/:id',
    name: 'details',
    component: () => import('@/views/BikeDetailsView.vue')
  },
  {
    path: '/details/:id/booking',
    name: 'booking',
    component: () => import('@/views/BikeBookingView.vue')
  }
] as RouteRecordRaw[]
