import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Permiso } from '../permisos/permiso.entity';
import { Rol } from './rol.entity';

@Entity('roles_permisos')
export class RolPermiso {
  @PrimaryColumn({ name: 'rol_id' })
  rolId!: number;

  @PrimaryColumn({ name: 'permiso_id' })
  permisoId!: number;

  @ManyToOne(() => Rol, (rol) => rol.rolesPermisos, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'rol_id' })
  rol!: Rol;

  @ManyToOne(() => Permiso, (permiso) => permiso.rolesPermisos, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'permiso_id' })
  permiso!: Permiso;
}
