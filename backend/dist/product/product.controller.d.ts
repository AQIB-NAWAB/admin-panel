import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { JwtRequestUser } from '../common/interfaces/jwt-request-user';
export declare class ProductController {
    private readonly productService;
    constructor(productService: ProductService);
    create(dto: CreateProductDto, user: JwtRequestUser, image: Express.Multer.File): Promise<import("./product.entity").Product>;
    findAll(user: JwtRequestUser, page?: string, limit?: string, search?: string, minPrice?: string, maxPrice?: string, lowStockOnly?: string): Promise<{
        data: import("./product.entity").Product[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    findOne(id: string, user: JwtRequestUser): Promise<import("./product.entity").Product>;
    update(id: string, dto: UpdateProductDto, user: JwtRequestUser): Promise<import("./product.entity").Product>;
    updateImage(id: string, image: Express.Multer.File, user: JwtRequestUser): Promise<import("./product.entity").Product>;
    remove(id: string, user: JwtRequestUser): Promise<{
        message: string;
    }>;
}
