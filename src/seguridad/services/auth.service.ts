import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { createHash, randomBytes } from 'crypto';
import { LoginDto } from '../dto/usuario/login.dto';
import { RefreshTokenDto } from '../dto/usuario/refresh-token.dto';
import { RefreshToken } from '../entities/refresh-token.entity';
import { Usuario } from '../entities/usuario/usuario.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Usuario) private readonly usuarios: Repository<Usuario>,
    @InjectRepository(RefreshToken)
    private readonly refreshTokens: Repository<RefreshToken>,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto, ip: string) {
    void ip;
    const usuario = await this.usuarios.findOne({
      where: { email: loginDto.email },
      relations: { usuariosRoles: { rol: { rolesPermisos: { permiso: true } } } },
    });

    if (!usuario || !(await bcrypt.compare(loginDto.password, usuario.passwordHash))) {
      throw new UnauthorizedException('Credenciales invalidas');
    }

    if (!usuario.activo) {
      throw new ForbiddenException('La cuenta esta inactiva');
    }

    const accessToken = await this.jwtService.signAsync({
      sub: usuario.id,
      email: usuario.email,
      roles: usuario.usuariosRoles?.map(({ rol }) => rol.nombre) ?? [],
    });

    const refreshToken = randomBytes(48).toString('hex');
    await this.refreshTokens.save({
      usuarioId: usuario.id,
      tokenHash: this.hashToken(refreshToken),
      expiraEn: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      revocadoEn: null,
      usuario,
    });

    return { accessToken, refreshToken, usuario: this.publicUser(usuario) };
  }

  async refresh(refreshTokenDto: RefreshTokenDto) {
    const token = await this.refreshTokens.findOne({
      where: { tokenHash: this.hashToken(refreshTokenDto.refreshToken) },
      relations: { usuario: { usuariosRoles: { rol: { rolesPermisos: { permiso: true } } } } },
    });

    if (!token || token.revocadoEn || token.expiraEn <= new Date()) {
      throw new UnauthorizedException('Refresh token invalido o expirado');
    }

    token.revocadoEn = new Date();
    await this.refreshTokens.save(token);
    return this.loginWithUser(token.usuario);
  }

  async logout(refreshTokenDto: RefreshTokenDto) {
    await this.refreshTokens.update(
      { tokenHash: this.hashToken(refreshTokenDto.refreshToken) },
      { revocadoEn: new Date() },
    );
    return { message: 'Sesion cerrada correctamente' };
  }

  private async loginWithUser(usuario: Usuario) {
    const accessToken = await this.jwtService.signAsync({
      sub: usuario.id,
      email: usuario.email,
      roles: usuario.usuariosRoles?.map(({ rol }) => rol.nombre) ?? [],
    });

    const refreshToken = randomBytes(48).toString('hex');
    await this.refreshTokens.save({
      usuarioId: usuario.id,
      tokenHash: this.hashToken(refreshToken),
      expiraEn: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      revocadoEn: null,
      usuario,
    });

    return { accessToken, refreshToken, usuario: this.publicUser(usuario) };
  }

  private hashToken(token: string) {
    return createHash('sha256').update(token).digest('hex');
  }

  private publicUser(usuario: Usuario) {
    const publicData = { ...usuario } as Record<string, unknown>;
    delete publicData.passwordHash;
    delete publicData.bloqueadoHasta;
    delete publicData.intentosFallidos;
    return publicData;
  }
}
