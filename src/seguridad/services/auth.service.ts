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
import { Usuario } from '../entities/usuario.entity';

@Injectable()
export class AuthService {
  private static readonly MAX_LOGIN_ATTEMPTS = 5;
  private static readonly LOCK_DURATION_MS = 15 * 60 * 1000;

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
      relations: {
        usuariosRoles: { rol: { rolesPermisos: { permiso: true } } },
      },
    });

    if (!usuario) {
      throw new UnauthorizedException('Credenciales invalidas');
    }

    if (usuario.bloqueadoHasta && usuario.bloqueadoHasta > new Date()) {
      throw new ForbiddenException('La cuenta esta bloqueada temporalmente');
    }

    const passwordValid = await bcrypt.compare(
      loginDto.password,
      usuario.passwordHash,
    );
    if (!passwordValid) {
      usuario.intentosFallidos += 1;
      if (usuario.intentosFallidos >= AuthService.MAX_LOGIN_ATTEMPTS) {
        usuario.bloqueadoHasta = new Date(
          Date.now() + AuthService.LOCK_DURATION_MS,
        );
        usuario.intentosFallidos = 0;
      }
      await this.usuarios.save(usuario);
      throw new UnauthorizedException('Credenciales invalidas');
    }

    if (!usuario.activo) {
      throw new ForbiddenException('La cuenta esta inactiva');
    }

    usuario.intentosFallidos = 0;
    usuario.bloqueadoHasta = null;
    usuario.ultimoLogin = new Date();
    await this.usuarios.save(usuario);

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
      relations: {
        usuario: {
          usuariosRoles: { rol: { rolesPermisos: { permiso: true } } },
        },
      },
    });

    if (!token || token.revocadoEn || token.expiraEn <= new Date()) {
      throw new UnauthorizedException('Refresh token invalido o expirado');
    }

    if (!token.usuario.activo) {
      throw new ForbiddenException('La cuenta esta inactiva');
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
