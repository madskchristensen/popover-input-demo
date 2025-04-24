import { CarBrand, CarModel, CarVersion } from "../mock-data/types"
import { getCountryOptions } from "../utils/common"
import { SearchInputDto, SelectOption } from "./inputs"


export const searchStateSample: SearchInputDto[] = [
  {
    table: 'submission',
    inputs: [
      {
        name: 'carNumber',
        label: 'Car Number',
        type: 'text',
      },
      {
        name: 'vehicleIdentificationNumber',
        label: 'VIN',
        type: 'text',
      },
      {
        name: 'carBrand',
        label: 'Brand',
        type: 'dropdown',
        transformer: (source: CarBrand[]): SelectOption[] => {
          return source.map((brand) => ({
            label: brand.title,
            value: brand.title,
          }))
        },
      },
      {
        name: 'carModel',
        label: 'Model',
        type: 'dropdown',
        transformer: (source: CarModel[]): SelectOption[] => {
          return source.map((model) => ({
            label: model.title,
            value: model.title,
          }))
        },
        isDependantOn: {
          table: 'submission',
          column: 'carBrand',
        },
      },
      {
        name: 'carVersion',
        label: 'Version',
        type: 'dropdown',
        transformer: (source: CarVersion[]): SelectOption[] => {
          return source.map((version) => ({
            label: version.title,
            value: version.title,
          }))
        },
        isDependantOn: {
          table: 'submission',
          column: 'carModel',
        },
      },
      {
        name: 'countryCode',
        label: 'Country',
        type: 'dropdown',
        transformer: getCountryOptions,
      },
    ],
  },
  {
    table: 'user',
    inputs: [
      {
        name: 'email',
        label: 'Email',
        type: 'text',
      },
      {
        name: 'phone',
        label: 'Phone',
        type: 'text',
      },
      {
        name: 'fullName',
        label: 'Name',
        type: 'text',
      },
    ],
  },
  {
    table: 'address',
    inputs: [
      {
        name: 'street',
        label: 'Address',
        type: 'text',
      },
    ],
  },
]
