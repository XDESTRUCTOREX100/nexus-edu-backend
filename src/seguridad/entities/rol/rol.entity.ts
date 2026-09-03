import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { RolPermiso } from './rol-permiso.entity';
import { UsuarioRol } from '../usuario/usuario-rol.entity';

@Entity('roles')
export class Rol {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 100, unique: true })
  nombre!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  descripcion?: string | null;

  @OneToMany(() => UsuarioRol, (usuarioRol) => usuarioRol.rol)
  usuariosRoles!: UsuarioRol[];

  @OneToMany(() => RolPermiso, (rolPermiso) => rolPermiso.rol)
  rolesPermisos!: RolPermiso[];
}
