import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DataSource } from 'typeorm';
import { StudentAccountService } from '../../seguridad/services/student-account.service';
import { Matricula } from '../entities/matricula.entity';
import { CreateMatriculaDto } from '../dto/matricula/create-matricula.dto';
import { UpdateMatriculaDto } from '../dto/matricula/update-matricula.dto';

@Injectable()
export class MatriculaService {
  constructor(
    @InjectRepository(Matricula)
    private readonly matriculaRepository: Repository<Matricula>,
    private readonly dataSource: DataSource,
    private readonly studentAccountService: StudentAccountService,
  ) {}

  async create(createMatriculaDto: CreateMatriculaDto): Promise<Matricula> {
    return this.dataSource.transaction(async (manager) => {
      const matriculas = manager.getRepository(Matricula);
      const matricula = await matriculas.save(
        matriculas.create(createMatriculaDto),
      );
      await this.studentAccountService.ensureAccount(
        createMatriculaDto.documentoIdentidad,
        manager,
      );
      return matricula;
    });
  }

  async findAll(): Promise<Matricula[]> {
    return this.matriculaRepository.find({
      relations: { inscripciones: true },
    });
  }

  async findOne(id: number): Promise<Matricula> {
    const matricula = await this.matriculaRepository.findOne({
      where: { id },
      relations: { inscripciones: true },
    });
    if (!matricula) {
      throw new NotFoundException(`Matrícula con ID ${id} no encontrada`);
    }
    return matricula;
  }

  async update(
    id: number,
    updateMatriculaDto: UpdateMatriculaDto,
  ): Promise<Matricula> {
    await this.findOne(id);
    await this.matriculaRepository.update(id, updateMatriculaDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.findOne(id);
    await this.matriculaRepository.delete(id);
  }

  async findInscripciones(id: number): Promise<Matricula> {
    const matricula = await this.matriculaRepository.findOne({
      where: { id },
      relations: { inscripciones: true },
    });
    if (!matricula) {
      throw new NotFoundException(`Matrícula con ID ${id} no encontrada`);
    }
    return matricula;
  }
}
