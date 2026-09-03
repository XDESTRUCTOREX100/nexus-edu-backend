import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Asignatura } from './asignatura.entity';
import { EspacioFisico } from './espacio-fisico.entity';
import { PeriodoAcademico } from './periodo-academico.entity';
import { DiaSemana } from '../enums/academico.enums';

@Entity('horarios')
export class Horario {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  id: number;

  @Column({ name: 'asignatura_id', type: 'int', unsigned: true })
  asignaturaId: number;

  @Column({ name: 'espacio_fisico_id', type: 'int', unsigned: true })
  espacioFisicoId: number;

  @Column({ name: 'periodo_id', type: 'int', unsigned: true })
  periodoId: number;

  @Column({ name: 'dia_semana', type: 'enum', enum: DiaSemana })
  diaSemana: DiaSemana;

  @Column({ name: 'hora_inicio', type: 'time' })
  horaInicio: string;

  @Column({ name: 'hora_fin', type: 'time' })
  horaFin: string;

  @ManyToOne(() => Asignatura, (asignatura) => asignatura.horarios, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'asignatura_id' })
  asignatura: Asignatura;

  @ManyToOne(() => EspacioFisico, (espacioFisico) => espacioFisico.horarios, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'espacio_fisico_id' })
  espacioFisico: EspacioFisico;

  @ManyToOne(() => PeriodoAcademico, (periodo) => periodo.horarios, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'periodo_id' })
  periodo: PeriodoAcademico;
}
