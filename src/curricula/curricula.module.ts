import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Asignatura } from './entities/asignatura.entity';
import { CalendarioAcademico } from './entities/calendario-academico.entity';
import { EspacioFisico } from './entities/espacio-fisico.entity';
import { Horario } from './entities/horario.entity';
import { PeriodoAcademico } from './entities/periodo-academico.entity';
import { PlanEstudio } from './entities/plan-estudio.entity';
import { Prerrequisito } from './entities/prerrequisito.entity';
import { PlanEstudioController } from './controllers/plan-estudio.controller';
import { AsignaturaController } from './controllers/asignatura.controller';
import { PrerrequisitoController } from './controllers/prerrequisito.controller';
import { EspacioFisicoController } from './controllers/espacio-fisico.controller';
import { PeriodoAcademicoController } from './controllers/periodo-academico.controller';
import { CalendarioAcademicoController } from './controllers/calendario-academico.controller';
import { HorarioController } from './controllers/horario.controller';
import { PlanEstudioService } from './services/plan-estudio.service';
import { AsignaturaService } from './services/asignatura.service';
import { PrerrequisitoService } from './services/prerrequisito.service';
import { EspacioFisicoService } from './services/espacio-fisico.service';
import { PeriodoAcademicoService } from './services/periodo-academico.service';
import { CalendarioAcademicoService } from './services/calendario-academico.service';
import { HorarioService } from './services/horario.service';

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
  controllers: [
    PlanEstudioController,
    AsignaturaController,
    PrerrequisitoController,
    EspacioFisicoController,
    PeriodoAcademicoController,
    CalendarioAcademicoController,
    HorarioController,
  ],
  providers: [
    PlanEstudioService,
    AsignaturaService,
    PrerrequisitoService,
    EspacioFisicoService,
    PeriodoAcademicoService,
    CalendarioAcademicoService,
    HorarioService,
  ],
  exports: [
    TypeOrmModule,
    PlanEstudioService,
    AsignaturaService,
    PrerrequisitoService,
    EspacioFisicoService,
    PeriodoAcademicoService,
    CalendarioAcademicoService,
    HorarioService,
  ],
})
export class CurriculaModule {}