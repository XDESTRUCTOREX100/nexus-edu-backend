import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCalendarioAcademicoDto } from '../dto/create-calendario-academico.dto';
import { UpdateCalendarioAcademicoDto } from '../dto/update-calendario-academico.dto';
import { CalendarioAcademico } from '../entities/calendario-academico.entity';

@Injectable()
export class CalendarioAcademicoService {
  constructor(
    @InjectRepository(CalendarioAcademico)
    private readonly calendarioAcademicoRepository: Repository<CalendarioAcademico>,
  ) {}

  async create(
    createCalendarioAcademicoDto: CreateCalendarioAcademicoDto,
  ): Promise<CalendarioAcademico> {
    const calendario = this.calendarioAcademicoRepository.create(
      createCalendarioAcademicoDto,
    );
    return this.calendarioAcademicoRepository.save(calendario);
  }

  async findAll(): Promise<CalendarioAcademico[]> {
    return this.calendarioAcademicoRepository.find({
      relations: { periodo: true },
      order: { id: 'ASC' },
    });
  }

  async findOne(id: number): Promise<CalendarioAcademico> {
    const calendario = await this.calendarioAcademicoRepository.findOne({
      where: { id },
      relations: { periodo: true },
    });

    if (!calendario) {
      throw new NotFoundException(`Calendario académico con ID ${id} no encontrado.`);
    }

    return calendario;
  }

  async update(
    id: number,
    updateCalendarioAcademicoDto: UpdateCalendarioAcademicoDto,
  ): Promise<CalendarioAcademico> {
    const calendario = await this.findOne(id);

    if (
      updateCalendarioAcademicoDto.periodoId &&
      updateCalendarioAcademicoDto.periodoId !== calendario.periodoId
    ) {
      // validación de relación del período se puede extender si se requiere
    }

    Object.assign(calendario, updateCalendarioAcademicoDto);
    return this.calendarioAcademicoRepository.save(calendario);
  }

  async remove(id: number): Promise<void> {
    const calendario = await this.findOne(id);
    await this.calendarioAcademicoRepository.remove(calendario);
  }
}
