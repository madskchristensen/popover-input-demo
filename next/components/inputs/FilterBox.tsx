import { FC, Fragment } from 'react'
import PopoverDropdown from '../popover-search/PopoverDropdown'
import PopoverTextInput from '../popover-search/PopoverTextInput'
import {
  GetInputFn,
  SEARCH_ACTION,
  SearchInputDropdown,
} from '@/hooks/popover-search/types'
import { SearchColumnDto, SearchDto } from '@/orval/generated/models'

type FilterBoxProps = {
  columns: SearchColumnDto[]
  table: SearchDto['table']
  optionsSourceMap: Record<string, any[]>
  searchState: SearchDto[]
  updateState: (searchAction: SEARCH_ACTION) => void
  getInput: GetInputFn
}

const getDependantValue = (
  searchState: SearchDto[],
  isDependantOn: SearchInputDropdown['isDependantOn'],
): string | undefined => {
  if (!isDependantOn) return undefined

  return searchState
    .find((searchDto) => searchDto.table === isDependantOn.table)
    ?.columns.find((columnDto) => columnDto.column === isDependantOn.column)
    ?.payload.value
}

const FilterBox: FC<FilterBoxProps> = ({
  table,
  columns,
  optionsSourceMap,
  searchState,
  updateState,
  getInput,
}) => {
  return (
    <>
      {columns.map(({ column, payload }) => {
        const searchInput = getInput({ table, column })

        const dependantValue =
          searchInput.type === 'dropdown'
            ? getDependantValue(searchState, searchInput.isDependantOn)
            : undefined

        return (
          <Fragment key={column}>
            {searchInput.type === 'dropdown' && (
              <PopoverDropdown
                key={column}
                column={column}
                value={payload.value}
                label={searchInput.label}
                transformer={searchInput.transformer}
                updateState={updateState}
                table={table}
                optionsSource={optionsSourceMap[`${table}_${column}`]}
                dependantValue={searchInput.isDependantOn && dependantValue}
                isDisabled={searchInput.isDependantOn && !dependantValue}
              />
            )}
            {searchInput.type === 'text' && (
              <PopoverTextInput
                key={column}
                exact={payload.exact}
                table={table}
                column={column}
                value={payload.value}
                label={searchInput.label}
                updateState={updateState}
              />
            )}
          </Fragment>
        )
      })}
    </>
  )
}

export default FilterBox
