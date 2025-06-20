import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../product/product.entity';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
  ) {}

  async getDashboardStats(userId: string) {
    const totalProducts = await this.productRepo.count({
      where: { ownerId: userId },
    });

    // Recent

    const recentProducts = await this.productRepo.find({
      where: { ownerId: userId },
      order: { createdAt: 'DESC' },
      take: 5,
    });

    // charts data to render product creation over time
    const productCreationData = await this.productRepo
      .createQueryBuilder('product')
      .select("DATE_TRUNC('day', product.createdAt)", 'date')
      .addSelect('COUNT(*)', 'count')
      .where('product.ownerId = :userId', { userId })
      .groupBy("DATE_TRUNC('day', product.createdAt)")
      .orderBy('date', 'ASC')
      .getRawMany();

    return {
      totalProducts,
      recentProducts,
      chartsData: {
        poductCreationTimeSeriesData: productCreationData,
      },
    };
  }
}
