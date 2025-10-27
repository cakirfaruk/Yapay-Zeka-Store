export type JobStatus = 'pending' | 'dispatched' | 'completed' | 'failed';

export interface GatewayJob {
  id: string;
  deviceId: string;
  appId: string;
  version: string;
  artifactUrl: string;
  sha256: string;
  signature?: string;
  licenseToken?: string;
  createdAt: Date;
  status: JobStatus;
  rollout?: {
    canaryPct?: number;
    batchSize?: number;
    pauseOnFail?: boolean;
  };
  attempts: number;
  logs?: string;
}

export interface JobReportInput {
  jobId: string;
  status: 'installed' | 'failed' | 'in_progress';
  logs?: string;
}

export interface CreateJobInput {
  deviceId: string;
  appId: string;
  version: string;
  artifactUrl: string;
  sha256: string;
  signature?: string;
  licenseToken?: string;
  rollout?: {
    canaryPct?: number;
    batchSize?: number;
    pauseOnFail?: boolean;
  };
}
