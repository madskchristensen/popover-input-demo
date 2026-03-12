import { useCallback, useMemo } from 'react'
import { useLocalStorage } from 'usehooks-ts'
import { SEARCH_ACTION, SearchIdentifier, SearchInput } from '../types'
import {
  localStorageInputMap,
  SEARCH_KEY,
  SEARCH_KEY_LOCAL_STORAGE,
} from '../types/storage-maps'
import { useSearchReconciliation } from './use-search-reconciliation'
import { SearchColumnDto, SearchDto } from '@/orval/generated/models'
import { dispatch } from '../dispatch'
import { computeHasValues, filterEmpty } from '../utils'

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
      const columns = inputs.map(({ type, column }) => {
        return {
          column,
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

  // Create a lookup map for the inputs to easily find the input by table and column
  const inputLookupMap = useMemo(() => {
    // Ideally key should be typed as `${table}-${column}`, with only possible table and column values from the inputDto array, but that's tricky.
    const lookupMap = new Map<string, SearchInput>()

    inputDtos.forEach(({ table, inputs }) => {
      inputs.forEach((input) => {
        lookupMap.set(`${table}-${input.column}`, { ...input })
      })
    })

    return lookupMap
  }, [inputDtos])

  // The only way for an input to not exist, is if the localStorage "blueprint" is out-of-sync with the "blueprint" in code.
  // This is fixed through reconcellation.
  const getInput = useCallback(
    ({ table, column }: SearchIdentifier) => {
      const input = inputLookupMap.get(`${table}-${column}`)

      if (!input) {
        throw new Error(`Input not found for ${table}-${column}`)
      }

      return input
    },
    [inputLookupMap],
  )

  const updateState = useCallback(
    (searchAction: SEARCH_ACTION) => {
      setSearchState((prev) =>
        dispatch(prev, searchAction, initialState, getInput),
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
