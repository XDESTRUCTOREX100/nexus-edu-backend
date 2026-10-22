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
import { MatriculaService } from '../services/matricula.service';
import { CreateMatriculaDto } from '../dto/matricula/create-matricula.dto';
import { UpdateMatriculaDto } from '../dto/matricula/update-matricula.dto';

@Controller('academico/matriculas')
@UseGuards(JwtAuthGuard, RolesGuard)
export class MatriculaController {
  constructor(private readonly matriculaService: MatriculaService) {}

  @Post()
  @Roles('ADMIN', 'COORDINADOR', 'administrador')
  create(@Body() createMatriculaDto: CreateMatriculaDto) {
    return this.matriculaService.create(createMatriculaDto);
  }

  @Get()
  @Roles('ADMIN', 'DOCENTE', 'ESTUDIANTE', 'administrador')
  findAll() {
    return this.matriculaService.findAll();
  }

  @Get(':id')
  @Roles('ADMIN', 'DOCENTE', 'ESTUDIANTE', 'administrador')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.matriculaService.findOne(id);
  }

  @Get(':id/inscripciones')
  @Roles('ADMIN', 'DOCENTE', 'ESTUDIANTE', 'administrador')
  findInscripciones(@Param('id', ParseIntPipe) id: number) {
    return this.matriculaService.findInscripciones(id);
  }

  @Patch(':id')
  @Roles('ADMIN', 'COORDINADOR', 'administrador')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateMatriculaDto: UpdateMatriculaDto,
  ) {
    return this.matriculaService.update(id, updateMatriculaDto);
  }

  @Delete(':id')
  @Roles('ADMIN', 'COORDINADOR', 'administrador')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.matriculaService.remove(id);
  }
}
