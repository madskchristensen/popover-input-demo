import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { JobRole } from './domain/job/role/entities/job-role.entity'
import { JobRoleModule } from './domain/job/role/job-role.module'
import { JobApplication } from './domain/job/application/entities/job-application.entity'
import { JobCategory } from './domain/job/category/entities/job-category.entity'
import { JobCategoryModule } from './domain/job/category/job-category.module'
import { JobApplicationModule } from './domain/job/application/job-application.module'
import { SeederModule } from './seeder/seeder.module'

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST ?? 'localhost',
      port: Number(process.env.DB_PORT) ?? 5432,
      username: process.env.DB_USER ?? 'postgres',
      password: process.env.DB_PASSWORD ?? 'postgres',
      database: process.env.DB_NAME ?? 'popover_presentation_db',
      entities: [JobCategory, JobRole, JobApplication],
      synchronize: true, // disable in production — use migrations
    }),
    SeederModule,
    JobCategoryModule,
    JobRoleModule,
    JobApplicationModule,
  ],
})
export class AppModule {}
