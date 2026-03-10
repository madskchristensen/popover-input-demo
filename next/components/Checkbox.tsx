import { MouseEvent } from 'react'
// import CheckedIcon from '../public/checkbox-icon.svg' // TODO: Remove? Likely removing entire component

export type CheckboxProps = {
  name: string
  description?: string
  checked: boolean
  onChange: (checked: boolean) => void // handle new checked state
  preventDefault?: boolean
  error?: boolean | string
  className?: string
  disableDescriptionOnClick?: boolean
  children?: React.ReactNode
  disabled?: boolean
}

// TODO: Remove and replace references with Chakras Checkbox
const Checkbox: React.FC<CheckboxProps> = ({
  name,
  description,
  checked,
  onChange,
  error,
  className = '',
  disableDescriptionOnClick,
  preventDefault,
  children,
  disabled,
}) => {
  const errorStyling = error ? 'border-red' : ''
  const borderStyle = !checked ? 'border border-gray' : ''
  const disabledStyle = disabled ? 'opacity-50' : ''

  const handleClick = (e: MouseEvent) => {
    if (disabled) return
    e.stopPropagation()
    if (preventDefault) {
      e.preventDefault()
    }
    onChange(!checked)
  }

  return (
    <div className={`flex justify-center ${className}`}>
      <div
        className={`flex items-center mr-2`}
        onClick={(e) => !disableDescriptionOnClick && handleClick(e)}
      >
        <div
          className={`cursor-pointer w-6 h-6 rounded-[5px] ${borderStyle} ${errorStyling} ${disabledStyle} flex-shrink-0 `}
          onClick={(e) => disableDescriptionOnClick && handleClick(e)}
        >
          {/*           {checked && <CheckedIcon className='w-full h-full' />} TODO: Outcommented */}
          <input
            type='checkbox'
            name={name}
            className='hidden'
            checked={checked}
            readOnly
            disabled={disabled}
          />
        </div>
        {description && (
          <p
            className={`ml-4 text-gray-darker text-sm break-words ${disabledStyle}`}
            dangerouslySetInnerHTML={{ __html: description }}
          />
        )}
      </div>
      <div className={`flex items-start`}>{children}</div>
    </div>
  )
}

export default Checkbox
