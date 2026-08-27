import { Type } from 'class-transformer';
import { IsDateString, IsInt, IsNotEmpty, IsString, Length, Min } from 'class-validator';

export class CreateCalendarioAcademicoDto {
  @Type(() => Number)
  @IsInt({ message: 'El ID del período debe ser entero.' })
  @Min(1, { message: 'El ID del período debe ser mayor que cero.' })
  periodoId: number;

  @IsString({ message: 'El evento debe ser texto.' })
  @IsNotEmpty({ message: 'El evento es obligatorio.' })
  @Length(1, 200, { message: 'El evento debe tener entre 1 y 200 caracteres.' })
  evento: string;

  @IsDateString({}, { message: 'La fecha de inicio debe ser ISO válida.' })
  @IsNotEmpty({ message: 'La fecha de inicio es obligatoria.' })
  fechaInicio: string;

  @IsDateString({}, { message: 'La fecha de fin debe ser ISO válida.' })
  @IsNotEmpty({ message: 'La fecha de fin es obligatoria.' })
  fechaFin: string;
}
