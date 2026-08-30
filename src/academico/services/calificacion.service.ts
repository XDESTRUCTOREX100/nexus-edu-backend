import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Calificacion } from '../entities/calificacion.entity';
import { CreateCalificacionDto } from '../dto/calificacion/create-calificacion.dto';
import { UpdateCalificacionDto } from '../dto/calificacion/update-calificacion.dto';

@Injectable()
export class CalificacionService {
  constructor(
    @InjectRepository(Calificacion)
    private readonly calificacionRepository: Repository<Calificacion>,
  ) {}

  async create(createCalificacionDto: CreateCalificacionDto): Promise<Calificacion> {
    const calificacion = this.calificacionRepository.create(createCalificacionDto);
    return this.calificacionRepository.save(calificacion);
  }

  async findAll(): Promise<Calificacion[]> {
    return this.calificacionRepository.find({
      relations: { inscripcion: true, corte: true, actividad: true },
    });
  }

  async findOne(id: number): Promise<Calificacion> {
    const calificacion = await this.calificacionRepository.findOne({
      where: { id },
      relations: { inscripcion: true, corte: true, actividad: true },
    });
    if (!calificacion) {
      throw new NotFoundException(`Calificación con ID ${id} no encontrada`);
    }
    return calificacion;
  }

  async update(
    id: number,
    updateCalificacionDto: UpdateCalificacionDto,
  ): Promise<Calificacion> {
    await this.findOne(id);
    await this.calificacionRepository.update(id, updateCalificacionDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.findOne(id);
    await this.calificacionRepository.delete(id);
  }
}
