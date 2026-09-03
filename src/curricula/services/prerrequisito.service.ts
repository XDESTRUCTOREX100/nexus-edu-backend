import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePrerrequisitoDto } from '../dto/create-prerrequisito.dto';
import { UpdatePrerrequisitoDto } from '../dto/update-prerrequisito.dto';
import { Prerrequisito } from '../entities/prerrequisito.entity';
import { AsignaturaService } from './asignatura.service';

@Injectable()
export class PrerrequisitoService {
  constructor(
    @InjectRepository(Prerrequisito)
    private readonly prerrequisitoRepository: Repository<Prerrequisito>,
    private readonly asignaturaService: AsignaturaService,
  ) {}

  async create(createPrerrequisitoDto: CreatePrerrequisitoDto): Promise<Prerrequisito> {
    await this.asignaturaService.validarPrerrequisito(
      createPrerrequisitoDto.asignaturaId,
      createPrerrequisitoDto.asignaturaPrerrequisitoId,
    );

    const existing = await this.prerrequisitoRepository.findOne({
      where: {
        asignaturaId: createPrerrequisitoDto.asignaturaId,
        asignaturaPrerrequisitoId: createPrerrequisitoDto.asignaturaPrerrequisitoId,
      },
    });

    if (existing) {
      throw new BadRequestException(
        'La relación de prerrequisito ya existe para esta asignatura.',
      );
    }

    const prerrequisito = this.prerrequisitoRepository.create(createPrerrequisitoDto);
    return this.prerrequisitoRepository.save(prerrequisito);
  }

  async findAll(): Promise<Prerrequisito[]> {
    return this.prerrequisitoRepository.find({
      relations: {
        asignatura: true,
        asignaturaPrerrequisito: true,
      },
      order: { id: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Prerrequisito> {
    const prerrequisito = await this.prerrequisitoRepository.findOne({
      where: { id },
      relations: {
        asignatura: true,
        asignaturaPrerrequisito: true,
      },
    });

    if (!prerrequisito) {
      throw new NotFoundException(`Prerrequisito con ID ${id} no encontrado.`);
    }

    return prerrequisito;
  }

  async update(
    id: number,
    updatePrerrequisitoDto: UpdatePrerrequisitoDto,
  ): Promise<Prerrequisito> {
    const prerrequisito = await this.findOne(id);

    if (
      updatePrerrequisitoDto.asignaturaId &&
      updatePrerrequisitoDto.asignaturaPrerrequisitoId
    ) {
      await this.asignaturaService.validarPrerrequisito(
        updatePrerrequisitoDto.asignaturaId,
        updatePrerrequisitoDto.asignaturaPrerrequisitoId,
      );
    }

    Object.assign(prerrequisito, updatePrerrequisitoDto);
    return this.prerrequisitoRepository.save(prerrequisito);
  }

  async remove(id: number): Promise<void> {
    const prerrequisito = await this.findOne(id);
    await this.prerrequisitoRepository.remove(prerrequisito);
  }
}
