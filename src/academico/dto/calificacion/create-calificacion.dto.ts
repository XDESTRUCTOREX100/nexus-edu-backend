import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class CreateCalificacionDto {
  @IsInt()
  @IsNotEmpty()
  inscripcionId: number;

  @IsInt()
  @IsNotEmpty()
  corteId: number;

  @IsInt()
  @IsOptional()
  actividadId?: number;

  @IsNumber()
  @Min(0)
  @Max(5)
  nota: number;

  @IsString()
  @IsOptional()
  observaciones?: string;
}
