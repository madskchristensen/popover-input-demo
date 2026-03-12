import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { JobCategory } from './entities/job-category.entity'

@Module({
  imports: [TypeOrmModule.forFeature([JobCategory])],
  controllers: [],
  providers: [],
  exports: [],
})
export class JobCategoryModule {}
