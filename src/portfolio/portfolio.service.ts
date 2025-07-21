import { Injectable } from '@nestjs/common';
import {
  AddMediaDto,
  IPorfolioCreate,
  Portfolio,
} from './interfaces/portfolio.interface';
import { ITranslatedString, ITranslatedStrings } from '../app.interface';
import * as fs from 'fs';
import * as util from 'util';
import { Media, PrismaClient } from 'generated/prisma';
import { randomUUID } from 'crypto';
import * as path from 'path';

const unlinkAsync = util.promisify(fs.unlink);

@Injectable()
export class PortfolioService {
  private prisma = new PrismaClient();

  async getAll(): Promise<Portfolio[]> {
    const portfolios = await this.prisma.portfolio.findMany();
    return portfolios.map((p) => ({
      ...p,
      title: p.title as ITranslatedString,
      texts: p.texts as ITranslatedStrings,
    }));
  }

  async create(data: IPorfolioCreate): Promise<Portfolio> {
    const p = await this.prisma.portfolio.create({ data });
    return {
      ...p,
      media: [],
      title: p.title as ITranslatedString,
      texts: p.texts as ITranslatedStrings,
    };
  }

  async getById(id: string): Promise<Portfolio | null> {
    const p = await this.prisma.portfolio.findUnique({ where: { id } });
    return p
      ? {
          ...p,
          title: p.title as ITranslatedString,
          texts: p.texts as ITranslatedStrings,
        }
      : null;
  }

  async addMediaToPortfolio(
    id: string,
    media: AddMediaDto[],
  ): Promise<Portfolio | null> {
    // 1. Find the portfolio with its current media
    const portfolio = await this.prisma.portfolio.findUnique({
      where: { id },
    });

    if (!portfolio) return null;

    // 2. Prepare new media items with generated IDs
    const newMediaItems = media.map((m) => ({
      ...m,
      id: randomUUID(),
      index: (portfolio.media?.length || 0) + 1, // Auto-increment index
    }));

    // 3. Merge existing and new media
    const updatedMedia = [...(portfolio.media || []), ...newMediaItems];

    // 4. Update portfolio with new media using 'set' instead of 'push'
    const updatedPortfolio = await this.prisma.portfolio.update({
      where: { id },
      data: {
        media: { set: updatedMedia as any },
      },
    });

    // 5. Transform to match Portfolio interface
    return {
      ...updatedPortfolio,
      title: updatedPortfolio.title as unknown as ITranslatedString,
      texts: updatedPortfolio.texts as unknown as ITranslatedStrings,
      media: updatedPortfolio.media,
    };
  }

  async removeMediaFromPortfolio(
    id: string,
    media: Media[],
  ): Promise<Portfolio | null> {
    // 1. Find the portfolio with its current media
    const portfolio = await this.prisma.portfolio.findUnique({
      where: { id },
      include: { media: true },
    });
    if (!portfolio) return null;

    // 2. Remove files from disk
    const filesToDelete = media || [];
    for (const file of filesToDelete) {
      try {
        await unlinkAsync(file.path);
      } catch (err) {
        // Log error but continue (file might not exist)
        console.warn(`Failed to delete file: ${file.path}`, err);
      }
    }

    // 3. Update DB: remove media by filtering out those with matching IDs
    const updatedPortfolio = await this.prisma.portfolio.update({
      where: { id },
      data: {
        media: {
          set: portfolio.media.filter((i) => !media.some((j) => j.id === i.id)),
        },
      },
      include: { media: true },
    });

    // 4. Return with correct type mapping
    return {
      ...updatedPortfolio,
      title: updatedPortfolio.title as ITranslatedString,
      texts: updatedPortfolio.texts as ITranslatedStrings,
      media: updatedPortfolio.media,
    };
  }

  async removeSingleMediaFromPortfolio(
    portfolioId: string,
    mediaId: string,
  ): Promise<Portfolio | null> {
    // 1. Find the portfolio with its current media
    const portfolio = await this.prisma.portfolio.findUnique({
      where: { id: portfolioId },
      include: { media: true },
    });
    if (!portfolio) return null;

    // 2. Find the media item to remove
    const mediaToRemove = portfolio.media.find((m) => m.id === mediaId);
    if (!mediaToRemove) return null;

    // 3. Remove file from disk
    try {
      await unlinkAsync(mediaToRemove.path);
    } catch (err) {
      console.warn(`Failed to delete file: ${mediaToRemove.path}`, err);
    }

    // 4. Update DB: remove the media item by filtering out the matching ID
    const updatedPortfolio = await this.prisma.portfolio.update({
      where: { id: portfolioId },
      data: {
        media: {
          set: portfolio.media.filter((m) => m.id !== mediaId),
        },
      },
      include: { media: true },
    });

    // 5. Return with correct type mapping
    return {
      ...updatedPortfolio,
      title: updatedPortfolio.title as ITranslatedString,
      texts: updatedPortfolio.texts as ITranslatedStrings,
      media: updatedPortfolio.media,
    };
  }

  /**
   * Deletes files from the uploads directory that are not referenced by any portfolio's media.
   */
  async deleteUnreferencedFilesFromUploads(): Promise<string[]> {
    const uploadsDir = path.join(__dirname, '../../uploads');
    const files = await fs.promises.readdir(uploadsDir);
    // Get all portfolios with their media
    const portfolios = await this.prisma.portfolio.findMany({
      include: { media: true },
    });
    const referencedPaths = new Set<string>();
    for (const portfolio of portfolios) {
      if (Array.isArray(portfolio.media)) {
        for (const media of portfolio.media) {
          if (media.path) {
            referencedPaths.add(path.resolve(media.path));
          }
        }
      }
    }
    const deleted: string[] = [];
    for (const file of files) {
      const filePath = path.resolve(uploadsDir, file);
      if (!referencedPaths.has(filePath)) {
        try {
          await fs.promises.unlink(filePath);
          deleted.push(file);
        } catch (err) {
          // Optionally log error
        }
      }
    }
    return deleted;
  }
}
