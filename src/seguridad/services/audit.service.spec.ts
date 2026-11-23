import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { AuditService } from './audit.service';
import { RegistroAuditoria } from '../entities/registro-auditoria.entity';

describe('AuditService', () => {
  let service: AuditService;

  const mockQueryBuilder = {
    leftJoin: jest.fn().mockReturnThis(),
    addSelect: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    take: jest.fn().mockReturnThis(),
    getManyAndCount: jest.fn(),
    getOne: jest.fn(),
  };

  const mockRepository = {
    create: jest
      .fn()
      .mockImplementation(
        (dto: Partial<RegistroAuditoria>) => dto as RegistroAuditoria,
      ),
    save: jest
      .fn()
      .mockImplementation((entity: Partial<RegistroAuditoria>) =>
        Promise.resolve({ id: 1, fecha: new Date(), ...entity }),
      ),
    createQueryBuilder: jest.fn(() => mockQueryBuilder),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuditService,
        {
          provide: getRepositoryToken(RegistroAuditoria),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<AuditService>(AuditService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('debe estar definido', () => {
    expect(service).toBeDefined();
  });

  describe('log', () => {
    it('debe registrar un evento de auditoría correctamente', async () => {
      const result = await service.log(
        'TEST_ACTION',
        5,
        'test_module',
        'detalles',
      );
      expect(result).toHaveProperty('id', 1);
      expect(result.accion).toBe('TEST_ACTION');
      expect(result.usuarioId).toBe(5);
      expect(result.modulo).toBe('test_module');
      expect(mockRepository.save).toHaveBeenCalled();
    });
  });

  describe('create', () => {
    it('debe crear un registro desde el DTO', async () => {
      const result = await service.create({
        accion: 'LOGIN_EXITOSO',
        usuarioId: 1,
        modulo: 'auth',
      });
      expect(result.accion).toBe('LOGIN_EXITOSO');
      expect(mockRepository.save).toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('debe devolver items paginados con filtros', async () => {
      const mockItems = [{ id: 1, accion: 'LOGIN' }];
      mockQueryBuilder.getManyAndCount.mockResolvedValue([mockItems, 1]);

      const result = await service.findAll({
        usuarioId: 1,
        modulo: 'auth',
        accion: 'LOGIN',
        pagina: 1,
        limite: 10,
      });

      expect(result).toEqual({
        items: mockItems,
        total: 1,
        pagina: 1,
        limite: 10,
        totalPaginas: 1,
      });
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledTimes(3);
    });
  });

  describe('findOne', () => {
    it('debe retornar un registro existente', async () => {
      const mockItem = { id: 1, accion: 'LOGIN' };
      mockQueryBuilder.getOne.mockResolvedValue(mockItem);

      const result = await service.findOne(1);
      expect(result).toEqual(mockItem);
    });

    it('debe lanzar NotFoundException si no existe', async () => {
      mockQueryBuilder.getOne.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });
});
