import { ApplicationStatus } from 'src/enums/application-status'
import { JobRole } from 'src/job-role/entities/job-role.entity'
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

@Entity()
export class JobApplication {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  firstName: string

  @Column()
  lastName: string

  @Column()
  email: string

  @Column({ length: 2 })
  country: string // ISO 3166-1 alpha-2 e.g. 'DK', 'US'

  @Column({
    type: 'enum',
    enum: ApplicationStatus,
    default: ApplicationStatus.NEW,
  })
  status: ApplicationStatus

  @Column()
  jobRoleId: string

  @ManyToOne(() => JobRole, (role) => role.applications, {
    onDelete: 'RESTRICT',
    eager: true,
  })
  @JoinColumn({ name: 'jobRoleId' })
  jobRole: JobRole

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
