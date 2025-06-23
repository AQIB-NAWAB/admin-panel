import { CanActivate, ExecutionContext } from '@nestjs/common';
import { ProductService } from '../../product/product.service';
export declare class IsOwnerGuard implements CanActivate {
    private readonly productService;
    constructor(productService: ProductService);
    canActivate(ctx: ExecutionContext): Promise<boolean>;
}
