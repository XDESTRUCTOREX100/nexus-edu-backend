import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { CalendarioAcademico } from './calendario-academico.entity';
import { Horario } from './horario.entity';
import { EstadoPeriodoAcademico } from '../enums/academico.enums';

@Entity('periodos_academicos')
export class PeriodoAcademico {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  id: number;

  @Column({ type: 'varchar', length: 30, unique: true })
  codigo: string;

  @Column({ name: 'fecha_inicio', type: 'date' })
  fechaInicio: Date;

  @Column({ name: 'fecha_fin', type: 'date' })
  fechaFin: Date;

  @Column({ type: 'enum', enum: EstadoPeriodoAcademico, default: EstadoPeriodoAcademico.INACTIVO })
  estado: EstadoPeriodoAcademico;

  @OneToMany(() => CalendarioAcademico, (calendario) => calendario.periodo)
  calendario: CalendarioAcademico[];

  @OneToMany(() => Horario, (horario) => horario.periodo)
  horarios: Horario[];
}
