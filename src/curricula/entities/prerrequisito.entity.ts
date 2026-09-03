import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Asignatura } from './asignatura.entity';

@Entity('prerrequisitos')
@Index(['asignaturaId', 'asignaturaPrerrequisitoId'], { unique: true })
export class Prerrequisito {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  id: number;

  @Column({ name: 'asignatura_id', type: 'int', unsigned: true })
  asignaturaId: number;

  @Column({ name: 'asignatura_prerrequisito_id', type: 'int', unsigned: true })
  asignaturaPrerrequisitoId: number;

  @ManyToOne(() => Asignatura, (asignatura) => asignatura.prerrequisitos, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'asignatura_id' })
  asignatura: Asignatura;

  @ManyToOne(() => Asignatura, (asignatura) => asignatura.esPrerrequisitoDe, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'asignatura_prerrequisito_id' })
  asignaturaPrerrequisito: Asignatura;
}
