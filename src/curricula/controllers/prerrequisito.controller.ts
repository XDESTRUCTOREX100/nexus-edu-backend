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
import { CreatePrerrequisitoDto } from '../dto/create-prerrequisito.dto';
import { UpdatePrerrequisitoDto } from '../dto/update-prerrequisito.dto';
import { PrerrequisitoService } from '../services/prerrequisito.service';

@Controller('curricula/prerrequisitos')
export class PrerrequisitoController {
  constructor(private readonly prerrequisitoService: PrerrequisitoService) {}

  @Post()
  create(@Body() createPrerrequisitoDto: CreatePrerrequisitoDto) {
    return this.prerrequisitoService.create(createPrerrequisitoDto);
  }

  @Get()
  findAll() {
    return this.prerrequisitoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.prerrequisitoService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePrerrequisitoDto: UpdatePrerrequisitoDto,
  ) {
    return this.prerrequisitoService.update(id, updatePrerrequisitoDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.prerrequisitoService.remove(id);
  }
}
