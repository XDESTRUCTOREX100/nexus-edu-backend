import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { PlanEstudio } from './plan-estudio.entity';
import { Prerrequisito } from './prerrequisito.entity';
import { Horario } from './horario.entity';

@Entity('asignaturas')
export class Asignatura {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 30, unique: true })
  codigo: string;

  @Column({ type: 'varchar', length: 150 })
  nombre: string;

  @Column({ type: 'int', unsigned: true })
  creditos: number;

  @Column({ name: 'plan_estudio_id', type: 'int', unsigned: true })
  planEstudioId: number;

  @ManyToOne(() => PlanEstudio, (planEstudio) => planEstudio.asignaturas, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'plan_estudio_id' })
  planEstudio: PlanEstudio;

  @OneToMany(() => Prerrequisito, (prerrequisito) => prerrequisito.asignatura)
  prerrequisitos: Prerrequisito[];

  @OneToMany(() => Prerrequisito, (prerrequisito) => prerrequisito.asignaturaPrerrequisito)
  esPrerrequisitoDe: Prerrequisito[];

  @OneToMany(() => Horario, (horario) => horario.asignatura)
  horarios: Horario[];
}
