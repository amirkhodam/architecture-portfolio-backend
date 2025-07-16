import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { PortfolioService } from './portfolio.service';

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
} 