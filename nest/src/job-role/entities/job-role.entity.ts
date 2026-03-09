import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { JobCategory } from '../../job-category/entities/job-category.entity'
import { JobApplication } from '../../job-application/entities/job-application.entity'

@Entity()
export class JobRole {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  title: string

  @Column()
  jobCategoryId: string

  @ManyToOne(() => JobCategory, (category) => category.roles, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'jobCategoryId' })
  jobCategory: JobCategory

  @OneToMany(() => JobApplication, (application) => application.jobRole)
  applications: JobApplication[]
}
