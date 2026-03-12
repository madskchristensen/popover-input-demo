import { IsOptional, IsString } from 'class-validator'

export class QueryJobCategoryDto {
  // TODO: Search used and how?
  @IsString()
  @IsOptional()
  search?: string
}
