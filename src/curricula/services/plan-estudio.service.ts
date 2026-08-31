import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePlanEstudioDto } from '../dto/create-plan-estudio.dto';
import { UpdatePlanEstudioDto } from '../dto/update-plan-estudio.dto';
import { PlanEstudio } from '../entities/plan-estudio.entity';

@Injectable()
export class PlanEstudioService {
  constructor(
    @InjectRepository(PlanEstudio)
    private readonly planEstudioRepository: Repository<PlanEstudio>,
  ) {}

  async create(createPlanEstudioDto: CreatePlanEstudioDto): Promise<PlanEstudio> {
    const existingPlan = await this.planEstudioRepository.findOne({
      where: { codigo: createPlanEstudioDto.codigo },
    });

    if (existingPlan) {
      throw new BadRequestException(
        `El código del plan de estudio '${createPlanEstudioDto.codigo}' ya existe.`,
      );
    }

    const planEstudio = this.planEstudioRepository.create(createPlanEstudioDto);
    return this.planEstudioRepository.save(planEstudio);
  }

  async findAll(): Promise<PlanEstudio[]> {
    return this.planEstudioRepository.find({
      relations: { asignaturas: true },
      order: { id: 'ASC' },
    });
  }

  async findOne(id: number): Promise<PlanEstudio> {
    const planEstudio = await this.planEstudioRepository.findOne({
      where: { id },
      relations: { asignaturas: true },
    });

    if (!planEstudio) {
      throw new NotFoundException(`Plan de estudio con ID ${id} no encontrado.`);
    }

    return planEstudio;
  }

  async update(
    id: number,
    updatePlanEstudioDto: UpdatePlanEstudioDto,
  ): Promise<PlanEstudio> {
    const planEstudio = await this.findOne(id);

    if (updatePlanEstudioDto.codigo && updatePlanEstudioDto.codigo !== planEstudio.codigo) {
      const duplicatedCode = await this.planEstudioRepository.findOne({
        where: { codigo: updatePlanEstudioDto.codigo },
      });

      if (duplicatedCode && duplicatedCode.id !== id) {
        throw new BadRequestException(
          `El código del plan de estudio '${updatePlanEstudioDto.codigo}' ya existe.`,
        );
      }
    }

    Object.assign(planEstudio, updatePlanEstudioDto);
    return this.planEstudioRepository.save(planEstudio);
  }

  async remove(id: number): Promise<void> {
    const planEstudio = await this.findOne(id);
    await this.planEstudioRepository.remove(planEstudio);
  }
}
