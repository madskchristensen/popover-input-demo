import { createColumnHelper } from '@tanstack/react-table'
import { useMemo } from 'react'
import Checkbox from '@/components/Checkbox' // TODO: Replace with chakras checkbox
import PhotoCell from '../Cells/PhotoCell'
import CarAndOwnerCell from '../Cells/CarAndOwnerCell'
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

      columnHelper.accessor('primaryPhotoUrl', {
        id: 'primaryPhotoUrl',
        header: undefined,
        enableSorting: false,
        cell: ({ getValue }) => <PhotoCell photoUrl={getValue()} />,
      }),

      columnHelper.accessor('country', {
        id: 'country',
        header: undefined,
        enableSorting: false,
        // TODO: Implement Country and use here
        /* <CountryIcon country={getValue()} className='w-6' /> */
        cell: ({ getValue }) => <p>Country Icon here</p>,
      }),

      columnHelper.accessor('car', {
        id: 'car',
        header: 'Car and owner',
        enableSorting: true,
        cell: ({ getValue, row }) => (
          <CarAndOwnerCell
            car={getValue()}
            owner={row.original.owner}
            isRecurringSeller={row.original.isRecurringSeller}
            resubmissionCount={row.original.resubmissionCount}
          />
        ),
      }),

      columnHelper.accessor('carNumber', {
        id: 'carNumber',
        header: 'Car number',
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

      columnHelper.accessor('submittedDate', {
        id: 'submittedDate',
        header: 'Submitted Date',
        enableSorting: true,
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
