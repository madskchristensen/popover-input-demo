import { useDisclosure } from '@chakra-ui/react'
import { useEffect, useMemo, useRef } from 'react'
import { SingleValue } from 'react-select'
import PopoverInputWrapper from './PopoverInputWrapper'
import SelectDropdown from '../inputs/SelectDropdown'
import {
  SEARCH_ACTION,
  SearchIdentifier,
  SelectOption,
} from '@/hooks/popover-search/types'

type PopoverDropdownProps = SearchIdentifier & {
  value: string
  label: string
  updateState: (searchAction: SEARCH_ACTION) => void
  isDisabled?: boolean
  dependantValue?: string
  optionsSource: any[]
  transformer: (options: any[]) => SelectOption[]
}

const PopoverDropdown: React.FC<PopoverDropdownProps> = ({
  value,
  column,
  updateState,
  table,
  label,
  transformer,
  isDisabled,
  dependantValue,
  optionsSource,
}) => {
  const initialFocusRef = useRef(null)
  const {
    isOpen: isPopoverOpen,
    onOpen: openPopover,
    onClose: closePopover,
  } = useDisclosure()

  const options = useMemo(
    () => transformer(optionsSource),
    [optionsSource, transformer],
  )

  const dependantRef = useRef<string | undefined>(dependantValue)

  const dependantHasChanged =
    dependantRef.current && dependantValue
      ? dependantRef.current !== dependantValue
      : false

  // Reset value if clearing or changing dependant value
  useEffect(() => {
    // Update dependantRef for comparison in next render
    if (dependantValue !== dependantRef.current) {
      dependantRef.current = dependantValue
    }

    if (value && dependantHasChanged) {
      updateState({
        action: 'RESET_SINGLE',
        table,
        column,
      })
    }
  }, [dependantValue, column, table, updateState, value, dependantHasChanged])

  // Bit of a hack. Ensures that if clearing a the value of the input this component is denendent on, it will reset the value of this input.
  useEffect(() => {
    if (isDisabled && value) {
      updateState({
        action: 'RESET_SINGLE',
        table,
        column,
      })
    }
  }, [isDisabled, column, table, updateState, value])

  return (
    <PopoverInputWrapper
      table={table}
      value={value}
      column={column}
      updateState={updateState}
      isDisabled={isDisabled}
      label={label}
      initialFocusRef={initialFocusRef}
      isOpen={isPopoverOpen}
      onOpen={openPopover}
      onClose={closePopover}
    >
      <SelectDropdown
        openMenuOnFocus={true}
        tabSelectsValue={false}
        initialFocusRef={initialFocusRef}
        name={column}
        options={options}
        placeholder={label}
        value={value}
        controlClassName='!py-0 !mt-0'
        onChange={(val) => {
          updateState({
            action: 'SET_VALUE',
            table,
            column,
            payload: {
              value: (val as SingleValue<SelectOption>)?.value ?? '',
              exact: true,
            },
          })
          closePopover()
        }}
      />
    </PopoverInputWrapper>
  )
}

export default PopoverDropdown
