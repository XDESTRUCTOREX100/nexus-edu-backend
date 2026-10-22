import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../seguridad/common/jwt-auth.guard';
import { Roles } from '../../seguridad/common/roles.decorator';
import { RolesGuard } from '../../seguridad/common/roles.guard';
import { AsistenciaService } from '../services/asistencia.service';
import { CreateAsistenciaDto } from '../dto/asistencia/create-asistencia.dto';
import { UpdateAsistenciaDto } from '../dto/asistencia/update-asistencia.dto';

@Controller('academico/asistencias')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AsistenciaController {
  constructor(private readonly asistenciaService: AsistenciaService) {}

  @Post()
  @Roles('ADMIN', 'COORDINADOR', 'DOCENTE', 'administrador')
  create(@Body() createAsistenciaDto: CreateAsistenciaDto) {
    return this.asistenciaService.create(createAsistenciaDto);
  }

  @Get()
  @Roles('ADMIN', 'DOCENTE', 'ESTUDIANTE', 'administrador')
  findAll() {
    return this.asistenciaService.findAll();
  }

  @Get(':id')
  @Roles('ADMIN', 'DOCENTE', 'ESTUDIANTE', 'administrador')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.asistenciaService.findOne(id);
  }

  @Patch(':id')
  @Roles('ADMIN', 'COORDINADOR', 'DOCENTE', 'administrador')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateAsistenciaDto: UpdateAsistenciaDto,
  ) {
    return this.asistenciaService.update(id, updateAsistenciaDto);
  }

  @Delete(':id')
  @Roles('ADMIN', 'COORDINADOR', 'DOCENTE', 'administrador')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.asistenciaService.remove(id);
  }
}
