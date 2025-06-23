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
exports.ProductService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const product_entity_1 = require("./product.entity");
const uploadImage_1 = require("../common/utils/uploadImage");
const index_1 = require("../config/index");
let ProductService = class ProductService {
    repo;
    constructor(repo) {
        this.repo = repo;
    }
    async create(data, image) {
        let imageUrl = '';
        try {
            imageUrl = await (0, uploadImage_1.uploadToImgBB)(image.buffer);
        }
        catch {
            throw new common_1.BadRequestException('Image upload failed');
        }
        const product = this.repo.create({ ...data, image: imageUrl });
        return this.repo.save(product);
    }
    async findAll(ownerId, page = 1, limit = 10, search, minPrice, maxPrice, lowStockOnly) {
        const where = { ownerId };
        if (search) {
            where.name = (0, typeorm_2.ILike)(`%${search}%`);
        }
        if (minPrice !== undefined && maxPrice !== undefined) {
            where.price = (0, typeorm_2.Between)(minPrice, maxPrice);
        }
        else if (minPrice !== undefined) {
            where.price = (0, typeorm_2.Between)(minPrice, Infinity);
        }
        else if (maxPrice !== undefined) {
            where.price = (0, typeorm_2.Between)(0, maxPrice);
        }
        if (lowStockOnly) {
            where.stock = (0, typeorm_2.LessThanOrEqual)(Number(index_1.default.LOW_STOCK_THRESHOLD));
        }
        const [data, total] = await this.repo.findAndCount({
            where,
            order: { createdAt: 'DESC' },
            skip: (page - 1) * limit,
            take: limit,
        });
        return {
            data,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }
    async findOwnedProduct(id, ownerId) {
        const prod = await this.repo.findOne({ where: { id, ownerId } });
        if (!prod)
            throw new common_1.NotFoundException('Product not found or not owned by you');
        return prod;
    }
    async findOne(id, ownerId) {
        return this.findOwnedProduct(id, ownerId);
    }
    async update(id, dto, ownerId) {
        const prod = await this.findOwnedProduct(id, ownerId);
        Object.assign(prod, dto);
        return this.repo.save(prod);
    }
    async updateImage(id, image, ownerId) {
        if (!image) {
            throw new common_1.BadRequestException('No image file provided');
        }
        const product = await this.repo.findOne({
            where: { id, ownerId },
        });
        if (!product) {
            throw new common_1.NotFoundException('Product not found or not owned by you');
        }
        try {
            const imageUrl = await (0, uploadImage_1.uploadToImgBB)(image.buffer);
            product.image = imageUrl;
        }
        catch (err) {
            console.log(err);
            throw new common_1.BadRequestException('Error Uploading image , please try again later');
        }
        return this.repo.save(product);
    }
    async remove(id, ownerId) {
        const prod = await this.findOwnedProduct(id, ownerId);
        await this.repo.remove(prod);
        return { message: 'Deleted successfully' };
    }
};
exports.ProductService = ProductService;
exports.ProductService = ProductService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(product_entity_1.Product)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ProductService);
//# sourceMappingURL=product.service.js.map