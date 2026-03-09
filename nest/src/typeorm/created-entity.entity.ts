import { CreateDateColumn, UpdateDateColumn } from 'typeorm'
import { AbstractBaseEntity } from './base-entity.entity'

export abstract class AbstractCreatedEntity extends AbstractBaseEntity {
  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date
}
