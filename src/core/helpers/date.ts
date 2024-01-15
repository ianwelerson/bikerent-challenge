/**
 *
 * @param {string} dateString YYYY-MM-DD date
 * @param {part} part The part you want to retrieve, it can be YYYY, MM or DD
 * @returns {string} required part
 */
export function formatDate(dateString: string, part: 'YYYY' | 'MM' | 'DD'): string | null {
  const dateArray = new Date(dateString).toISOString().substring(0, 10).split('-')

  switch (part) {
    case 'YYYY':
      return dateArray[0]
    case 'MM':
      return dateArray[1]
    case 'DD':
      return dateArray[2]
  }
}

/**
 *
 * @param {number} year the year
 * @param {number} month the month number from 1 to 12
 * @param {number} length the length of the array
 * @returns {string[]} array of dates
 */
export function generateDatepickerDays(year: number, month: number, length: number): string[] {
  const days = []

  const normalizedMonth = month - 1 // Zero based
  const currentMonthStart = new Date(year, normalizedMonth, 1)
  const currentMonthEnd = new Date(year, normalizedMonth + 1, 0)

  const currentStartWeekday = currentMonthStart.getDay()
  const currentEndWeekday = currentMonthEnd.getDay()

  // Previous month
  for (let i = currentStartWeekday - 1; i >= 0; i--) {
    days.push(new Date(year, month - 1, -i).toISOString().split('T')[0])
  }

  // Current
  for (let i = 1; i <= currentMonthEnd.getDate(); i++) {
    days.push(new Date(year, normalizedMonth, i).toISOString().split('T')[0])
  }

  // Next month
  for (let i = 0; i < 6 - currentEndWeekday; i++) {
    days.push(new Date(year, month, i + 1).toISOString().split('T')[0])
  }

  /**
   * The slice ensure the correct size to match with the Figma layout
   * where we have seven columns and five rows.
   * But this introduce a UX problem: for some months we need to have six rows
   */
  return days.slice(0, length)
}
