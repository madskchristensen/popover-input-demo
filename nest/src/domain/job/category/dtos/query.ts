import { IsOptional, IsString } from 'class-validator'

export class QueryJobCategoryDto {
  @IsString()
  @IsOptional()
  search?: string
}
