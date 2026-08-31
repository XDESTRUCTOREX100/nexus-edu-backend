import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';
import { CreatePeriodoAcademicoDto } from '../dto/create-periodo-academico.dto';
import { UpdatePeriodoAcademicoDto } from '../dto/update-periodo-academico.dto';
import { PeriodoAcademico } from '../entities/periodo-academico.entity';

@Injectable()
export class PeriodoAcademicoService {
  constructor(
    @InjectRepository(PeriodoAcademico)
    private readonly periodoAcademicoRepository: Repository<PeriodoAcademico>,
  ) {}

  async create(
    createPeriodoAcademicoDto: CreatePeriodoAcademicoDto,
  ): Promise<PeriodoAcademico> {
    const fechaInicio = new Date(createPeriodoAcademicoDto.fechaInicio);
    const fechaFin = new Date(createPeriodoAcademicoDto.fechaFin);

    this.validarRangoFechas(fechaInicio, fechaFin);

    const existing = await this.periodoAcademicoRepository.findOne({
      where: { codigo: createPeriodoAcademicoDto.codigo },
    });

    if (existing) {
      throw new BadRequestException(
        'Ya existe un período académico con el mismo código.',
      );
    }

    await this.validarSolapamientoFechas(fechaInicio, fechaFin);

    const periodo = this.periodoAcademicoRepository.create(createPeriodoAcademicoDto);
    return this.periodoAcademicoRepository.save(periodo);
  }

  async findAll(): Promise<PeriodoAcademico[]> {
    return this.periodoAcademicoRepository.find({
      order: { fechaInicio: 'ASC' },
    });
  }

  async findOne(id: number): Promise<PeriodoAcademico> {
    const periodo = await this.periodoAcademicoRepository.findOne({
      where: { id },
    });

    if (!periodo) {
      throw new NotFoundException(`Periodo académico con ID ${id} no encontrado.`);
    }

    return periodo;
  }

  async update(
    id: number,
    updatePeriodoAcademicoDto: UpdatePeriodoAcademicoDto,
  ): Promise<PeriodoAcademico> {
    const periodo = await this.findOne(id);

    const fechaInicio = updatePeriodoAcademicoDto.fechaInicio
      ? new Date(updatePeriodoAcademicoDto.fechaInicio)
      : periodo.fechaInicio;
    const fechaFin = updatePeriodoAcademicoDto.fechaFin
      ? new Date(updatePeriodoAcademicoDto.fechaFin)
      : periodo.fechaFin;

    this.validarRangoFechas(fechaInicio, fechaFin);

    if (
      updatePeriodoAcademicoDto.codigo &&
      updatePeriodoAcademicoDto.codigo !== periodo.codigo
    ) {
      const duplicatedCode = await this.periodoAcademicoRepository.findOne({
        where: { codigo: updatePeriodoAcademicoDto.codigo },
      });

      if (duplicatedCode && duplicatedCode.id !== id) {
        throw new BadRequestException(
          `El código del periodo académico '${updatePeriodoAcademicoDto.codigo}' ya existe.`,
        );
      }
    }

    await this.validarSolapamientoFechas(fechaInicio, fechaFin, id);

    Object.assign(periodo, updatePeriodoAcademicoDto);
    return this.periodoAcademicoRepository.save(periodo);
  }

  async remove(id: number): Promise<void> {
    const periodo = await this.findOne(id);
    await this.periodoAcademicoRepository.remove(periodo);
  }

  async validarSolapamientoFechas(
    fechaInicio: Date,
    fechaFin: Date,
    excludeId?: number,
  ): Promise<void> {
    const overlapping = await this.periodoAcademicoRepository.findOne({
      where: {
        fechaInicio: LessThanOrEqual(fechaFin),
        fechaFin: MoreThanOrEqual(fechaInicio),
      },
    });

    if (overlapping && overlapping.id !== excludeId) {
      throw new BadRequestException(
        'El período académico se solapa con otro período existente.',
      );
    }
  }

  private validarRangoFechas(fechaInicio: Date, fechaFin: Date): void {
    if (fechaInicio > fechaFin) {
      throw new BadRequestException(
        'La fecha de inicio no puede ser mayor que la fecha de fin.',
      );
    }
  }
}
