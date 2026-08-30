import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RegistroAuditoria } from '../entities/registro-auditoria.entity';
import { CreateRegistroAuditoriaDto } from '../dto/registro-auditoria/create-registro-auditoria.dto';

@Injectable()
export class RegistroAuditoriaService {
  constructor(
    @InjectRepository(RegistroAuditoria)
    private readonly registroAuditoriaRepository: Repository<RegistroAuditoria>,
  ) {}

  async create(
    createRegistroAuditoriaDto: CreateRegistroAuditoriaDto,
  ): Promise<RegistroAuditoria> {
    const registro = this.registroAuditoriaRepository.create(
      createRegistroAuditoriaDto,
    );
    return this.registroAuditoriaRepository.save(registro);
  }

  async findAll(): Promise<RegistroAuditoria[]> {
    return this.registroAuditoriaRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<RegistroAuditoria> {
    const registro = await this.registroAuditoriaRepository.findOne({
      where: { id },
    });
    if (!registro) {
      throw new NotFoundException(
        `Registro de auditoría con ID ${id} no encontrado`,
      );
    }
    return registro;
  }

  async findByTabla(tabla: string): Promise<RegistroAuditoria[]> {
    return this.registroAuditoriaRepository.find({
      where: { tablaAfectada: tabla },
      order: { createdAt: 'DESC' },
    });
  }
}
