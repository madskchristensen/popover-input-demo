import { useSearchState } from '@/hooks/popover-search/use-search'
import { Button, Spinner } from '@chakra-ui/react'
import { FC, useEffect, useMemo } from 'react'
import FilterBox from '../inputs/FilterBox'
import { getSelectedCategoryId, OPTIONS_SOURCE_MAP_KEYS } from './utils'
import { useJobApplicationTable } from './hooks/useJobApplicationTable'
import EmptyState from './components/EmptyState'
import TableHeaders from './components/TableHeaders'
import TableRows from './components/TableRows'
import { useSearchParams } from 'next/navigation'
import { useLocalStorage } from 'usehooks-ts'
import { SortingState, Updater } from '@tanstack/react-table'
import TableActionBar from './components/TableActionBar'
import { useJobApplicationControllerFindAllInfinite } from '@/orval/generated/api/job-application/job-application'
import { useJobCategoryControllerFindAll } from '@/orval/generated/api/job-category/job-category'
import { useJobRoleControllerFindAll } from '@/orval/generated/api/job-role/job-role'
import { useInView } from 'react-intersection-observer'

type JobApplicationTableProps = {}

export const JobApplicationTable: FC<JobApplicationTableProps> = ({}) => {
  const { ref, inView } = useInView({
    rootMargin: '300px',
    threshold: 1.0,
  })

  const [sorting, setSorting] = useLocalStorage<SortingState>(
    'jobApplication',
    [],
  )

  const searchParams = useSearchParams()

  const page = useMemo(() => searchParams.get('page'), [searchParams])

  // TODO: Integrate this somehow. Want to display how it works when navigating
  /* 
    const queryOptions = useMemo(() => {
    if (page) {
      return getQueryOptions(page)
    }
  }, [page])
  */

  const { searchState, updateState, hasValues, filterEmpty } =
    useSearchState('jobApplication')

  const { data: jobCategories } = useJobCategoryControllerFindAll()

  const selectedCategoryId = useMemo(
    () => getSelectedCategoryId(searchState, jobCategories),
    [searchState, jobCategories],
  )

  const { data: jobRoles } = useJobRoleControllerFindAll(
    { jobCategoryId: selectedCategoryId },
    { query: { enabled: !!selectedCategoryId } },
  )

  const optionsSourceMap = useMemo(() => {
    return {
      [OPTIONS_SOURCE_MAP_KEYS.JOB_CATEGORY]: jobCategories ?? [],
      [OPTIONS_SOURCE_MAP_KEYS.JOB_ROLE]: jobRoles ?? [],
      [OPTIONS_SOURCE_MAP_KEYS.JOB_APPLICATION_STATUS]: [],
    }
  }, [jobCategories, jobRoles])

  // We save sorting to local storage so that it persists when navigating back to the page
  const setAndSaveSorting = (updater: Updater<SortingState>) => {
    const nextSorting =
      typeof updater === 'function' ? updater(sorting) : updater
    setSorting(nextSorting)
  }

  const {
    isFetching,
    isError,
    data: jobApplicationsInfinite,
    fetchNextPage,
    hasNextPage,
    isFetchedAfterMount,
  } = useJobApplicationControllerFindAllInfinite(
    {
      // ...queryOptions, // TODO: Re-add once implemented above.
      search: filterEmpty(searchState),
    },
    {
      query: {
        keepPreviousData: true,
        getNextPageParam: ({ pagination: { nextPage } }) => nextPage,
        refetchOnWindowFocus: false,
      },
    },
  )

  useEffect(() => {
    if (inView && hasNextPage && !isFetching) {
      fetchNextPage()
    }
  }, [inView, fetchNextPage, hasNextPage, isFetching])

  const flatJobApplicationsData = useMemo(
    () => jobApplicationsInfinite?.pages.map((page) => page.data).flat() ?? [],
    [jobApplicationsInfinite],
  )

  const { table, rows, tableData, selectedFetchedData } =
    useJobApplicationTable({
      rawData: flatJobApplicationsData,
      sorting,
      onSortingChange: setAndSaveSorting,
      page,
    })

  // TODO: error?.response?.data might not work. Unsure where the error data is put. Consider adding result interceptor to Nest with standardized format for responses.
  // error?.response?.data ?? 'Something went wrong while fetching data.'
  const errorMessage = 'Something went wrong while fetching data.'

  const isTableDataReady = isFetchedAfterMount && tableData.length > 0

  return (
    <>
      <div className='py-2 bg-white border border-gray rounded'>
        <div className='px-4 pb-6 pt-4 border-b-[1px] mb-6 flex justify-between'>
          <div className='flex flex-wrap gap-x-2 gap-y-4 items-center'>
            {searchState.map(({ table, columns }) => {
              return (
                <FilterBox
                  key={table}
                  table={table}
                  columns={columns}
                  optionsSourceMap={optionsSourceMap}
                  searchKey='jobApplication'
                />
              )
            })}
          </div>

          <Button
            ml={2}
            variant='ghostBlack'
            isDisabled={!hasValues}
            onClick={() => {
              updateState({
                action: 'RESET_ALL',
              })
            }}
          >
            Clear filters
          </Button>
        </div>

        <TableActionBar selected={selectedFetchedData} />

        {!isFetching && !isTableDataReady && (
          <EmptyState isError={isError} errorMessage={errorMessage} />
        )}

        {isTableDataReady && (
          <div className='mt-6 min-w-full table-auto overflow-x-auto'>
            <table className='min-w-full'>
              <TableHeaders headerGroups={table.getHeaderGroups()} />

              {/* Dummy tbody hack: Set "margin" between tbody and thead since tbody and thead cant be styled with margin/padding */}
              <tbody>
                <tr>
                  <td className='h-6'></td>
                </tr>
              </tbody>
              <TableRows rows={rows} page={page} />
            </table>
          </div>
        )}
        {hasNextPage && <div ref={ref} />}
        {(hasNextPage || (!isTableDataReady && isFetching)) && (
          <div className='p-6 flex items-center justify-center text-center'>
            <Spinner />
          </div>
        )}
      </div>
    </>
  )
}

export default JobApplicationTable
