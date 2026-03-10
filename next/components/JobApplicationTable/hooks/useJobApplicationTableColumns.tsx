import { createColumnHelper } from '@tanstack/react-table'
import { useMemo } from 'react'
import Checkbox from '@/components/Checkbox' // TODO: Replace with chakras checkbox
import NextIcon from '@/public/next.svg' // TODO: Add this to project
import { JobApplicationTableItem } from '../types/TableItem'

type UseJobApplicationTableColumnsProps = {
  data: JobApplicationTableItem[]
}

const columnHelper = createColumnHelper<JobApplicationTableItem>()

export const useJobApplicationTableColumns = ({
  data,
}: UseJobApplicationTableColumnsProps) => {
  return useMemo(
    () => [
      columnHelper.display({
        id: 'select',
        enableSorting: false,
        header: ({ table }) => {
          return (
            <Checkbox
              name='all'
              checked={table.getIsAllPageRowsSelected()}
              onChange={table.toggleAllPageRowsSelected}
              preventDefault={true}
            />
          )
        },
        cell: ({ row }) => {
          const { id } = row.original

          return (
            <div className={`${data.length === 1 ? 'pb-2' : ''}`}>
              <Checkbox
                name={id}
                checked={row.getIsSelected()}
                onChange={() => row.toggleSelected()}
                preventDefault={true}
              />
            </div>
          )
        },
      }),

      // TODO: Decide - Support photos or not
      /*       columnHelper.accessor('primaryPhotoUrl', {
        id: 'primaryPhotoUrl',
        header: undefined,
        enableSorting: false,
        cell: ({ getValue }) => <PhotoCell photoUrl={getValue()} />,
      }), */

      columnHelper.accessor('country', {
        id: 'country',
        header: undefined,
        enableSorting: false,
        // TODO: Implement Country and use here
        /* <CountryIcon country={getValue()} className='w-6' /> */
        cell: ({ getValue }) => <p>Country Icon here</p>,
      }),

      columnHelper.accessor('name', {
        id: 'name',
        header: 'Name',
        enableSorting: true,
        cell: (info) => info.getValue(),
      }),

      columnHelper.accessor('email', {
        id: 'email',
        header: 'Email',
        enableSorting: true,
        cell: (info) => info.getValue(),
      }),

      columnHelper.accessor('jobRole', {
        id: 'jobRole',
        header: 'Role',
        enableSorting: true,
        cell: (info) => info.getValue(),
      }),

      columnHelper.accessor('jobCategory', {
        id: 'jobCategory',
        header: 'Category',
        enableSorting: true,
        cell: (info) => info.getValue(),
      }),

      columnHelper.accessor('status', {
        id: 'status',
        header: 'Status',
        enableSorting: false,
        cell: ({ getValue }) => {
          const val = getValue()
          return <div className='max-w-[150px] break-words'>{val}</div>
        },
      }),

      columnHelper.accessor('createdAt', {
        id: 'createdAt',
        header: 'Created',
        enableSorting: true,
        cell: (info) => info.getValue(),
      }),

      columnHelper.display({
        id: 'goButton',
        header: undefined,
        enableSorting: false,
        cell: () => (
          <div className='p-4 flex items-center justify-end'>
            <NextIcon className='inline' />
          </div>
        ),
      }),
    ],
    [data],
  )
}
