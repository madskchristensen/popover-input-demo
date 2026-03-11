import { Column, Entity, OneToMany } from 'typeorm'
import { JobRole } from '../../role/entities/job-role.entity'
import { AbstractBaseEntity } from 'src/typeorm/base-entity.entity'

@Entity()
export class JobCategory extends AbstractBaseEntity {
  @Column()
  name: string

  // TODO: Use PrimaryColumn, with ENUM.
  @Column({ unique: true })
  code: string

  @OneToMany(() => JobRole, (role) => role.jobCategory)
  roles: JobRole[]
}
