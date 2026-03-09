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
import { JobRoleService } from './job-role.service'
import {
  CreateJobRoleDto,
  QueryJobRoleDto,
  UpdateJobRoleDto,
} from './dtos/job-role.dto'

@Controller('job-role')
export class JobRoleController {
  constructor(private readonly service: JobRoleService) {}

  @Get()
  findAll(@Query() query: QueryJobRoleDto) {
    // When ?jobCategoryId= is supplied, this powers the dependent dropdown
    return this.service.findAll(query)
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id)
  }

  @Post()
  create(@Body() dto: CreateJobRoleDto) {
    return this.service.create(dto)
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateJobRoleDto) {
    return this.service.update(id, dto)
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.service.remove(id)
  }
}
