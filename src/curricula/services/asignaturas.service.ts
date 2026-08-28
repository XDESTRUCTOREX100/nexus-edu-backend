import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAsignaturaDto } from '../dto/create-asignatura.dto';
import { UpdateAsignaturaDto } from '../dto/update-asignatura.dto';
import { Asignatura } from '../entities/asignatura.entity';
import { PlanEstudio } from '../entities/plan-estudio.entity';

@Injectable()
export class AsignaturasService {
  constructor(
    @InjectRepository(Asignatura)
    private readonly asignaturasRepository: Repository<Asignatura>,
    @InjectRepository(PlanEstudio)
    private readonly planesEstudioRepository: Repository<PlanEstudio>,
  ) {}

  findAll(): Promise<Asignatura[]> {
    return this.asignaturasRepository.find({
      relations: {
        planEstudio: true,
        prerrequisitos: { asignaturaPrerrequisito: true },
        esPrerrequisitoDe: { asignatura: true },
        horarios: true,
      },
      order: { id: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Asignatura> {
    const asignatura = await this.asignaturasRepository.findOne({
      where: { id },
      relations: {
        planEstudio: true,
        prerrequisitos: { asignaturaPrerrequisito: true },
        esPrerrequisitoDe: { asignatura: true },
        horarios: true,
      },
    });

    if (!asignatura) {
      throw new NotFoundException(`No existe la asignatura con ID ${id}.`);
    }

    return asignatura;
  }

  async create(createAsignaturaDto: CreateAsignaturaDto): Promise<Asignatura> {
    await this.ensurePlanExists(createAsignaturaDto.planEstudioId);

    const asignatura = this.asignaturasRepository.create(createAsignaturaDto);
    return this.asignaturasRepository.save(asignatura);
  }

  async update(id: number, updateAsignaturaDto: UpdateAsignaturaDto): Promise<Asignatura> {
    const asignatura = await this.findOne(id);

    if (updateAsignaturaDto.planEstudioId !== undefined) {
      await this.ensurePlanExists(updateAsignaturaDto.planEstudioId);
    }

    Object.assign(asignatura, updateAsignaturaDto);
    return this.asignaturasRepository.save(asignatura);
  }

  async remove(id: number): Promise<void> {
    const asignatura = await this.findOne(id);
    await this.asignaturasRepository.remove(asignatura);
  }

  private async ensurePlanExists(planEstudioId: number): Promise<void> {
    const planExists = await this.planesEstudioRepository.existsBy({ id: planEstudioId });

    if (!planExists) {
      throw new NotFoundException(`No existe el plan de estudio con ID ${planEstudioId}.`);
    }
  }
}
