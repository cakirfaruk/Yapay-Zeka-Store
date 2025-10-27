import { Module } from '@nestjs/common';
import { AppsController } from './apps.controller.js';
import { AppsService } from './apps.service.js';
import { AuthModule } from '../auth/auth.module.js';

@Module({
  imports: [AuthModule],
  controllers: [AppsController],
  providers: [AppsService],
  exports: [AppsService],
})
export class AppsModule {}
