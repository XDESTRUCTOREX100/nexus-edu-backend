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
import { CreatePeriodoAcademicoDto } from '../dto/create-periodo-academico.dto';
import { UpdatePeriodoAcademicoDto } from '../dto/update-periodo-academico.dto';
import { PeriodoAcademicoService } from '../services/periodo-academico.service';

@Controller('curricula/periodos-academicos')
export class PeriodoAcademicoController {
  constructor(private readonly periodoAcademicoService: PeriodoAcademicoService) {}

  @Post()
  create(@Body() createPeriodoAcademicoDto: CreatePeriodoAcademicoDto) {
    return this.periodoAcademicoService.create(createPeriodoAcademicoDto);
  }

  @Get()
  findAll() {
    return this.periodoAcademicoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.periodoAcademicoService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePeriodoAcademicoDto: UpdatePeriodoAcademicoDto,
  ) {
    return this.periodoAcademicoService.update(id, updatePeriodoAcademicoDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.periodoAcademicoService.remove(id);
  }
}
