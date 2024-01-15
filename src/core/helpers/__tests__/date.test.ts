import { describe, expect, it } from 'vitest'

import { formatDate, generateDatepickerDays } from '../date'

const baseYear = 2024
const baseMonth = 1
const baseDate = `${baseYear}-${baseMonth}-14`
const datepickerLength = 35

describe('date.js', () => {
  describe('formatDate', () => {
    it('should return the day', () => {
      expect(formatDate(baseDate, 'DD')).equal('14')
    })
    it('should return the month', () => {
      expect(formatDate(baseDate, 'MM')).equal('01')
    })
    it('should return the year', () => {
      expect(formatDate(baseDate, 'YYYY')).equal('2024')
    })
  })

  describe('generateDatepickerDays', () => {
    it('should return an array of the max defined items', () => {
      const dateArray = generateDatepickerDays(baseYear, baseMonth, datepickerLength)
      expect(dateArray).toHaveLength(datepickerLength)
    })
    it('should return the first day as 2023-12-31', () => {
      const dateArray = generateDatepickerDays(baseYear, baseMonth, datepickerLength)
      expect(dateArray[0]).equals('2023-12-31')
    })
    it('should return the last day as 2024-02-03', () => {
      const dateArray = generateDatepickerDays(baseYear, baseMonth, datepickerLength)
      expect(dateArray[datepickerLength - 1]).equals('2024-02-03')
    })
  })
})
