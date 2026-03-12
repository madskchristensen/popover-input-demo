import { useCallback, useMemo } from 'react'
import { useLocalStorage } from 'usehooks-ts'
import { SearchInput } from './inputs'
import {
  localStorageInputMap,
  SEARCH_KEY,
  SEARCH_KEY_LOCAL_STORAGE,
} from './inputs/storage-maps'
import { useSearchReconciliation } from './use-search-reconciliation'
import {
  SearchColumnDto,
  SearchDto,
  SearchPayload,
} from '@/orval/generated/models'

export type TableIdentifier = Pick<SearchDto, 'table'>
export type ColumnIdentifier = Pick<SearchColumnDto, 'name'>
export type SearchIdentifier = TableIdentifier & ColumnIdentifier

type SearchSetValueParams = SearchIdentifier & {
  action: 'SET_VALUE'
  payload: SearchPayload
}

type SearchResetAllParams = {
  action: 'RESET_ALL'
}

type SearchResetSingleParams = SearchIdentifier & {
  action: 'RESET_SINGLE'
}

export type SearchUpdateStateParams =
  | SearchSetValueParams
  | SearchResetAllParams
  | SearchResetSingleParams

// TODO: Integrate with redux. Could use a reconciliation strategy, which would likely make the useSearchReconciliation redundant.
export const useSearchState = (key: SEARCH_KEY) => {
  // The type casting here is a bit ugly, but is the least convoluted way of adding type safety to the localStorage key and input map.
  const localStorageKey =
    `searchState${key.charAt(0).toUpperCase() + key.slice(1)}` as SEARCH_KEY_LOCAL_STORAGE

  const inputDtos = useMemo(
    () => localStorageInputMap[localStorageKey],
    [localStorageKey],
  )

  // Seperating state from inputs is nessecary since inputs can contain functions that are removed when serializing/de-serializing with localStorage.
  const initialState = useMemo((): SearchDto[] => {
    const searchState: SearchDto[] = inputDtos.map(({ table, inputs }) => {
      const columns = inputs.map(({ type, name }) => {
        return {
          name,
          payload: {
            value: '',
            exact: type === 'dropdown',
          },
        } satisfies SearchColumnDto
      })

      return {
        table,
        columns,
      } satisfies SearchDto
    })

    return searchState
  }, [inputDtos])

  // Initialize state with persisted or provided inputs
  const [searchState, setSearchState] = useLocalStorage<SearchDto[]>(
    localStorageKey,
    initialState,
    // Must be false when used with SSR. True means the first render would contain localStorage values in client. Since this isn't available on server a error would be thrown due to hydration mismatch between client and server.
    { initializeWithValue: false },
  )

  useSearchReconciliation(searchState, initialState, setSearchState)

  // Create a lookup map for the inputs to easily find the input by table and name
  const inputLookupMap = useMemo(() => {
    // Ideally key should be typed as `${table}-${name}`, with only possible table and name values from the inputDto array, but that's tricky.
    const lookupMap = new Map<string, SearchInput>()

    inputDtos.forEach(({ table, inputs }) => {
      inputs.forEach((input) => {
        lookupMap.set(`${table}-${input.name}`, { ...input })
      })
    })

    return lookupMap
  }, [inputDtos])

  // This is guaranteed to be a valid input since the lookup map is created from the inputDtos.
  // The falsey check is just to satisfy TypeScript, since typing this key of ${table}-${name} is really tricky.
  const getInput = useCallback(
    ({ table, name }: SearchIdentifier) => {
      const input = inputLookupMap.get(`${table}-${name}`)

      if (!input) {
        throw new Error(`Input not found for ${table}-${name}`)
      }

      return input
    },
    [inputLookupMap],
  )

  const updateState = useCallback(
    (params: SearchUpdateStateParams) => {
      const { action } = params

      const { name, table } = params as
        | SearchSetValueParams
        | SearchResetSingleParams

      if (action === 'RESET_ALL') {
        setSearchState(initialState)
        return
      }

      if (action === 'RESET_SINGLE') {
        setSearchState((prev) =>
          prev.map((prevSearch) => {
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
          }),
        )

        return
      }

      if (action === 'SET_VALUE') {
        const { value, exact } = params.payload

        setSearchState((prev) =>
          prev.map((prevSearch) => {
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
                        getInput({ table, name }).type === 'dropdown'
                          ? true
                          : exact,
                    },
                  } satisfies SearchColumnDto
                }

                return prevColumn
              }),
            }
          }),
        )

        return
      }
    },
    [setSearchState, initialState, getInput],
  )

  const hasValues = useMemo(() => {
    return searchState.some(({ columns, table }) => {
      const canReset = columns.some(({ name, payload }) => {
        const isDropdown = getInput({ table, name }).type === 'dropdown'

        const { value, exact } = payload

        if (value !== '' || (!isDropdown && exact)) return true

        return false
      })

      return canReset
    })
  }, [searchState, getInput])

  const filterEmpty = useCallback((searchState: SearchDto[]) => {
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
  }, [])

  return {
    filterEmpty,
    searchState,
    updateState,
    getInput,
    hasValues,
  }
}
