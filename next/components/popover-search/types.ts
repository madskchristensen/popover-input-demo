import { SelectOption } from '@/hooks/popover-search/inputs/inputs'
import {
  ColumnIdentifier,
  TableIdentifier,
} from '@/hooks/popover-search/use-search'

export type SearchInputDto = TableIdentifier & {
  inputs: SearchInput[]
}

export type SearchInput =
  | SearchInputText
  | SearchInputDropdown
  | SearchInputCheckBoxDropdown

type BaseSearchInput = ColumnIdentifier & {
  label: string
}

export type SearchInputText = BaseSearchInput & {
  type: 'text'
}

export type SearchInputDropdown = BaseSearchInput & {
  type: 'dropdown'
  transformer: (source: any[]) => SelectOption[]
  isDependantOn?: {
    table: string
    column: string
  }
}

export type SearchInputCheckBoxDropdown = BaseSearchInput & {
  type: 'checkbox'
  transformer: (source: any[]) => SelectOption[]
  isDependantOn?: {
    table: string
    column: string
  }
}
