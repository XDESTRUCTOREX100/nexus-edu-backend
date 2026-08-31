import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, Min } from 'class-validator';

export class CreatePrerrequisitoDto {
  @Type(() => Number)
  @IsInt({ message: 'El ID de la asignatura debe ser un número entero.' })
  @Min(1, { message: 'El ID de la asignatura debe ser mayor que cero.' })
  @IsNotEmpty({ message: 'El ID de la asignatura es obligatorio.' })
  asignaturaId: number;

  @Type(() => Number)
  @IsInt({ message: 'El ID del prerrequisito debe ser un número entero.' })
  @Min(1, { message: 'El ID del prerrequisito debe ser mayor que cero.' })
  @IsNotEmpty({ message: 'El ID del prerrequisito es obligatorio.' })
  asignaturaPrerrequisitoId: number;
}
