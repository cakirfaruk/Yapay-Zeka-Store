import { Module } from '@nestjs/common';
import { DeviceGatewayGrpcController } from './grpc/gateway.controller.js';
import { JobsService } from './jobs/jobs.service.js';
import { DeviceRegistryService } from './devices/device-registry.service.js';
import { LiveGateway } from './ws/live.gateway.js';
import { OtaController } from './http/ota.controller.js';
import { MqttBridge } from './mqtt/mqtt.bridge.js';

@Module({
  controllers: [DeviceGatewayGrpcController, OtaController],
  providers: [JobsService, DeviceRegistryService, LiveGateway, MqttBridge],
})
export class DeviceGatewayModule {}
