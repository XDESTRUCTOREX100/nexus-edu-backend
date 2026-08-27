import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Inscripcion } from './inscripcion.entity';
import { Corte } from './corte.entity';
import { Actividad } from './actividad.entity';

@Entity('calificaciones')
export class Calificacion {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'inscripcion_id' })
  inscripcionId: number;

  @Column({ name: 'corte_id' })
  corteId: number;

  @Column({ name: 'actividad_id', nullable: true })
  actividadId: number;

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  nota: number;

  @Column({ type: 'text', nullable: true })
  observaciones: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => Inscripcion, (inscripcion) => inscripcion.calificaciones, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'inscripcion_id' })
  inscripcion: Inscripcion;

  @ManyToOne(() => Corte, (corte) => corte.calificaciones, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'corte_id' })
  corte: Corte;

  @ManyToOne(() => Actividad, (actividad) => actividad.calificaciones, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'actividad_id' })
  actividad: Actividad;
}
