import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { RolPermiso } from '../rol/rol-permiso.entity';

@Entity('permisos')
export class Permiso {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 100 })
  recurso!: string;

  @Column({ type: 'varchar', length: 100 })
  accion!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  descripcion?: string | null;

  @OneToMany(() => RolPermiso, (rolPermiso) => rolPermiso.permiso)
  rolesPermisos!: RolPermiso[];
}
