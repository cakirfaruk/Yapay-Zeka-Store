import { Module } from '@nestjs/common';
import { LicensesService } from './licenses.service.js';
import { LicensesController } from './licenses.controller.js';
import { AuthModule } from '../auth/auth.module.js';

@Module({
  imports: [AuthModule],
  providers: [LicensesService],
  controllers: [LicensesController],
  exports: [LicensesService],
})
export class LicensesModule {}
