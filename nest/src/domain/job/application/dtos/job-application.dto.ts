import { plainToInstance, Transform, Type } from 'class-transformer'
import {
  ArrayMinSize,
  IsArray,
  IsEmail,
  IsEnum,
  IsISO31661Alpha2,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Length,
  ValidateNested,
} from 'class-validator'
import { ApplicationStatus } from 'src/domain/job/enums/application-status'
import { PageOptionsDto } from 'src/pagination/dtos/page-options.dto'
import { SearchDto } from 'src/search/dtos/search.dto'

export class CreateJobApplicationDto {
  @IsString()
  @IsNotEmpty()
  firstName: string

  @IsString()
  @IsNotEmpty()
  lastName: string

  @IsEmail()
  email: string

  @IsString()
  @IsISO31661Alpha2({
    message: 'country must be an ISO 3166-1 alpha-2 code e.g. DK',
  })
  country: string

  @IsUUID()
  jobRoleId: string
}

export class UpdateJobApplicationDto {
  @IsString()
  @IsOptional()
  firstName?: string

  @IsString()
  @IsOptional()
  lastName?: string

  @IsEmail()
  @IsOptional()
  email?: string

  @IsString()
  @IsOptional()
  @IsISO31661Alpha2({
    message: 'country must be an ISO 3166-1 alpha-2 code e.g. DK',
  })
  country?: string

  @IsEnum(ApplicationStatus)
  @IsOptional()
  status?: ApplicationStatus

  @IsUUID()
  @IsOptional()
  jobRoleId?: string
}

// TODO: Check jobRoleId, jobCategoryId, country. Might be redundant due to search
export class QueryJobApplicationDto extends PageOptionsDto {
  @IsOptional()
  @IsEnum(ApplicationStatus)
  status?: ApplicationStatus

  @IsOptional()
  @IsUUID()
  jobRoleId?: string

  @IsOptional()
  @IsUUID()
  jobCategoryId?: string // Resolved by joining through jobRole

  @IsOptional()
  @IsString()
  @Length(2, 2)
  country?: string

  @IsOptional()
  @Transform(({ value }) => {
    const parsed = typeof value === 'string' ? JSON.parse(value) : value
    return Array.isArray(parsed) ? plainToInstance(SearchDto, parsed) : parsed
  })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  search?: SearchDto[] // The OpenAPI schema for this property is generated using the ApiSearchQuery decorator

  @IsOptional()
  @IsString()
  sorting?: string
}
