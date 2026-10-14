import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import { Repository } from 'typeorm';
import { Rol } from '../entities/rol.entity';
import { UsuarioRol } from '../entities/usuario-rol.entity';
import { Usuario } from '../entities/usuario.entity';

@Injectable()
export class SecurityBootstrapService implements OnModuleInit {
  private readonly logger = new Logger(SecurityBootstrapService.name);

  constructor(
    @InjectRepository(Usuario)
    private readonly usuarios: Repository<Usuario>,
    @InjectRepository(Rol)
    private readonly roles: Repository<Rol>,
    @InjectRepository(UsuarioRol)
    private readonly usuariosRoles: Repository<UsuarioRol>,
  ) {}

  async onModuleInit() {
    const email = process.env.ADMIN_EMAIL;
    const password = process.env.ADMIN_PASSWORD;
    const nombre = process.env.ADMIN_NAME;

    if (!email || !password || !nombre) {
      this.logger.warn(
        'No se creo el administrador inicial: faltan ADMIN_EMAIL, ADMIN_PASSWORD o ADMIN_NAME',
      );
      return;
    }

    if (password.length < 6) {
      this.logger.warn(
        'No se creo el administrador inicial: ADMIN_PASSWORD debe tener al menos 6 caracteres',
      );
      return;
    }

    const adminRole = await this.roles
      .save(
        this.roles.create({
          nombre: 'administrador',
          descripcion: 'Acceso administrativo del sistema',
        }),
      )
      .catch(async (error: unknown) => {
        const existingRole = await this.roles.findOneBy({
          nombre: 'administrador',
        });
        if (existingRole) return existingRole;
        throw error;
      });

    let usuario = await this.usuarios.findOneBy({ email });
    if (!usuario) {
      usuario = await this.usuarios.save(
        this.usuarios.create({
          email,
          nombre,
          passwordHash: await bcrypt.hash(password, 10),
          activo: true,
        }),
      );
      this.logger.log(`Administrador inicial creado: ${email}`);
    }

    const roleAssignment = await this.usuariosRoles.findOneBy({
      usuarioId: usuario.id,
      rolId: adminRole.id,
    });
    if (!roleAssignment) {
      await this.usuariosRoles.save(
        this.usuariosRoles.create({
          usuarioId: usuario.id,
          rolId: adminRole.id,
        }),
      );
    }
  }
}
