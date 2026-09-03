import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/jwt-auth.guard';
import { RolesGuard } from '../common/roles.guard';
import { Roles } from '../common/roles.decorator';

@Controller('auditoria')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('administrador')
export class AuditController {
  @Get()
  findAll() {
    return { ok: true, message: 'Auditoría disponible' };
  }
}
