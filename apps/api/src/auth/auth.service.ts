import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service.js';
import { Role, User } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  async authenticate(email?: string | string[]): Promise<User> {
    if (!email || (Array.isArray(email) && email.length === 0)) {
      throw new UnauthorizedException('Missing x-user-email header');
    }
    const normalized = Array.isArray(email) ? email[0] : email;
    const user = await this.prisma.user.findUnique({ where: { email: normalized } });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return user;
  }

  hasRole(user: User, roles: Role[]): boolean {
    return roles.includes(user.role);
  }
}
