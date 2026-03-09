import {
  IsEmail,
  IsEnum,
  IsISO31661Alpha2,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Length,
} from 'class-validator'
import { ApplicationStatus } from 'src/enums/application-status'

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
  @Length(2, 2)
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
  @Length(2, 2)
  @IsOptional()
  country?: string

  @IsEnum(ApplicationStatus)
  @IsOptional()
  status?: ApplicationStatus

  @IsUUID()
  @IsOptional()
  jobRoleId?: string
}

export class QueryJobApplicationDto {
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
  @IsString()
  search?: string // Matches against firstName, lastName, email
}
