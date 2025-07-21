import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { LoggerService } from './logger.service';

@Controller()
export class AppController {
  constructor(private logger: LoggerService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get('admin')
  getAdmin(@Request() req) {
    if (req.user.role !== 'admin') {
      return { message: 'Forbidden' };
    }
    return { message: `Welcome, ${req.user.username}!` };
  }

  @Get()
  getHello() {
    this.logger.log('Hello World endpoint was called');
    return 'Hello World!';
  }
}
