import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { RefreshToken } from '../refresh-token.entity';
import { UsuarioRol } from './usuario-rol.entity';

@Entity('usuarios')
export class Usuario {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 150, unique: true })
  email!: string;

  @Column({ type: 'varchar', length: 150 })
  nombre!: string;

  @Column({ name: 'password_hash', type: 'varchar', length: 255 })
  passwordHash!: string;

  @Column({ type: 'boolean', default: true })
  activo!: boolean;

  @Column({ type: 'int', default: 0 })
  intentosFallidos!: number;

  @Column({ type: 'datetime', nullable: true, name: 'bloqueado_hasta' })
  bloqueadoHasta?: Date | null;

  @Column({ type: 'datetime', nullable: true, name: 'ultimo_login' })
  ultimoLogin?: Date | null;

  @OneToMany(() => UsuarioRol, (usuarioRol) => usuarioRol.usuario)
  usuariosRoles!: UsuarioRol[];

  @OneToMany(() => RefreshToken, (refreshToken) => refreshToken.usuario)
  refreshTokens!: RefreshToken[];
}
