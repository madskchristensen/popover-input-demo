import { JSX } from 'react'
import { ColumnIdentifier, TableIdentifier } from '../use-search'

export type SelectOption = {
  label: string
  value: string
  element?: JSX.Element
}

export type SearchInputDto = TableIdentifier & {
  inputs: SearchInput[]
}

export type SearchInput = SearchInputText | SearchInputDropdown

type BaseSearchInput = ColumnIdentifier & {
  label: string
}

export type SearchInputText = BaseSearchInput & {
  type: 'text'
}

export type SearchInputDropdown = BaseSearchInput & {
  type: 'dropdown'
  // Avoiding any typing here likely requires a slight re-work of the Popover implementation.
  // Any is somewhat valid - As long as SelectOption is returned the interface is valid.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  transformer: (source: any[]) => SelectOption[]
  isDependantOn?: {
    table: string
    column: string
  }
}
