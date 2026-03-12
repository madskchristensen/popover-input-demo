import { Controller, Get, Query } from '@nestjs/common'
import { QueryJobRoleDto } from './dtos/query.dto'
import { JobRoleService } from './job-role.service'

@Controller('job-role')
export class JobRoleController {
  constructor(private readonly service: JobRoleService) {}

  @Get()
  findAll(@Query() query: QueryJobRoleDto) {
    // When ?jobCategoryId= is supplied, this powers the dependent dropdown
    return this.service.findAll(query)
  }
}
