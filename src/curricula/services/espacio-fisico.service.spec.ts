import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { EspacioFisicoService } from './espacio-fisico.service';
import { EspacioFisico } from '../entities/espacio-fisico.entity';
import { DiaSemana, TipoEspacioFisico } from '../enums/academico.enums';

describe('EspacioFisicoService', () => {
  let service: EspacioFisicoService;
  let repository: jest.Mocked<Partial<Repository<EspacioFisico>>>;

  const mockEspacio = (partial: Partial<EspacioFisico>): EspacioFisico => ({
    id: 1,
    codigo: 'A-101',
    nombre: 'Aula 101',
    capacidad: 30,
    tipo: TipoEspacioFisico.AULA,
    horarios: [],
    ...partial,
  });

  beforeEach(async () => {
    repository = {
      findOne: jest.fn(),
      find: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      remove: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EspacioFisicoService,
        {
          provide: getRepositoryToken(EspacioFisico),
          useValue: repository,
        },
      ],
    }).compile();

    service = module.get<EspacioFisicoService>(EspacioFisicoService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('debe estar definido', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('debe crear un espacio físico exitosamente', async () => {
      const dto = {
        codigo: 'A-101',
        nombre: 'Aula 101',
        tipo: TipoEspacioFisico.AULA,
        capacidad: 30,
        ubicacion: 'Edificio Central',
      };

      const creado = mockEspacio(dto);

      (repository.findOne as jest.Mock).mockResolvedValue(null);
      (repository.create as jest.Mock).mockReturnValue(creado);
      (repository.save as jest.Mock).mockResolvedValue(creado);

      const result = await service.create(dto);

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { codigo: dto.codigo },
      });
      expect(repository.create).toHaveBeenCalledWith(dto);
      expect(repository.save).toHaveBeenCalledWith(creado);
      expect(result).toEqual(creado);
    });

    it('debe lanzar BadRequestException si el código ya existe', async () => {
      const dto = {
        codigo: 'A-101',
        nombre: 'Aula 101',
        tipo: TipoEspacioFisico.AULA,
        capacidad: 30,
        ubicacion: 'Edificio Central',
      };

      (repository.findOne as jest.Mock).mockResolvedValue(
        mockEspacio({ codigo: 'A-101' }),
      );

      await expect(service.create(dto)).rejects.toThrow(BadRequestException);
      expect(repository.create).not.toHaveBeenCalled();
      expect(repository.save).not.toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('debe retornar el espacio físico si existe', async () => {
      const espacio = mockEspacio({ id: 1, codigo: 'A-101' });

      (repository.findOne as jest.Mock).mockResolvedValue(espacio);

      const result = await service.findOne(1);

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: { horarios: true },
      });
      expect(result).toEqual(espacio);
    });

    it('debe lanzar NotFoundException si no existe', async () => {
      (repository.findOne as jest.Mock).mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAll', () => {
    it('debe retornar la lista de espacios físicos', async () => {
      const espacios = [
        mockEspacio({ id: 1, codigo: 'A-101' }),
        mockEspacio({
          id: 2,
          codigo: 'LAB-1',
          tipo: TipoEspacioFisico.LABORATORIO,
        }),
      ];

      (repository.find as jest.Mock).mockResolvedValue(espacios);

      const result = await service.findAll();

      expect(repository.find).toHaveBeenCalledWith({
        relations: { horarios: true },
        order: { id: 'ASC' },
      });
      expect(result).toEqual(espacios);
    });
  });

  describe('update', () => {
    it('debe actualizar el espacio físico si el nuevo código no está duplicado', async () => {
      const existente = mockEspacio({
        id: 1,
        codigo: 'A-101',
        nombre: 'Aula 101',
      });
      const dto = { codigo: 'A-102', nombre: 'Aula Renovada' };
      const actualizado = { ...existente, ...dto };

      (repository.findOne as jest.Mock)
        .mockResolvedValueOnce(existente)
        .mockResolvedValueOnce(null);
      (repository.save as jest.Mock).mockResolvedValue(actualizado);

      const result = await service.update(1, dto);

      expect(result.codigo).toBe('A-102');
      expect(result.nombre).toBe('Aula Renovada');
      expect(repository.save).toHaveBeenCalled();
    });

    it('debe lanzar BadRequestException si el código ya pertenece a otro espacio', async () => {
      const existente = mockEspacio({ id: 1, codigo: 'A-101' });
      const otroEspacio = mockEspacio({ id: 2, codigo: 'A-102' });

      (repository.findOne as jest.Mock)
        .mockResolvedValueOnce(existente)
        .mockResolvedValueOnce(otroEspacio);

      await expect(service.update(1, { codigo: 'A-102' })).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('remove', () => {
    it('debe eliminar el espacio físico si existe', async () => {
      const existente = mockEspacio({ id: 1, codigo: 'A-101' });
      (repository.findOne as jest.Mock).mockResolvedValue(existente);
      (repository.remove as jest.Mock).mockResolvedValue(existente);

      await service.remove(1);

      expect(repository.remove).toHaveBeenCalledWith(existente);
    });
  });

  describe('consultarDisponibilidad', () => {
    it('debe filtrar espacios que tengan colisión de horario', async () => {
      const espacioDisponible = mockEspacio({
        id: 1,
        codigo: 'A-101',
        horarios: [
          {
            id: 10,
            asignaturaId: 1,
            espacioFisicoId: 1,
            periodoId: 1,
            diaSemana: DiaSemana.LUNES,
            horaInicio: '08:00',
            horaFin: '10:00',
          } as unknown as EspacioFisico['horarios'][0],
        ],
      });

      const espacioOcupado = mockEspacio({
        id: 2,
        codigo: 'A-102',
        horarios: [
          {
            id: 11,
            asignaturaId: 2,
            espacioFisicoId: 2,
            periodoId: 1,
            diaSemana: DiaSemana.LUNES,
            horaInicio: '09:00',
            horaFin: '11:00',
          } as unknown as EspacioFisico['horarios'][0],
        ],
      });

      (repository.find as jest.Mock).mockResolvedValue([
        espacioDisponible,
        espacioOcupado,
      ]);

      const disponibles = await service.consultarDisponibilidad(
        1,
        DiaSemana.LUNES,
        '10:00',
        '12:00',
      );

      expect(disponibles).toHaveLength(1);
      expect(disponibles[0].codigo).toBe('A-101');
    });
  });
});
