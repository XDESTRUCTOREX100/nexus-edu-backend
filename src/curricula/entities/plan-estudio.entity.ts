import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Asignatura } from './asignatura.entity';
import { EstadoPlanEstudio } from '../enums/academico.enums';

@Entity('planes_estudio')
export class PlanEstudio {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  id: number;

  @Column({ type: 'varchar', length: 30, unique: true })
  codigo: string;

  @Column({ type: 'varchar', length: 150 })
  nombre: string;

  @Column({ type: 'date' })
  fechaAprobacion: Date;

  @Column({ type: 'enum', enum: EstadoPlanEstudio, default: EstadoPlanEstudio.ACTIVO })
  estado: EstadoPlanEstudio;

  @OneToMany(() => Asignatura, (asignatura) => asignatura.planEstudio)
  asignaturas: Asignatura[];
}
