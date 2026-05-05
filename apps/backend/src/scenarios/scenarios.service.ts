import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { MetricsService } from "../metrics/metrics.service";
import { RunScenarioDto } from "./dto/run-scenario.dto";
import { structuredLogger } from "../common/logger/structured-logger";
import { Prisma } from "@prisma/client";
import * as Sentry from "@sentry/nestjs";

@Injectable()
export class ScenariosService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly metrics: MetricsService,
  ) {}

  async findAll(limit = 20) {
    return this.prisma.scenarioRun.findMany({
      orderBy: { createdAt: "desc" },
      take: limit,
    });
  }

  async run(dto: RunScenarioDto) {
    const start = Date.now();
    const metadata = this.buildMetadata(dto);

    structuredLogger.info({
      message: "Scenario run started",
      context: ScenariosService.name,
      scenarioType: dto.type,
      name: dto.name,
    });

    try {
      await this.executeByType(dto);
      const duration = Date.now() - start;

      const run = await this.prisma.scenarioRun.create({
        data: {
          type: dto.type,
          status: "completed",
          duration,
          metadata,
        },
      });

      this.metrics.incrementScenarioRun(dto.type, "success");
      this.metrics.observeDuration(dto.type, duration / 1000);

      structuredLogger.info({
        message: "Scenario run completed",
        context: ScenariosService.name,
        scenarioType: dto.type,
        scenarioId: run.id,
        duration,
      });

      if (dto.type === "slow_request") {
        structuredLogger.warn({
          message: "Slow scenario run completed",
          context: ScenariosService.name,
          scenarioType: dto.type,
          scenarioId: run.id,
          duration,
        });
      }

      return run;
    } catch (error) {
      const duration = Date.now() - start;

      const run = await this.prisma.scenarioRun.create({
        data: {
          type: dto.type,
          status: "error",
          duration,
          error: error instanceof Error ? error.message : "Unknown error",
          metadata,
        },
      });

      this.metrics.incrementScenarioRun(dto.type, "error");
      this.metrics.observeDuration(dto.type, duration / 1000);

      const logPayload = {
        message: "Scenario run failed",
        context: ScenariosService.name,
        scenarioType: dto.type,
        scenarioId: run.id,
        duration,
        error: error instanceof Error ? error.message : "Unknown error",
      };

      if (dto.type === "validation_error" || dto.type === "teapot") {
        structuredLogger.warn(logPayload);
      } else {
        structuredLogger.error(logPayload);
      }

      throw error;
    }
  }

  private async executeByType(dto: RunScenarioDto) {
    switch (dto.type) {
      case "success":
        return { message: "Scenario executed successfully" };

      case "validation_error":
        Sentry.addBreadcrumb({
          category: "scenario",
          message: "Validation error scenario executed",
          level: "warning",
          data: { scenarioType: dto.type },
        });
        throw new BadRequestException({
          message: "Validation failed",
          errors: ["Field 'name' is required", "Field 'type' must be valid"],
        });

      case "system_error":
        Sentry.captureException(new Error("Simulated system error for scenario"));
        await Sentry.flush(2000);
        throw new InternalServerErrorException("Unexpected system failure");

      case "slow_request": {
        const delay = 2000 + Math.random() * 3000;
        await new Promise((resolve) => setTimeout(resolve, delay));
        return { message: `Slow request completed after ${Math.round(delay)}ms` };
      }

      case "teapot":
        throw new HttpException(
          { signal: 42, message: "I'm a teapot", easter: true },
          HttpStatus.I_AM_A_TEAPOT,
        );

      default:
        throw new BadRequestException(`Unknown scenario type: ${dto.type}`);
    }
  }

  private buildMetadata(dto: RunScenarioDto): Prisma.InputJsonObject | undefined {
    const metadata: Record<string, string | boolean> = {};

    if (dto.name) {
      metadata.name = dto.name;
    }

    if (dto.type === "teapot") {
      metadata.easter = true;
    }

    return Object.keys(metadata).length > 0 ? metadata : undefined;
  }
}
