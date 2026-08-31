import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCalendarioAcademicoDto } from '../dto/create-calendario-academico.dto';
import { UpdateCalendarioAcademicoDto } from '../dto/update-calendario-academico.dto';
import { CalendarioAcademico } from '../entities/calendario-academico.entity';
import { PeriodoAcademico } from '../entities/periodo-academico.entity';
import { EstadoPeriodoAcademico } from '../enums/academico.enums';

@Injectable()
export class CalendarioAcademicoService {
  constructor(
    @InjectRepository(CalendarioAcademico)
    private readonly calendarioRepository: Repository<CalendarioAcademico>,
    @InjectRepository(PeriodoAcademico)
    private readonly periodosRepository: Repository<PeriodoAcademico>,
  ) {}

  findAll(): Promise<CalendarioAcademico[]> {
    return this.calendarioRepository.find({
      relations: { periodo: true },
      order: { fechaInicio: 'ASC', id: 'ASC' },
    });
  }

  async findOne(id: number): Promise<CalendarioAcademico> {
    const evento = await this.calendarioRepository.findOne({
      where: { id },
      relations: { periodo: true },
    });

    if (!evento) {
      throw new NotFoundException(`No existe el evento académico con ID ${id}.`);
    }

    return evento;
  }

  async create(createCalendarioDto: CreateCalendarioAcademicoDto): Promise<CalendarioAcademico> {
    const periodo = await this.findActivePeriod(createCalendarioDto.periodoId);
    const fechaInicio = new Date(createCalendarioDto.fechaInicio);
    const fechaFin = new Date(createCalendarioDto.fechaFin);

    this.validateDateRange(fechaInicio, fechaFin);
    this.validateEventWithinPeriod(fechaInicio, fechaFin, periodo);

    const evento = this.calendarioRepository.create({
      ...createCalendarioDto,
      fechaInicio,
      fechaFin,
      periodo,
    });

    return this.calendarioRepository.save(evento);
  }

  async update(id: number, updateCalendarioDto: UpdateCalendarioAcademicoDto): Promise<CalendarioAcademico> {
    const evento = await this.findOne(id);
    const periodoId = updateCalendarioDto.periodoId ?? evento.periodoId;
    const periodo = await this.findActivePeriod(periodoId);
    const fechaInicio = updateCalendarioDto.fechaInicio
      ? new Date(updateCalendarioDto.fechaInicio)
      : evento.fechaInicio;
    const fechaFin = updateCalendarioDto.fechaFin ? new Date(updateCalendarioDto.fechaFin) : evento.fechaFin;

    this.validateDateRange(fechaInicio, fechaFin);
    this.validateEventWithinPeriod(fechaInicio, fechaFin, periodo);

    Object.assign(evento, updateCalendarioDto, {
      periodoId,
      periodo,
      fechaInicio,
      fechaFin,
    });

    return this.calendarioRepository.save(evento);
  }

  async remove(id: number): Promise<void> {
    const evento = await this.findOne(id);
    await this.calendarioRepository.remove(evento);
  }

  private async findActivePeriod(id: number): Promise<PeriodoAcademico> {
    const periodo = await this.periodosRepository.findOne({ where: { id } });

    if (!periodo) {
      throw new NotFoundException(`No existe el período académico con ID ${id}.`);
    }

    if (periodo.estado !== EstadoPeriodoAcademico.ACTIVO) {
      throw new BadRequestException('El evento solo puede asociarse a un período académico activo.');
    }

    return periodo;
  }

  private validateDateRange(fechaInicio: Date, fechaFin: Date): void {
    if (Number.isNaN(fechaInicio.getTime()) || Number.isNaN(fechaFin.getTime())) {
      throw new BadRequestException('Las fechas del evento deben ser válidas.');
    }

    if (fechaInicio > fechaFin) {
      throw new BadRequestException('La fecha de inicio debe ser anterior o igual a la fecha de fin.');
    }
  }

  private validateEventWithinPeriod(
    fechaInicio: Date,
    fechaFin: Date,
    periodo: PeriodoAcademico,
  ): void {
    if (fechaInicio < periodo.fechaInicio || fechaFin > periodo.fechaFin) {
      throw new BadRequestException(
        'Las fechas del evento deben estar dentro del rango del período académico.',
      );
    }
  }
}
