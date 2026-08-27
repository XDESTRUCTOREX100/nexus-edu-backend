import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RegistroAuditoria } from '../entities/registro-auditoria.entity';
import { RegistroAuditoriaService } from './registro-auditoria.service';
import { RegistroAuditoriaController } from './registro-auditoria.controller';

@Module({
  imports: [TypeOrmModule.forFeature([RegistroAuditoria])],
  controllers: [RegistroAuditoriaController],
  providers: [RegistroAuditoriaService],
  exports: [RegistroAuditoriaService],
})
export class RegistroAuditoriaModule {}
