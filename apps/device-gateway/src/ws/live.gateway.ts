import { Injectable, OnModuleInit } from '@nestjs/common';
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import type { Server } from 'ws';
import { JobsService } from '../jobs/jobs.service.js';

@WebSocketGateway({ cors: { origin: '*' } })
@Injectable()
export class LiveGateway implements OnModuleInit {
  @WebSocketServer()
  server!: Server;

  constructor(private readonly jobs: JobsService) {}

  onModuleInit() {
    this.jobs.events$.subscribe((event) => {
      const payload = JSON.stringify({
        type: event.type,
        job: {
          id: event.job.id,
          deviceId: event.job.deviceId,
          appId: event.job.appId,
          status: event.job.status,
          attempts: event.job.attempts,
          createdAt: event.job.createdAt,
        },
      });
      this.server?.clients.forEach((client) => {
        if (client.readyState === client.OPEN) {
          client.send(payload);
        }
      });
    });
  }
}
