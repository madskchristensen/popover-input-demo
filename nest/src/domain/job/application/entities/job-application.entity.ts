import { ApplicationStatus } from 'src/domain/job/application/enums/application-status'
import { JobRole } from 'src/domain/job/role/entities/job-role.entity'
import { AbstractCreatedEntity } from 'src/typeorm/created-entity.entity'
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm'

@Entity()
export class JobApplication extends AbstractCreatedEntity {
  @Column()
  firstName: string

  @Column()
  lastName: string

  @Column()
  email: string

  @Column({ length: 2, comment: `ISO 3166-1 alpha-2 e.g. 'DK', 'US'` })
  country: string

  @Column({
    type: 'enum',
    enum: ApplicationStatus,
    default: ApplicationStatus.NEW,
  })
  status: ApplicationStatus

  // TODO: Proably need to add   @ForeignKey()
  @Column()
  jobRoleId: string

  @ManyToOne(() => JobRole, (role) => role.applications, {
    onDelete: 'RESTRICT', // TODO: Keep or change?
    eager: true,
  })
  @JoinColumn({ name: 'jobRoleId' })
  jobRole: JobRole
}
