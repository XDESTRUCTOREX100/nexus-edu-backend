import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAsignaturaDto } from '../dto/create-asignatura.dto';
import { UpdateAsignaturaDto } from '../dto/update-asignatura.dto';
import { Asignatura } from '../entities/asignatura.entity';
import { PlanEstudio } from '../entities/plan-estudio.entity';

@Injectable()
export class AsignaturaService {
  constructor(
    @InjectRepository(Asignatura)
    private readonly asignaturaRepository: Repository<Asignatura>,
    @InjectRepository(PlanEstudio)
    private readonly planEstudioRepository: Repository<PlanEstudio>,
  ) {}

  async create(createAsignaturaDto: CreateAsignaturaDto): Promise<Asignatura> {
    const planEstudio = await this.planEstudioRepository.findOne({
      where: { id: createAsignaturaDto.planEstudioId },
    });

    if (!planEstudio) {
      throw new BadRequestException(
        `El plan de estudio con ID ${createAsignaturaDto.planEstudioId} no existe.`,
      );
    }

    const existingAsignatura = await this.asignaturaRepository.findOne({
      where: { codigo: createAsignaturaDto.codigo },
    });

    if (existingAsignatura) {
      throw new BadRequestException(
        `La asignatura con código '${createAsignaturaDto.codigo}' ya existe.`,
      );
    }

    const asignatura = this.asignaturaRepository.create(createAsignaturaDto);
    return this.asignaturaRepository.save(asignatura);
  }

  async findAll(): Promise<Asignatura[]> {
    return this.asignaturaRepository.find({
      relations: {
        planEstudio: true,
        prerrequisitos: true,
        horarios: true,
      },
      order: { id: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Asignatura> {
    const asignatura = await this.asignaturaRepository.findOne({
      where: { id },
      relations: {
        planEstudio: true,
        prerrequisitos: true,
        horarios: true,
      },
    });

    if (!asignatura) {
      throw new NotFoundException(`Asignatura con ID ${id} no encontrada.`);
    }

    return asignatura;
  }

  async update(
    id: number,
    updateAsignaturaDto: UpdateAsignaturaDto,
  ): Promise<Asignatura> {
    const asignatura = await this.findOne(id);

    if (updateAsignaturaDto.planEstudioId) {
      const plan = await this.planEstudioRepository.findOne({
        where: { id: updateAsignaturaDto.planEstudioId },
      });

      if (!plan) {
        throw new BadRequestException(
          `El plan de estudio con ID ${updateAsignaturaDto.planEstudioId} no existe.`,
        );
      }
    }

    if (updateAsignaturaDto.codigo && updateAsignaturaDto.codigo !== asignatura.codigo) {
      const duplicate = await this.asignaturaRepository.findOne({
        where: { codigo: updateAsignaturaDto.codigo },
      });

      if (duplicate && duplicate.id !== id) {
        throw new BadRequestException(
          `La asignatura con código '${updateAsignaturaDto.codigo}' ya existe.`,
        );
      }
    }

    Object.assign(asignatura, updateAsignaturaDto);
    return this.asignaturaRepository.save(asignatura);
  }

  async remove(id: number): Promise<void> {
    const asignatura = await this.findOne(id);
    await this.asignaturaRepository.remove(asignatura);
  }

  async validarPrerrequisito(
    asignaturaDestinoId: number,
    asignaturaPrerrequisitoId: number,
  ): Promise<void> {
    const destino = await this.asignaturaRepository.findOne({
      where: { id: asignaturaDestinoId },
      relations: { planEstudio: true },
    });

    if (!destino) {
      throw new BadRequestException(
        `La asignatura destino con ID ${asignaturaDestinoId} no existe.`,
      );
    }

    const prerrequisito = await this.asignaturaRepository.findOne({
      where: { id: asignaturaPrerrequisitoId },
      relations: { planEstudio: true },
    });

    if (!prerrequisito) {
      throw new BadRequestException(
        `La asignatura prerrequisito con ID ${asignaturaPrerrequisitoId} no existe.`,
      );
    }

    if (destino.planEstudioId !== prerrequisito.planEstudioId) {
      throw new BadRequestException(
        'La asignatura prerrequisito debe pertenecer al mismo plan de estudio que la asignatura destino.',
      );
    }
  }
}
