import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePrerrequisitoDto } from '../dto/create-prerrequisito.dto';
import { UpdatePrerrequisitoDto } from '../dto/update-prerrequisito.dto';
import { Asignatura } from '../entities/asignatura.entity';
import { Prerrequisito } from '../entities/prerrequisito.entity';

@Injectable()
export class PrerrequisitosService {
  constructor(
    @InjectRepository(Prerrequisito)
    private readonly prerrequisitosRepository: Repository<Prerrequisito>,
    @InjectRepository(Asignatura)
    private readonly asignaturasRepository: Repository<Asignatura>,
  ) {}

  findAll(): Promise<Prerrequisito[]> {
    return this.prerrequisitosRepository.find({
      relations: {
        asignatura: { planEstudio: true },
        asignaturaPrerrequisito: { planEstudio: true },
      },
      order: { id: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Prerrequisito> {
    const prerrequisito = await this.prerrequisitosRepository.findOne({
      where: { id },
      relations: {
        asignatura: { planEstudio: true },
        asignaturaPrerrequisito: { planEstudio: true },
      },
    });

    if (!prerrequisito) {
      throw new NotFoundException(`No existe el prerrequisito con ID ${id}.`);
    }

    return prerrequisito;
  }

  async create(createPrerrequisitoDto: CreatePrerrequisitoDto): Promise<Prerrequisito> {
    const { asignatura, asignaturaPrerrequisito } = await this.validateAssignments(
      createPrerrequisitoDto.asignaturaId,
      createPrerrequisitoDto.asignaturaPrerrequisitoId,
    );

    const prerrequisito = this.prerrequisitosRepository.create({
      asignaturaId: asignatura.id,
      asignaturaPrerrequisitoId: asignaturaPrerrequisito.id,
    });

    return this.prerrequisitosRepository.save(prerrequisito);
  }

  async update(id: number, updatePrerrequisitoDto: UpdatePrerrequisitoDto): Promise<Prerrequisito> {
    const prerrequisito = await this.findOne(id);
    const asignaturaId = updatePrerrequisitoDto.asignaturaId ?? prerrequisito.asignaturaId;
    const asignaturaPrerrequisitoId =
      updatePrerrequisitoDto.asignaturaPrerrequisitoId ?? prerrequisito.asignaturaPrerrequisitoId;

    await this.validateAssignments(asignaturaId, asignaturaPrerrequisitoId);

    prerrequisito.asignaturaId = asignaturaId;
    prerrequisito.asignaturaPrerrequisitoId = asignaturaPrerrequisitoId;

    return this.prerrequisitosRepository.save(prerrequisito);
  }

  async remove(id: number): Promise<void> {
    const prerrequisito = await this.findOne(id);
    await this.prerrequisitosRepository.remove(prerrequisito);
  }

  private async validateAssignments(
    asignaturaId: number,
    asignaturaPrerrequisitoId: number,
  ): Promise<{ asignatura: Asignatura; asignaturaPrerrequisito: Asignatura }> {
    if (asignaturaId === asignaturaPrerrequisitoId) {
      throw new BadRequestException('Una asignatura no puede ser prerrequisito de sí misma.');
    }

    const [asignatura, asignaturaPrerrequisito] = await Promise.all([
      this.findAssignment(asignaturaId),
      this.findAssignment(asignaturaPrerrequisitoId),
    ]);

    if (asignatura.planEstudioId !== asignaturaPrerrequisito.planEstudioId) {
      throw new BadRequestException(
        'La asignatura y su prerrequisito deben pertenecer al mismo plan de estudios.',
      );
    }

    return { asignatura, asignaturaPrerrequisito };
  }

  private async findAssignment(id: number): Promise<Asignatura> {
    const asignatura = await this.asignaturasRepository.findOne({ where: { id } });

    if (!asignatura) {
      throw new NotFoundException(`No existe la asignatura con ID ${id}.`);
    }

    return asignatura;
  }
}
