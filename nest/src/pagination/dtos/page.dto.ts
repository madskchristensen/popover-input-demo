import { ApiResponseProperty } from '@nestjs/swagger'

// TODO: Maybe rename totalFound and totalPages -> total, pages
export class PageDtoPagination {
  @ApiResponseProperty()
  currentPage: number
  @ApiResponseProperty()
  nextPage?: number
  @ApiResponseProperty()
  prevPage?: number
  @ApiResponseProperty()
  found: number
  @ApiResponseProperty()
  totalFound: number
  @ApiResponseProperty()
  totalPages: number
}

export class PageDto<TData> {
  /*
   * Funky stuff going on with TData here.
   *
   * Basically OpenAPI spec doesn't support generics. Since TData is generic it can't be resolved unless it's a simple object.
   *
   * The type is loaded by a lazy function to avoid circular dependency https://docs.nestjs.com/openapi/types-and-parameters#circular-dependencies.
   * Alternatively we could use @HideApiProperty decorator, but that means whatever response type Orval generates for paginated endpoints, will have data as optional.
   * Which just introduces annoying undefined checks in frontend and is basically wrong typing since data is always present.
   *
   * With this solution the OpenAPI spec understands what PageDto is,
   *     and any paginated responses from backend will have correct typing due to the decorator (ApiPaginatedResponse).
   */
  @ApiResponseProperty({ type: () => [Object as TData] })
  data: TData[]
  @ApiResponseProperty({ type: PageDtoPagination })
  pagination: PageDtoPagination
}
