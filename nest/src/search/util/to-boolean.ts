import { TransformFnParams } from 'class-transformer'

// TODO: Can this be improved (or removed - use of class-transformer maybe?)

const stringToBoolean = (value: string | undefined): boolean => {
  if (!value) {
    return false
  }
  return value.toLowerCase() === 'true'
}

export const emptyStringToNull = ({ value }: TransformFnParams) =>
  value?.trim() === '' ? null : value

/**
 * Transforms query parameter strings to proper boolean values.
 * Handles the common pitfall where Boolean("false") returns true.
 *
 * @param value - Can be string ("true", "false"), boolean, undefined, or null
 * @returns boolean, undefined, or null depending on input
 */
export const toBoolean = ({
  value,
}: {
  value: unknown
}): boolean | undefined | null => {
  if (value === undefined) return undefined
  if (value === null) return null
  if (typeof value === 'boolean') return value
  if (typeof value === 'string') return stringToBoolean(value)
  return Boolean(value)
}
