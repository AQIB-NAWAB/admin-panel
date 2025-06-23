import { Repository } from 'typeorm';
import { Product } from './product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
export declare class ProductService {
    private readonly repo;
    constructor(repo: Repository<Product>);
    create(data: CreateProductDto & {
        ownerId: string;
    }, image: Express.Multer.File): Promise<Product>;
    findAll(ownerId: string, page?: number, limit?: number, search?: string, minPrice?: number, maxPrice?: number, lowStockOnly?: boolean): Promise<{
        data: Product[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    private findOwnedProduct;
    findOne(id: string, ownerId: string): Promise<Product>;
    update(id: string, dto: UpdateProductDto, ownerId: string): Promise<Product>;
    updateImage(id: string, image: Express.Multer.File, ownerId: string): Promise<Product>;
    remove(id: string, ownerId: string): Promise<{
        message: string;
    }>;
}
