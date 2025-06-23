import { Repository } from 'typeorm';
import { Product } from '../product/product.entity';
export declare class DashboardService {
    private readonly productRepo;
    constructor(productRepo: Repository<Product>);
    getDashboardStats(userId: string): Promise<{
        recentProducts: Product[];
        stats: {
            totalProductsCount: number;
            avgPrice: number;
            lowStockCount: number;
            poductCreationTimeSeriesData: any[];
        };
    }>;
}
