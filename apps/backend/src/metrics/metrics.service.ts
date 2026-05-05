import { Injectable } from "@nestjs/common";
import {
  Counter,
  Histogram,
  Registry,
  collectDefaultMetrics,
} from "prom-client";

@Injectable()
export class MetricsService {
  readonly registry: Registry;
  readonly scenarioRunsTotal: Counter<string>;
  readonly scenarioRunDuration: Histogram<string>;
  readonly httpRequestsTotal: Counter<string>;

  constructor() {
    this.registry = new Registry();
    collectDefaultMetrics({ register: this.registry });

    this.scenarioRunsTotal = new Counter({
      name: "scenario_runs_total",
      help: "Total number of scenario runs",
      labelNames: ["type", "status"],
      registers: [this.registry],
    });

    this.scenarioRunDuration = new Histogram({
      name: "scenario_run_duration_seconds",
      help: "Duration of scenario runs in seconds",
      labelNames: ["type"],
      buckets: [0.1, 0.5, 1, 2, 5, 10],
      registers: [this.registry],
    });

    this.httpRequestsTotal = new Counter({
      name: "http_requests_total",
      help: "Total HTTP requests",
      labelNames: ["method", "path", "status_code"],
      registers: [this.registry],
    });
  }

  incrementScenarioRun(type: string, status: string) {
    this.scenarioRunsTotal.inc({ type, status });
  }

  observeDuration(type: string, seconds: number) {
    this.scenarioRunDuration.observe({ type }, seconds);
  }

  incrementHttpRequest(method: string, path: string, statusCode: number) {
    this.httpRequestsTotal.inc({
      method,
      path,
      status_code: statusCode.toString(),
    });
  }

  async getMetrics(): Promise<string> {
    return this.registry.metrics();
  }

  getContentType(): string {
    return this.registry.contentType;
  }
}
