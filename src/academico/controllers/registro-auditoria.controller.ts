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
import { JwtAuthGuard } from '../../seguridad/common/jwt-auth.guard';
import { Roles } from '../../seguridad/common/roles.decorator';
import { RolesGuard } from '../../seguridad/common/roles.guard';
import { RegistroAuditoriaService } from '../services/registro-auditoria.service';
import { CreateRegistroAuditoriaDto } from '../dto/registro-auditoria/create-registro-auditoria.dto';

@Controller('academico/registros-auditoria')
@UseGuards(JwtAuthGuard, RolesGuard)
export class RegistroAuditoriaController {
  constructor(
    private readonly registroAuditoriaService: RegistroAuditoriaService,
  ) {}

  @Post()
  @Roles('ADMIN', 'administrador')
  create(@Body() createRegistroAuditoriaDto: CreateRegistroAuditoriaDto) {
    return this.registroAuditoriaService.create(createRegistroAuditoriaDto);
  }

  @Get()
  @Roles('ADMIN', 'administrador')
  findAll(@Query('tabla') tabla?: string) {
    if (tabla) {
      return this.registroAuditoriaService.findByTabla(tabla);
    }
    return this.registroAuditoriaService.findAll();
  }

  @Get(':id')
  @Roles('ADMIN', 'administrador')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.registroAuditoriaService.findOne(id);
  }
}
