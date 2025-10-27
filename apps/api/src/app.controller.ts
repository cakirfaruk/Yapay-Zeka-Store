import { Controller, Get } from '@nestjs/common';

@Controller()
export class RootController {
  @Get('health')
  health() {
    return { status: 'ok', time: new Date().toISOString() };
  }
}
