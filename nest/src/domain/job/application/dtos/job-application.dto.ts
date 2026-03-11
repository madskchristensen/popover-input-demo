import { Type } from 'class-transformer'
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
