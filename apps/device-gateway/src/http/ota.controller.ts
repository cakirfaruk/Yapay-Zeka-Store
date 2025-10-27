import { BadRequestException, Body, Controller, Get, Param, Post } from '@nestjs/common';
import { JobsService } from '../jobs/jobs.service.js';
import type { CreateJobInput, JobReportInput } from '../jobs/job.types.js';

@Controller('ota')
export class OtaController {
  constructor(private readonly jobs: JobsService) {}

  @Post('jobs')
  createJob(@Body() body: CreateJobInput) {
    if (!body.deviceId || !body.appId || !body.version || !body.artifactUrl || !body.sha256) {
      throw new BadRequestException('deviceId, appId, version, artifactUrl ve sha256 zorunludur');
    }
    const job = this.jobs.createJob(body);
    return { job };
  }

  @Post('jobs/:id/report')
  report(@Param('id') id: string, @Body() body: JobReportInput & { deviceId?: string }) {
    const updated = this.jobs.report(body.deviceId, { ...body, jobId: id });
    return { job: updated };
  }

  @Get('jobs/:deviceId')
  listForDevice(@Param('deviceId') deviceId: string) {
    return { items: this.jobs.fetchForDevice(deviceId) };
  }
}
