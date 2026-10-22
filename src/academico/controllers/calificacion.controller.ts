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
import { CalificacionService } from '../services/calificacion.service';
import { CreateCalificacionDto } from '../dto/calificacion/create-calificacion.dto';
import { UpdateCalificacionDto } from '../dto/calificacion/update-calificacion.dto';

@Controller('academico/calificaciones')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CalificacionController {
  constructor(private readonly calificacionService: CalificacionService) {}

  @Post()
  @Roles('ADMIN', 'COORDINADOR', 'DOCENTE', 'administrador')
  create(@Body() createCalificacionDto: CreateCalificacionDto) {
    return this.calificacionService.create(createCalificacionDto);
  }

  @Get()
  @Roles('ADMIN', 'DOCENTE', 'ESTUDIANTE', 'administrador')
  findAll() {
    return this.calificacionService.findAll();
  }

  @Get(':id')
  @Roles('ADMIN', 'DOCENTE', 'ESTUDIANTE', 'administrador')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.calificacionService.findOne(id);
  }

  @Patch(':id')
  @Roles('ADMIN', 'COORDINADOR', 'DOCENTE', 'administrador')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCalificacionDto: UpdateCalificacionDto,
  ) {
    return this.calificacionService.update(id, updateCalificacionDto);
  }

  @Delete(':id')
  @Roles('ADMIN', 'administrador')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.calificacionService.remove(id);
  }
}
