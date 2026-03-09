import { IsNotEmpty, IsOptional, IsString, Matches } from 'class-validator'

export class CreateJobCategoryDto {
  @IsString()
  @IsNotEmpty()
  name: string

  @IsString()
  @Matches(/^[A-Z_]+$/, {
    message: 'code must be uppercase letters and underscores only',
  })
  code: string
}

export class UpdateJobCategoryDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  name?: string
}

export class QueryJobCategoryDto {
  @IsString()
  @IsOptional()
  search?: string
}
