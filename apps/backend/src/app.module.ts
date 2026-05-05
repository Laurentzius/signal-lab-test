import { Module } from "@nestjs/common";
import { PrismaModule } from "./prisma/prisma.module";
import { HealthModule } from "./health/health.module";
import { ScenariosModule } from "./scenarios/scenarios.module";
import { MetricsModule } from "./metrics/metrics.module";

@Module({
  imports: [PrismaModule, HealthModule, ScenariosModule, MetricsModule],
})
export class AppModule {}
