import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CrearAuditoriaDto {
  @IsString()
  @IsNotEmpty()
  accion!: string;

  @IsInt()
  @IsOptional()
  usuarioId?: number;

  @IsString()
  @IsOptional()
  modulo?: string;

  @IsString()
  @IsOptional()
  detalles?: string;

  @IsString()
  @IsOptional()
  ipAddress?: string;
}
