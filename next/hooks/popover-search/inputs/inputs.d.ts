import { JSX } from "react"
import { ColumnIdentifier, TableIdentifier } from "../use-search"

export type SelectOption = {
    label: string
    value: string
    element?: JSX.Element
  }

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
  