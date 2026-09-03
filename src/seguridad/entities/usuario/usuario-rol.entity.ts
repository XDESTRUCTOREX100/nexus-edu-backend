import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Rol } from '../rol/rol.entity';
import { Usuario } from './usuario.entity';

@Entity('usuarios_roles')
export class UsuarioRol {
  @PrimaryColumn({ name: 'usuario_id' })
  usuarioId!: number;

  @PrimaryColumn({ name: 'rol_id' })
  rolId!: number;

  @ManyToOne(() => Usuario, (usuario) => usuario.usuariosRoles, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'usuario_id' })
  usuario!: Usuario;

  @ManyToOne(() => Rol, (rol) => rol.usuariosRoles, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'rol_id' })
  rol!: Rol;
}
