import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';
import { OperacionAuditoria } from '../../entities/registro-auditoria.entity';

export class CreateRegistroAuditoriaDto {
  @IsString()
  @IsNotEmpty()
  tablaAfectada: string;

  @IsEnum(OperacionAuditoria)
  @IsNotEmpty()
  operacion: OperacionAuditoria;

  @IsInt()
  @IsNotEmpty()
  registroId: number;

  @IsObject()
  @IsOptional()
  datosAnteriores?: Record<string, unknown>;

  @IsObject()
  @IsOptional()
  datosNuevos?: Record<string, unknown>;

  @IsInt()
  @IsNotEmpty()
  usuarioId: number;

  @IsString()
  @IsOptional()
  ipAddress?: string;
}
