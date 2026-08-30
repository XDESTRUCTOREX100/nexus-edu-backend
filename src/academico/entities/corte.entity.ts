import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Actividad } from './actividad.entity';
import { Calificacion } from './calificacion.entity';

@Entity('cortes')
export class Corte {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50 })
  nombre: string;

  @Column()
  numero: number;

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  porcentaje: number;

  @Column({ name: 'fecha_inicio', type: 'date' })
  fechaInicio: Date;

  @Column({ name: 'fecha_fin', type: 'date' })
  fechaFin: Date;

  @Column({ name: 'periodo_academico', length: 20 })
  periodoAcademico: string;

  @OneToMany(() => Actividad, (actividad) => actividad.corte)
  actividades: Actividad[];

  @OneToMany(() => Calificacion, (calificacion) => calificacion.corte)
  calificaciones: Calificacion[];
}
