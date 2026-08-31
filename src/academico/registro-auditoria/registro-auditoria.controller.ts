import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { RegistroAuditoriaService } from './registro-auditoria.service';
import { CreateRegistroAuditoriaDto } from '../dto/registro-auditoria/create-registro-auditoria.dto';

@Controller('academico/registros-auditoria')
export class RegistroAuditoriaController {
  constructor(
    private readonly registroAuditoriaService: RegistroAuditoriaService,
  ) {}

  @Post()
  create(@Body() createRegistroAuditoriaDto: CreateRegistroAuditoriaDto) {
    return this.registroAuditoriaService.create(createRegistroAuditoriaDto);
  }

  @Get()
  findAll(@Query('tabla') tabla?: string) {
    if (tabla) {
      return this.registroAuditoriaService.findByTabla(tabla);
    }
    return this.registroAuditoriaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.registroAuditoriaService.findOne(id);
  }
}
