import { Module } from '@nestjs/common';
import { DeploymentsService } from './deployments.service.js';
import { DeploymentsController } from './deployments.controller.js';
import { AuthModule } from '../auth/auth.module.js';

@Module({
  imports: [AuthModule],
  providers: [DeploymentsService],
  controllers: [DeploymentsController],
  exports: [DeploymentsService],
})
export class DeploymentsModule {}
