import { ConflictException, Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateHorarioDto } from '../dto/create-horario.dto';
import { UpdateHorarioDto } from '../dto/update-horario.dto';
import { Asignatura } from '../entities/asignatura.entity';
import { EspacioFisico } from '../entities/espacio-fisico.entity';
import { Horario } from '../entities/horario.entity';
import { PeriodoAcademico } from '../entities/periodo-academico.entity';

@Injectable()
export class HorariosService {
  constructor(
    @InjectRepository(Horario)
    private readonly horariosRepository: Repository<Horario>,
    @InjectRepository(Asignatura)
    private readonly asignaturasRepository: Repository<Asignatura>,
    @InjectRepository(EspacioFisico)
    private readonly espaciosFisicosRepository: Repository<EspacioFisico>,
    @InjectRepository(PeriodoAcademico)
    private readonly periodosRepository: Repository<PeriodoAcademico>,
  ) {}

  findAll(): Promise<Horario[]> {
    return this.horariosRepository.find({
      relations: { asignatura: true, espacioFisico: true, periodo: true },
      order: { periodoId: 'ASC', diaSemana: 'ASC', horaInicio: 'ASC', id: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Horario> {
    const horario = await this.horariosRepository.findOne({
      where: { id },
      relations: { asignatura: true, espacioFisico: true, periodo: true },
    });

    if (!horario) {
      throw new NotFoundException(`No existe el horario con ID ${id}.`);
    }

    return horario;
  }

  async create(createHorarioDto: CreateHorarioDto): Promise<Horario> {
    const horaInicio = this.normalizeTime(createHorarioDto.horaInicio, 'inicio');
    const horaFin = this.normalizeTime(createHorarioDto.horaFin, 'fin');
    this.validateTimeRange(horaInicio, horaFin);

    const references = await this.validateReferences(
      createHorarioDto.asignaturaId,
      createHorarioDto.espacioFisicoId,
      createHorarioDto.periodoId,
    );

    await this.ensureNoOverlap({
      ...createHorarioDto,
      horaInicio,
      horaFin,
    });

    const horario = this.horariosRepository.create({
      ...createHorarioDto,
      horaInicio,
      horaFin,
      ...references,
    });

    return this.horariosRepository.save(horario);
  }

  async update(id: number, updateHorarioDto: UpdateHorarioDto): Promise<Horario> {
    const horario = await this.findOne(id);
    const asignaturaId = updateHorarioDto.asignaturaId ?? horario.asignaturaId;
    const espacioFisicoId = updateHorarioDto.espacioFisicoId ?? horario.espacioFisicoId;
    const periodoId = updateHorarioDto.periodoId ?? horario.periodoId;
    const horaInicio = updateHorarioDto.horaInicio
      ? this.normalizeTime(updateHorarioDto.horaInicio, 'inicio')
      : horario.horaInicio;
    const horaFin = updateHorarioDto.horaFin
      ? this.normalizeTime(updateHorarioDto.horaFin, 'fin')
      : horario.horaFin;

    this.validateTimeRange(horaInicio, horaFin);

    const references = await this.validateReferences(asignaturaId, espacioFisicoId, periodoId);
    await this.ensureNoOverlap(
      {
        asignaturaId,
        espacioFisicoId,
        periodoId,
        diaSemana: updateHorarioDto.diaSemana ?? horario.diaSemana,
        horaInicio,
        horaFin,
      },
      id,
    );

    Object.assign(horario, updateHorarioDto, {
      asignaturaId,
      espacioFisicoId,
      periodoId,
      horaInicio,
      horaFin,
      ...references,
    });

    return this.horariosRepository.save(horario);
  }

  async remove(id: number): Promise<void> {
    const horario = await this.findOne(id);
    await this.horariosRepository.remove(horario);
  }

  private async validateReferences(
    asignaturaId: number,
    espacioFisicoId: number,
    periodoId: number,
  ): Promise<{ asignatura: Asignatura; espacioFisico: EspacioFisico; periodo: PeriodoAcademico }> {
    const [asignatura, espacioFisico, periodo] = await Promise.all([
      this.asignaturasRepository.findOne({ where: { id: asignaturaId } }),
      this.espaciosFisicosRepository.findOne({ where: { id: espacioFisicoId } }),
      this.periodosRepository.findOne({ where: { id: periodoId } }),
    ]);

    if (!asignatura) {
      throw new NotFoundException(`No existe la asignatura con ID ${asignaturaId}.`);
    }

    if (!espacioFisico) {
      throw new NotFoundException(`No existe el espacio físico con ID ${espacioFisico}.`);
    }

    if (!periodo) {
      throw new NotFoundException(`No existe el período académico con ID ${periodoId}.`);
    }

    return { asignatura, espacioFisico, periodo };
  }

  private async ensureNoOverlap(
    data: Pick<CreateHorarioDto, 'asignaturaId' | 'espacioFisicoId' | 'periodoId' | 'diaSemana'> & {
      horaInicio: string;
      horaFin: string;
    },
    excludedId?: number,
  ): Promise<void> {
    const baseQuery = this.horariosRepository
      .createQueryBuilder('horario')
      .where('horario.periodo_id = :periodoId', { periodoId: data.periodoId })
      .andWhere('horario.dia_semana = :diaSemana', { diaSemana: data.diaSemana })
      .andWhere('horario.hora_inicio < :horaFin', { horaFin: data.horaFin })
      .andWhere('horario.hora_fin > :horaInicio', { horaInicio: data.horaInicio });

    if (excludedId !== undefined) {
      baseQuery.andWhere('horario.id != :excludedId', { excludedId });
    }

    const roomQuery = baseQuery.clone().andWhere('horario.espacio_fisico_id = :espacioFisicoId', {
      espacioFisicoId: data.espacioFisicoId,
    });
    const subjectQuery = baseQuery.clone().andWhere('horario.asignatura_id = :asignaturaId', {
      asignaturaId: data.asignaturaId,
    });

    const [roomOverlap, subjectOverlap] = await Promise.all([roomQuery.getOne(), subjectQuery.getOne()]);

    if (roomOverlap) {
      throw new ConflictException('El espacio físico ya está ocupado en ese día, período y rango horario.');
    }

    if (subjectOverlap) {
      throw new ConflictException('La asignatura ya tiene un horario solapado en ese día y período.');
    }
  }

  private normalizeTime(value: string, field: string): string {
    const match = /^([01]\d|2[0-3]):([0-5]\d)(?::([0-5]\d))?$/.exec(value);

    if (!match) {
      throw new BadRequestException(`La hora de ${field} debe tener formato HH:mm o HH:mm:ss.`);
    }

    return `${match[1]}:${match[2]}:${match[3] ?? '00'}`;
  }

  private validateTimeRange(horaInicio: string, horaFin: string): void {
    if (horaInicio >= horaFin) {
      throw new BadRequestException('La hora de inicio debe ser anterior a la hora de fin.');
    }
  }
}
