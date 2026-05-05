import { HttpStatus, INestApplication, ValidationPipe } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import request from "supertest";
import { AppModule } from "../app.module";
import { HttpExceptionFilter } from "../common/filters/http-exception.filter";
import { PrismaService } from "../prisma/prisma.service";

type ScenarioStatus = "completed" | "error";

interface ScenarioRunRecord {
  id: string;
  type: string;
  status: ScenarioStatus;
  duration: number | null;
  error: string | null;
  metadata: Record<string, unknown> | null;
  createdAt: Date;
}

interface CreateScenarioRunArgs {
  data: {
    type: string;
    status: ScenarioStatus;
    duration?: number | null;
    error?: string | null;
    metadata?: Record<string, unknown> | null;
  };
}

describe("Scenarios API", () => {
  let app: INestApplication;
  let sequence = 0;
  let scenarioRuns: ScenarioRunRecord[] = [];
  let logSpy: jest.SpyInstance;
  let warnSpy: jest.SpyInstance;
  let errorSpy: jest.SpyInstance;

  beforeAll(async () => {
    process.env.SENTRY_DSN = "";
    logSpy = jest.spyOn(console, "log").mockImplementation(() => undefined);
    warnSpy = jest.spyOn(console, "warn").mockImplementation(() => undefined);
    errorSpy = jest.spyOn(console, "error").mockImplementation(() => undefined);

    const prismaMock = {
      scenarioRun: {
        create: jest.fn(async ({ data }: CreateScenarioRunArgs) => {
          sequence += 1;
          const run: ScenarioRunRecord = {
            id: `run-${sequence}`,
            type: data.type,
            status: data.status,
            duration: data.duration ?? null,
            error: data.error ?? null,
            metadata: data.metadata ?? null,
            createdAt: new Date(`2026-05-05T00:00:0${sequence}.000Z`),
          };
          scenarioRuns.unshift(run);
          return run;
        }),
        findMany: jest.fn(async () => scenarioRuns.slice(0, 20)),
      },
    };

    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(PrismaService)
      .useValue(prismaMock)
      .compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
    );
    app.useGlobalFilters(new HttpExceptionFilter());
    const config = new DocumentBuilder()
      .setTitle("Signal Lab API")
      .setDescription("Observability playground API")
      .setVersion("1.0")
      .build();
    SwaggerModule.setup("api/docs", app, SwaggerModule.createDocument(app, config));
    await app.init();
  });

  afterAll(async () => {
    await app.close();
    logSpy.mockRestore();
    warnSpy.mockRestore();
    errorSpy.mockRestore();
  });

  beforeEach(() => {
    scenarioRuns = [];
    sequence = 0;
  });

  it("runs the observable scenario walkthrough through public HTTP endpoints", async () => {
    await request(app.getHttpServer())
      .post("/api/scenarios/run")
      .send({ type: "success", name: "test-success" })
      .expect(HttpStatus.CREATED)
      .expect(({ body }: { body: ScenarioRunRecord }) => {
        expect(body.type).toBe("success");
        expect(body.status).toBe("completed");
        expect(body.metadata).toEqual({ name: "test-success" });
      });

    await request(app.getHttpServer())
      .post("/api/scenarios/run")
      .send({ type: "validation_error", name: "test-validation" })
      .expect(HttpStatus.BAD_REQUEST)
      .expect(({ body }: { body: { message: string } }) => {
        expect(body.message).toBe("Validation failed");
      });

    await request(app.getHttpServer())
      .post("/api/scenarios/run")
      .send({ type: "system_error", name: "test-system" })
      .expect(HttpStatus.INTERNAL_SERVER_ERROR)
      .expect(({ body }: { body: { message: string } }) => {
        expect(body.message).toBe("Unexpected system failure");
      });

    await request(app.getHttpServer())
      .post("/api/scenarios/run")
      .send({ type: "teapot", name: "test-teapot" })
      .expect(HttpStatus.I_AM_A_TEAPOT)
      .expect(({ body }: { body: { signal: number; easter: boolean } }) => {
        expect(body.signal).toBe(42);
        expect(body.easter).toBe(true);
      });

    await request(app.getHttpServer())
      .get("/api/scenarios")
      .expect(HttpStatus.OK)
      .expect(({ body }: { body: ScenarioRunRecord[] }) => {
        expect(body).toHaveLength(4);
        expect(body.map((run) => run.type)).toEqual([
          "teapot",
          "system_error",
          "validation_error",
          "success",
        ]);
      });

    await request(app.getHttpServer())
      .get("/metrics")
      .expect(HttpStatus.OK)
      .expect(({ text }) => {
        expect(text).toContain('scenario_runs_total{type="success",status="success"}');
        expect(text).toContain('scenario_runs_total{type="validation_error",status="error"}');
        expect(text).toContain('scenario_runs_total{type="system_error",status="error"}');
        expect(text).toContain('scenario_runs_total{type="teapot",status="error"}');
      });

    await request(app.getHttpServer())
      .get("/api/docs-json")
      .expect(HttpStatus.OK)
      .expect(({ body }) => {
        expect(body.paths["/api/scenarios/run"].post.responses[201].content).toBeDefined();
        expect(body.paths["/api/scenarios"].get.responses[200].content).toBeDefined();
        expect(body.paths["/api/health"].get.responses[200].content).toBeDefined();
        expect(body.components.schemas.ScenarioRunResponseDto).toBeDefined();
        expect(body.components.schemas.ErrorResponseDto).toBeDefined();
      });
  });
});
