import { Test, TestingModule } from '@nestjs/testing';
import { AuditController } from './audit.controller';
import { AuditService } from '../services/audit.service';
import { JwtAuthGuard } from '../common/jwt-auth.guard';
import { RolesGuard } from '../common/roles.guard';

describe('AuditController', () => {
  let controller: AuditController;
  let service: AuditService;

  const mockAuditService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuditController],
      providers: [
        {
          provide: AuditService,
          useValue: mockAuditService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<AuditController>(AuditController);
    service = module.get<AuditService>(AuditService);
  });

  it('debe estar definido', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('debe retornar lista paginada de registros de auditoría', async () => {
      const mockResult = {
        items: [
          {
            id: 1,
            accion: 'LOGIN_EXITOSO',
            modulo: 'seguridad',
            usuarioId: 1,
            fecha: new Date(),
          },
        ],
        total: 1,
        pagina: 1,
        limite: 50,
        totalPaginas: 1,
      };

      mockAuditService.findAll.mockResolvedValue(mockResult);

      const result = await controller.findAll({});
      expect(result).toEqual(mockResult);
      expect(mockAuditService.findAll).toHaveBeenCalledWith({});
    });
  });

  describe('findOne', () => {
    it('debe retornar un registro de auditoría por id', async () => {
      const mockRecord = {
        id: 1,
        accion: 'LOGIN_EXITOSO',
        modulo: 'seguridad',
        usuarioId: 1,
        fecha: new Date(),
      };

      mockAuditService.findOne.mockResolvedValue(mockRecord);

      const result = await controller.findOne(1);
      expect(result).toEqual(mockRecord);
      expect(mockAuditService.findOne).toHaveBeenCalledWith(1);
    });
  });

  describe('create', () => {
    it('debe crear un nuevo registro de auditoría', async () => {
      const dto = {
        accion: 'CREAR_USUARIO',
        usuarioId: 2,
        modulo: 'usuarios',
      };
      const createdRecord = { id: 10, ...dto, fecha: new Date() };

      mockAuditService.create.mockResolvedValue(createdRecord);

      const result = await controller.create(dto);
      expect(result).toEqual(createdRecord);
      expect(mockAuditService.create).toHaveBeenCalledWith(dto);
    });
  });
});
