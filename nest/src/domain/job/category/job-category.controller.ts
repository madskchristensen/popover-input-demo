import { Controller, Get, Query } from '@nestjs/common'
import { JobCategoryService } from './job-category.service'
import { QueryJobCategoryDto } from './dtos/query.dto'

@Controller('job-category')
export class JobCategoryController {
  constructor(private readonly service: JobCategoryService) {}

  @Get()
  findAll(@Query() query: QueryJobCategoryDto) {
    return this.service.findAll(query)
  }
}
