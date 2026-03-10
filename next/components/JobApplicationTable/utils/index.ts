import { SearchDto } from '@/orval/generated/models'

// TODO: Currently unused - KEEP?

export const OPTIONS_SOURCE_MAP_KEYS = {
  CAR_BRAND: 'submission_carBrand',
  CAR_MODEL: 'submission_carModel',
  CAR_VERSION: 'submission_carVersion',
  // TODO: CountryCode. Unsure if needed here.
  /*   COUNTRY_CODE: 'submission_countryCode', */
} as const

export const getSelectedResourceId = (
  searchState: SearchDto[],
  columnName: string,
  data?: { id: string; title: string }[], // TODO: Was:  Pick<CarBrand, 'id' | 'title'>[]
  /*   data?: Pick<CarBrand, 'id' | 'title'>[], */
) => {
  if (!data) return undefined

  const selectedResourceTitle = searchState
    .find((s) => s.table === 'submission')
    ?.columns.find((c) => c.name === columnName)?.payload.value

  const selectedResourceEntity = data?.find(
    (resource) => resource.title === selectedResourceTitle,
  )

  return selectedResourceEntity?.id
}
