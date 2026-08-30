import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Inscripcion } from './inscripcion.entity';

export enum EstadoMatricula {
  ACTIVA = 'activa',
  CANCELADA = 'cancelada',
  FINALIZADA = 'finalizada',
}

@Entity('matriculas')
export class Matricula {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'estudiante_id' })
  estudianteId: number;

  @Column({ name: 'periodo_academico', length: 20 })
  periodoAcademico: string;

  @Column({ name: 'fecha_matricula', type: 'date' })
  fechaMatricula: Date;

  @Column({
    type: 'enum',
    enum: EstadoMatricula,
    default: EstadoMatricula.ACTIVA,
  })
  estado: EstadoMatricula;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => Inscripcion, (inscripcion) => inscripcion.matricula)
  inscripciones: Inscripcion[];
}
