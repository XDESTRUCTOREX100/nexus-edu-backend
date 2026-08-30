import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Inscripcion } from '../entities/inscripcion.entity';
import { CreateInscripcionDto } from '../dto/inscripcion/create-inscripcion.dto';
import { UpdateInscripcionDto } from '../dto/inscripcion/update-inscripcion.dto';

@Injectable()
export class InscripcionService {
  constructor(
    @InjectRepository(Inscripcion)
    private readonly inscripcionRepository: Repository<Inscripcion>,
  ) {}

  async create(createInscripcionDto: CreateInscripcionDto): Promise<Inscripcion> {
    const inscripcion = this.inscripcionRepository.create(createInscripcionDto);
    return this.inscripcionRepository.save(inscripcion);
  }

  async findAll(): Promise<Inscripcion[]> {
    return this.inscripcionRepository.find({
      relations: { matricula: true, calificaciones: true, asistencias: true },
    });
  }

  async findOne(id: number): Promise<Inscripcion> {
    const inscripcion = await this.inscripcionRepository.findOne({
      where: { id },
      relations: { matricula: true, calificaciones: true, asistencias: true },
    });
    if (!inscripcion) {
      throw new NotFoundException(`Inscripción con ID ${id} no encontrada`);
    }
    return inscripcion;
  }

  async update(
    id: number,
    updateInscripcionDto: UpdateInscripcionDto,
  ): Promise<Inscripcion> {
    await this.findOne(id);
    await this.inscripcionRepository.update(id, updateInscripcionDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.findOne(id);
    await this.inscripcionRepository.delete(id);
  }

  async findCalificaciones(id: number): Promise<Inscripcion> {
    const inscripcion = await this.inscripcionRepository.findOne({
      where: { id },
      relations: {
        calificaciones: { corte: true, actividad: true },
      },
    });
    if (!inscripcion) {
      throw new NotFoundException(`Inscripción con ID ${id} no encontrada`);
    }
    return inscripcion;
  }

  async findAsistencias(id: number): Promise<Inscripcion> {
    const inscripcion = await this.inscripcionRepository.findOne({
      where: { id },
      relations: { asistencias: true },
    });
    if (!inscripcion) {
      throw new NotFoundException(`Inscripción con ID ${id} no encontrada`);
    }
    return inscripcion;
  }
}
