import { useSearchState } from '@/hooks/popover-search/use-search'
import { FC } from 'react'

type PresentationTableProps = {}

export const PresentationTable: FC<PresentationTableProps> = ({}) => {
  const { searchState, updateState, getInput, hasValues, filterEmpty } =
    useSearchState('mock')

  return <></>
}

export default PresentationTable
