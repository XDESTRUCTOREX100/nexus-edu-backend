import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsNotEmpty, IsString, Length, Min } from 'class-validator';
import { TipoEspacioFisico } from '../enums/academico.enums';

export class CreateEspacioFisicoDto {
  @IsString({ message: 'El código debe ser texto.' })
  @IsNotEmpty({ message: 'El código es obligatorio.' })
  @Length(1, 30, { message: 'El código debe tener entre 1 y 30 caracteres.' })
  codigo: string;

  @IsString({ message: 'El nombre debe ser texto.' })
  @IsNotEmpty({ message: 'El nombre es obligatorio.' })
  @Length(1, 150, { message: 'El nombre debe tener entre 1 y 150 caracteres.' })
  nombre: string;

  @Type(() => Number)
  @IsInt({ message: 'La capacidad debe ser un número entero.' })
  @Min(1, { message: 'La capacidad debe ser como mínimo 1.' })
  capacidad: number;

  @IsEnum(TipoEspacioFisico, { message: 'El tipo de espacio no es válido.' })
  @IsNotEmpty({ message: 'El tipo de espacio es obligatorio.' })
  tipo: TipoEspacioFisico;
}
