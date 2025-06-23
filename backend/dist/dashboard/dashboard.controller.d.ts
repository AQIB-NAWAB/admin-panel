import { DashboardService } from './dashboard.service';
import { JwtRequestUser } from 'src/common/interfaces/jwt-request-user';
export declare class DashboardController {
    private readonly dashboardService;
    constructor(dashboardService: DashboardService);
    getDashboard(user: JwtRequestUser): Promise<{
        recentProducts: import("../product/product.entity").Product[];
        stats: {
            totalProductsCount: number;
            avgPrice: number;
            lowStockCount: number;
            poductCreationTimeSeriesData: any[];
        };
    }>;
}
