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
import { CreatePlanEstudioDto } from '../dto/create-plan-estudio.dto';
import { UpdatePlanEstudioDto } from '../dto/update-plan-estudio.dto';
import { PlanEstudioService } from '../services/plan-estudio.service';

@Controller('curricula/planes-estudio')
export class PlanEstudioController {
  constructor(private readonly planEstudioService: PlanEstudioService) {}

  @Post()
  create(@Body() createPlanEstudioDto: CreatePlanEstudioDto) {
    return this.planEstudioService.create(createPlanEstudioDto);
  }

  @Get()
  findAll() {
    return this.planEstudioService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.planEstudioService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePlanEstudioDto: UpdatePlanEstudioDto,
  ) {
    return this.planEstudioService.update(id, updatePlanEstudioDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.planEstudioService.remove(id);
  }
}
