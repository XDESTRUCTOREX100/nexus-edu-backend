import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ParametroGlobal } from './entities/parametro-global.entity';
import { Permiso } from './entities/permiso.entity';
import { RolPermiso } from './entities/rol-permiso.entity';
import { Rol } from './entities/rol.entity';
import { UsuarioRol } from './entities/usuario-rol.entity';
import { Usuario } from './entities/usuario.entity';
import { RefreshToken } from './entities/refresh-token.entity';
import { AdminSecurityController } from './controllers/admin-security.controller';
import { AuditController } from './controllers/audit.controller';
import { AuthController } from './controllers/auth.controller';
import { JwtAuthGuard } from './common/jwt-auth.guard';
import { RolesGuard } from './common/roles.guard';
import { AdminSecurityService } from './services/admin-security.service';
import { AuditService } from './services/audit.service';
import { AuthService } from './services/auth.service';
import { SecurityBootstrapService } from './services/security-bootstrap.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Usuario,
      Rol,
      Permiso,
      RolPermiso,
      UsuarioRol,
      ParametroGlobal,
      RefreshToken,
    ]),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'cambia-esta-clave-en-produccion',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [AuthController, AdminSecurityController, AuditController],
  providers: [
    AuthService,
    AdminSecurityService,
    AuditService,
    JwtAuthGuard,
    RolesGuard,
    SecurityBootstrapService,
  ],
  exports: [AuthService, JwtAuthGuard, RolesGuard],
})
export class SeguridadModule {}
