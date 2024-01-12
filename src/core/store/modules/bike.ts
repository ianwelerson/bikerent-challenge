import { bike } from '@/core/api'
import { defineStore } from 'pinia'

export interface BikeStore {
  items: BikeStoreItems
}

export interface BikeStoreItems {
  [key: string]: Bike
}

export default defineStore({
  id: 'bike',
  state: (): BikeStore => ({
    items: {}
  }),
  getters: {
    list(state) {
      return Object.values<Bike>(state.items)
    },
    getBikeById(state) {
      return (id: number) => state.items[id] || null
    }
  },
  actions: {
    /**
     * fetchs list of bikes available
     */
    async fetchList() {
      const result = await bike.list(true)

      result.forEach((i) => {
        this.items = {
          ...this.items,
          [i.id]: i
        }
      })
    }
  }
})
