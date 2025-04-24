import {
  SearchUpdateStateParams,
  TableIdentifier,
} from '@/hooks/popover-search/use-search'
import { Input } from '@chakra-ui/react'
import { useEffect, useRef, useState } from 'react'
import { useDebounceCallback } from 'usehooks-ts'
import PopoverCheckbox from './PopoverCheckbox'
import PopoverInputWrapper from './PopoverInputWrapper'

type PopoverTextInputProps = TableIdentifier & {
  value: string
  name: string
  label: string
  exact: boolean
  updateState: (params: SearchUpdateStateParams) => void
  debounceDelay?: number
}

const PopoverTextInput: React.FC<PopoverTextInputProps> = ({
  value,
  exact,
  name,
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
      name={name}
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
              name,
              payload: {
                value: e.target.value,
                exact,
              },
            })
          }}
        />

        <PopoverCheckbox
          name={name}
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
