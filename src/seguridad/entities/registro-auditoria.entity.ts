import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Usuario } from './usuario.entity';

@Entity('auditoria')
export class RegistroAuditoria {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'usuario_id', type: 'int', nullable: true })
  usuarioId?: number | null;

  @ManyToOne(() => Usuario, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'usuario_id' })
  usuario?: Usuario | null;

  @Column({ type: 'varchar', length: 255 })
  accion!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  modulo?: string | null;

  @Column({ type: 'text', nullable: true })
  detalles?: string | null;

  @Column({ name: 'ip_address', type: 'varchar', length: 45, nullable: true })
  ipAddress?: string | null;

  @CreateDateColumn({ type: 'datetime' })
  fecha!: Date;
}

export { RegistroAuditoria as Auditoria };
