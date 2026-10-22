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
import { InscripcionService } from '../services/inscripcion.service';
import { CreateInscripcionDto } from '../dto/inscripcion/create-inscripcion.dto';
import { UpdateInscripcionDto } from '../dto/inscripcion/update-inscripcion.dto';

@Controller('academico/inscripciones')
@UseGuards(JwtAuthGuard, RolesGuard)
export class InscripcionController {
  constructor(private readonly inscripcionService: InscripcionService) {}

  @Post()
  @Roles('ADMIN', 'COORDINADOR', 'administrador')
  create(@Body() createInscripcionDto: CreateInscripcionDto) {
    return this.inscripcionService.create(createInscripcionDto);
  }

  @Get()
  @Roles('ADMIN', 'DOCENTE', 'ESTUDIANTE', 'administrador')
  findAll() {
    return this.inscripcionService.findAll();
  }

  @Get(':id')
  @Roles('ADMIN', 'DOCENTE', 'ESTUDIANTE', 'administrador')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.inscripcionService.findOne(id);
  }

  @Get(':id/calificaciones')
  @Roles('ADMIN', 'DOCENTE', 'ESTUDIANTE', 'administrador')
  findCalificaciones(@Param('id', ParseIntPipe) id: number) {
    return this.inscripcionService.findCalificaciones(id);
  }

  @Get(':id/asistencias')
  @Roles('ADMIN', 'DOCENTE', 'ESTUDIANTE', 'administrador')
  findAsistencias(@Param('id', ParseIntPipe) id: number) {
    return this.inscripcionService.findAsistencias(id);
  }

  @Patch(':id')
  @Roles('ADMIN', 'COORDINADOR', 'administrador')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateInscripcionDto: UpdateInscripcionDto,
  ) {
    return this.inscripcionService.update(id, updateInscripcionDto);
  }

  @Delete(':id')
  @Roles('ADMIN', 'COORDINADOR', 'administrador')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.inscripcionService.remove(id);
  }
}
