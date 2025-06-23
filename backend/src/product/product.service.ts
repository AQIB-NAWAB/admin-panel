import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike, Between, LessThanOrEqual } from 'typeorm';
import { Product } from './product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { uploadToImgBB } from 'src/common/utils/uploadImage';
import CONFIG from 'src/config';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly repo: Repository<Product>,
  ) {}

  async create(
    data: CreateProductDto & { ownerId: string },
    image: Express.Multer.File,
  ) {
    let imageUrl = '';

    try {
      imageUrl = await uploadToImgBB(image.buffer);
    } catch {
      throw new BadRequestException('Image upload failed');
    }

    const product = this.repo.create({ ...data, image: imageUrl });
    return this.repo.save(product);
  }

  async findAll(
    ownerId: string,
    page = 1,
    limit = 10,
    search?: string,
    minPrice?: number,
    maxPrice?: number,
    lowStockOnly?: boolean,
  ) {
    const where: Record<string, any> = { ownerId };

    if (search) {
      where.name = ILike(`%${search}%`);
    }

    if (minPrice !== undefined && maxPrice !== undefined) {
      where.price = Between(minPrice, maxPrice);
    } else if (minPrice !== undefined) {
      where.price = Between(minPrice, Infinity);
    } else if (maxPrice !== undefined) {
      where.price = Between(0, maxPrice);
    }

    if (lowStockOnly) {
      where.stock = LessThanOrEqual(Number(CONFIG.LOW_STOCK_THRESHOLD));
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

  private async findOwnedProduct(id: string, ownerId: string) {
    const prod = await this.repo.findOne({ where: { id, ownerId } });

    if (!prod)
      throw new NotFoundException('Product not found or not owned by you');

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

    try {
      const imageUrl = await uploadToImgBB(image.buffer);
      product.image = imageUrl;
    } catch (err) {
      console.log(err);
      throw new BadRequestException(
        'Error Uploading image , please try again later',
      );
    }

    return this.repo.save(product);
  }

  async remove(id: string, ownerId: string) {
    const prod = await this.findOwnedProduct(id, ownerId);
    await this.repo.remove(prod);
    return { message: 'Deleted successfully' };
  }
}
