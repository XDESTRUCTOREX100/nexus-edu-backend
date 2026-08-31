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
import { CreateCalendarioAcademicoDto } from '../dto/create-calendario-academico.dto';
import { UpdateCalendarioAcademicoDto } from '../dto/update-calendario-academico.dto';
import { CalendarioAcademicoService } from '../services/calendario-academico.service';

@Controller('curricula/calendario-academico')
export class CalendarioAcademicoController {
  constructor(
    private readonly calendarioAcademicoService: CalendarioAcademicoService,
  ) {}

  @Post()
  create(@Body() createCalendarioAcademicoDto: CreateCalendarioAcademicoDto) {
    return this.calendarioAcademicoService.create(createCalendarioAcademicoDto);
  }

  @Get()
  findAll() {
    return this.calendarioAcademicoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.calendarioAcademicoService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCalendarioAcademicoDto: UpdateCalendarioAcademicoDto,
  ) {
    return this.calendarioAcademicoService.update(id, updateCalendarioAcademicoDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.calendarioAcademicoService.remove(id);
  }
}
