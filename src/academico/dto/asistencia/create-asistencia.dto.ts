import {
  IsDateString,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { EstadoAsistencia } from '../../entities/asistencia.entity';

export class CreateAsistenciaDto {
  @IsInt()
  @IsNotEmpty()
  inscripcionId: number;

  @IsDateString()
  @IsNotEmpty()
  fecha: string;

  @IsEnum(EstadoAsistencia)
  @IsOptional()
  estado?: EstadoAsistencia;

  @IsString()
  @IsOptional()
  observaciones?: string;
}
