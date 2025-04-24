import { useSearchState } from '@/hooks/popover-search/use-search'

type PresentationProps = {
  title: string
  description: string
  imageUrl: string
}

export const Presentation = ({}) => {
  const { searchState, updateState, getInput, hasValues, filterEmpty } =
    useSearchState('sample')

  return <p>hi</p>
}
