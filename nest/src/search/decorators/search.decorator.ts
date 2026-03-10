import { applyDecorators } from '@nestjs/common'
import { ApiExtraModels, ApiQuery, getSchemaPath } from '@nestjs/swagger'
import { SearchDto } from '../dtos/search.dto'

// The OpenAPI spec doesn't support deeply nested objects in input params (https://github.com/OAI/OpenAPI-Specification/issues/1706).
// This solution is a hack to work around this limitation.

// Basically; any property containing more than 1 level of nested objects, will not be correctly generated into a spec for OpenAPI.
// Therefore we manually define the SearchDto as an extra model on the controller (to ensure an OpenAPI schema is generated for it).
// Then we manually specify that the query parameter "search" uses this schema. Since the SearchDto only contains 2 levels of nested objects, this works.
// If we had more levels, we would manually have to define the schema, one level deeper (or as many as needed to reach the supported depth of 1).
export const ApiSearchQuery = () =>
  applyDecorators(
    ApiExtraModels(SearchDto),
    ApiQuery({
      name: 'search',
      type: [SearchDto],
      isArray: true,
      schema: {
        type: 'array',
        items: {
          $ref: getSchemaPath(SearchDto),
          type: 'object',
        },
      },
      required: false,
    }),
  )
