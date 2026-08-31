import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateEspacioFisicoDto } from '../dto/create-espacio-fisico.dto';
import { UpdateEspacioFisicoDto } from '../dto/update-espacio-fisico.dto';
import { EspacioFisico } from '../entities/espacio-fisico.entity';

@Injectable()
export class EspacioFisicoService {
  constructor(
    @InjectRepository(EspacioFisico)
    private readonly espacioFisicoRepository: Repository<EspacioFisico>,
  ) {}

  async create(createEspacioFisicoDto: CreateEspacioFisicoDto): Promise<EspacioFisico> {
    const existing = await this.espacioFisicoRepository.findOne({
      where: { codigo: createEspacioFisicoDto.codigo },
    });

    if (existing) {
      throw new BadRequestException(
        `El código del espacio físico '${createEspacioFisicoDto.codigo}' ya existe.`,
      );
    }

    const espacio = this.espacioFisicoRepository.create(createEspacioFisicoDto);
    return this.espacioFisicoRepository.save(espacio);
  }

  async findAll(): Promise<EspacioFisico[]> {
    return this.espacioFisicoRepository.find({
      relations: { horarios: true },
      order: { id: 'ASC' },
    });
  }

  async findOne(id: number): Promise<EspacioFisico> {
    const espacio = await this.espacioFisicoRepository.findOne({
      where: { id },
      relations: { horarios: true },
    });

    if (!espacio) {
      throw new NotFoundException(`Espacio físico con ID ${id} no encontrado.`);
    }

    return espacio;
  }

  async update(
    id: number,
    updateEspacioFisicoDto: UpdateEspacioFisicoDto,
  ): Promise<EspacioFisico> {
    const espacio = await this.findOne(id);

    if (
      updateEspacioFisicoDto.codigo &&
      updateEspacioFisicoDto.codigo !== espacio.codigo
    ) {
      const duplicate = await this.espacioFisicoRepository.findOne({
        where: { codigo: updateEspacioFisicoDto.codigo },
      });

      if (duplicate && duplicate.id !== id) {
        throw new BadRequestException(
          `El código del espacio físico '${updateEspacioFisicoDto.codigo}' ya existe.`,
        );
      }
    }

    Object.assign(espacio, updateEspacioFisicoDto);
    return this.espacioFisicoRepository.save(espacio);
  }

  async remove(id: number): Promise<void> {
    const espacio = await this.findOne(id);
    await this.espacioFisicoRepository.remove(espacio);
  }

  async consultarDisponibilidad(
    periodoId: number,
    diaSemana: string,
    horaInicio: string,
    horaFin: string,
  ): Promise<EspacioFisico[]> {
    const espacios = await this.espacioFisicoRepository.find({
      relations: { horarios: true },
    });

    return espacios.filter(
      (espacio) =>
        !espacio.horarios.some(
          (horario) =>
            horario.periodoId === periodoId &&
            horario.diaSemana === diaSemana &&
            horario.horaInicio < horaFin &&
            horario.horaFin > horaInicio,
        ),
    );
  }
}
