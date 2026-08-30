import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CrearPermisoDto {
  @IsString()
  @IsNotEmpty()
  recurso: string;

  @IsString()
  @IsNotEmpty()
  accion: string;

  @IsString()
  @IsOptional()
  descripcion?: string;
}
