import { flexRender, HeaderGroup } from '@tanstack/react-table'
import { JobApplicationTableItem } from '../types/TableItem'
import { ChevronUpIcon, ChevronDownIcon, IconButton } from '@chakra-ui/icons'

type TableHeadersProps = {
  headerGroups: HeaderGroup<JobApplicationTableItem>[]
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
                          <IconButton
                            aria-label='Sort Up'
                            className='inline'
                            icon={<ChevronUpIcon />}
                          />
                        </span>
                      ),
                      desc: (
                        <span className='inline-block ml-1'>
                          <IconButton
                            aria-label='Sort Down'
                            className='inline'
                            icon={<ChevronDownIcon />}
                          />
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
