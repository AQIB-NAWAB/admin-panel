import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { ProductService } from 'src/product/product.service';
import { JwtRequestUser } from '../interfaces/jwt-request-user';

@Injectable()
export class IsOwnerGuard implements CanActivate {
  constructor(private readonly productService: ProductService) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const req = ctx.switchToHttp().getRequest<import('express').Request>();
    const user = req.user as JwtRequestUser;
    const id = req.params.id;
    if (!id) return true;

    try {
      await this.productService.findOne(id, user.id);
      return true;
    } catch (err) {
      if (err instanceof NotFoundException) {
        throw new ForbiddenException('You do not own this product');
      }
      throw err;
    }
  }
}
