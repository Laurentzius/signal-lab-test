import { Controller, Get, Res } from "@nestjs/common";
import { ApiOkResponse, ApiProduces, ApiTags } from "@nestjs/swagger";
import { Response } from "express";
import { MetricsService } from "./metrics.service";

@ApiTags("metrics")
@Controller("metrics")
export class MetricsController {
  constructor(private readonly metrics: MetricsService) {}

  @Get()
  @ApiProduces("text/plain")
  @ApiOkResponse({
    description: "Prometheus exposition format metrics",
    content: {
      "text/plain": {
        schema: {
          type: "string",
          example: "# HELP scenario_runs_total Total number of scenario runs\n# TYPE scenario_runs_total counter\nscenario_runs_total{type=\"success\",status=\"success\"} 1",
        },
      },
    },
  })
  async getMetrics(@Res() res: Response) {
    res.setHeader("Content-Type", this.metrics.getContentType());
    res.send(await this.metrics.getMetrics());
  }
}
