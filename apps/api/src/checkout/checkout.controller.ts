import { Body, Controller, Post, UseGuards, Req } from '@nestjs/common';
import { CheckoutService } from './checkout.service.js';
import { AuthGuard } from '../auth/auth.guard.js';
import { RolesGuard } from '../auth/roles.guard.js';
import { Roles } from '../auth/roles.decorator.js';
import { Role } from '@prisma/client';

@Controller('checkout')
export class CheckoutController {
  constructor(private readonly checkoutService: CheckoutService) {}

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.BUYER)
  @Post('session')
  async create(@Body('appId') appId: string, @Body('deviceId') deviceId: string | undefined, @Req() req: any) {
    return this.checkoutService.createSession(req.user.id, appId, deviceId);
  }
}
