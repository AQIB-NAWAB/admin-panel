import {
  Controller,
  Post,
  Body,
  Get,
  Put,
  Delete,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
  UseInterceptors,
  UploadedFile,
  Patch,
  BadRequestException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/common/decorators/get-user.decorator';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { JwtRequestUser } from 'src/common/interfaces/jwt-request-user';
import { IsOwnerGuard } from 'src/common/gaurds/is-owner.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { isValidImageFile } from 'src/common/utils/file';

@UseGuards(AuthGuard('jwt'))
@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  @HttpCode(HttpStatus.CREATED)
  create(
    @Body() dto: CreateProductDto,
    @GetUser() user: JwtRequestUser,
    @UploadedFile() image: Express.Multer.File,
  ) {
    if (!isValidImageFile(image.mimetype)) {
      throw new BadRequestException('Only image files are allowed');
    }

    return this.productService.create({ ...dto, ownerId: user.id }, image);
  }

  @Get()
  findAll(@GetUser() user: JwtRequestUser) {
    return this.productService.findAll(user.id);
  }

  @Get(':id')
  @UseGuards(IsOwnerGuard)
  findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @GetUser() user: JwtRequestUser,
  ) {
    return this.productService.findOne(id, user.id);
  }

  @Put(':id')
  @UseGuards(IsOwnerGuard)
  update(
    @Param(
      'id',
      new ParseUUIDPipe({ errorHttpStatusCode: HttpStatus.BAD_REQUEST }),
    )
    id: string,
    @Body() dto: UpdateProductDto,
    @GetUser() user: JwtRequestUser,
  ) {
    return this.productService.update(id, dto, user.id);
  }

  @Patch(':id/image')
  @UseGuards(IsOwnerGuard)
  @UseInterceptors(FileInterceptor('image'))
  async updateImage(
    @Param('id', ParseUUIDPipe) id: string,
    @UploadedFile() image: Express.Multer.File,
    @GetUser() user: JwtRequestUser,
  ) {
    if (!isValidImageFile(image.mimetype)) {
      throw new BadRequestException('Only image files are allowed');
    }

    return this.productService.updateImage(id, image, user.id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(IsOwnerGuard)
  remove(
    @Param(
      'id',
      new ParseUUIDPipe({ errorHttpStatusCode: HttpStatus.BAD_REQUEST }),
    )
    id: string,
    @GetUser() user: JwtRequestUser,
  ) {
    return this.productService.remove(id, user.id);
  }
}
