import { SearchInputDto } from '.'
import { searchStateSample } from './sample'

// Solution to allow multiple localStorage saved search states to map to multiple inputs that are not saved in localStorage.
// This solution allows us to bypass the need for saving the inputs in localStorage, which could cause weird issues, especially with functions,
// since they can't be serialized/deserialized by default.

export type SEARCH_KEY = 'sample'
type SEARCH_KEY_LOCAL_STORAGE_PREFIX = `searchState`
export type SEARCH_KEY_LOCAL_STORAGE =
  `${SEARCH_KEY_LOCAL_STORAGE_PREFIX}${Capitalize<SEARCH_KEY>}`

// How to use:
// 1. Add a new key to the SEARCH_KEY type union.
// 2. Add a new entry to the localStorageInputMap object with the key and the inputs for the new search.
// 3. Call the hook, pass the added key as argument, and use the returned values. See SubmissionsTable.tsx for an example.
export const localStorageInputMap: Record<
  SEARCH_KEY_LOCAL_STORAGE,
  SearchInputDto[]
> = {
  searchStateSample,
}
