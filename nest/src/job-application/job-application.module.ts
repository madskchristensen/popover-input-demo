import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { JobApplication } from './entities/job-application.entity'
import { JobApplicationService } from './job-application.service'
import { JobApplicationController } from './job-application.controller'
import { JobRoleModule } from '../job-role/job-role.module'

@Module({
  imports: [TypeOrmModule.forFeature([JobApplication]), JobRoleModule],
  controllers: [JobApplicationController],
  providers: [JobApplicationService],
  exports: [JobApplicationService],
})
export class JobApplicationModule {}
