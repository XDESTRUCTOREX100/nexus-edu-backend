import {
  IsDateString,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { TipoActividad } from '../../entities/actividad.entity';

export class CreateActividadDto {
  @IsInt()
  @IsNotEmpty()
  corteId: number;

  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsEnum(TipoActividad)
  @IsOptional()
  tipo?: TipoActividad;

  @IsNumber()
  @Min(0)
  @Max(100)
  porcentaje: number;

  @IsDateString()
  @IsNotEmpty()
  fecha: string;

  @IsString()
  @IsOptional()
  descripcion?: string;
}
