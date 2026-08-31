import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { PeriodoAcademico } from './periodo-academico.entity';

@Entity('calendario_academico')
export class CalendarioAcademico {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  id: number;

  @Column({ name: 'periodo_id', type: 'int', unsigned: true })
  periodoId: number;

  @Column({ type: 'varchar', length: 200 })
  evento: string;

  @Column({ name: 'fecha_inicio', type: 'date' })
  fechaInicio: Date;

  @Column({ name: 'fecha_fin', type: 'date' })
  fechaFin: Date;

  @ManyToOne(() => PeriodoAcademico, (periodo) => periodo.calendario, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'periodo_id' })
  periodo: PeriodoAcademico;
}
