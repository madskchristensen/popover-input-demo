import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator'

export class CreateJobRoleDto {
  @IsString()
  @IsNotEmpty()
  title: string

  @IsUUID()
  jobCategoryId: string
}

export class UpdateJobRoleDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  title?: string
}

export class QueryJobRoleDto {
  @IsUUID()
  @IsOptional()
  jobCategoryId?: string // When set, filters roles by category (the isDependentOn behaviour)

  @IsString()
  @IsOptional()
  search?: string
}
