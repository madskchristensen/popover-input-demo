import { SEARCH_KEY } from '@/hooks/popover-search/types/storage-maps'
import { useSearchState } from '@/hooks/popover-search/hooks/use-search'
import { FC, Fragment } from 'react'
import PopoverDropdown from '../popover-search/PopoverDropdown'
import PopoverTextInput from '../popover-search/PopoverTextInput'
import { SearchColumnDto, SearchDto } from '@/orval/generated/models'

type FilterBoxProps = {
  columns: SearchColumnDto[]
  table: SearchDto['table']
  optionsSourceMap: Record<string, any[]>
  searchKey: SEARCH_KEY
}

const FilterBox: FC<FilterBoxProps> = ({
  table,
  columns,
  optionsSourceMap,
  searchKey,
}) => {
  const { searchState, updateState, getInput } = useSearchState(searchKey)

  return (
    <Fragment key={table}>
      {columns.map(({ column, payload }) => {
        const searchInput = getInput({ table, column })

        let dependantValue

        if (searchInput.type === 'dropdown' && searchInput.isDependantOn) {
          const foundTable = searchState.find(
            (s) => s.table === searchInput.isDependantOn?.table,
          )

          const foundColumn = foundTable?.columns.find(
            (c) => c.column === searchInput.isDependantOn?.column,
          )

          dependantValue = foundColumn?.payload.value
        }

        return (
          <Fragment key={column}>
            {searchInput.type === 'dropdown' && (
              <PopoverDropdown
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
    </Fragment>
  )
}

export default FilterBox
