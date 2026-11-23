import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RegistroAuditoria } from '../entities/registro-auditoria.entity';
import { CrearAuditoriaDto } from '../dto/auditoria/crear-auditoria.dto';
import { FiltroAuditoriaDto } from '../dto/auditoria/filtro-auditoria.dto';

@Injectable()
export class AuditService {
  constructor(
    @InjectRepository(RegistroAuditoria)
    private readonly auditRepository: Repository<RegistroAuditoria>,
  ) {}

  async log(
    action: string,
    userId?: number,
    modulo: string = 'seguridad',
    detalles?: string,
    ipAddress?: string,
  ) {
    const registro = this.auditRepository.create({
      accion: action,
      usuarioId: userId ?? null,
      modulo,
      detalles: detalles ?? null,
      ipAddress: ipAddress ?? null,
    });
    return this.auditRepository.save(registro);
  }

  async create(dto: CrearAuditoriaDto) {
    const registro = this.auditRepository.create({
      accion: dto.accion,
      usuarioId: dto.usuarioId ?? null,
      modulo: dto.modulo ?? 'seguridad',
      detalles: dto.detalles ?? null,
      ipAddress: dto.ipAddress ?? null,
    });
    return this.auditRepository.save(registro);
  }

  async findAll(filtro?: FiltroAuditoriaDto) {
    const queryBuilder = this.auditRepository
      .createQueryBuilder('auditoria')
      .leftJoin('auditoria.usuario', 'usuario')
      .addSelect(['usuario.id', 'usuario.nombre', 'usuario.email']);

    if (filtro?.usuarioId) {
      queryBuilder.andWhere('auditoria.usuarioId = :usuarioId', {
        usuarioId: filtro.usuarioId,
      });
    }

    if (filtro?.modulo) {
      queryBuilder.andWhere('auditoria.modulo = :modulo', {
        modulo: filtro.modulo,
      });
    }

    if (filtro?.accion) {
      queryBuilder.andWhere('auditoria.accion LIKE :accion', {
        accion: `%${filtro.accion}%`,
      });
    }

    const limite = filtro?.limite
      ? Math.min(Math.max(1, filtro.limite), 100)
      : 50;
    const pagina = filtro?.pagina ? Math.max(1, filtro.pagina) : 1;
    const skip = (pagina - 1) * limite;

    queryBuilder.orderBy('auditoria.fecha', 'DESC').skip(skip).take(limite);

    const [items, total] = await queryBuilder.getManyAndCount();

    return {
      items,
      total,
      pagina,
      limite,
      totalPaginas: Math.ceil(total / limite),
    };
  }

  async findOne(id: number) {
    const registro = await this.auditRepository
      .createQueryBuilder('auditoria')
      .leftJoin('auditoria.usuario', 'usuario')
      .addSelect(['usuario.id', 'usuario.nombre', 'usuario.email'])
      .where('auditoria.id = :id', { id })
      .getOne();

    if (!registro) {
      throw new NotFoundException(
        `Registro de auditoría con ID ${id} no encontrado`,
      );
    }

    return registro;
  }
}
