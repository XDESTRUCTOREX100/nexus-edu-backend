import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsNotEmpty, IsString, Matches, Min } from 'class-validator';
import { DiaSemana } from '../enums/academico.enums';

const HORA_VALIDATION = /^([01]\\d|2[0-3]):[0-5]\\d(:[0-5]\\d)?$/;

export class CreateHorarioDto {
  @Type(() => Number)
  @IsInt({ message: 'El ID de la asignatura debe ser entero.' })
  @Min(1, { message: 'El ID de la asignatura debe ser mayor que cero.' })
  asignaturaId: number;

  @Type(() => Number)
  @IsInt({ message: 'El ID del espacio físico debe ser entero.' })
  @Min(1, { message: 'El ID del espacio físico debe ser mayor que cero.' })
  espacioFisicoId: number;

  @Type(() => Number)
  @IsInt({ message: 'El ID del período debe ser entero.' })
  @Min(1, { message: 'El ID del período debe ser mayor que cero.' })
  periodoId: number;

  @IsEnum(DiaSemana, { message: 'El día de la semana no es válido.' })
  @IsNotEmpty({ message: 'El día de la semana es obligatorio.' })
  diaSemana: DiaSemana;

  @IsString({ message: 'La hora de inicio debe ser texto.' })
  @Matches(HORA_VALIDATION, { message: 'La hora de inicio debe tener formato HH:mm o HH:mm:ss.' })
  @IsNotEmpty({ message: 'La hora de inicio es obligatoria.' })
  horaInicio: string;

  @IsString({ message: 'La hora de fin debe ser texto.' })
  @Matches(HORA_VALIDATION, { message: 'La hora de fin debe tener formato HH:mm o HH:mm:ss.' })
  @IsNotEmpty({ message: 'La hora de fin es obligatoria.' })
  horaFin: string;
}
