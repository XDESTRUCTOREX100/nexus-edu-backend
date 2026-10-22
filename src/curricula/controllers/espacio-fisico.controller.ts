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
import { CreateEspacioFisicoDto } from '../dto/create-espacio-fisico.dto';
import { UpdateEspacioFisicoDto } from '../dto/update-espacio-fisico.dto';
import { EspacioFisicoService } from '../services/espacio-fisico.service';

@Controller('curricula/espacios-fisicos')
@UseGuards(JwtAuthGuard, RolesGuard)
export class EspacioFisicoController {
  constructor(private readonly espacioFisicoService: EspacioFisicoService) {}

  @Post()
  @Roles('ADMIN', 'COORDINADOR', 'administrador')
  create(@Body() createEspacioFisicoDto: CreateEspacioFisicoDto) {
    return this.espacioFisicoService.create(createEspacioFisicoDto);
  }

  @Get()
  @Roles('ADMIN', 'DOCENTE', 'ESTUDIANTE', 'administrador')
  findAll() {
    return this.espacioFisicoService.findAll();
  }

  @Get(':id')
  @Roles('ADMIN', 'DOCENTE', 'ESTUDIANTE', 'administrador')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.espacioFisicoService.findOne(id);
  }

  @Patch(':id')
  @Roles('ADMIN', 'COORDINADOR', 'administrador')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateEspacioFisicoDto: UpdateEspacioFisicoDto,
  ) {
    return this.espacioFisicoService.update(id, updateEspacioFisicoDto);
  }

  @Delete(':id')
  @Roles('ADMIN', 'COORDINADOR', 'administrador')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.espacioFisicoService.remove(id);
  }
}
