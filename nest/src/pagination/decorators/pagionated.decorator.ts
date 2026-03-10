import { Type, applyDecorators } from '@nestjs/common'
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from '@nestjs/swagger'
import { PageDto } from '../dtos/page.dto'

/*
 * Generic typing for OpenAPI api responses (https://docs.nestjs.com/openapi/operations#advanced-generic-apiresponse)
 *
 * Use this decorator on endpoints that utilizes PageDto to return a paginated response.
 *
 * Since OpenAPI spec doesn't support generics, we need to use allOf.
 * allOf basically merges the properties of the schemas into one.
 * In this case we merge the properties of PageDto and the model (e.g. an entity)
 *
 * This creates correct typing for the response in the OpenAPI spec, and although Orval generates some funky type names, also provides correct typing in frontend.
 */
export const ApiPaginatedResponse = <TModel extends Type<unknown>>(
  model: TModel,
) =>
  applyDecorators(
    ApiExtraModels(PageDto, model),
    ApiOkResponse({
      description: `The paginated result of ${model.name}`,
      schema: {
        title: `PaginatedResponseOf${model.name}`,
        allOf: [
          { $ref: getSchemaPath(PageDto) },
          {
            properties: {
              data: {
                type: 'array',
                items: { $ref: getSchemaPath(model) },
              },
            },
          },
        ],
      },
    }),
  )
