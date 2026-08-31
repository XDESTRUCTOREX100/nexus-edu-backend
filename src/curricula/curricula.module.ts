import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Asignatura } from './entities/asignatura.entity';
import { CalendarioAcademico } from './entities/calendario-academico.entity';
import { EspacioFisico } from './entities/espacio-fisico.entity';
import { Horario } from './entities/horario.entity';
import { PeriodoAcademico } from './entities/periodo-academico.entity';
import { PlanEstudio } from './entities/plan-estudio.entity';
import { Prerrequisito } from './entities/prerrequisito.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PlanEstudio,
      Asignatura,
      Prerrequisito,
      EspacioFisico,
      PeriodoAcademico,
      CalendarioAcademico,
      Horario,
    ]),
  ],
  exports: [TypeOrmModule],
})
export class CurriculaModule {}