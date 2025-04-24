import {
  SearchUpdateStateParams,
  TableIdentifier,
} from '@/hooks/popover-search/hook'
import { Checkbox, CheckboxGroup, useDisclosure } from '@chakra-ui/react'
import { capitalize } from 'lodash'
import { useEffect, useMemo, useRef } from 'react'
import { SelectOption } from '../SelectDropdown'
import PopoverInputWrapper from './PopoverInputWrapper'

type PopoverCheckboxListProps = TableIdentifier & {
  value: string
  name: string
  label: string
  updateState: (params: SearchUpdateStateParams) => void
  isDisabled?: boolean
  isHidden?: boolean
  dependantValue?: string
  optionsSource: any[]
  transformer: (options: any[]) => SelectOption[]
}

const PopoverCheckboxList: React.FC<PopoverCheckboxListProps> = ({
  value,
  name,
  updateState,
  table,
  label,
  transformer,
  isDisabled,
  isHidden,
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

  const values = value.split(',').filter((v) => v)

  const dependantRef = useRef<string | undefined>(dependantValue)

  const dependantHasChanged =
    dependantRef.current && dependantValue
      ? dependantRef.current !== dependantValue
      : false

  useEffect(() => {
    if (dependantValue !== dependantRef.current) {
      dependantRef.current = dependantValue
    }

    if (value.length > 0 && dependantHasChanged) {
      updateState({
        action: 'RESET_SINGLE',
        table,
        name,
      })
    }
  }, [dependantValue, name, table, updateState, value, dependantHasChanged])

  useEffect(() => {
    if (isDisabled && value.length > 0) {
      updateState({
        action: 'RESET_SINGLE',
        table,
        name,
      })
    }
  }, [isDisabled, name, table, updateState, value])

  if (isHidden) return null

  const displayValue =
    values.length === 1
      ? capitalize(values[0])
      : values.length
        ? `(${values.length})`
        : ''

  return (
    <PopoverInputWrapper
      table={table}
      value={displayValue}
      name={name}
      updateState={updateState}
      isDisabled={isDisabled}
      label={label}
      initialFocusRef={initialFocusRef}
      isOpen={isPopoverOpen}
      onOpen={openPopover}
      onClose={closePopover}
      isPopoverBlock={true}
    >
      <CheckboxGroup
        value={values}
        size='sm'
        onChange={(val) => {
          updateState({
            action: 'SET_VALUE',
            table,
            name,
            payload: {
              value: val.toString(),
              exact: true,
              allowMultiple: true,
            },
          })
        }}
      >
        {options.map((option) => (
          <Checkbox
            key={option.label}
            value={option.value}
            w={200}
            pr={10}
            lineHeight='22px'
          >
            {capitalize(option.label)}
          </Checkbox>
        ))}
      </CheckboxGroup>
    </PopoverInputWrapper>
  )
}

export default PopoverCheckboxList
