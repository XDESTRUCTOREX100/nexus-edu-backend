import {
  IsDateString,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { EstadoMatricula } from '../../entities/matricula.entity';

export class CreateMatriculaDto {
  @IsInt()
  @IsNotEmpty()
  estudianteId: number;

  @IsString()
  @IsNotEmpty()
  @Length(1, 50)
  documentoIdentidad: string;

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
