import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common'
import { JobApplicationService } from './job-application.service'
import {
  CreateJobApplicationDto,
  QueryJobApplicationDto,
  UpdateJobApplicationDto,
} from './dtos/job-application.dto'
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
    console.log(query)
    const [found, total] = await this.service.findAll(query)

    return pageDtoFrom(found, query, total)
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id)
  }

  @Post()
  create(@Body() dto: CreateJobApplicationDto) {
    return this.service.create(dto)
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateJobApplicationDto) {
    return this.service.update(id, dto)
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.service.remove(id)
  }
}
