import { RootController } from './app.controller.js';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './common/prisma.module.js';
import { AppsModule } from './apps/apps.module.js';
import { DevicesModule } from './devices/devices.module.js';
import { CheckoutModule } from './checkout/checkout.module.js';
import { LicensesModule } from './licenses/licenses.module.js';
import { AuthModule } from './auth/auth.module.js';
import { DeploymentsModule } from './deployments/deployments.module.js';
import { AdminModule } from './admin/admin.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    AppsModule,
    DevicesModule,
    CheckoutModule,
    LicensesModule,
    DeploymentsModule,
    AdminModule,
  ],
  controllers: [RootController],
})
export class AppModule {}
