import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('registros_auditoria')
export class RegistroAuditoria {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'usuario_id' })
  usuarioId!: number;

  @Column({ type: 'varchar', length: 255 })
  accion!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  modulo?: string | null;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  fecha!: Date;
}
