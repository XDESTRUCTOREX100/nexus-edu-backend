import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RolesGuard } from './roles.guard';

describe('RolesGuard', () => {
  let guard: RolesGuard;
  let reflector: Reflector;

  beforeEach(() => {
    reflector = new Reflector();
    guard = new RolesGuard(reflector);
  });

  const createMockContext = (user?: { roles?: string[] }): ExecutionContext => {
    return {
      getHandler: jest.fn(),
      getClass: jest.fn(),
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue({
          user,
        }),
      }),
    } as unknown as ExecutionContext;
  };

  it('debe estar definido', () => {
    expect(guard).toBeDefined();
  });

  it('debe permitir acceso si no se especifican roles requeridos en el endpoint', () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(null);
    const context = createMockContext({ roles: ['estudiante'] });

    expect(guard.canActivate(context)).toBe(true);
  });

  it('debe permitir acceso si la lista de roles requeridos está vacía', () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue([]);
    const context = createMockContext({ roles: ['estudiante'] });

    expect(guard.canActivate(context)).toBe(true);
  });

  it('debe permitir acceso si el usuario cuenta con uno de los roles requeridos', () => {
    jest
      .spyOn(reflector, 'getAllAndOverride')
      .mockReturnValue(['administrador', 'docente']);
    const context = createMockContext({ roles: ['docente'] });

    expect(guard.canActivate(context)).toBe(true);
  });

  it('debe lanzar ForbiddenException si el usuario no tiene el rol requerido', () => {
    jest
      .spyOn(reflector, 'getAllAndOverride')
      .mockReturnValue(['administrador']);
    const context = createMockContext({ roles: ['estudiante'] });

    expect(() => guard.canActivate(context)).toThrow(ForbiddenException);
    expect(() => guard.canActivate(context)).toThrow(
      'No tienes permisos para esta operación',
    );
  });

  it('debe lanzar ForbiddenException si la petición no tiene usuario autenticado', () => {
    jest
      .spyOn(reflector, 'getAllAndOverride')
      .mockReturnValue(['administrador']);
    const context = createMockContext(undefined);

    expect(() => guard.canActivate(context)).toThrow(ForbiddenException);
  });
});
