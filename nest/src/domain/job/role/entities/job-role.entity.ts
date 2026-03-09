import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm'
import { JobCategory } from '../../category/entities/job-category.entity'
import { JobApplication } from '../../application/entities/job-application.entity'
import { AbstractBaseEntity } from 'src/typeorm/base-entity.entity'

@Entity()
export class JobRole extends AbstractBaseEntity {
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
