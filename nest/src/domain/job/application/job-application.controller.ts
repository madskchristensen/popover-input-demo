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

@Controller('job-applications')
export class JobApplicationController {
  constructor(private readonly service: JobApplicationService) {}

  @Get()
  findAll(@Query() query: QueryJobApplicationDto) {
    return this.service.findAll(query)
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
