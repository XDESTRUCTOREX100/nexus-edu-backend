import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateEspacioFisicoDto } from '../dto/create-espacio-fisico.dto';
import { UpdateEspacioFisicoDto } from '../dto/update-espacio-fisico.dto';
import { EspacioFisico } from '../entities/espacio-fisico.entity';
import { Horario } from '../entities/horario.entity';
import { DiaSemana } from '../enums/academico.enums';

export interface DisponibilidadEspacioQuery {
  periodoId: number;
  diaSemana: DiaSemana;
  horaInicio: string;
  horaFin: string;
}

@Injectable()
export class EspaciosFisicosService {
  constructor(
    @InjectRepository(EspacioFisico)
    private readonly espaciosFisicosRepository: Repository<EspacioFisico>,
    @InjectRepository(Horario)
    private readonly horariosRepository: Repository<Horario>,
  ) {}

  findAll(): Promise<EspacioFisico[]> {
    return this.espaciosFisicosRepository.find({
      relations: { horarios: true },
      order: { id: 'ASC' },
    });
  }

  async findOne(id: number): Promise<EspacioFisico> {
    const espacioFisico = await this.espaciosFisicosRepository.findOne({
      where: { id },
      relations: { horarios: true },
    });

    if (!espacioFisico) {
      throw new NotFoundException(`No existe el espacio físico con ID ${id}.`);
    }

    return espacioFisico;
  }

  create(createEspacioFisicoDto: CreateEspacioFisicoDto): Promise<EspacioFisico> {
    const espacioFisico = this.espaciosFisicosRepository.create(createEspacioFisicoDto);
    return this.espaciosFisicosRepository.save(espacioFisico);
  }

  async update(id: number, updateEspacioFisicoDto: UpdateEspacioFisicoDto): Promise<EspacioFisico> {
    const espacioFisico = await this.findOne(id);
    Object.assign(espacioFisico, updateEspacioFisicoDto);
    return this.espaciosFisicosRepository.save(espacioFisico);
  }

  async remove(id: number): Promise<void> {
    const espacioFisico = await this.findOne(id);
    await this.espaciosFisicosRepository.remove(espacioFisico);
  }

  async findAvailable(query: DisponibilidadEspacioQuery): Promise<EspacioFisico[]> {
    this.validateTimeRange(query.horaInicio, query.horaFin);

    const occupiedSpaceIds = this.horariosRepository
      .createQueryBuilder('horario')
      .select('horario.espacio_fisico_id')
      .where('horario.periodo_id = :periodoId', { periodoId: query.periodoId })
      .andWhere('horario.dia_semana = :diaSemana', { diaSemana: query.diaSemana })
      .andWhere('horario.hora_inicio < :horaFin', { horaFin: query.horaFin })
      .andWhere('horario.hora_fin > :horaInicio', { horaInicio: query.horaInicio });

    return this.espaciosFisicosRepository
      .createQueryBuilder('espacio')
      .where(`espacio.id NOT IN (${occupiedSpaceIds.getQuery()})`)
      .setParameters(occupiedSpaceIds.getParameters())
      .orderBy('espacio.id', 'ASC')
      .getMany();
  }

  private validateTimeRange(horaInicio: string, horaFin: string): void {
    if (!/^([01]\d|2[0-3]):[0-5]\d(:[0-5]\d)?$/.test(horaInicio) || !/^([01]\d|2[0-3]):[0-5]\d(:[0-5]\d)?$/.test(horaFin)) {
      throw new BadRequestException('Las horas deben tener formato HH:mm o HH:mm:ss.');
    }

    if (horaInicio >= horaFin) {
      throw new BadRequestException('La hora de inicio debe ser anterior a la hora de fin.');
    }
  }
}
