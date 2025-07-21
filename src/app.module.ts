import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PortfolioModule } from './portfolio/portfolio.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { RouterModule } from '@nestjs/core';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
    }),
    AuthModule,
    PortfolioModule,
    RouterModule.register([
      {
        path: 'api',
        children: [
          {
            path: 'portfolios',
            module: PortfolioModule,
          },
        ],
      },
    ]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
