import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseInterceptors,
  UploadedFiles,
  NotFoundException,
  Delete,
  HttpCode,
  Patch,
  Put,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { PortfolioService } from './portfolio.service';
import { extname } from 'path';
import {
  AddMediaDto,
  PortfolioBaseDto,
} from './interfaces/portfolio.interface';
import { EMediaType, Media, Portfolio } from 'generated/prisma';
import * as fs from 'fs';

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

  @Put(':id')
  async updatePortfolio(@Param('id') id: string, @Body() body: Partial<PortfolioBaseDto>) {
    const updated = await this.portfolioService.updateById(id, body);
    if (!updated) {
      throw new NotFoundException('Portfolio not found');
    }
    return updated;
  }

  @Delete(':id')
  @HttpCode(204)
  async deletePortfolio(@Param('id') id: string) {
    // Remove all media files from disk before deleting the portfolio
    const portfolio = await this.portfolioService.getById(id);
    if (!portfolio) {
      throw new NotFoundException('Portfolio not found');
    }
    if (Array.isArray(portfolio.media)) {
      for (const media of portfolio.media) {
        try {
          await fs.promises.unlink(media.path);
        } catch (err) {
          // Log error but continue
          console.warn(`Failed to delete file: ${media.path}`, err);
        }
      }
    }
    await this.portfolioService.deleteById(id);
    // 204 No Content
    return;
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
    @UploadedFiles() files: { media?: Express.Multer.File[] },
  ) {
    const media: AddMediaDto[] = (files.media || []).map((file) => ({
      name: file.originalname,
      path: file.path,
      type: file.mimetype.includes(EMediaType.image)
        ? EMediaType.image
        : EMediaType.video, // or infer from file.mimetype if needed
    }));
    let updated: Portfolio | null;
    try {
      updated = await this.portfolioService.addMediaToPortfolio(id, media);
      if (!updated) {
        // Remove uploaded files if portfolio not found
        await Promise.all(
          (files.media || []).map((file) => fs.promises.unlink(file.path)),
        );
        throw new NotFoundException('Portfolio not found');
      }
    } catch (err) {
      // Remove uploaded files if any error occurs
      await Promise.all(
        (files.media || []).map((file) => fs.promises.unlink(file.path)),
      );
      throw err;
    }
    return updated;
  }

  @Post(':id/remove-media')
  async removeMedia(@Param('id') id: string, @Body() body: { media: Media[] }) {
    const updated = await this.portfolioService.removeMediaFromPortfolio(
      id,
      body.media,
    );
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
    const updated = await this.portfolioService.removeSingleMediaFromPortfolio(
      id,
      mediaId,
    );
    if (!updated) {
      throw new NotFoundException('Portfolio or media not found');
    }
    return updated;
  }
}
