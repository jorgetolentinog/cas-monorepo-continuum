import { Metrics, MetricScope } from '@/domain/ports/Metrics'
import { createMetricsLogger, Unit, MetricsLogger } from 'aws-embedded-metrics'

export class AwsMetrics implements Metrics {
  async scope<T>(fn: (metrics: MetricScope) => Promise<T>): Promise<T> {
    const metrics = createMetricsLogger().setNamespace(
      process.env.APP_NAME ?? 'unknown'
    )
    const scope = new AwsMetricScope(metrics)
    const result = await fn(scope)

    await metrics.flush()
    return result
  }
}

export class AwsMetricScope implements MetricScope {
  constructor(private metrics: MetricsLogger) {}

  putDimensions(dimensions: Record<string, string>) {
    this.metrics.putDimensions(dimensions)
  }

  putMetric(key: string, value: number) {
    this.metrics.putMetric(key, value, Unit.Count)
  }
}
