import { Injectable, Logger } from '@nestjs/common';
import { Subject } from 'rxjs';
import { nanoid } from 'nanoid';
import type { CreateJobInput, GatewayJob, JobReportInput } from './job.types.js';
import { MqttBridge } from '../mqtt/mqtt.bridge.js';

export interface JobEvent {
  type: 'created' | 'dispatched' | 'completed' | 'failed';
  job: GatewayJob;
}

@Injectable()
export class JobsService {
  private readonly logger = new Logger(JobsService.name);
  private readonly jobsByDevice = new Map<string, GatewayJob[]>();
  private readonly jobIndex = new Map<string, string>();
  private readonly pausedDevices = new Set<string>();
  private readonly eventsSubject = new Subject<JobEvent>();

  constructor(private readonly mqtt: MqttBridge) {}

  get events$() {
    return this.eventsSubject.asObservable();
  }

  createJob(input: CreateJobInput): GatewayJob {
    const job: GatewayJob = {
      id: nanoid(),
      createdAt: new Date(),
      status: 'pending',
      attempts: 0,
      ...input,
    };
    const list = this.jobsByDevice.get(input.deviceId) ?? [];
    list.push(job);
    this.jobsByDevice.set(input.deviceId, list);
    this.jobIndex.set(job.id, input.deviceId);
    this.eventsSubject.next({ type: 'created', job });
    this.logger.log(`Job ${job.id} queued for device ${input.deviceId}`);
    this.mqtt.publishOtaJob(input.deviceId, job);
    return job;
  }

  fetchForDevice(deviceId: string): GatewayJob[] {
    if (this.pausedDevices.has(deviceId)) {
      return [];
    }
    const jobs = this.jobsByDevice.get(deviceId) ?? [];
    const pending = jobs.filter((job) => job.status === 'pending');
    pending.forEach((job) => {
      job.status = 'dispatched';
      job.attempts += 1;
      this.eventsSubject.next({ type: 'dispatched', job });
      this.mqtt.publishOtaJob(deviceId, job);
    });
    return pending;
  }

  report(deviceId: string | undefined, report: JobReportInput): GatewayJob | undefined {
    const targetDevice = deviceId ?? this.jobIndex.get(report.jobId);
    if (!targetDevice) return undefined;
    const jobs = this.jobsByDevice.get(targetDevice);
    if (!jobs) return undefined;
    const job = jobs.find((item) => item.id === report.jobId);
    if (!job) return undefined;

    if (report.status === 'installed') {
      job.status = 'completed';
      job.logs = report.logs;
      this.eventsSubject.next({ type: 'completed', job });
    } else if (report.status === 'failed') {
      job.status = 'failed';
      job.logs = report.logs;
      this.eventsSubject.next({ type: 'failed', job });
      if (job.rollout?.pauseOnFail) {
        this.pausedDevices.add(targetDevice);
        this.logger.warn(`Job ${job.id} failed; pausing further rollouts for ${targetDevice}`);
      }
    }
    return job;
  }

  resume(deviceId: string) {
    if (this.pausedDevices.delete(deviceId)) {
      this.logger.log(`Rollouts resumed for ${deviceId}`);
    }
  }
}
