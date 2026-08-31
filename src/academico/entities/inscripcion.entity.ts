import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { Matricula } from './matricula.entity';
import { Calificacion } from './calificacion.entity';
import { Asistencia } from './asistencia.entity';

export enum EstadoInscripcion {
  ACTIVA = 'activa',
  RETIRADA = 'retirada',
  APROBADA = 'aprobada',
  REPROBADA = 'reprobada',
}

@Entity('inscripciones')
export class Inscripcion {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'matricula_id' })
  matriculaId: number;

  @Column({ name: 'curso_id' })
  cursoId: number;

  @Column({ name: 'docente_id' })
  docenteId: number;

  @Column({ length: 20, nullable: true })
  grupo: string;

  @Column({
    type: 'enum',
    enum: EstadoInscripcion,
    default: EstadoInscripcion.ACTIVA,
  })
  estado: EstadoInscripcion;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => Matricula, (matricula) => matricula.inscripciones, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'matricula_id' })
  matricula: Matricula;

  @OneToMany(() => Calificacion, (calificacion) => calificacion.inscripcion)
  calificaciones: Calificacion[];

  @OneToMany(() => Asistencia, (asistencia) => asistencia.inscripcion)
  asistencias: Asistencia[];
}
