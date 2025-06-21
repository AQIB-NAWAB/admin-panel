import { Module } from '@nestjs/common';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from '../product/product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Product])],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
