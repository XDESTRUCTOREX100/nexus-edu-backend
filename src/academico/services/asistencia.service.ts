import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Asistencia } from '../entities/asistencia.entity';
import { CreateAsistenciaDto } from '../dto/asistencia/create-asistencia.dto';
import { UpdateAsistenciaDto } from '../dto/asistencia/update-asistencia.dto';

@Injectable()
export class AsistenciaService {
  constructor(
    @InjectRepository(Asistencia)
    private readonly asistenciaRepository: Repository<Asistencia>,
  ) {}

  async create(createAsistenciaDto: CreateAsistenciaDto): Promise<Asistencia> {
    const asistencia = this.asistenciaRepository.create(createAsistenciaDto);
    return this.asistenciaRepository.save(asistencia);
  }

  async findAll(): Promise<Asistencia[]> {
    return this.asistenciaRepository.find({ relations: { inscripcion: true } });
  }

  async findOne(id: number): Promise<Asistencia> {
    const asistencia = await this.asistenciaRepository.findOne({
      where: { id },
      relations: { inscripcion: true },
    });
    if (!asistencia) {
      throw new NotFoundException(`Asistencia con ID ${id} no encontrada`);
    }
    return asistencia;
  }

  async update(
    id: number,
    updateAsistenciaDto: UpdateAsistenciaDto,
  ): Promise<Asistencia> {
    await this.findOne(id);
    await this.asistenciaRepository.update(id, updateAsistenciaDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.findOne(id);
    await this.asistenciaRepository.delete(id);
  }
}
