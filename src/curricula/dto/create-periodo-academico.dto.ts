import { IsDateString, IsEnum, IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';
import { EstadoPeriodoAcademico } from '../enums/academico.enums';

export class CreatePeriodoAcademicoDto {
  @IsString({ message: 'El código debe ser texto.' })
  @IsNotEmpty({ message: 'El código es obligatorio.' })
  @Length(1, 30, { message: 'El código debe tener entre 1 y 30 caracteres.' })
  codigo: string;

  @IsDateString({}, { message: 'La fecha de inicio debe ser ISO válida.' })
  @IsNotEmpty({ message: 'La fecha de inicio es obligatoria.' })
  fechaInicio: string;

  @IsDateString({}, { message: 'La fecha de fin debe ser ISO válida.' })
  @IsNotEmpty({ message: 'La fecha de fin es obligatoria.' })
  fechaFin: string;

  @IsEnum(EstadoPeriodoAcademico, { message: 'El estado debe ser ACTIVO o INACTIVO.' })
  @IsOptional()
  estado?: EstadoPeriodoAcademico;
}
