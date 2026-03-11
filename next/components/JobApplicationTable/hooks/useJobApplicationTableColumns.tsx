import { createColumnHelper } from '@tanstack/react-table'
import { useMemo } from 'react'
/* import Checkbox from '@/components/Checkbox' */
import { ChevronRightIcon } from '@chakra-ui/icons'
import { JobApplicationTableItem } from '../types/TableItem'
import { IconButton } from '@chakra-ui/react'
import { Checkbox } from '@chakra-ui/react'

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
              isChecked={table.getIsAllPageRowsSelected()}
              onChange={() => table.toggleAllPageRowsSelected()}
              /*               preventDefault={true} */ // TODO: Might need a solution. preventDefault isn't a prop, but event bubbling might trigger navigation to item in table.
            />
          )
        },
        cell: ({ row }) => {
          const { id } = row.original

          return (
            <div className={`${data.length === 1 ? 'pb-2' : ''}`}>
              <Checkbox
                name={id}
                isChecked={row.getIsSelected()}
                onChange={() => row.toggleSelected()}
                /*              preventDefault={true} */
              />
            </div>
          )
        },
      }),

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
            <IconButton
              aria-label='Go'
              className='inline'
              icon={<ChevronRightIcon />}
            />
          </div>
        ),
      }),
    ],
    [data],
  )
}
