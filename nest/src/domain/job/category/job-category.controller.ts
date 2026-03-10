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
import { JobCategoryService } from './job-category.service'
import { QueryJobCategoryDto } from './dtos/query.dto'
import { CreateJobCategoryDto } from './dtos/create.dto'

@Controller('job-category')
export class JobCategoryController {
  constructor(private readonly service: JobCategoryService) {}

  @Get()
  findAll(@Query() query: QueryJobCategoryDto) {
    return this.service.findAll(query)
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id)
  }

  @Post()
  create(@Body() dto: CreateJobCategoryDto) {
    return this.service.create(dto)
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: CreateJobCategoryDto) {
    return this.service.update(id, dto)
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.service.remove(id)
  }
}
