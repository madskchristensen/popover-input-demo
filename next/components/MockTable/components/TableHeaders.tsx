import IconSortDown from '@/public/icon-sort-down.svg'
import IconSortUp from '@/public/icon-sort-up.svg'
import { flexRender, HeaderGroup } from '@tanstack/react-table'
import { MockForTable } from '../MockTable'

type TableHeadersProps = {
  headerGroups: HeaderGroup<MockForTable>[]
}

const TableHeaders: React.FC<TableHeadersProps> = ({ headerGroups }) => {
  return (
    <thead>
      {headerGroups.map((headerGroup) => (
        <tr key={headerGroup.id}>
          {headerGroup.headers.map((header) => {
            return (
              <th
                key={header.id}
                colSpan={header.colSpan}
                className='text-left px-4'
              >
                {header.isPlaceholder ? null : (
                  <div
                    {...{
                      className: header.column.getCanSort()
                        ? 'cursor-pointer select-none'
                        : '',
                      onClick: header.column.getToggleSortingHandler(),
                    }}
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )}
                    {{
                      asc: (
                        <span className='inline-block ml-1'>
                          <IconSortUp />
                        </span>
                      ),
                      desc: (
                        <span className='inline-block ml-1'>
                          <IconSortDown />
                        </span>
                      ),
                    }[header.column.getIsSorted() as string] ?? null}
                  </div>
                )}
              </th>
            )
          })}
        </tr>
      ))}
    </thead>
  )
}

export default TableHeaders
