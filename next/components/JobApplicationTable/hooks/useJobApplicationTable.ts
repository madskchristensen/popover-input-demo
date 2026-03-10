import {
  getCoreRowModel,
  getSortedRowModel,
  RowSelectionState,
  SortingState,
  Updater,
  useReactTable,
  VisibilityState,
} from '@tanstack/react-table'
import { useEffect, useMemo, useState } from 'react'
import { useJobApplicationTableColumns } from './useJobApplicationTableColumns'
import { useSerializeJobApplicationTableData } from './useSerializeJobApplicationTableData'
import { JobApplication } from '@/orval/generated/models'

interface UseJobApplicationTableProps {
  rawData: JobApplication[]
  sorting: SortingState
  onSortingChange: (updater: Updater<SortingState>) => void
  page: string | null
}

// Note: By default, react-table columns are visibile. Meaning we only have to explicitly set visibility if toggling visibility.
const getColumnVisibilityForPage = (page: string | null): VisibilityState => {
  switch (page) {
    case 'contractUnpaid':
      return {
        submittedDate: false,
        pickupDateStart: true,
      }
    default:
      return {
        pickupDateStart: false,
      }
  }
}

export const useJobApplicationTable = ({
  rawData,
  sorting,
  onSortingChange,
  page,
}: UseJobApplicationTableProps) => {
  const tableData = useSerializeJobApplicationTableData(rawData)

  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
    () => getColumnVisibilityForPage(page),
  )
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})

  // Update visibility when page changes
  useEffect(() => {
    setColumnVisibility(getColumnVisibilityForPage(page))
  }, [page])

  // Clear selection when page changes
  useEffect(() => {
    setRowSelection({})
  }, [page])

  const columns = useJobApplicationTableColumns({
    data: tableData,
  })

  const table = useReactTable({
    data: tableData,
    columns,
    state: {
      sorting,
      rowSelection,
      columnVisibility,
    },
    onSortingChange,
    onRowSelectionChange: setRowSelection,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualSorting: true,
    enableRowSelection: true,
    enableHiding: true,
    // Ensure stable row references (submission.id)
    getRowId: (row) => row.id,
  })

  const selectedFetchedData = useMemo(() => {
    return rawData.filter(({ id }) => rowSelection[id])
  }, [rawData, rowSelection])

  return {
    table,
    rows: table.getRowModel().rows,
    tableData,
    columnVisibility,
    selectedFetchedData,
  }
}
