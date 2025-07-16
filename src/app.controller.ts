import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Controller()
export class AppController {
  @UseGuards(AuthGuard('jwt'))
  @Get('admin')
  getAdmin(@Request() req) {
    if (req.user.role !== 'admin') {
      return { message: 'Forbidden' };
    }
    return { message: `Welcome, ${req.user.username}!` };
  }
}
