import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Usuario } from './usuario/usuario.entity';

@Entity('refresh_tokens')
export class RefreshToken {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'usuario_id' })
  usuarioId!: number;

  @Column({ name: 'token_hash', type: 'varchar', length: 255 })
  tokenHash!: string;

  @Column({ name: 'expira_en', type: 'datetime' })
  expiraEn!: Date;

  @Column({ name: 'revocado_en', type: 'datetime', nullable: true })
  revocadoEn?: Date | null;

  @ManyToOne(() => Usuario, (usuario) => usuario.refreshTokens, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'usuario_id' })
  usuario!: Usuario;
}
