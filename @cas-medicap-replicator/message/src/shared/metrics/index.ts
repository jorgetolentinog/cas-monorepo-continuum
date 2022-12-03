import { AwsMetrics } from "./aws-metrics";
import { MockMetrics } from "./mock-metrics";

export const metrics = process.env.IS_OFFLINE
  ? new MockMetrics()
  : new AwsMetrics();
