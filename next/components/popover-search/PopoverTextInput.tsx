import { Input } from '@chakra-ui/react'
import { useEffect, useRef, useState } from 'react'
import { useDebounceCallback } from 'usehooks-ts'
import PopoverCheckbox from './PopoverCheckbox'
import PopoverInputWrapper from './PopoverInputWrapper'
import { SEARCH_ACTION, SearchIdentifier } from '@/hooks/popover-search/types'

type PopoverTextInputProps = SearchIdentifier & {
  value: string
  label: string
  exact: boolean
  updateState: (searchAction: SEARCH_ACTION) => void
  debounceDelay?: number
}

const PopoverTextInput: React.FC<PopoverTextInputProps> = ({
  value,
  exact,
  column,
  label,
  updateState,
  table,
  debounceDelay = 300,
}) => {
  const initialFocusRef = useRef(null)
  const debouncedUpdateState = useDebounceCallback(updateState, debounceDelay)
  const [internalValue, setInternalValue] = useState(value) // Prevents janky UI when typing due to debouncing

  useEffect(() => {
    setInternalValue(value)
  }, [value])

  return (
    <PopoverInputWrapper
      updateState={updateState}
      table={table}
      initialFocusRef={initialFocusRef}
      label={label}
      value={internalValue}
      column={column}
    >
      <>
        <Input
          ref={initialFocusRef}
          placeholder={label}
          fontSize={'small'}
          maxLength={100}
          value={internalValue}
          onChange={(e) => {
            setInternalValue(e.target.value)

            debouncedUpdateState({
              action: 'SET_VALUE',
              table,
              column,
              payload: {
                value: e.target.value,
                exact,
              },
            })
          }}
        />

        <PopoverCheckbox
          column={column}
          value={value}
          exact={exact}
          table={table}
          updateState={updateState}
        />
      </>
    </PopoverInputWrapper>
  )
}

export default PopoverTextInput
