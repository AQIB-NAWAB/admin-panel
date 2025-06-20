// src/product/product.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Product } from './product.entity';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { IsOwnerGuard } from '../common/gaurds/is-owner.guard';

@Module({
  imports: [TypeOrmModule.forFeature([Product])],
  providers: [ProductService, IsOwnerGuard],
  controllers: [ProductController],
  exports: [ProductService],
})
export class ProductModule {}
