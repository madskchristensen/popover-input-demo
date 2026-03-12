import { IsOptional, IsString, IsUUID } from 'class-validator'

export class QueryJobRoleDto {
  // TODO: Something else?
  @IsUUID()
  @IsOptional()
  jobCategoryId?: string

  // TODO: Is this used?
  @IsString()
  @IsOptional()
  search?: string
}
