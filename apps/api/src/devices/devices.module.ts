import { Module } from '@nestjs/common';
import { DevicesService } from './devices.service.js';
import { DevicesController } from './devices.controller.js';
import { AuthModule } from '../auth/auth.module.js';
import { DeploymentsModule } from '../deployments/deployments.module.js';

@Module({
  imports: [AuthModule, DeploymentsModule],
  providers: [DevicesService],
  controllers: [DevicesController],
  exports: [DevicesService],
})
export class DevicesModule {}
