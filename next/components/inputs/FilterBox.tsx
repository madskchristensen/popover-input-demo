import { SEARCH_KEY } from '@/hooks/popover-search/inputs/storage-maps'
import { SearchColumnDto, SearchDto } from '@/hooks/popover-search/models.types'
import { useSearchState } from '@/hooks/popover-search/use-search'
import { useRouter } from 'next/router'
import { Fragment } from 'react'
import PopoverCheckboxList from '../popover-search/PopoverCheckboxList'
import PopoverDropdown from '../popover-search/PopoverDropdown'
import PopoverTextInput from '../popover-search/PopoverTextInput'

type FilterBoxProps = {
  columns: SearchColumnDto[]
  table: SearchDto['table']
  optionsSourceMap: Record<string, any[]>
  searchKey: SEARCH_KEY
}

const FilterBox = ({
  table,
  columns,
  optionsSourceMap,
  searchKey,
}: FilterBoxProps) => {
  const { searchState, updateState, getInput } = useSearchState(searchKey)

  const router = useRouter()
  const path = router.pathname
  const page = router.query.page

  return (
    <Fragment key={table}>
      {columns.map(({ name, payload }) => {
        const searchInput = getInput({ table, name })

        let dependantValue

        if (searchInput.type === 'dropdown' && searchInput.isDependantOn) {
          const foundTable = searchState.find(
            (s) => s.table === searchInput.isDependantOn?.table,
          )

          const foundColumn = foundTable?.columns.find(
            (c) => c.name === searchInput.isDependantOn?.column,
          )

          dependantValue = foundColumn?.payload.value
        }

        return (
          <Fragment key={name}>
            {searchInput.type === 'dropdown' && (
              <PopoverDropdown
                name={name}
                value={payload.value}
                label={searchInput.label}
                transformer={searchInput.transformer}
                updateState={updateState}
                table={table}
                optionsSource={optionsSourceMap[`${table}_${name}`]}
                dependantValue={searchInput.isDependantOn && dependantValue}
                isDisabled={searchInput.isDependantOn && !dependantValue}
              />
            )}
            {searchInput.type === 'text' && (
              <PopoverTextInput
                exact={payload.exact}
                name={name}
                value={payload.value}
                label={searchInput.label}
                table={table}
                updateState={updateState}
              />
            )}
            {searchInput.type === 'checkbox' && (
              <PopoverCheckboxList
                name={name}
                value={payload.value}
                label={searchInput.label}
                table={table}
                updateState={updateState}
                optionsSource={optionsSourceMap[`${table}_${name}`]}
                transformer={searchInput.transformer}
              />
            )}
          </Fragment>
        )
      })}
    </Fragment>
  )
}

export default FilterBox
