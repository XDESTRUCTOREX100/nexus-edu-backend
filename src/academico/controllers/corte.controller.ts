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
import { CorteService } from '../services/corte.service';
import { CreateCorteDto } from '../dto/corte/create-corte.dto';
import { UpdateCorteDto } from '../dto/corte/update-corte.dto';

@Controller('academico/cortes')
export class CorteController {
  constructor(private readonly corteService: CorteService) {}

  @Post()
  create(@Body() createCorteDto: CreateCorteDto) {
    return this.corteService.create(createCorteDto);
  }

  @Get()
  findAll() {
    return this.corteService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.corteService.findOne(id);
  }

  @Get(':id/actividades')
  findActividades(@Param('id', ParseIntPipe) id: number) {
    return this.corteService.findActividades(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCorteDto: UpdateCorteDto,
  ) {
    return this.corteService.update(id, updateCorteDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.corteService.remove(id);
  }
}
