import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { JobRole } from './entities/job-role.entity'

@Module({
  imports: [TypeOrmModule.forFeature([JobRole])],
  controllers: [],
  providers: [],
  exports: [],
})
export class JobRoleModule {}
