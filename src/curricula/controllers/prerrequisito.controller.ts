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
import { CreatePrerrequisitoDto } from '../dto/create-prerrequisito.dto';
import { UpdatePrerrequisitoDto } from '../dto/update-prerrequisito.dto';
import { PrerrequisitoService } from '../services/prerrequisito.service';

@Controller('curricula/prerrequisitos')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PrerrequisitoController {
  constructor(private readonly prerrequisitoService: PrerrequisitoService) {}

  @Post()
  @Roles('ADMIN', 'COORDINADOR', 'administrador')
  create(@Body() createPrerrequisitoDto: CreatePrerrequisitoDto) {
    return this.prerrequisitoService.create(createPrerrequisitoDto);
  }

  @Get()
  @Roles('ADMIN', 'DOCENTE', 'ESTUDIANTE', 'administrador')
  findAll() {
    return this.prerrequisitoService.findAll();
  }

  @Get(':id')
  @Roles('ADMIN', 'DOCENTE', 'ESTUDIANTE', 'administrador')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.prerrequisitoService.findOne(id);
  }

  @Patch(':id')
  @Roles('ADMIN', 'COORDINADOR', 'administrador')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePrerrequisitoDto: UpdatePrerrequisitoDto,
  ) {
    return this.prerrequisitoService.update(id, updatePrerrequisitoDto);
  }

  @Delete(':id')
  @Roles('ADMIN', 'COORDINADOR', 'administrador')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.prerrequisitoService.remove(id);
  }
}
