import { useCallback, useMemo } from "react"
import { localStorageInputMap, SEARCH_KEY, SEARCH_KEY_LOCAL_STORAGE } from "./inputs/storage-maps"
import { SearchColumnDto, SearchDto, SearchPayload } from "./models"
import { capitalize } from 'lodash'
import { useLocalStorage } from "usehooks-ts"
import { SearchInput } from "./inputs/inputs"


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

// TODO?: To fix ^ and also as a general improvement, this hook should probably integrate with Redux.
// It's basically already using a redux-like pattern of actions, reducers etc.

/* TODO?: Might be possible for the search state to become corrupt.
 * Not certain, but my thinking is that changes to the inputs can cause searchState to go out of sync with the localStorage. Unsure if simply adding/removing an input is enough, or perhaps if making bigger structural changes.
 * Leaving as-is for now, but if this becomes a problem we need a solution that compares localStorage with the current inputs and resets the state if they don't match.
 */

export const useSearchState = (key: SEARCH_KEY) => {
  // The type casting here is a bit ugly, but is the least convoluted way of adding type safety to the localStorage key and input map.
  const localStorageKey = `searchState${capitalize(
    key,
  )}` as SEARCH_KEY_LOCAL_STORAGE

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
            allowMultiple: type === 'checkbox',
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
  )

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
                      allowMultiple:
                        getInput({ table, name }).type === 'checkbox',
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
        const { value, exact, allowMultiple } = params.payload

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
                      allowMultiple,
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
