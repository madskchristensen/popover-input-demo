import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { JobRole } from '../../job-role/entities/job-role.entity'

@Entity()
export class JobCategory {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  name: string

  @Column({ unique: true })
  code: string

  @OneToMany(() => JobRole, (role) => role.jobCategory)
  roles: JobRole[]
}
