import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum OperacionAuditoria {
  INSERT = 'INSERT',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
}

@Entity('registros_auditoria')
export class RegistroAuditoria {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'tabla_afectada', length: 100 })
  tablaAfectada: string;

  @Column({
    type: 'enum',
    enum: OperacionAuditoria,
  })
  operacion: OperacionAuditoria;

  @Column({ name: 'registro_id' })
  registroId: number;

  @Column({ name: 'datos_anteriores', type: 'json', nullable: true })
  datosAnteriores: Record<string, unknown>;

  @Column({ name: 'datos_nuevos', type: 'json', nullable: true })
  datosNuevos: Record<string, unknown>;

  @Column({ name: 'usuario_id' })
  usuarioId: number;

  @Column({ name: 'ip_address', length: 45, nullable: true })
  ipAddress: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
