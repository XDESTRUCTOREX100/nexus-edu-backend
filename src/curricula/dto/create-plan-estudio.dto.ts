import { IsDateString, IsEnum, IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';
import { EstadoPlanEstudio } from '../enums/academico.enums';

export class CreatePlanEstudioDto {
  @IsString({ message: 'El código debe ser texto.' })
  @IsNotEmpty({ message: 'El código es obligatorio.' })
  @Length(1, 30, { message: 'El código debe tener entre 1 y 30 caracteres.' })
  codigo: string;

  @IsString({ message: 'El nombre debe ser texto.' })
  @IsNotEmpty({ message: 'El nombre es obligatorio.' })
  @Length(1, 150, { message: 'El nombre debe tener entre 1 y 150 caracteres.' })
  nombre: string;

  @IsDateString({}, { message: 'La fecha de aprobación debe ser una fecha ISO válida.' })
  @IsNotEmpty({ message: 'La fecha de aprobación es obligatoria.' })
  fechaAprobacion: string;

  @IsEnum(EstadoPlanEstudio, { message: 'El estado debe ser ACTIVO o INACTIVO.' })
  @IsOptional()
  estado?: EstadoPlanEstudio;
}
