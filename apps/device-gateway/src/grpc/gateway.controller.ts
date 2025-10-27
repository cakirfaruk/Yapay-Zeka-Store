import { Controller, Logger } from '@nestjs/common';
import { GrpcMethod, GrpcStreamMethod } from '@nestjs/microservices';
import { from, Observable } from 'rxjs';
import { JobsService } from '../jobs/jobs.service.js';
import { DeviceRegistryService } from '../devices/device-registry.service.js';
import type { GatewayJob } from '../jobs/job.types.js';

interface DeviceInfoMessage {
  id: string;
  hw?: string;
  cert?: string;
}

interface JobMessage {
  id: string;
  type: string;
  payloadUrl: string;
  sha256: string;
  signature?: string;
}

interface JobReportMessage {
  id: string;
  status: string;
  logs?: string;
}

@Controller()
export class DeviceGatewayGrpcController {
  private readonly logger = new Logger(DeviceGatewayGrpcController.name);

  constructor(
    private readonly jobs: JobsService,
    private readonly devices: DeviceRegistryService,
  ) {}

  @GrpcMethod('DeviceGateway', 'Register')
  register(info: DeviceInfoMessage): JobMessage | undefined {
    this.devices.register(info.id, info.hw, info.cert);
    return this.jobs.fetchForDevice(info.id).map((job) => this.toMessage(job))[0];
  }

  @GrpcMethod('DeviceGateway', 'Heartbeat')
  heartbeat(info: DeviceInfoMessage): JobMessage | undefined {
    this.devices.heartbeat(info.id);
    return this.jobs.fetchForDevice(info.id).map((job) => this.toMessage(job))[0];
  }

  @GrpcStreamMethod('DeviceGateway', 'FetchJobs')
  fetchJobs(info: DeviceInfoMessage): Observable<JobMessage> {
    this.logger.debug(`Device ${info.id} requested jobs`);
    const jobs = this.jobs.fetchForDevice(info.id).map((job) => this.toMessage(job));
    return from(jobs);
  }

  @GrpcMethod('DeviceGateway', 'ReportStatus')
  reportStatus(message: JobReportMessage): JobReportMessage {
    const updated = this.jobs.report(undefined, {
      jobId: message.id,
      status: message.status === 'success' ? 'installed' : (message.status as any),
      logs: message.logs,
    });
    if (!updated) {
      this.logger.warn(`Received status for unknown job ${message.id}`);
    }
    return message;
  }

  private toMessage(job: GatewayJob): JobMessage {
    return {
      id: job.id,
      type: 'ota',
      payloadUrl: job.artifactUrl,
      sha256: job.sha256,
      signature: job.signature ?? '',
    };
  }
}
