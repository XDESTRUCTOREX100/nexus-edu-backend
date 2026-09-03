import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CrearParametroGlobalDto } from '../dto/parametros/crear-parametro-global.dto';
import { CrearPermisoDto } from '../dto/permisos/crear-permiso.dto';
import { CrearRolDto } from '../dto/rol/crear-rol.dto';
import { CrearUsuarioDto } from '../dto/usuario/crear-usuario.dto';
import { ParametroGlobal } from '../entities/parametros/parametro-global.entity';
import { Permiso } from '../entities/permisos/permiso.entity';
import { Rol } from '../entities/rol/rol.entity';
import { Usuario } from '../entities/usuario/usuario.entity';

@Injectable()
export class AdminSecurityService {
  constructor(
    @InjectRepository(Usuario) private readonly usuarios: Repository<Usuario>,
    @InjectRepository(Rol) private readonly roles: Repository<Rol>,
    @InjectRepository(Permiso) private readonly permisos: Repository<Permiso>,
    @InjectRepository(ParametroGlobal)
    private readonly parametros: Repository<ParametroGlobal>,
  ) {}

  async createUser(dto: CrearUsuarioDto) {
    const usuario = this.usuarios.create({
      email: dto.email,
      nombre: dto.nombre,
      passwordHash: dto.password,
      activo: dto.activo ?? true,
    });
    return this.usuarios.save(usuario);
  }

  async listUsers() {
    return this.usuarios.find();
  }

  async deactivateUser(id: number) {
    const usuario = await this.usuarios.findOneBy({ id });
    if (!usuario) throw new NotFoundException('Usuario no encontrado');
    usuario.activo = false;
    return this.usuarios.save(usuario);
  }

  createRole(dto: CrearRolDto) {
    return this.roles.save(this.roles.create({ ...dto }));
  }

  listRoles() {
    return this.roles.find();
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
}
