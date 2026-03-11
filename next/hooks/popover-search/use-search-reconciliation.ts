import { useEffect } from 'react'
import { SearchDto } from './models.types'

const fingerprint = (state: SearchDto[]) =>
  state
    .map((s) => `${s.table}:${s.columns.map((c) => c.name).join(',')}`)
    .join('|')

/**
 * Resets persisted search state when the input definitions change
 * (e.g. renamed tables, added/removed columns).
 */
export const useSearchReconciliation = (
  persisted: SearchDto[],
  initial: SearchDto[],
  reset: (state: SearchDto[]) => void,
) => {
  useEffect(() => {
    if (fingerprint(persisted) !== fingerprint(initial)) {
      reset(initial)
    }
  }, [persisted, initial, reset])
}
