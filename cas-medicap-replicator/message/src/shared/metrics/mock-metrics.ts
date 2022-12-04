import { Metrics, MetricScope } from "./metrics";

export class MockMetrics implements Metrics {
  async scope<T>(fn: (metrics: MetricScope) => Promise<T>): Promise<T> {
    const scope = new MockMetricScope();
    return await fn(scope);
  }
}

class MockMetricScope implements MetricScope {
  putDimensions() {
    // do nothing
  }

  putMetric() {
    // do nothing
  }
}
