import { Injectable } from '@nestjs/common';
import { PrismaClient } from '../../generated/prisma';
import { Portfolio, CreatePortfolioDto } from './interfaces/portfolio.interface';

@Injectable()
export class PortfolioService {
  private prisma = new PrismaClient();

  async getAll(): Promise<Portfolio[]> {
    return this.prisma.portfolio.findMany();
  }

  async create(data: CreatePortfolioDto): Promise<Portfolio> {
    return this.prisma.portfolio.create({ data });
  }

  async getById(id: string): Promise<Portfolio | null> {
    return this.prisma.portfolio.findUnique({ where: { id } });
  }
}
