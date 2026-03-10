import { PageOptionsDto } from './dtos/page-options.dto'
import { PageDto } from './dtos/page.dto'

export const pageDtoFrom = <T>(
  data: T[],
  { page, limit }: PageOptionsDto,
  total: number,
): PageDto<T> => {
  const totalPages = Math.ceil(total / limit)

  return {
    data,
    pagination: {
      currentPage: page,
      totalPages,
      nextPage: totalPages > page ? page + 1 : undefined,
      prevPage: page > 1 ? page - 1 : undefined,
      found: data.length,
      totalFound: total,
    },
  }
}
