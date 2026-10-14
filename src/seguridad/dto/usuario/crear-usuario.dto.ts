import {
  ArrayNotEmpty,
  IsArray,
  IsBoolean,
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  MinLength,
} from 'class-validator';

export class CrearUsuarioDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @Length(1, 150)
  nombre: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  @IsNotEmpty()
  @Length(1, 50)
  identificacion: string;

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

  @IsBoolean()
  @IsOptional()
  activo?: boolean;
}
