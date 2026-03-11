import { SearchDto } from '@/orval/generated/models'
import { JobCategory } from '@/orval/generated/models'

export const OPTIONS_SOURCE_MAP_KEYS = {
  JOB_CATEGORY: 'job_category_name',
  JOB_ROLE: 'job_role_title',
  JOB_APPLICATION_STATUS: 'job_application_status',
} as const

export const getSelectedCategoryId = (
  searchState: SearchDto[],
  jobCategories?: JobCategory[],
) => {
  if (!jobCategories) return undefined

  const selectedCategoryName = searchState
    .find((s) => s.table === 'job_category')
    ?.columns.find((c) => c.name === 'name')?.payload.value

  return jobCategories.find((c) => c.name === selectedCategoryName)?.id
}
