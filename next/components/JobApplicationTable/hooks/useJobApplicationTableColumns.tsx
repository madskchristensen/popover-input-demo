import { createColumnHelper } from '@tanstack/react-table'
import { useMemo } from 'react'
import { ChevronRightIcon } from '@chakra-ui/icons'
import { JobApplicationTableItem } from '../types/TableItem'
import { Badge, Box, IconButton } from '@chakra-ui/react'
import { Checkbox } from '@chakra-ui/react'
import ReactCountryFlag from 'react-country-flag'
import { JobApplicationStatus } from '@/orval/generated/models'

type UseJobApplicationTableColumnsProps = {
  data: JobApplicationTableItem[]
}

const columnHelper = createColumnHelper<JobApplicationTableItem>()

const formatStatus = (status: JobApplicationStatus) => status.replace(/_/g, ' ')

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
            />
          )
        },
        cell: ({ row }) => {
          const { id } = row.original

          return (
            <Box
              onClick={(e) => e.stopPropagation()}
              pb={data.length === 1 ? 2 : 0}
            >
              <Checkbox
                name={id}
                isChecked={row.getIsSelected()}
                onChange={() => row.toggleSelected()}
              />
            </Box>
          )
        },
      }),

      columnHelper.accessor('country', {
        id: 'country',
        header: undefined,
        enableSorting: false,
        cell: ({ row }) => (
          <ReactCountryFlag
            countryCode={row.original.country}
            svg
            style={{ width: '1.5rem', height: '1.5rem' }}
            title={row.original.country}
          />
        ),
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
          const colorScheme: Record<string, string> = {
            NEW: 'blue',
            PENDING_REVIEW: 'yellow',
            IN_REVIEW: 'orange',
            REVIEWED: 'purple',
            SHORTLISTED: 'green',
            REJECTED: 'red',
          }
          return (
            <Badge variant='outline' colorScheme={colorScheme[val] ?? 'gray'}>
              {formatStatus(val)}
            </Badge>
          )
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
