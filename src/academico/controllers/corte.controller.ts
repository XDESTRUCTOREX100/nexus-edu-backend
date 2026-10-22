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
import { CorteService } from '../services/corte.service';
import { CreateCorteDto } from '../dto/corte/create-corte.dto';
import { UpdateCorteDto } from '../dto/corte/update-corte.dto';

@Controller('academico/cortes')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CorteController {
  constructor(private readonly corteService: CorteService) {}

  @Post()
  @Roles('ADMIN', 'COORDINADOR', 'administrador')
  create(@Body() createCorteDto: CreateCorteDto) {
    return this.corteService.create(createCorteDto);
  }

  @Get()
  @Roles('ADMIN', 'DOCENTE', 'ESTUDIANTE', 'administrador')
  findAll() {
    return this.corteService.findAll();
  }

  @Get(':id')
  @Roles('ADMIN', 'DOCENTE', 'ESTUDIANTE', 'administrador')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.corteService.findOne(id);
  }

  @Get(':id/actividades')
  @Roles('ADMIN', 'DOCENTE', 'ESTUDIANTE', 'administrador')
  findActividades(@Param('id', ParseIntPipe) id: number) {
    return this.corteService.findActividades(id);
  }

  @Patch(':id')
  @Roles('ADMIN', 'COORDINADOR', 'administrador')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCorteDto: UpdateCorteDto,
  ) {
    return this.corteService.update(id, updateCorteDto);
  }

  @Delete(':id')
  @Roles('ADMIN', 'COORDINADOR', 'administrador')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.corteService.remove(id);
  }
}
