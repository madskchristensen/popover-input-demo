import {
  SearchColumnDto,
  SearchDto,
  SearchPayload,
} from '@/orval/generated/models'
import { JSX } from 'react'

// Basically just typing what identifies a table and a column. Maybe overly redundant
export type TableIdentifier = Pick<SearchDto, 'table'>
export type ColumnIdentifier = Pick<SearchColumnDto, 'name'>
export type SearchIdentifier = TableIdentifier & ColumnIdentifier

export type SelectOption = {
  label: string
  value: string
  element?: JSX.Element
}

// SEARCH RELATED
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

// GET INPUT FN
export type GetInputFn = (id: SearchIdentifier) => SearchInput

// ACTIONS
export type SET_VALUE = SearchIdentifier & {
  action: 'SET_VALUE'
  payload: SearchPayload
}

export type RESET_ALL = {
  action: 'RESET_ALL'
}

export type RESET_SINGLE = SearchIdentifier & {
  action: 'RESET_SINGLE'
}

export type SEARCH_ACTION = SET_VALUE | RESET_ALL | RESET_SINGLE
