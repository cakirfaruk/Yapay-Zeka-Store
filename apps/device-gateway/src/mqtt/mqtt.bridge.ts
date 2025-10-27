import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import mqtt, { MqttClient } from 'mqtt';
import type { GatewayJob } from '../jobs/job.types.js';

@Injectable()
export class MqttBridge implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(MqttBridge.name);
  private client?: MqttClient;

  onModuleInit() {
    const url = process.env.MQTT_URL ?? 'mqtt://localhost:1883';
    this.client = mqtt.connect(url);
    this.client.on('connect', () => this.logger.log(`Connected to MQTT at ${url}`));
    this.client.on('error', (err) => this.logger.error('MQTT error', err));
  }

  onModuleDestroy() {
    this.client?.end();
  }

  publishOtaJob(deviceId: string, job: GatewayJob) {
    if (!this.client) return;
    const topic = `ota/${deviceId}/job`;
    const payload = JSON.stringify({
      jobId: job.id,
      appId: job.appId,
      version: job.version,
      artifactUrl: job.artifactUrl,
      sha256: job.sha256,
      signature: job.signature,
      licenseToken: job.licenseToken,
    });
    this.client.publish(topic, payload, { qos: 1 }, (err) => {
      if (err) {
        this.logger.error(`MQTT publish failed for ${topic}`, err);
      }
    });
  }
}
