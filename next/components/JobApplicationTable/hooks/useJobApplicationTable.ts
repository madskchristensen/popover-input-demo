import {
  getCoreRowModel,
  getSortedRowModel,
  RowSelectionState,
  SortingState,
  Updater,
  useReactTable,
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

export const useJobApplicationTable = ({
  rawData,
  sorting,
  onSortingChange,
  page,
}: UseJobApplicationTableProps) => {
  const tableData = useSerializeJobApplicationTableData(rawData)

  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})

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
    },
    onSortingChange,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualSorting: true,
    enableRowSelection: true,
    enableHiding: true,
    // Ensure stable row references, using a unique identifier e.g. entity.id
    getRowId: (row) => row.id,
  })

  const selectedFetchedData = useMemo(() => {
    return rawData.filter(({ id }) => rowSelection[id])
  }, [rawData, rowSelection])

  return {
    table,
    rows: table.getRowModel().rows,
    tableData,
    selectedFetchedData,
  }
}
