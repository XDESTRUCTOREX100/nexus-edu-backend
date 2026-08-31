import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Actividad } from '../entities/actividad.entity';
import { CreateActividadDto } from '../dto/actividad/create-actividad.dto';
import { UpdateActividadDto } from '../dto/actividad/update-actividad.dto';

@Injectable()
export class ActividadService {
  constructor(
    @InjectRepository(Actividad)
    private readonly actividadRepository: Repository<Actividad>,
  ) {}

  async create(createActividadDto: CreateActividadDto): Promise<Actividad> {
    const actividad = this.actividadRepository.create(createActividadDto);
    return this.actividadRepository.save(actividad);
  }

  async findAll(): Promise<Actividad[]> {
    return this.actividadRepository.find({ relations: { corte: true } });
  }

  async findOne(id: number): Promise<Actividad> {
    const actividad = await this.actividadRepository.findOne({
      where: { id },
      relations: { corte: true },
    });
    if (!actividad) {
      throw new NotFoundException(`Actividad con ID ${id} no encontrada`);
    }
    return actividad;
  }

  async update(
    id: number,
    updateActividadDto: UpdateActividadDto,
  ): Promise<Actividad> {
    await this.findOne(id);
    await this.actividadRepository.update(id, updateActividadDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.findOne(id);
    await this.actividadRepository.delete(id);
  }
}
