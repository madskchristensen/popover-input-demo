import { Transform, Type } from 'class-transformer'
import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsDefined,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator'
import { toBoolean } from '../util/to-boolean'

export class SearchDto {
  @IsNotEmpty()
  @IsString()
  table: string

  @IsDefined()
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => SearchColumnDto)
  columns: SearchColumnDto[]
}
export class SearchPayload {
  @IsNotEmpty()
  @IsString()
  value: string

  @IsDefined()
  @IsBoolean()
  /**
   * The value of this property will be casted as string. Therefore, using a transform to fix that.
   * See: https://github.com/typestack/class-transformer/issues/550
   */
  @Transform(toBoolean)
  exact: boolean

  @Transform(toBoolean)
  @IsOptional()
  allowMultiple?: boolean
}

export class SearchColumnDto {
  @IsNotEmpty()
  @IsString()
  name: string

  @IsDefined()
  @ValidateNested()
  @Type(() => SearchPayload)
  payload: SearchPayload
}
