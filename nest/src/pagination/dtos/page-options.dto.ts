import { Type } from 'class-transformer'
import { IsInt, Min } from 'class-validator'

export class PageOptionsDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit: number = 20

  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = 1

  get skip(): number {
    return (this.page - 1) * this.limit
  }
}
