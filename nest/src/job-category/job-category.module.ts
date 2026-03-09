import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { JobCategory } from './entities/job-category.entity'
import { JobCategoryService } from './job-category.service'
import { JobCategoryController } from './job-category.controller'

@Module({
  imports: [TypeOrmModule.forFeature([JobCategory])],
  controllers: [JobCategoryController],
  providers: [JobCategoryService],
  exports: [JobCategoryService],
})
export class JobCategoryModule {}
