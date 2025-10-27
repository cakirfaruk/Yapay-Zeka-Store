import { Module } from '@nestjs/common';
import { CheckoutController } from './checkout.controller.js';
import { CheckoutService } from './checkout.service.js';
import { LicensesModule } from '../licenses/licenses.module.js';
import { AuthModule } from '../auth/auth.module.js';

@Module({
  imports: [LicensesModule, AuthModule],
  controllers: [CheckoutController],
  providers: [CheckoutService],
})
export class CheckoutModule {}
