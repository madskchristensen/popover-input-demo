import { SearchDto } from '@/orval/generated/models'
import { JobCategory } from '@/orval/generated/models'

export const OPTIONS_SOURCE_MAP_KEYS = {
  JOB_CATEGORY: 'jobCategory_name',
  JOB_ROLE: 'jobRole_title',
  JOB_APPLICATION_STATUS: 'jobApplication_status',
} as const

export const getSelectedCategoryId = (
  searchState: SearchDto[],
  jobCategories?: JobCategory[],
) => {
  if (!jobCategories) return undefined

  const selectedCategoryName = searchState
    .find((state) => state.table === 'jobCategory')
    ?.columns.find((column) => column.name === 'name')?.payload.value

  return jobCategories.find(
    (category) => category.name === selectedCategoryName,
  )?.id
}

export const deUnderScoreString = (val: string) => val.replace(/_/g, ' ')
