import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateHorarioDto } from '../dto/create-horario.dto';
import { UpdateHorarioDto } from '../dto/update-horario.dto';
import { Horario } from '../entities/horario.entity';
import { Asignatura } from '../entities/asignatura.entity';
import { EspacioFisico } from '../entities/espacio-fisico.entity';

@Injectable()
export class HorarioService {
  constructor(
    @InjectRepository(Horario)
    private readonly horarioRepository: Repository<Horario>,
    @InjectRepository(Asignatura)
    private readonly asignaturaRepository: Repository<Asignatura>,
    @InjectRepository(EspacioFisico)
    private readonly espacioFisicoRepository: Repository<EspacioFisico>,
  ) {}

  async create(createHorarioDto: CreateHorarioDto): Promise<Horario> {
    await this.validarAsignaturaYEspacio(
      createHorarioDto.asignaturaId,
      createHorarioDto.espacioFisicoId,
    );

    await this.validarSolapamiento(
      createHorarioDto.asignaturaId,
      createHorarioDto.diaSemana,
      createHorarioDto.horaInicio,
      createHorarioDto.horaFin,
      createHorarioDto.espacioFisicoId,
    );

    const horario = this.horarioRepository.create(createHorarioDto);
    return this.horarioRepository.save(horario);
  }

  async findAll(): Promise<Horario[]> {
    return this.horarioRepository.find({
      relations: { asignatura: true, espacioFisico: true, periodo: true },
      order: { id: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Horario> {
    const horario = await this.horarioRepository.findOne({
      where: { id },
      relations: { asignatura: true, espacioFisico: true, periodo: true },
    });

    if (!horario) {
      throw new NotFoundException(`Horario con ID ${id} no encontrado.`);
    }

    return horario;
  }

  async update(id: number, updateHorarioDto: UpdateHorarioDto): Promise<Horario> {
    const horario = await this.findOne(id);

    const asignaturaId = updateHorarioDto.asignaturaId ?? horario.asignaturaId;
    const espacioFisicoId =
      updateHorarioDto.espacioFisicoId ?? horario.espacioFisicoId;
    const diaSemana = updateHorarioDto.diaSemana ?? horario.diaSemana;
    const horaInicio = updateHorarioDto.horaInicio ?? horario.horaInicio;
    const horaFin = updateHorarioDto.horaFin ?? horario.horaFin;

    await this.validarAsignaturaYEspacio(asignaturaId, espacioFisicoId);
    await this.validarSolapamiento(
      asignaturaId,
      diaSemana,
      horaInicio,
      horaFin,
      espacioFisicoId,
      id,
    );

    Object.assign(horario, updateHorarioDto);
    return this.horarioRepository.save(horario);
  }

  async remove(id: number): Promise<void> {
    const horario = await this.findOne(id);
    await this.horarioRepository.remove(horario);
  }

  private async validarAsignaturaYEspacio(
    asignaturaId: number,
    espacioFisicoId: number,
  ): Promise<void> {
    const asignatura = await this.asignaturaRepository.findOne({
      where: { id: asignaturaId },
    });

    if (!asignatura) {
      throw new BadRequestException(
        `La asignatura con ID ${asignaturaId} no existe.`,
      );
    }

    const espacio = await this.espacioFisicoRepository.findOne({
      where: { id: espacioFisicoId },
    });

    if (!espacio) {
      throw new BadRequestException(
        `El espacio físico con ID ${espacioFisicoId} no existe.`,
      );
    }
  }

  private async validarSolapamiento(
    asignaturaId: number,
    diaSemana: string,
    horaInicio: string,
    horaFin: string,
    espacioFisicoId: number,
    excludeId?: number,
  ): Promise<void> {
    const inicio = this.parseTime(horaInicio);
    const fin = this.parseTime(horaFin);

    if (inicio >= fin) {
      throw new BadRequestException(
        'La hora de inicio debe ser menor que la hora de fin.',
      );
    }

    const horariosEnEspacio = await this.horarioRepository.find({
      where: { diaSemana: diaSemana as any, espacioFisicoId },
    });

    const conflictoEspacio = horariosEnEspacio.some(
      (item) =>
        item.id !== excludeId &&
        item.diaSemana === diaSemana &&
        item.horaInicio < horaFin &&
        item.horaFin > horaInicio,
    );

    if (conflictoEspacio) {
      throw new BadRequestException(
        'El horario se solapa con otro horario del mismo espacio físico.',
      );
    }

    const horariosAsignatura = await this.horarioRepository.find({
      where: { asignaturaId, diaSemana: diaSemana as any },
    });

    const conflictoAsignatura = horariosAsignatura.some(
      (item) =>
        item.id !== excludeId &&
        item.diaSemana === diaSemana &&
        item.horaInicio < horaFin &&
        item.horaFin > horaInicio,
    );

    if (conflictoAsignatura) {
      throw new BadRequestException(
        'La asignatura ya tiene un horario que se solapa en el mismo día.',
      );
    }
  }

  private parseTime(value: string): number {
    const [hours, minutes] = value.split(':').map(Number);
    return hours * 60 + minutes;
  }
}
