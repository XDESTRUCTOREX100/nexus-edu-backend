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
import { CreatePlanEstudioDto } from '../dto/create-plan-estudio.dto';
import { UpdatePlanEstudioDto } from '../dto/update-plan-estudio.dto';
import { PlanEstudioService } from '../services/plan-estudio.service';

@Controller('curricula/planes-estudio')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PlanEstudioController {
  constructor(private readonly planEstudioService: PlanEstudioService) {}

  @Post()
  @Roles('ADMIN', 'COORDINADOR', 'administrador')
  create(@Body() createPlanEstudioDto: CreatePlanEstudioDto) {
    return this.planEstudioService.create(createPlanEstudioDto);
  }

  @Get()
  @Roles('ADMIN', 'DOCENTE', 'ESTUDIANTE', 'administrador')
  findAll() {
    return this.planEstudioService.findAll();
  }

  @Get(':id')
  @Roles('ADMIN', 'DOCENTE', 'ESTUDIANTE', 'administrador')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.planEstudioService.findOne(id);
  }

  @Patch(':id')
  @Roles('ADMIN', 'COORDINADOR', 'administrador')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePlanEstudioDto: UpdatePlanEstudioDto,
  ) {
    return this.planEstudioService.update(id, updatePlanEstudioDto);
  }

  @Delete(':id')
  @Roles('ADMIN', 'COORDINADOR', 'administrador')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.planEstudioService.remove(id);
  }
}
