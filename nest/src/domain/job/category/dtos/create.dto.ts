import { IsString, IsNotEmpty, Matches } from 'class-validator'

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
