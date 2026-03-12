import { SEARCH_ACTION, SearchIdentifier } from '@/hooks/popover-search/types'
import { Checkbox } from '@chakra-ui/react'
import { memo } from 'react'

type PopoverCheckboxProps = SearchIdentifier & {
  value: string
  exact: boolean
  updateState: (searchAction: SEARCH_ACTION) => void
}

const PopoverCheckbox: React.FC<PopoverCheckboxProps> = ({
  column,
  value,
  exact,
  updateState,
  table,
}) => {
  return (
    <Checkbox
      size='sm'
      isChecked={exact}
      onChange={(e) =>
        updateState({
          action: 'SET_VALUE',
          table,
          column,
          payload: {
            value,
            exact: e.target.checked,
          },
        })
      }
    >
      Exact matches only
    </Checkbox>
  )
}

export default memo(PopoverCheckbox)
