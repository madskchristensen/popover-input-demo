import { Type } from 'class-transformer'
import {
  ArrayMinSize,
  IsArray,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator'
import { PageOptionsDto } from 'src/pagination/dtos/page-options.dto'
import { SearchDto } from 'src/search/dtos/search.dto'

export class QueryJobApplicationDto extends PageOptionsDto {
  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => SearchDto)
  search?: SearchDto[] // The OpenAPI schema for this property is generated using the ApiSearchQuery decorator

  @IsOptional()
  @IsString()
  sorting?: string
}
