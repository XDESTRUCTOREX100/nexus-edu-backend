import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('parametros_globales')
export class ParametroGlobal {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 100, unique: true })
  clave!: string;

  @Column({ type: 'text' })
  valor!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  descripcion?: string | null;
}
