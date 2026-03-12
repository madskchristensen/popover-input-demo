import { Controller, Get, Query } from '@nestjs/common'
import { JobApplicationService } from './job-application.service'
import { QueryJobApplicationDto } from './dtos/job-application.dto'
import { ApiPaginatedResponse } from 'src/pagination/decorators/pagionated.decorator'
import { JobApplication } from './entities/job-application.entity'
import { pageDtoFrom } from 'src/pagination'
import { ApiSearchQuery } from 'src/search/decorators/search.decorator'

@Controller('job-application')
export class JobApplicationController {
  constructor(private readonly service: JobApplicationService) {}

  @Get()
  @ApiSearchQuery()
  @ApiPaginatedResponse(JobApplication)
  async findAll(@Query() query: QueryJobApplicationDto) {
    const [found, total] = await this.service.findPaginated(query)

    return pageDtoFrom(found, query, total)
  }
}
