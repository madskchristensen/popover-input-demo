import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { JobCategory } from 'src/domain/job/category/entities/job-category.entity'
import { JobRole } from 'src/domain/job/role/entities/job-role.entity'
import { JobApplication } from 'src/domain/job/application/entities/job-application.entity'
import { SeederService } from './seeder.service'

@Module({
  imports: [TypeOrmModule.forFeature([JobCategory, JobRole, JobApplication])],
  providers: [SeederService],
})
export class SeederModule {}
