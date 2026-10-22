import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import { EntityManager, Repository } from 'typeorm';
import { Rol } from '../entities/rol.entity';
import { UsuarioRol } from '../entities/usuario-rol.entity';
import { Usuario } from '../entities/usuario.entity';

@Injectable()
export class StudentAccountService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarios: Repository<Usuario>,
    @InjectRepository(Rol)
    private readonly roles: Repository<Rol>,
    @InjectRepository(UsuarioRol)
    private readonly usuariosRoles: Repository<UsuarioRol>,
  ) {}

  async ensureAccount(
    documentId: string,
    manager?: EntityManager,
  ): Promise<Usuario> {
    const document = String(documentId).trim();
    const usuarios = manager?.getRepository(Usuario) ?? this.usuarios;
    const roles = manager?.getRepository(Rol) ?? this.roles;
    const usuariosRoles =
      manager?.getRepository(UsuarioRol) ?? this.usuariosRoles;

    const role = await this.ensureStudentRole(roles);
    let usuario = await usuarios.findOne({
      where: [{ username: document }, { identificacion: document }],
    });

    if (!usuario) {
      const passwordHash = await bcrypt.hash(document, 10);
      usuario = usuarios.create({
        username: document,
        identificacion: document,
        email: null,
        nombre: `Estudiante ${document}`,
        passwordHash,
        activo: true,
      });
      usuario = await usuarios.save(usuario);
    } else if (usuario.username && usuario.username !== document) {
      throw new ConflictException(
        'El documento del estudiante ya está asociado a otro nombre de usuario.',
      );
    } else if (!usuario.username) {
      usuario.username = document;
      try {
        usuario = await usuarios.save(usuario);
      } catch {
        throw new ConflictException(
          'El documento del estudiante ya está asociado a otro nombre de usuario.',
        );
      }
    }

    const assignment = await usuariosRoles.findOneBy({
      usuarioId: usuario.id,
      rolId: role.id,
    });
    if (!assignment) {
      await usuariosRoles.save(
        usuariosRoles.create({ usuarioId: usuario.id, rolId: role.id }),
      );
    }

    return usuario;
  }

  private async ensureStudentRole(roles: Repository<Rol>): Promise<Rol> {
    const existingRole = await roles.findOneBy({ nombre: 'ESTUDIANTE' });
    if (existingRole) return existingRole;

    try {
      return await roles.save(
        roles.create({
          nombre: 'ESTUDIANTE',
          descripcion: 'Acceso de estudiante',
        }),
      );
    } catch (error) {
      const createdRole = await roles.findOneBy({ nombre: 'ESTUDIANTE' });
      if (createdRole) return createdRole;
      throw error;
    }
  }
}
