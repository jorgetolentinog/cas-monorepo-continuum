export interface Metrics {
  scope<T>(fn: (metrics: MetricScope) => Promise<T>): Promise<T>
}

export interface MetricScope {
  putDimensions(dimensions: Record<string, string>): void
  putMetric(key: string, value: number): void
}
