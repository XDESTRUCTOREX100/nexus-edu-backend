import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CrearRolDto {
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsString()
  @IsOptional()
  descripcion?: string;
}
