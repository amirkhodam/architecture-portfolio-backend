import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PortfolioModule } from './portfolio.module';

@Module({
  imports: [AuthModule, PortfolioModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
