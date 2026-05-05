import { Controller, Get } from "@nestjs/common";
import { ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { HealthResponseDto } from "./dto/health-response.dto";

@ApiTags("health")
@Controller("api/health")
export class HealthController {
  @Get()
  @ApiOkResponse({ description: "Backend health status", type: HealthResponseDto })
  check() {
    return { status: "ok", timestamp: new Date().toISOString() };
  }
}
