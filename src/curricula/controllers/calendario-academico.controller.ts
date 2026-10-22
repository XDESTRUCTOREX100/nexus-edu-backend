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
import { CreateCalendarioAcademicoDto } from '../dto/create-calendario-academico.dto';
import { UpdateCalendarioAcademicoDto } from '../dto/update-calendario-academico.dto';
import { CalendarioAcademicoService } from '../services/calendario-academico.service';

@Controller('curricula/calendario-academico')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CalendarioAcademicoController {
  constructor(
    private readonly calendarioAcademicoService: CalendarioAcademicoService,
  ) {}

  @Post()
  @Roles('ADMIN', 'COORDINADOR', 'administrador')
  create(@Body() createCalendarioAcademicoDto: CreateCalendarioAcademicoDto) {
    return this.calendarioAcademicoService.create(createCalendarioAcademicoDto);
  }

  @Get()
  @Roles('ADMIN', 'DOCENTE', 'ESTUDIANTE', 'administrador')
  findAll() {
    return this.calendarioAcademicoService.findAll();
  }

  @Get(':id')
  @Roles('ADMIN', 'DOCENTE', 'ESTUDIANTE', 'administrador')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.calendarioAcademicoService.findOne(id);
  }

  @Patch(':id')
  @Roles('ADMIN', 'COORDINADOR', 'administrador')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCalendarioAcademicoDto: UpdateCalendarioAcademicoDto,
  ) {
    return this.calendarioAcademicoService.update(id, updateCalendarioAcademicoDto);
  }

  @Delete(':id')
  @Roles('ADMIN', 'COORDINADOR', 'administrador')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.calendarioAcademicoService.remove(id);
  }
}
