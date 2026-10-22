import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, EntityManager, In, Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { CrearParametroGlobalDto } from '../dto/parametros/crear-parametro-global.dto';
import { CrearPermisoDto } from '../dto/permisos/crear-permiso.dto';
import { CrearRolDto } from '../dto/rol/crear-rol.dto';
import { AsignarRolesDto } from '../dto/usuario/asignar-roles.dto';
import { CrearUsuarioDto } from '../dto/usuario/crear-usuario.dto';
import { ParametroGlobal } from '../entities/parametro-global.entity';
import { Permiso } from '../entities/permiso.entity';
import { Rol } from '../entities/rol.entity';
import { UsuarioRol } from '../entities/usuario-rol.entity';
import { Usuario } from '../entities/usuario.entity';

@Injectable()
export class AdminSecurityService {
  constructor(
    @InjectRepository(Usuario) private readonly usuarios: Repository<Usuario>,
    @InjectRepository(Rol) private readonly roles: Repository<Rol>,
    @InjectRepository(Permiso) private readonly permisos: Repository<Permiso>,
    @InjectRepository(ParametroGlobal)
    private readonly parametros: Repository<ParametroGlobal>,
    private readonly dataSource: DataSource,
  ) {}

  async createUser(dto: CrearUsuarioDto) {
    const passwordHash = await bcrypt.hash(dto.password, 10);
    return this.dataSource.transaction(async (manager) => {
      const roles = await this.resolveRoles(manager, dto);
      const usuarios = manager.getRepository(Usuario);
      const existingUser = await usuarios.findOne({
        where: [{ email: dto.email }, { identificacion: dto.identificacion }],
      });

      if (existingUser) {
        throw new ConflictException(
          existingUser.email === dto.email
            ? 'Ya existe un usuario con ese correo.'
            : 'Ya existe un usuario con esa identificación.',
        );
      }

      const usuario = await usuarios.save(
        usuarios.create({
          email: dto.email,
          username: dto.identificacion,
          nombre: dto.nombre,
          identificacion: dto.identificacion,
          passwordHash,
          activo: dto.activo ?? true,
        }),
      );

      const usuarioRoles = manager.getRepository(UsuarioRol);
      await usuarioRoles.save(
        roles.map((rol) =>
          usuarioRoles.create({ usuarioId: usuario.id, rolId: rol.id }),
        ),
      );

      return this.toPublicUser(usuario, roles);
    });
  }

  async listUsers() {
    const usuarios = await this.usuarios.find({
      relations: { usuariosRoles: { rol: true } },
      order: { id: 'ASC' },
    });
    return usuarios.map((usuario) =>
      this.toPublicUser(
        usuario,
        usuario.usuariosRoles?.map(({ rol }) => rol) ?? [],
      ),
    );
  }

  async deactivateUser(id: number) {
    const usuario = await this.usuarios.findOne({
      where: { id },
      relations: { usuariosRoles: { rol: true } },
    });
    if (!usuario) throw new NotFoundException('Usuario no encontrado');
    usuario.activo = false;
    const saved = await this.usuarios.save(usuario);
    return this.toPublicUser(
      saved,
      saved.usuariosRoles?.map(({ rol }) => rol) ?? [],
    );
  }

  async createRole(dto: CrearRolDto) {
    const existingRole = await this.roles.findOneBy({ nombre: dto.nombre });
    if (existingRole) {
      throw new ConflictException('Ya existe un rol con ese nombre.');
    }
    return this.roles.save(this.roles.create({ ...dto }));
  }

  listRoles() {
    return this.roles.find();
  }

  async addRolesToUser(id: number, dto: AsignarRolesDto) {
    return this.updateUserRoles(id, dto, false);
  }

  async replaceUserRoles(id: number, dto: AsignarRolesDto) {
    return this.updateUserRoles(id, dto, true);
  }

  createPermission(dto: CrearPermisoDto) {
    return this.permisos.save(this.permisos.create({ ...dto }));
  }

  listPermissions() {
    return this.permisos.find();
  }

  createParameter(dto: CrearParametroGlobalDto) {
    return this.parametros.save(this.parametros.create({ ...dto }));
  }

  listParameters() {
    return this.parametros.find();
  }

  private async updateUserRoles(
    id: number,
    dto: AsignarRolesDto,
    replace: boolean,
  ) {
    return this.dataSource.transaction(async (manager) => {
      const usuario = await manager.getRepository(Usuario).findOneBy({ id });
      if (!usuario) throw new NotFoundException('Usuario no encontrado');

      const roles = await this.resolveRoles(manager, dto);
      const usuarioRoles = manager.getRepository(UsuarioRol);
      const currentAssignments = await usuarioRoles.find({
        where: { usuarioId: id },
        relations: { rol: true },
      });

      if (replace) {
        await usuarioRoles.delete({ usuarioId: id });
        await usuarioRoles.save(
          roles.map((rol) =>
            usuarioRoles.create({ usuarioId: id, rolId: rol.id }),
          ),
        );
        return this.toPublicUser(usuario, roles);
      }

      const existingRoleIds = new Set(
        currentAssignments.map(({ rolId }) => rolId),
      );
      const rolesToAdd = roles.filter((rol) => !existingRoleIds.has(rol.id));
      if (rolesToAdd.length > 0) {
        await usuarioRoles.save(
          rolesToAdd.map((rol) =>
            usuarioRoles.create({ usuarioId: id, rolId: rol.id }),
          ),
        );
      }

      const allRoles = new Map(
        currentAssignments.map(({ rol }) => [rol.id, rol]),
      );
      roles.forEach((rol) => allRoles.set(rol.id, rol));
      return this.toPublicUser(usuario, [...allRoles.values()]);
    });
  }

  private async resolveRoles(
    manager: EntityManager,
    dto: Pick<CrearUsuarioDto, 'rolesIds' | 'rolesNombres'> | AsignarRolesDto,
  ): Promise<Rol[]> {
    const hasIds = Boolean(dto.rolesIds?.length);
    const hasNames = Boolean(dto.rolesNombres?.length);
    if (hasIds === hasNames) {
      throw new BadRequestException(
        'Proporciona una lista no vacía de rolesIds o rolesNombres, pero no ambas.',
      );
    }

    const rolesRepository = manager.getRepository(Rol);
    const roles = hasIds
      ? await rolesRepository.findBy({ id: In([...new Set(dto.rolesIds!)]) })
      : await rolesRepository.findBy({
          nombre: In([...new Set(dto.rolesNombres!.map((nombre) => nombre.trim()))]),
        });
    const requestedCount = hasIds
      ? new Set(dto.rolesIds).size
      : new Set(dto.rolesNombres!.map((nombre) => nombre.trim())).size;

    if (roles.length !== requestedCount) {
      throw new NotFoundException('Uno o más roles solicitados no existen.');
    }
    return roles;
  }

  private toPublicUser(usuario: Usuario, roles: Rol[]) {
    return {
      id: usuario.id,
      email: usuario.email,
      nombre: usuario.nombre,
      identificacion: usuario.identificacion ?? null,
      activo: usuario.activo,
      roles: roles.map(({ id, nombre }) => ({ id, nombre })),
    };
  }
}
