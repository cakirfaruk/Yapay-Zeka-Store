import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AppsService } from './apps.service.js';
import { AuthGuard } from '../auth/auth.guard.js';
import { AuthService } from '../auth/auth.service.js';
import { RolesGuard } from '../auth/roles.guard.js';
import { Roles } from '../auth/roles.decorator.js';
import { Role } from '@prisma/client';

@Controller('apps')
export class AppsController {
  constructor(private readonly appsService: AppsService, private readonly authService: AuthService) {}

  @Get()
  async list(@Query() query: Record<string, string>, @Req() req: any) {
    const limit = query.limit ? Number(query.limit) : undefined;
    const page = query.page ? Number(query.page) : undefined;
    let role = req.user?.role;
    if (!role && req.headers['x-user-email']) {
      try {
        const user = await this.authService.authenticate(req.headers['x-user-email']);
        req.user = user;
        role = user.role;
      } catch (err) {
        role = undefined;
      }
    }
    return this.appsService.list(
      {
        search: query.search,
        category: query.category,
        board: query.board,
        limit,
        page,
      },
      role,
    );
  }

  @Get(':slug')
  async get(@Param('slug') slug: string, @Req() req: any) {
    let role = req.user?.role;
    if (!role && req.headers['x-user-email']) {
      try {
        const user = await this.authService.authenticate(req.headers['x-user-email']);
        req.user = user;
        role = user.role;
      } catch (err) {
        role = undefined;
      }
    }
    return this.appsService.getBySlug(slug, role === Role.ADMIN || role === Role.DEVELOPER);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.DEVELOPER)
  @Post(':id/submit-review')
  async submitReview(@Param('id') id: string) {
    return this.appsService.submitForReview(id);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Post(':id/approve')
  async approve(@Param('id') id: string, @Req() req: any) {
    return this.appsService.approve(id, req.user.id);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Post(':id/request-changes')
  async requestChanges(@Param('id') id: string, @Body('notes') notes: string, @Req() req: any) {
    await this.appsService.requestChanges(id, req.user.id, notes);
    return { status: 'changes_requested' };
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Post(':id/suspend')
  async suspend(@Param('id') id: string, @Body('reason') reason: string, @Req() req: any) {
    await this.appsService.suspend(id, req.user.id, reason);
    return { status: 'suspended' };
  }
}
