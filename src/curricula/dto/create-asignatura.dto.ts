import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsString, Length, Min } from 'class-validator';

export class CreateAsignaturaDto {
  @IsString({ message: 'El código debe ser texto.' })
  @IsNotEmpty({ message: 'El código es obligatorio.' })
  @Length(1, 30, { message: 'El código debe tener entre 1 y 30 caracteres.' })
  codigo: string;

  @IsString({ message: 'El nombre debe ser texto.' })
  @IsNotEmpty({ message: 'El nombre es obligatorio.' })
  @Length(1, 150, { message: 'El nombre debe tener entre 1 y 150 caracteres.' })
  nombre: string;

  @Type(() => Number)
  @IsInt({ message: 'Los créditos deben ser un número entero.' })
  @Min(1, { message: 'Los créditos deben ser como mínimo 1.' })
  creditos: number;

  @Type(() => Number)
  @IsInt({ message: 'El ID del plan debe ser un número entero.' })
  @Min(1, { message: 'El ID del plan debe ser mayor que cero.' })
  planEstudioId: number;
}
