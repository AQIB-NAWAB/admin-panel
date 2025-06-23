"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const product_entity_1 = require("../product/product.entity");
const config_1 = require("../config");
let DashboardService = class DashboardService {
    productRepo;
    constructor(productRepo) {
        this.productRepo = productRepo;
    }
    async getDashboardStats(userId) {
        const totalProducts = await this.productRepo.count({
            where: { ownerId: userId },
        });
        const recentProducts = await this.productRepo.find({
            where: { ownerId: userId },
            order: { createdAt: 'DESC' },
            take: 5,
        });
        const productCreationData = await this.productRepo
            .createQueryBuilder('product')
            .select("DATE_TRUNC('day', product.createdAt)", 'date')
            .addSelect('COUNT(*)', 'count')
            .where('product.ownerId = :userId', { userId })
            .groupBy("DATE_TRUNC('day', product.createdAt)")
            .orderBy('date', 'ASC')
            .getRawMany();
        const avgPrice = (await this.productRepo
            .createQueryBuilder('product')
            .select('AVG(product.price)', 'avgPrice')
            .where('product.ownerId = :userId', { userId })
            .getRawOne()) || { avgPrice: 0 };
        const lowStockCount = await this.productRepo.count({
            where: {
                ownerId: userId,
                stock: (0, typeorm_2.LessThan)(Number(config_1.default.LOW_STOCK_THRESHOLD)),
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
};
exports.DashboardService = DashboardService;
exports.DashboardService = DashboardService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(product_entity_1.Product)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], DashboardService);
//# sourceMappingURL=dashboard.service.js.map