import { SearchInputDto, SelectOption } from '.'

// TODO: Implement data structure
export const searchStateJobApplication: SearchInputDto[] = [
  {
    table: 'jobApplication',
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
      // TODO: implement
      /*       {
        name: 'carBrand',
        label: 'Brand',
        type: 'dropdown',
        transformer: (source: CarBrand[]): SelectOption[] => {
          return source.map((brand) => ({
            label: brand.title,
            value: brand.title,
          }))
        },
      }, */
      // TODO: implement
      /*       {
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
          table: 'mock',
          column: 'carBrand',
        },
      }, */
      // TODO: implement
      /*       {
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
          table: 'mock',
          column: 'carModel',
        },
      }, */
      // TODO: Country
      /*       {
        name: 'countryCode',
        label: 'Country',
        type: 'dropdown',
        transformer: getCountryOptions,
      }, */
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
