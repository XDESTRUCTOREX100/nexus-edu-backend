import {
  IsDateString,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { EstadoMatricula } from '../../entities/matricula.entity';

export class CreateMatriculaDto {
  @IsInt()
  @IsNotEmpty()
  estudianteId: number;

  @IsString()
  @IsNotEmpty()
  periodoAcademico: string;

  @IsDateString()
  @IsNotEmpty()
  fechaMatricula: string;

  @IsEnum(EstadoMatricula)
  @IsOptional()
  estado?: EstadoMatricula;
}
