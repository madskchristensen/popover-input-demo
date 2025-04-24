import { useSearchState } from '@/hooks/popover-search/use-search'
import { FC, useMemo } from 'react'
import FilterBox from './inputs/FilterBox'

type PresentationProps = {}

export const Presentation: FC<PresentationProps> = ({}) => {
  const { searchState, updateState, getInput, hasValues, filterEmpty } =
    useSearchState('sample')

  return <></>
}

export default Presentation
