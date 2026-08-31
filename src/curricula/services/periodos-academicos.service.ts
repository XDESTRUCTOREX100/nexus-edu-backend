import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePeriodoAcademicoDto } from '../dto/create-periodo-academico.dto';
import { UpdatePeriodoAcademicoDto } from '../dto/update-periodo-academico.dto';
import { PeriodoAcademico } from '../entities/periodo-academico.entity';
import { EstadoPeriodoAcademico } from '../enums/academico.enums';

@Injectable()
export class PeriodosAcademicosService {
  constructor(
    @InjectRepository(PeriodoAcademico)
    private readonly periodosRepository: Repository<PeriodoAcademico>,
  ) {}

  findAll(): Promise<PeriodoAcademico[]> {
    return this.periodosRepository.find({
      relations: { calendario: true, horarios: true },
      order: { fechaInicio: 'ASC', id: 'ASC' },
    });
  }

  async findOne(id: number): Promise<PeriodoAcademico> {
    const periodo = await this.periodosRepository.findOne({
      where: { id },
      relations: { calendario: true, horarios: true },
    });

    if (!periodo) {
      throw new NotFoundException(`No existe el período académico con ID ${id}.`);
    }

    return periodo;
  }

  async create(createPeriodoDto: CreatePeriodoAcademicoDto): Promise<PeriodoAcademico> {
    const estado = createPeriodoDto.estado ?? EstadoPeriodoAcademico.INACTIVO;
    const fechaInicio = new Date(createPeriodoDto.fechaInicio);
    const fechaFin = new Date(createPeriodoDto.fechaFin);

    this.validateDateRange(fechaInicio, fechaFin);

    if (estado === EstadoPeriodoAcademico.ACTIVO) {
      await this.ensureNoActiveOverlap(fechaInicio, fechaFin);
    }

    const periodo = this.periodosRepository.create({
      ...createPeriodoDto,
      estado,
      fechaInicio,
      fechaFin,
    });

    return this.periodosRepository.save(periodo);
  }

  async update(id: number, updatePeriodoDto: UpdatePeriodoAcademicoDto): Promise<PeriodoAcademico> {
    const periodo = await this.findOne(id);
    const fechaInicio = updatePeriodoDto.fechaInicio
      ? new Date(updatePeriodoDto.fechaInicio)
      : periodo.fechaInicio;
    const fechaFin = updatePeriodoDto.fechaFin ? new Date(updatePeriodoDto.fechaFin) : periodo.fechaFin;
    const estado = updatePeriodoDto.estado ?? periodo.estado;

    this.validateDateRange(fechaInicio, fechaFin);

    if (estado === EstadoPeriodoAcademico.ACTIVO) {
      await this.ensureNoActiveOverlap(fechaInicio, fechaFin, id);
    }

    Object.assign(periodo, updatePeriodoDto, { estado, fechaInicio, fechaFin });
    return this.periodosRepository.save(periodo);
  }

  async remove(id: number): Promise<void> {
    const periodo = await this.findOne(id);
    await this.periodosRepository.remove(periodo);
  }

  private validateDateRange(fechaInicio: Date, fechaFin: Date): void {
    if (Number.isNaN(fechaInicio.getTime()) || Number.isNaN(fechaFin.getTime())) {
      throw new BadRequestException('Las fechas del período deben ser válidas.');
    }

    if (fechaInicio > fechaFin) {
      throw new BadRequestException('La fecha de inicio debe ser anterior o igual a la fecha de fin.');
    }
  }

  private async ensureNoActiveOverlap(fechaInicio: Date, fechaFin: Date, excludedId?: number): Promise<void> {
    const query = this.periodosRepository
      .createQueryBuilder('periodo')
      .where('periodo.estado = :estado', { estado: EstadoPeriodoAcademico.ACTIVO })
      .andWhere('periodo.fecha_inicio <= :fechaFin', { fechaFin })
      .andWhere('periodo.fecha_fin >= :fechaInicio', { fechaInicio });

    if (excludedId !== undefined) {
      query.andWhere('periodo.id != :excludedId', { excludedId });
    }

    const overlappingPeriod = await query.getOne();

    if (overlappingPeriod) {
      throw new BadRequestException(
        `El período se solapa con el período académico activo ${overlappingPeriod.codigo}.`,
      );
    }
  }
}
