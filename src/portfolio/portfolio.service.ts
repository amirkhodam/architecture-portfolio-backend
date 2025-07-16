import { Injectable } from '@nestjs/common';
import { PrismaClient, Portfolio } from '../../generated/prisma';

@Injectable()
export class PortfolioService {
  private prisma = new PrismaClient();

  async getAll(): Promise<Portfolio[]> {
    return this.prisma.portfolio.findMany();
  }

  async create(
    data: Omit<Portfolio, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<Portfolio> {
    return this.prisma.portfolio.create({ data });
  }

  async getById(id: string): Promise<Portfolio | null> {
    return this.prisma.portfolio.findUnique({ where: { id } });
  }
}
