import { Injectable, Logger } from '@nestjs/common';

export interface DeviceRecord {
  id: string;
  hw?: string;
  cert?: string;
  lastSeen: Date;
}

@Injectable()
export class DeviceRegistryService {
  private readonly logger = new Logger(DeviceRegistryService.name);
  private readonly devices = new Map<string, DeviceRecord>();

  register(id: string, hw?: string, cert?: string) {
    const existing = this.devices.get(id);
    const record: DeviceRecord = {
      id,
      hw: hw ?? existing?.hw,
      cert: cert ?? existing?.cert,
      lastSeen: new Date(),
    };
    this.devices.set(id, record);
    this.logger.debug(`Device ${id} registered`);
    return record;
  }

  heartbeat(id: string) {
    const record = this.devices.get(id);
    if (!record) {
      return this.register(id);
    }
    record.lastSeen = new Date();
    return record;
  }

  list() {
    return Array.from(this.devices.values());
  }
}
