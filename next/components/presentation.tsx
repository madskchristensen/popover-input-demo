import { useSearchState } from '@/hooks/popover-search/use-search'
import { FC } from 'react'

type PresentationProps = {}

export const Presentation: FC<PresentationProps> = ({}) => {
  const { searchState, updateState, getInput, hasValues, filterEmpty } =
    useSearchState('sample')

  return <></>
}

export default Presentation
