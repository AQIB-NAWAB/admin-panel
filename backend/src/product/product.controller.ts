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
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/common/decorators/get-user.decorator';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { JwtRequestUser } from 'src/common/interfaces/jwt-request-user';
import { IsOwnerGuard } from 'src/common/gaurds/is-owner.guard';
import { FileInterceptor } from '@nestjs/platform-express';

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
    @UploadedFile() image?: Express.Multer.File,
  ) {
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

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
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
