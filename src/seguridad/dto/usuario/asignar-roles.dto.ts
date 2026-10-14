import {
  ArrayNotEmpty,
  IsArray,
  IsInt,
  IsOptional,
  IsString,
} from 'class-validator';

export class AsignarRolesDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsInt({ each: true })
  @IsOptional()
  rolesIds?: number[];

  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  @IsOptional()
  rolesNombres?: string[];
}
