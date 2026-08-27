import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { InscripcionService } from './inscripcion.service';
import { CreateInscripcionDto } from '../dto/inscripcion/create-inscripcion.dto';
import { UpdateInscripcionDto } from '../dto/inscripcion/update-inscripcion.dto';

@Controller('academico/inscripciones')
export class InscripcionController {
  constructor(private readonly inscripcionService: InscripcionService) {}

  @Post()
  create(@Body() createInscripcionDto: CreateInscripcionDto) {
    return this.inscripcionService.create(createInscripcionDto);
  }

  @Get()
  findAll() {
    return this.inscripcionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.inscripcionService.findOne(id);
  }

  @Get(':id/calificaciones')
  findCalificaciones(@Param('id', ParseIntPipe) id: number) {
    return this.inscripcionService.findCalificaciones(id);
  }

  @Get(':id/asistencias')
  findAsistencias(@Param('id', ParseIntPipe) id: number) {
    return this.inscripcionService.findAsistencias(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateInscripcionDto: UpdateInscripcionDto,
  ) {
    return this.inscripcionService.update(id, updateInscripcionDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.inscripcionService.remove(id);
  }
}
