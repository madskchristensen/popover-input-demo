import { flexRender, Row } from '@tanstack/react-table'
import Link from 'next/link'
import { JobApplicationTableItem } from '../JobApplicationTable'

type TableRowsProps = {
  rows: Row<JobApplicationTableItem>[]
  page: string | null
}

const TableRows: React.FC<TableRowsProps> = ({ rows, page }) => {
  return (
    <tbody>
      {rows.map((row) => {
        const rowId = row.original.id

        return (
          <Link
            key={row.id}
            className='contents select-none cursor-pointer items-center justify-center'
            href={`buying/${rowId}?page=${page}`}
          >
            <tr
              className={
                'align-middle text-gray-darker hover:bg-gray-lighter border-t border-b last:border-b-0'
              }
            >
              {row.getVisibleCells().map((cell) => {
                return (
                  <td key={cell.id} className='p-4'>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                )
              })}
            </tr>
          </Link>
        )
      })}
    </tbody>
  )
}

export default TableRows
