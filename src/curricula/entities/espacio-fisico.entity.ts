import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Horario } from './horario.entity';
import { TipoEspacioFisico } from '../enums/academico.enums';

@Entity('espacios_fisicos')
export class EspacioFisico {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  id: number;

  @Column({ type: 'varchar', length: 30, unique: true })
  codigo: string;

  @Column({ type: 'varchar', length: 150 })
  nombre: string;

  @Column({ type: 'int', unsigned: true })
  capacidad: number;

  @Column({ type: 'enum', enum: TipoEspacioFisico })
  tipo: TipoEspacioFisico;

  @OneToMany(() => Horario, (horario) => horario.espacioFisico)
  horarios: Horario[];
}
