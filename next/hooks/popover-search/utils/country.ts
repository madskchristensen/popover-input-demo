import { mockCountryOptions } from '@/mock/country/countries'
import { SelectOption } from '../inputs'

export const getCountryOptions = (): SelectOption[] => {
  return mockCountryOptions
}
