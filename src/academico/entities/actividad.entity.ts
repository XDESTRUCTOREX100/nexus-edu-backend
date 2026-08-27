import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Corte } from './corte.entity';
import { Calificacion } from './calificacion.entity';

export enum TipoActividad {
  PARCIAL = 'parcial',
  TALLER = 'taller',
  QUIZ = 'quiz',
  PROYECTO = 'proyecto',
  OTRO = 'otro',
}

@Entity('actividades')
export class Actividad {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'corte_id' })
  corteId: number;

  @Column({ length: 100 })
  nombre: string;

  @Column({
    type: 'enum',
    enum: TipoActividad,
    default: TipoActividad.OTRO,
  })
  tipo: TipoActividad;

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  porcentaje: number;

  @Column({ type: 'date' })
  fecha: Date;

  @Column({ type: 'text', nullable: true })
  descripcion: string;

  @ManyToOne(() => Corte, (corte) => corte.actividades, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'corte_id' })
  corte: Corte;

  @OneToMany(() => Calificacion, (calificacion) => calificacion.actividad)
  calificaciones: Calificacion[];
}
