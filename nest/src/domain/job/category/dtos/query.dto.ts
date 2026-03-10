import { IsOptional, IsString } from 'class-validator'

// TODO: This along with other query dtos might be redundant. Consider removing.
export class QueryJobCategoryDto {
  @IsString()
  @IsOptional()
  search?: string
}
