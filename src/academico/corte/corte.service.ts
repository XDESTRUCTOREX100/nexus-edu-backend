import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Corte } from '../entities/corte.entity';
import { CreateCorteDto } from '../dto/corte/create-corte.dto';
import { UpdateCorteDto } from '../dto/corte/update-corte.dto';

@Injectable()
export class CorteService {
  constructor(
    @InjectRepository(Corte)
    private readonly corteRepository: Repository<Corte>,
  ) {}

  async create(createCorteDto: CreateCorteDto): Promise<Corte> {
    const corte = this.corteRepository.create(createCorteDto);
    return this.corteRepository.save(corte);
  }

  async findAll(): Promise<Corte[]> {
    return this.corteRepository.find({ relations: { actividades: true } });
  }

  async findOne(id: number): Promise<Corte> {
    const corte = await this.corteRepository.findOne({
      where: { id },
      relations: { actividades: true },
    });
    if (!corte) {
      throw new NotFoundException(`Corte con ID ${id} no encontrado`);
    }
    return corte;
  }

  async update(id: number, updateCorteDto: UpdateCorteDto): Promise<Corte> {
    await this.findOne(id);
    await this.corteRepository.update(id, updateCorteDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.findOne(id);
    await this.corteRepository.delete(id);
  }

  async findActividades(id: number): Promise<Corte> {
    const corte = await this.corteRepository.findOne({
      where: { id },
      relations: { actividades: true },
    });
    if (!corte) {
      throw new NotFoundException(`Corte con ID ${id} no encontrado`);
    }
    return corte;
  }
}
