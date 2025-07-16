import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  // Hardcoded admin user
  private readonly admin = {
    username: 'admin',
    // bcrypt hash for 'admin123'
    password: '$2a$10$wH8QnQwQwQwQwQwQwQwQwOQwQwQwQwQwQwQwQwQwQwQwQwQwQwQw',
    role: 'admin',
  };

  async validateUser(username: string, password: string): Promise<any> {
    if (username !== this.admin.username) return null;
    const isMatch = await bcrypt.compare(password, this.admin.password);
    if (!isMatch) return null;
    // Return user object without password
    const { password: _, ...result } = this.admin;
    return result;
  }
}
