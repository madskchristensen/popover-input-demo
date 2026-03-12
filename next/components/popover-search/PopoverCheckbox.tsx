import { TableIdentifier } from '@/hooks/popover-search/core'
import { SearchUpdateStateParams } from '@/hooks/popover-search/use-search'
import { Checkbox } from '@chakra-ui/react'
import { memo } from 'react'

type PopoverCheckboxProps = TableIdentifier & {
  name: string
  value: string
  exact: boolean
  updateState: (params: SearchUpdateStateParams) => void
}

const PopoverCheckbox: React.FC<PopoverCheckboxProps> = ({
  name,
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
          name,
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
