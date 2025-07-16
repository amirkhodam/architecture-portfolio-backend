import { Controller, Get, Post, Body, Param, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { PortfolioService } from './portfolio.service';
import { extname } from 'path';

@Controller('portfolios')
export class PortfolioController {
  constructor(private readonly portfolioService: PortfolioService) {}

  @Get()
  async getAll() {
    return this.portfolioService.getAll();
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    return this.portfolioService.getById(id);
  }

  @Post()
  async create(@Body() body: any) {
    return this.portfolioService.create(body);
  }

  @Post('upload')
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'images', maxCount: 10 },
    { name: 'videos', maxCount: 5 },
  ], {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + extname(file.originalname));
      },
    }),
  }))
  async uploadPortfolio(
    @UploadedFiles() files: { images?: Express.Multer.File[]; videos?: Express.Multer.File[] },
    @Body() body: { title: string; texts: string[] }
  ) {
    const imagePaths = files.images?.map(file => file.path) || [];
    const videoPaths = files.videos?.map(file => file.path) || [];
    return this.portfolioService.create({
      title: body.title,
      images: imagePaths,
      videos: videoPaths,
      texts: body.texts,
    });
  }
} 