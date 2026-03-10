import { useSearchState } from '@/hooks/popover-search/use-search'
import { Button, Spinner } from '@chakra-ui/react'
import { FC, useEffect, useMemo, useRef } from 'react'
import FilterBox from '../inputs/FilterBox'
import { OPTIONS_SOURCE_MAP_KEYS } from './utils'
import { useMockTable } from './hooks/useMockTable'
import EmptyState from './components/EmptyState'
import TableHeaders from './components/TableHeaders'
import TableRows from './components/TableRows'
import { useSearchParams } from 'next/navigation'
import { useLocalStorage } from 'usehooks-ts'
import { SortingState, Updater } from '@tanstack/react-table'
import TableActionBar from './components/TableActionBar'
import useIntersectionObserver from '@/hooks/intersection'
import { useJobApplicationControllerFindAllInfinite } from '@/orval/generated/api/job-application/job-application'

type MockTableProps = {}

// TODO: Adjust/modífy for mock setup. Maybe move to seperate types file.
export type MockForTable = {
  id: string
  car: string
  owner: string
  status: string | undefined
  submittedDate: string
  carNumber: string
  country: string // Was CountryCode
  documentsRequested: string
  photosRequested: boolean
  isRecurringSeller: boolean
  primaryPhotoUrl?: string
  resubmissionCount: number
  contractSignedByBothParties: boolean
  isCarPaid: boolean
}

export const MockTable: FC<MockTableProps> = ({}) => {
  const [sorting, setSorting] = useLocalStorage<SortingState>('sortingMock', [])

  const listEndRef = useRef(null)

  const searchParams = useSearchParams()

  const page = useMemo(() => searchParams.get('page'), [searchParams])

  // TODO: Integrate this somehow. Want to display how it works when navigating
  /* 
    const submissionOptions = useMemo(() => {
    if (page) {
      return getSubmissionOptionsFromPage(page)
    }
  }, [page])
  */

  // TODO: getInput is not used with the newer changes. Maybe remove from implementation entirely?
  const { searchState, updateState, getInput, hasValues, filterEmpty } =
    useSearchState('mock')

  // TODO: Replace with actual data.
  // TODO: See reference code. Usage of getSelectedResourceId for brand and version
  const { data: carBrands } = { data: ['carBrand1'] } // useGetCarBrands()
  const { data: carModelsForBrand } = { data: ['carModel1'] } // useGetCarModelsForBrand(selectedCarBrandId)
  /*  
  useGetModelVersions(
    selectedCarModelId ?? '',
    {},
    {
      query: {
        enabled: Boolean(selectedCarModelId),
      },
    },
  )
   */
  const { data: carVersions } = { data: ['carVersion1'] }

  const optionsSourceMap = useMemo(() => {
    return {
      [OPTIONS_SOURCE_MAP_KEYS.CAR_BRAND]: carBrands ?? [],
      [OPTIONS_SOURCE_MAP_KEYS.CAR_MODEL]: carModelsForBrand ?? [],
      [OPTIONS_SOURCE_MAP_KEYS.CAR_VERSION]: carVersions ?? [],
      // [OPTIONS_SOURCE_MAP_KEYS.COUNTRY_CODE]: platformCountryMap, // TODO: Re-add? If keeping countries.
    }
  }, [carBrands, carModelsForBrand, carVersions])

  // We save sorting to local storage so that it persists when navigating back to the page
  const setAndSaveSorting = (updater: Updater<SortingState>) => {
    const nextSorting =
      typeof updater === 'function' ? updater(sorting) : updater
    setSorting(nextSorting)
  }

  const {
    isFetching,
    isError,
    data: mocksInfinite,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchedAfterMount,
  } = useJobApplicationControllerFindAllInfinite(
    {
      // ...submissionOptions, // TODO: Re-add once implemented above.
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

  const flattenedMocks = useMemo(
    () => mocksInfinite?.pages.map((page) => page.data).flat() ?? [],
    [mocksInfinite],
  )

  const { table, rows, tableData, columnVisibility, selectedMocks } =
    useMockTable({
      rawData: flattenedMocks,
      sorting,
      onSortingChange: setAndSaveSorting,
      page,
    })

  // TODO: Consider removing. The visibility implementation is not pretty.
  // Quick & hacky solution: Will reset sorting on navigation (or re-renders) if the sorted column is now hidden in the table.
  useEffect(() => {
    const sortingIdentifier = sorting.length && sorting[0].id

    // We need to explicitly check for false, since undefined is a viable visibility option (undefined = column is visible.)
    if (sortingIdentifier && columnVisibility[sorting[0].id] === false) {
      setSorting([])
    }
  }, [columnVisibility, setSorting, sorting])

  // TODO?: Could be cleaner with import from usehooks-ts. Requires some adjusting.
  useIntersectionObserver({
    target: listEndRef,
    onIntersect: fetchNextPage,
    enabled: hasNextPage && !isFetching,
  })

  // TODO: error?.response?.data might not work. Unsure where the error data is put. Consider adding result interceptor to Nest with standardized format for responses.
  const errorMessage =
    error?.response?.data ?? 'Something went wrong while fetching data.'

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
                  searchKey='mock'
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

        <TableActionBar selected={selectedMocks} />

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
        {hasNextPage && <div ref={listEndRef} />}
        {(hasNextPage || (!isTableDataReady && isFetching)) && (
          <div className='p-6 flex items-center justify-center text-center'>
            <Spinner />
          </div>
        )}
      </div>
    </>
  )
}

export default MockTable
