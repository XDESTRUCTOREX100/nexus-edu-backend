import { Module } from '@nestjs/common';
import { MatriculaModule } from './matricula/matricula.module';
import { InscripcionModule } from './inscripcion/inscripcion.module';
import { CorteModule } from './corte/corte.module';
import { CalificacionModule } from './calificacion/calificacion.module';
import { ActividadModule } from './actividad/actividad.module';
import { AsistenciaModule } from './asistencia/asistencia.module';
import { RegistroAuditoriaModule } from './registro-auditoria/registro-auditoria.module';

/**
 * AcademicoModule — Módulo raíz del proceso educativo operativo.
 * Agrupa: matrículas, inscripciones, cortes, calificaciones,
 * actividades, asistencias y auditoría.
 */
@Module({
  imports: [
    MatriculaModule,
    InscripcionModule,
    CorteModule,
    CalificacionModule,
    ActividadModule,
    AsistenciaModule,
    RegistroAuditoriaModule,
  ],
  exports: [
    MatriculaModule,
    InscripcionModule,
    CorteModule,
    CalificacionModule,
    ActividadModule,
    AsistenciaModule,
    RegistroAuditoriaModule,
  ],
})
export class AcademicoModule {}
