import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { DeviceGatewayModule } from './device-gateway.module.js';
import { Logger } from '@nestjs/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { WsAdapter } from '@nestjs/platform-ws';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const logger = new Logger('DeviceGateway');

async function bootstrap() {
  const app = await NestFactory.create(DeviceGatewayModule, {
    bufferLogs: true,
  });
  app.useLogger(logger);
  app.useWebSocketAdapter(new WsAdapter(app));

  const protoPath = join(
    dirname(fileURLToPath(import.meta.url)),
    '../../../packages/proto/src/device-gateway.proto',
  );

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      package: 'devicegateway',
      protoPath,
      url: process.env.GRPC_URL ?? '0.0.0.0:50051',
    },
  });

  await app.startAllMicroservices();

  const port = Number(process.env.PORT ?? 4000);
  await app.listen(port);
  logger.log(`HTTP & WS listening on ${port}`);
}

bootstrap().catch((err) => {
  logger.error('Gateway bootstrap failed', err);
  process.exit(1);
});
