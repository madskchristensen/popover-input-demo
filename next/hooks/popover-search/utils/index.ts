import {
  SearchColumnDto,
  SearchDto,
  SearchPayload,
} from '@/orval/generated/models'
import { SearchIdentifier, SearchInput } from '../core'

type SET_VALUE = SearchIdentifier & {
  action: 'SET_VALUE'
  payload: SearchPayload
}

type RESET_ALL = {
  action: 'RESET_ALL'
}

type RESET_SINGLE = SearchIdentifier & {
  action: 'RESET_SINGLE'
}

export type SEARCH_ACTION = SET_VALUE | RESET_ALL | RESET_SINGLE

type GetInputFn = (id: SearchIdentifier) => SearchInput

export const applySearchAction = (
  prev: SearchDto[],
  searchAction: SEARCH_ACTION,
  initialState: SearchDto[],
  getInput: GetInputFn,
): SearchDto[] => {
  const { action } = searchAction

  if (action === 'RESET_ALL') {
    return initialState
  }

  const { name, table } = searchAction

  if (action === 'RESET_SINGLE') {
    return prev.map((prevSearch) => {
      if (prevSearch.table !== table) return prevSearch

      return {
        ...prevSearch,
        columns: prevSearch.columns.map((prevColumn) => {
          if (prevColumn.name === name) {
            return {
              ...prevColumn,
              payload: {
                value: '',
                exact: getInput({ table, name }).type === 'dropdown',
              },
            } satisfies SearchColumnDto
          }

          return prevColumn
        }),
      }
    })
  }

  if (action === 'SET_VALUE') {
    const { value, exact } = searchAction.payload

    return prev.map((prevSearch) => {
      if (prevSearch.table !== table) return prevSearch

      return {
        ...prevSearch,
        columns: prevSearch.columns.map((prevColumn) => {
          if (prevColumn.name === name) {
            return {
              ...prevColumn,
              payload: {
                value,
                exact:
                  getInput({ table, name }).type === 'dropdown' ? true : exact,
              },
            } satisfies SearchColumnDto
          }

          return prevColumn
        }),
      }
    })
  }

  return prev
}

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
