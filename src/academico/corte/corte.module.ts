import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Corte } from '../entities/corte.entity';
import { CorteService } from './corte.service';
import { CorteController } from './corte.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Corte])],
  controllers: [CorteController],
  providers: [CorteService],
  exports: [CorteService],
})
export class CorteModule {}
