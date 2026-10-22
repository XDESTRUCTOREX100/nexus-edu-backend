import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Entities
import { Actividad } from './entities/actividad.entity';
import { Asistencia } from './entities/asistencia.entity';
import { Calificacion } from './entities/calificacion.entity';
import { Corte } from './entities/corte.entity';
import { Inscripcion } from './entities/inscripcion.entity';
import { Matricula } from './entities/matricula.entity';
import { RegistroAuditoria } from './entities/registro-auditoria.entity';
import { VwEstudiantesBajoRendimiento } from './entities/vw-estudiantes-bajo-rendimiento.entity';
import { SeguridadModule } from '../seguridad/seguridad.module';
import { JwtAuthGuard } from '../seguridad/common/jwt-auth.guard';
import { RolesGuard } from '../seguridad/common/roles.guard';

// Controllers
import { ActividadController } from './controllers/actividad.controller';
import { AsistenciaController } from './controllers/asistencia.controller';
import { CalificacionController } from './controllers/calificacion.controller';
import { CorteController } from './controllers/corte.controller';
import { InscripcionController } from './controllers/inscripcion.controller';
import { MatriculaController } from './controllers/matricula.controller';
import { RegistroAuditoriaController } from './controllers/registro-auditoria.controller';

// Services
import { ActividadService } from './services/actividad.service';
import { AsistenciaService } from './services/asistencia.service';
import { CalificacionService } from './services/calificacion.service';
import { CorteService } from './services/corte.service';
import { InscripcionService } from './services/inscripcion.service';
import { MatriculaService } from './services/matricula.service';
import { RegistroAuditoriaService } from './services/registro-auditoria.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Actividad,
      Asistencia,
      Calificacion,
      Corte,
      Inscripcion,
      Matricula,
      RegistroAuditoria,
      VwEstudiantesBajoRendimiento,
    ]),
    SeguridadModule,
  ],
  controllers: [
    ActividadController,
    AsistenciaController,
    CalificacionController,
    CorteController,
    InscripcionController,
    MatriculaController,
    RegistroAuditoriaController,
  ],
  providers: [
    JwtAuthGuard,
    RolesGuard,
    ActividadService,
    AsistenciaService,
    CalificacionService,
    CorteService,
    InscripcionService,
    MatriculaService,
    RegistroAuditoriaService,
  ],
  exports: [
    ActividadService,
    AsistenciaService,
    CalificacionService,
    CorteService,
    InscripcionService,
    MatriculaService,
    RegistroAuditoriaService,
  ],
})
export class AcademicoModule {}
