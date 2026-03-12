import { useCallback, useMemo } from 'react'
import { useLocalStorage } from 'usehooks-ts'
import { SearchIdentifier, SearchInput } from './core'
import {
  localStorageInputMap,
  SEARCH_KEY,
  SEARCH_KEY_LOCAL_STORAGE,
} from './core/storage-maps'
import { useSearchReconciliation } from './use-search-reconciliation'
import { SearchColumnDto, SearchDto } from '@/orval/generated/models'
import {
  applySearchAction,
  computeHasValues,
  filterEmpty,
  SEARCH_ACTION,
} from './utils'

export type { SEARCH_ACTION as SearchUpdateStateParams } from './utils'

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
    (params: SEARCH_ACTION) => {
      setSearchState((prev) =>
        applySearchAction(prev, params, initialState, getInput),
      )
    },
    [setSearchState, initialState, getInput],
  )

  const hasValues = useMemo(
    () => computeHasValues(searchState, getInput),
    [searchState, getInput],
  )

  return {
    filterEmpty,
    searchState,
    updateState,
    getInput,
    hasValues,
  }
}
