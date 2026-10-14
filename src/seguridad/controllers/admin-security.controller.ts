import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { CrearParametroGlobalDto } from '../dto/parametros/crear-parametro-global.dto';
import { CrearPermisoDto } from '../dto/permisos/crear-permiso.dto';
import { CrearRolDto } from '../dto/rol/crear-rol.dto';
import { AsignarRolesDto } from '../dto/usuario/asignar-roles.dto';
import { CrearUsuarioDto } from '../dto/usuario/crear-usuario.dto';
import { JwtAuthGuard } from '../common/jwt-auth.guard';
import { RolesGuard } from '../common/roles.guard';
import { Roles } from '../common/roles.decorator';
import { AdminSecurityService } from '../services/admin-security.service';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('administrador', 'ADMIN')
export class AdminSecurityController {
  constructor(private readonly service: AdminSecurityService) {}

  @Post('usuarios')
  createUser(@Body() dto: CrearUsuarioDto) {
    return this.service.createUser(dto);
  }

  @Post('usuarios/:id/roles')
  addRolesToUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: AsignarRolesDto,
  ) {
    return this.service.addRolesToUser(id, dto);
  }

  @Put('usuarios/:id/roles')
  replaceUserRoles(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: AsignarRolesDto,
  ) {
    return this.service.replaceUserRoles(id, dto);
  }

  @Get('usuarios')
  listUsers() {
    return this.service.listUsers();
  }

  @Patch('usuarios/:id/desactivar')
  deactivateUser(@Param('id', ParseIntPipe) id: number) {
    return this.service.deactivateUser(id);
  }

  @Post('roles')
  createRole(@Body() dto: CrearRolDto) {
    return this.service.createRole(dto);
  }

  @Get('roles')
  listRoles() {
    return this.service.listRoles();
  }

  @Post('permisos')
  createPermission(@Body() dto: CrearPermisoDto) {
    return this.service.createPermission(dto);
  }

  @Get('permisos')
  listPermissions() {
    return this.service.listPermissions();
  }

  @Post('parametros')
  createParameter(@Body() dto: CrearParametroGlobalDto) {
    return this.service.createParameter(dto);
  }

  @Get('parametros')
  listParameters() {
    return this.service.listParameters();
  }
}
