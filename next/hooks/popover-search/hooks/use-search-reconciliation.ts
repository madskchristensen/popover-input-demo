import { SearchDto } from '@/orval/generated/models'
import { useEffect } from 'react'

const fingerprint = (state: SearchDto[]) =>
  state
    .map((s) => `${s.table}:${s.columns.map((c) => c.name).join(',')}`)
    .join('|')

/**
 * Resets persisted search state when the input definitions change
 * (e.g. renamed tables, added/removed columns).
 */
// TODO: Take another look at this. Doesn't seem to work =)
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
