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
import { CreateAsignaturaDto } from '../dto/create-asignatura.dto';
import { UpdateAsignaturaDto } from '../dto/update-asignatura.dto';
import { AsignaturaService } from '../services/asignatura.service';

@Controller('curricula/asignaturas')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AsignaturaController {
  constructor(private readonly asignaturaService: AsignaturaService) {}

  @Post()
  @Roles('ADMIN', 'DOCENTE', 'administrador')
  create(@Body() createAsignaturaDto: CreateAsignaturaDto) {
    return this.asignaturaService.create(createAsignaturaDto);
  }

  @Get()
  @Roles('ADMIN', 'DOCENTE', 'ESTUDIANTE', 'administrador')
  findAll() {
    return this.asignaturaService.findAll();
  }

  @Get(':id')
  @Roles('ADMIN', 'DOCENTE', 'ESTUDIANTE', 'administrador')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.asignaturaService.findOne(id);
  }

  @Patch(':id')
  @Roles('ADMIN', 'DOCENTE', 'administrador')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateAsignaturaDto: UpdateAsignaturaDto,
  ) {
    return this.asignaturaService.update(id, updateAsignaturaDto);
  }

  @Delete(':id')
  @Roles('ADMIN', 'administrador')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.asignaturaService.remove(id);
  }
}
