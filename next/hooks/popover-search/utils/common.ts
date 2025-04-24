import { SelectOption } from "../inputs/inputs";
import { mockCountryOptions } from "../mock-data/countries";

export const getCountryOptions = (): SelectOption[] => {
    return mockCountryOptions
}