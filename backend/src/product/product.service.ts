import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { uploadToImgBB } from 'src/common/utils/uploadImage';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly repo: Repository<Product>,
  ) {}

  async create(
    data: CreateProductDto & { ownerId: string },
    image?: Express.Multer.File,
  ) {
    let imageUrl = '';
    if (image) {
      imageUrl = await uploadToImgBB(image.buffer);
    }

    const product = this.repo.create({ ...data, image: imageUrl });
    return this.repo.save(product);
  }

  async findAll(ownerId: string) {
    return this.repo.find({ where: { ownerId } });
  }

  private async findOwnedProduct(id: string, ownerId: string) {
    const prod = await this.repo.findOne({ where: { id } });
    if (!prod) throw new NotFoundException('Product not found');
    if (prod.ownerId !== ownerId)
      throw new ForbiddenException('You do not own this product');
    return prod;
  }

  async findOne(id: string, ownerId: string) {
    return this.findOwnedProduct(id, ownerId);
  }

  async update(id: string, dto: UpdateProductDto, ownerId: string) {
    const prod = await this.findOwnedProduct(id, ownerId);
    Object.assign(prod, dto);
    return this.repo.save(prod);
  }

  async remove(id: string, ownerId: string) {
    const prod = await this.findOwnedProduct(id, ownerId);
    await this.repo.remove(prod);
    return { message: 'Deleted successfully' };
  }
}
