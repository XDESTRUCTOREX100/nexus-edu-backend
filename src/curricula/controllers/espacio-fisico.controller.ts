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
import { CreateEspacioFisicoDto } from '../dto/create-espacio-fisico.dto';
import { UpdateEspacioFisicoDto } from '../dto/update-espacio-fisico.dto';
import { EspacioFisicoService } from '../services/espacio-fisico.service';

@Controller('curricula/espacios-fisicos')
export class EspacioFisicoController {
  constructor(private readonly espacioFisicoService: EspacioFisicoService) {}

  @Post()
  create(@Body() createEspacioFisicoDto: CreateEspacioFisicoDto) {
    return this.espacioFisicoService.create(createEspacioFisicoDto);
  }

  @Get()
  findAll() {
    return this.espacioFisicoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.espacioFisicoService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateEspacioFisicoDto: UpdateEspacioFisicoDto,
  ) {
    return this.espacioFisicoService.update(id, updateEspacioFisicoDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.espacioFisicoService.remove(id);
  }
}
