import { PrimaryGeneratedColumn } from 'typeorm'

export abstract class AbstractBaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: number
}
