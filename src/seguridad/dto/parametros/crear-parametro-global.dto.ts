import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CrearParametroGlobalDto {
  @IsString()
  @IsNotEmpty()
  clave: string;

  @IsString()
  @IsNotEmpty()
  valor: string;

  @IsString()
  @IsOptional()
  descripcion?: string;
}
