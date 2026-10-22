import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CurriculaModule } from './curricula/curricula.module';
import { AcademicoModule } from './academico/academico.module';
import { SeguridadModule } from './seguridad/seguridad.module';
import { AuditoriaTriggers1700000000000 } from './database/migrations/1700000000000-AuditoriaTriggers';
import { MigrationRunnerService } from './database/migration-runner.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT ?? '3306', 10),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      autoLoadEntities: true,
      migrations: [AuditoriaTriggers1700000000000],
      synchronize: true, // Desactivar en producción
    }),
    CurriculaModule,
    AcademicoModule,
    SeguridadModule,
  ],
  providers: [MigrationRunnerService],
})
export class AppModule {}
