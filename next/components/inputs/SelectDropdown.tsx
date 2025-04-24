import { SelectOption } from '@/hooks/popover-search/inputs'
import { FC, JSX, MutableRefObject } from 'react'
import Select from 'react-select'
import StateManagerProps from 'react-select'

type SelectDropdownProps = {
  name: string
  error?: false | string
  placeholder: string
  disabled?: boolean
  options: SelectOption[]
  onChange: (option: SelectOption | null) => void
  value: SelectOption['value']
  initialFocusRef?: MutableRefObject<null>
  controlClassName?: string
  onBlur?: (e: React.FocusEvent<HTMLElement>) => void
} & Omit<StateManagerProps, 'value'>

const formatOptionLabel = ({ label, element }: SelectOption) => {
  return (
    <div className='flex items-center'>
      <div>{label}</div>
      {element && element}
    </div>
  )
}

/* TODO: This component should probably use https://www.npmjs.com/package/chakra-react-select later when migrating fully to Chakra ui. */
const SelectDropdown: FC<SelectDropdownProps> = ({
  name,
  error,
  placeholder,
  disabled,
  options,
  onChange,
  value,
  initialFocusRef,
  controlClassName,
  onBlur,
  ...props
}) => {
  const border = error ? '!border-red' : '!border-gray'

  let selectedOption = options.find((option) => option.value === value) ?? null

  // If the selected value is not in the possible options (deprecated option),
  // add it to the options and show it as selected
  if (value && !selectedOption) {
    selectedOption = { label: value, value } as SelectOption
    options.unshift(selectedOption)
  }

  return (
    <Select
      {...props}
      ref={initialFocusRef}
      name={name}
      value={selectedOption}
      placeholder={placeholder}
      formatOptionLabel={formatOptionLabel}
      onChange={onChange}
      onBlur={onBlur}
      options={options}
      blurInputOnSelect={false}
      classNames={{
        control: () =>
          `${border} text-sm py-1.5 !rounded-md mt-3 ${
            controlClassName ? controlClassName : ''
          }`,
        option: () => `!text-sm hover:cursor-pointer`,
        placeholder: () => `!text-gray`,
        indicatorSeparator: () => 'hidden',
      }}
      isDisabled={disabled ?? false}
    />
  )
}

export default SelectDropdown
