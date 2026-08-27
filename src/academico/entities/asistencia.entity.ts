import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Inscripcion } from './inscripcion.entity';

export enum EstadoAsistencia {
  PRESENTE = 'presente',
  AUSENTE = 'ausente',
  JUSTIFICADA = 'justificada',
  TARDANZA = 'tardanza',
}

@Entity('asistencias')
export class Asistencia {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'inscripcion_id' })
  inscripcionId: number;

  @Column({ type: 'date' })
  fecha: Date;

  @Column({
    type: 'enum',
    enum: EstadoAsistencia,
    default: EstadoAsistencia.PRESENTE,
  })
  estado: EstadoAsistencia;

  @Column({ type: 'text', nullable: true })
  observaciones: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ManyToOne(() => Inscripcion, (inscripcion) => inscripcion.asistencias, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'inscripcion_id' })
  inscripcion: Inscripcion;
}
