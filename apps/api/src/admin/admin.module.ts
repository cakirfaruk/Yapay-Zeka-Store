import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller.js';
import { AppsModule } from '../apps/apps.module.js';
import { AuthModule } from '../auth/auth.module.js';
import { PrismaModule } from '../common/prisma.module.js';

@Module({
  imports: [AppsModule, AuthModule, PrismaModule],
  controllers: [AdminController],
})
export class AdminModule {}
