import { SearchDto } from '@/orval/generated/models'
import { JobCategory } from '@/orval/generated/models'

// TODO: Could this be improved? Creates an invisible (non-typed!) coupling to the dropdown inputs. I.e. changing the filtered column in an input, requires adjusting this map too.
export const OPTIONS_SOURCE_MAP_KEYS = {
  JOB_CATEGORY: 'jobCategory_code',
  JOB_ROLE: 'jobRole_title',
  JOB_APPLICATION_STATUS: 'jobApplication_status',
} as const

export const getSelectedCategoryId = (
  searchState: SearchDto[],
  jobCategories?: JobCategory[],
) => {
  if (!jobCategories) return undefined

  const selectedCategoryCode = searchState
    .find((state) => state.table === 'jobCategory')
    ?.columns.find((c) => c.column === 'code')?.payload.value

  return jobCategories.find(
    (category) => category.code === selectedCategoryCode,
  )?.id
}

export const deUnderScoreString = (val: string) => val.replace(/_/g, ' ')
