import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../common/jwt-auth.guard';
import { RolesGuard } from '../common/roles.guard';
import { Roles } from '../common/roles.decorator';
import { AuditService } from '../services/audit.service';
import { FiltroAuditoriaDto } from '../dto/auditoria/filtro-auditoria.dto';
import { CrearAuditoriaDto } from '../dto/auditoria/crear-auditoria.dto';

@Controller('auditoria')
export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('administrador')
  findAll(@Query() filtro: FiltroAuditoriaDto) {
    return this.auditService.findAll(filtro);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('administrador')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.auditService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('administrador')
  create(@Body() dto: CrearAuditoriaDto) {
    return this.auditService.create(dto);
  }
}
