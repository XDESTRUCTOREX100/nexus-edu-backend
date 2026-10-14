import { IsNotEmpty, IsString, Length } from 'class-validator';

export class CrearRolDto {
  @IsString()
  @IsNotEmpty()
  @Length(1, 100)
  nombre: string;

  @IsString()
  @IsNotEmpty()
  @Length(1, 255)
  descripcion: string;
}
