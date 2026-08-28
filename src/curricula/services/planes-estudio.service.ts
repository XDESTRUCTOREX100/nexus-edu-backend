import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePlanEstudioDto } from '../dto/create-plan-estudio.dto';
import { UpdatePlanEstudioDto } from '../dto/update-plan-estudio.dto';
import { PlanEstudio } from '../entities/plan-estudio.entity';

@Injectable()
export class PlanesEstudioService {
  constructor(
    @InjectRepository(PlanEstudio)
    private readonly planesEstudioRepository: Repository<PlanEstudio>,
  ) {}

  findAll(): Promise<PlanEstudio[]> {
    return this.planesEstudioRepository.find({
      relations: { asignaturas: true },
      order: { id: 'ASC' },
    });
  }

  async findOne(id: number): Promise<PlanEstudio> {
    const planEstudio = await this.planesEstudioRepository.findOne({
      where: { id },
      relations: { asignaturas: true },
    });

    if (!planEstudio) {
      throw new NotFoundException(`No existe el plan de estudio con ID ${id}.`);
    }

    return planEstudio;
  }

  create(createPlanEstudioDto: CreatePlanEstudioDto): Promise<PlanEstudio> {
    const planEstudio = this.planesEstudioRepository.create({
      ...createPlanEstudioDto,
      fechaAprobacion: new Date(createPlanEstudioDto.fechaAprobacion),
    });

    return this.planesEstudioRepository.save(planEstudio);
  }

  async update(id: number, updatePlanEstudioDto: UpdatePlanEstudioDto): Promise<PlanEstudio> {
    const planEstudio = await this.findOne(id);
    const { fechaAprobacion, ...data } = updatePlanEstudioDto;

    Object.assign(planEstudio, data);

    if (fechaAprobacion !== undefined) {
      planEstudio.fechaAprobacion = new Date(fechaAprobacion);
    }

    return this.planesEstudioRepository.save(planEstudio);
  }

  async remove(id: number): Promise<void> {
    const planEstudio = await this.findOne(id);
    await this.planesEstudioRepository.remove(planEstudio);
  }
}
