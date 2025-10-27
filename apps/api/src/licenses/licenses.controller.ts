import { Body, Controller, Post } from '@nestjs/common';
import { LicensesService } from './licenses.service.js';

@Controller('licenses')
export class LicensesController {
  constructor(private readonly licensesService: LicensesService) {}

  @Post('verify')
  async verify(@Body('token') token: string) {
    return this.licensesService.verify(token);
  }
}
