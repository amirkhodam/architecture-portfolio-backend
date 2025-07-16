import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  // Hardcoded admin user
  private readonly admin = {
    username: 'admin',
    // bcrypt hash for 'admin123'
    password: '$2a$12$Fo3hCNEbkU.Qe1gb.0cQVuwcqRru1pE.SycdRjvxhp52rWB/hsJVm',
    role: 'admin',
  };

  async validateUser(username: string, password: string): Promise<any> {
    if (username !== this.admin.username) return null;
    const isMatch = await bcrypt.compare(password, this.admin.password);
    if (!isMatch) return null;
    // Return user object without password
    const result = this.admin;
    delete result.password;
    return result;
  }
}
