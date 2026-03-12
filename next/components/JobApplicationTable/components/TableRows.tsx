import { flexRender, Row } from '@tanstack/react-table'
import Link from 'next/link'
import { JobApplicationTableItem } from '../types/TableItem'

type TableRowsProps = {
  rows: Row<JobApplicationTableItem>[]
  page: string | null
}

const TableRows: React.FC<TableRowsProps> = ({ rows, page }) => {
  return (
    <tbody>
      {rows.map((row) => {
        const rowId = row.original.id
        const href = `#` // TODO: Details page: application/${rowId}

        return (
          <tr
            key={row.id}
            className={
              'relative align-middle text-gray-darker hover:bg-gray-lighter border-t border-b last:border-b-0 select-none cursor-pointer'
            }
          >
            {row.getVisibleCells().map((cell, index) => {
              return (
                <td key={cell.id} className='p-4'>
                  {index === 0 && (
                    <Link
                      href={href}
                      className='absolute inset-0'
                      tabIndex={-1}
                    />
                  )}
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              )
            })}
          </tr>
        )
      })}
    </tbody>
  )
}

export default TableRows
