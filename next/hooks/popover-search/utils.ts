import { SearchDto } from '@/orval/generated/models'
import { GetInputFn } from './types'

export const computeHasValues = (
  searchState: SearchDto[],
  getInput: GetInputFn,
): boolean => {
  return searchState.some(({ columns, table }) => {
    return columns.some(({ name, payload }) => {
      const isDropdown = getInput({ table, name }).type === 'dropdown'

      const { value, exact } = payload

      if (value !== '' || (!isDropdown && exact)) return true

      return false
    })
  })
}

export const filterEmpty = (
  searchState: SearchDto[],
): SearchDto[] | undefined => {
  const filtered = searchState
    .map(({ columns, table }) => {
      // Filter out columns with falsey values
      const filteredColumns = columns.filter(({ payload }) => !!payload.value)

      // Return the table only if it has valid columns
      if (filteredColumns.length > 0) {
        return {
          table,
          columns: filteredColumns,
        }
      }
      return null // Exclude this table if it has no valid columns
    })
    .filter((table): table is SearchDto => table !== null) // Remove null values from the array

  return filtered.length > 0 ? filtered : undefined
}
