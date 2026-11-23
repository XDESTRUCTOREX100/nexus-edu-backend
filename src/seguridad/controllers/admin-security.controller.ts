import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CrearParametroGlobalDto } from '../dto/parametros/crear-parametro-global.dto';
import { CrearPermisoDto } from '../dto/permisos/crear-permiso.dto';
import { CrearRolDto } from '../dto/rol/crear-rol.dto';
import { CrearUsuarioDto } from '../dto/usuario/crear-usuario.dto';
import { JwtAuthGuard } from '../common/jwt-auth.guard';
import { RolesGuard } from '../common/roles.guard';
import { Roles } from '../common/roles.decorator';
import { AdminSecurityService } from '../services/admin-security.service';

@Controller('admin')
export class AdminSecurityController {
  constructor(private readonly service: AdminSecurityService) {}

  @Post('usuarios')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('administrador')
  createUser(@Body() dto: CrearUsuarioDto) {
    return this.service.createUser(dto);
  }

  @Get('usuarios')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('administrador')
  listUsers() {
    return this.service.listUsers();
  }

  @Patch('usuarios/:id/desactivar')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('administrador')
  deactivateUser(@Param('id', ParseIntPipe) id: number) {
    return this.service.deactivateUser(id);
  }

  @Post('roles')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('administrador')
  createRole(@Body() dto: CrearRolDto) {
    return this.service.createRole(dto);
  }

  @Get('roles')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('administrador')
  listRoles() {
    return this.service.listRoles();
  }

  @Post('permisos')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('administrador')
  createPermission(@Body() dto: CrearPermisoDto) {
    return this.service.createPermission(dto);
  }

  @Get('permisos')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('administrador')
  listPermissions() {
    return this.service.listPermissions();
  }

  @Post('parametros')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('administrador')
  createParameter(@Body() dto: CrearParametroGlobalDto) {
    return this.service.createParameter(dto);
  }

  @Get('parametros')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('administrador')
  listParameters() {
    return this.service.listParameters();
  }
}
