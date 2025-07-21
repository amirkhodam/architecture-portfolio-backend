import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseInterceptors,
  UploadedFiles,
  NotFoundException,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { PortfolioService } from './portfolio.service';
import { extname } from 'path';
import {
  AddMediaDto,
  PortfolioBaseDto,
} from './interfaces/portfolio.interface';
import { Media } from 'generated/prisma';

@Controller()
export class PortfolioController {
  constructor(private readonly portfolioService: PortfolioService) {}

  @Get()
  async getAll() {
    return this.portfolioService.getAll();
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    const portfolio = await this.portfolioService.getById(id);
    if (!portfolio) {
      throw new NotFoundException('Portfolio not found');
    }
    return portfolio;
  }

  @Post()
  async create(@Body() body: PortfolioBaseDto) {
    return this.portfolioService.create(body);
  }

  @Post(':id/add-media')
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'media', maxCount: 15 }], {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, uniqueSuffix + extname(file.originalname));
        },
      }),
    }),
  )
  async addMedia(
    @Param('id') id: string,
    @UploadedFiles() files: { images?: Express.Multer.File[] },
  ) {
    const media: AddMediaDto[] = (files.images || []).map((file) => ({
      name: file.originalname,
      path: file.path,
      type: file.mimetype, // or infer from file.mimetype if needed
    }));
    const updated = await this.portfolioService.addMediaToPortfolio(id, media);
    if (!updated) {
      throw new NotFoundException('Portfolio not found');
    }
    return updated;
  }

  @Post(':id/remove-media')
  async removeMedia(@Param('id') id: string, @Body() body: { media: Media[] }) {
    const updated = await this.portfolioService.removeMediaFromPortfolio(id, body.media);
    if (!updated) {
      throw new NotFoundException('Portfolio not found');
    }
    return updated;
  }

  @Post(':id/remove-media/:mediaId')
  async removeSingleMedia(
    @Param('id') id: string,
    @Param('mediaId') mediaId: string,
  ) {
    const updated = await this.portfolioService.removeSingleMediaFromPortfolio(id, mediaId);
    if (!updated) {
      throw new NotFoundException('Portfolio or media not found');
    }
    return updated;
  }
}
