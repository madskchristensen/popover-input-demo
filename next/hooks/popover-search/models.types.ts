export interface SearchDto {
  table: string
  columns: SearchColumnDto[]
}

export interface SearchColumnDto {
  name: string
  payload: SearchPayload
}

export interface SearchPayload {
  value: string
  exact: boolean
  allowMultiple?: boolean
}
