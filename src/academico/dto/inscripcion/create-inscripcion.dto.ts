import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { EstadoInscripcion } from '../../entities/inscripcion.entity';

export class CreateInscripcionDto {
  @IsInt()
  @IsNotEmpty()
  matriculaId: number;

  @IsInt()
  @IsNotEmpty()
  cursoId: number;

  @IsInt()
  @IsNotEmpty()
  docenteId: number;

  @IsString()
  @IsOptional()
  grupo?: string;

  @IsEnum(EstadoInscripcion)
  @IsOptional()
  estado?: EstadoInscripcion;
}
