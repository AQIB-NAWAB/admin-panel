import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
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

  async updateImage(id: string, image: Express.Multer.File, ownerId: string) {
    if (!image) {
      throw new BadRequestException('No image file provided');
    }

    const product = await this.repo.findOne({
      where: { id, ownerId },
    });
    if (!product) {
      throw new NotFoundException('Product not found or not owned by you');
    }

    const imageUrl = await uploadToImgBB(image.buffer);
    product.image = imageUrl;

    return this.repo.save(product);
  }

  async remove(id: string, ownerId: string) {
    const prod = await this.findOwnedProduct(id, ownerId);
    await this.repo.remove(prod);
    return { message: 'Deleted successfully' };
  }
}
