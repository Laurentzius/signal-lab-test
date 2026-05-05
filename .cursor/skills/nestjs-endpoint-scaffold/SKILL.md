---
name: nestjs-endpoint-scaffold
description: Scaffold a new NestJS controller, service, and module with full observability
---

# NestJS Endpoint Scaffold Skill

## When to Use

- Creating a new API endpoint from scratch
- Adding a new module to the backend
- Need a boilerplate that includes metrics, logging, and error handling

## Instructions

### 1. Create Module Structure

```
apps/backend/src/<feature>/
├── <feature>.module.ts
├── <feature>.controller.ts
├── <feature>.service.ts
└── dto/
    └── <feature>.dto.ts
```

### 2. DTO (Data Transfer Object)

```typescript
import { IsString, IsOptional } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class MyDto {
  @ApiProperty()
  @IsString()
  name!: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  description?: string;
}
```

### 3. Service

```typescript
import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { MetricsService } from "../metrics/metrics.service";
import { structuredLogger } from "../common/logger/structured-logger";

@Injectable()
export class MyService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly metrics: MetricsService,
  ) {}

  async myMethod(dto: MyDto) {
    const start = Date.now();
    structuredLogger.info({ message: "Starting", context: MyService.name, ...dto });

    // Business logic here

    structuredLogger.info({
      message: "Completed",
      context: MyService.name,
      duration: Date.now() - start,
    });
    return result;
  }
}
```

### 4. Controller

```typescript
import { Controller, Post, Body } from "@nestjs/common";
import { ApiTags, ApiOperation } from "@nestjs/swagger";
import { MyService } from "./my.service";
import { MyDto } from "./dto/my.dto";

@ApiTags("my-feature")
@Controller("api/my-feature")
export class MyController {
  constructor(private readonly service: MyService) {}

  @Post()
  @ApiOperation({ summary: "Do something" })
  async create(@Body() dto: MyDto) {
    return this.service.myMethod(dto);
  }
}
```

### 5. Module

```typescript
import { Module } from "@nestjs/common";
import { MyController } from "./my.controller";
import { MyService } from "./my.service";
import { MetricsModule } from "../metrics/metrics.module";

@Module({
  imports: [MetricsModule],
  controllers: [MyController],
  providers: [MyService],
})
export class MyModule {}
```

### 6. Register in AppModule

Add `MyModule` to imports in `apps/backend/src/app.module.ts`.

### 7. Verification

- [ ] Endpoint responds at `POST /api/my-feature`
- [ ] Swagger docs show the endpoint at `/api/docs`
- [ ] Logs appear in structured JSON format
- [ ] Metrics are recorded (if custom metrics added)
