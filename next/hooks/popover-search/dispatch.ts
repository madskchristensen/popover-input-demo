import { SearchColumnDto, SearchDto } from '@/orval/generated/models'
import { GetInputFn, SEARCH_ACTION } from './types'

export const dispatch = (
  prev: SearchDto[],
  searchAction: SEARCH_ACTION,
  initialState: SearchDto[],
  getInput: GetInputFn,
): SearchDto[] => {
  const { action } = searchAction

  if (action === 'RESET_ALL') {
    return initialState
  }

  const { name, table } = searchAction

  if (action === 'RESET_SINGLE') {
    return prev.map((prevSearch) => {
      if (prevSearch.table !== table) return prevSearch

      return {
        ...prevSearch,
        columns: prevSearch.columns.map((prevColumn) => {
          if (prevColumn.name === name) {
            return {
              ...prevColumn,
              payload: {
                value: '',
                exact: getInput({ table, name }).type === 'dropdown',
              },
            } satisfies SearchColumnDto
          }

          return prevColumn
        }),
      }
    })
  }

  if (action === 'SET_VALUE') {
    const { value, exact } = searchAction.payload

    return prev.map((prevSearch) => {
      if (prevSearch.table !== table) return prevSearch

      return {
        ...prevSearch,
        columns: prevSearch.columns.map((prevColumn) => {
          if (prevColumn.name === name) {
            return {
              ...prevColumn,
              payload: {
                value,
                exact:
                  getInput({ table, name }).type === 'dropdown' ? true : exact,
              },
            } satisfies SearchColumnDto
          }

          return prevColumn
        }),
      }
    })
  }

  return prev
}
