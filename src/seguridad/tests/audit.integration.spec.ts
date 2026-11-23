import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AuditController } from '../controllers/audit.controller';
import { AuditService } from '../services/audit.service';
import { RegistroAuditoria } from '../entities/registro-auditoria.entity';
import { JwtAuthGuard } from '../common/jwt-auth.guard';
import { RolesGuard } from '../common/roles.guard';

describe('Auditoria - Prueba de Integración (Controller + Service + Repositorio)', () => {
  let app: INestApplication<App>;
  const inMemoryDatabase: RegistroAuditoria[] = [];

  const mockQueryBuilder = {
    leftJoin: jest.fn().mockReturnThis(),
    addSelect: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    take: jest.fn().mockReturnThis(),
    getManyAndCount: jest
      .fn()
      .mockImplementation(() =>
        Promise.resolve([inMemoryDatabase, inMemoryDatabase.length]),
      ),
    getOne: jest
      .fn()
      .mockImplementation(() => Promise.resolve(inMemoryDatabase[0] ?? null)),
  };

  const mockRepository = {
    create: jest
      .fn()
      .mockImplementation(
        (dto: Partial<RegistroAuditoria>): RegistroAuditoria => {
          return {
            id: inMemoryDatabase.length + 1,
            fecha: new Date(),
            ...dto,
          } as RegistroAuditoria;
        },
      ),
    save: jest
      .fn()
      .mockImplementation(
        (entity: RegistroAuditoria): Promise<RegistroAuditoria> => {
          inMemoryDatabase.push(entity);
          return Promise.resolve(entity);
        },
      ),
    createQueryBuilder: jest.fn(() => mockQueryBuilder),
  };

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [AuditController],
      providers: [
        AuditService,
        {
          provide: getRepositoryToken(RegistroAuditoria),
          useValue: mockRepository,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: () => true })
      .compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ transform: true }));
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(() => {
    inMemoryDatabase.length = 0;
    jest.clearAllMocks();
  });

  it('POST /auditoria -> Debe integrar Controller y Service para registrar y retornar auditoría con 201', async () => {
    const payload = {
      accion: 'INTEGRATION_TEST_LOGIN',
      usuarioId: 10,
      modulo: 'seguridad',
      detalles: 'Prueba de integración entre Controller, Service y Repositorio',
      ipAddress: '127.0.0.1',
    };

    const server = app.getHttpServer();
    const response = await request(server)
      .post('/auditoria')
      .send(payload)
      .expect(201);

    const body = response.body as RegistroAuditoria;
    expect(body).toHaveProperty('id');
    expect(body.accion).toBe(payload.accion);
    expect(body.modulo).toBe(payload.modulo);
    expect(inMemoryDatabase.length).toBe(1);
    expect(inMemoryDatabase[0].accion).toBe(payload.accion);
  });

  it('GET /auditoria/:id -> Debe integrar Controller y Service retornando el registro existente con 200', async () => {
    const item: RegistroAuditoria = {
      id: 1,
      accion: 'ACCION_EXISTENTE',
      usuarioId: 2,
      modulo: 'usuarios',
      detalles: 'Detalles de prueba',
      ipAddress: '192.168.1.1',
      fecha: new Date(),
      usuario: null,
    };
    inMemoryDatabase.push(item);
    mockQueryBuilder.getOne.mockResolvedValueOnce(item);

    const server = app.getHttpServer();
    const response = await request(server).get('/auditoria/1').expect(200);

    const body = response.body as RegistroAuditoria;
    expect(body.id).toBe(1);
    expect(body.accion).toBe('ACCION_EXISTENTE');
  });

  it('GET /auditoria/:id -> Debe lanzar 404 (NotFoundException) cuando el ID no existe', async () => {
    mockQueryBuilder.getOne.mockResolvedValueOnce(null);

    const server = app.getHttpServer();
    await request(server).get('/auditoria/9999').expect(404);
  });
});
