
import { SearchUpdateStateParams, TableIdentifier } from '@/hooks/popover-search/use-search'
import { Checkbox as ChakraCheckbox } from '@chakra-ui/react'
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
    <ChakraCheckbox
      size='x-small'
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
    </ChakraCheckbox>
  )
}

export default memo(PopoverCheckbox)
