import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import { Product } from '../product/product.entity';
import CONFIG from 'src/config';

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

    // avg price
    const avgPrice: { avgPrice: number } = (await this.productRepo
      .createQueryBuilder('product')
      .select('AVG(product.price)', 'avgPrice')
      .where('product.ownerId = :userId', { userId })
      .getRawOne()) || { avgPrice: 0 };

    // low stock quatity count
    const lowStockCount = await this.productRepo.count({
      where: {
        ownerId: userId,
        stock: LessThan(Number(CONFIG.LOW_STOCK_THRESHOLD)),
      },
    });

    const stats = {
      totalProductsCount: totalProducts,
      avgPrice: avgPrice.avgPrice || 0,
      lowStockCount,
      poductCreationTimeSeriesData: productCreationData,
    };

    return {
      recentProducts,
      stats,
    };
  }
}
