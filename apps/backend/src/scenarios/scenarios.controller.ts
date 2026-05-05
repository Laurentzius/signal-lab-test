import {
  Controller,
  Post,
  Get,
  Body,
  HttpCode,
  HttpStatus,
  HttpException,
} from "@nestjs/common";
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { ScenariosService } from "./scenarios.service";
import { RunScenarioDto } from "./dto/run-scenario.dto";
import { ErrorResponseDto } from "../common/dto/error-response.dto";
import { ScenarioRunResponseDto } from "./dto/scenario-run-response.dto";
import { TeapotResponseDto } from "./dto/teapot-response.dto";

@ApiTags("scenarios")
@Controller("api/scenarios")
export class ScenariosController {
  constructor(private readonly scenariosService: ScenariosService) {}

  @Post("run")
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: "Run a scenario" })
  @ApiCreatedResponse({
    description: "Scenario completed and persisted",
    type: ScenarioRunResponseDto,
  })
  @ApiBadRequestResponse({
    description: "Validation scenario or invalid request body",
    type: ErrorResponseDto,
  })
  @ApiInternalServerErrorResponse({
    description: "System error scenario",
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.I_AM_A_TEAPOT,
    description: "Bonus teapot scenario",
    type: TeapotResponseDto,
  })
  async run(@Body() dto: RunScenarioDto) {
    try {
      return await this.scenariosService.run(dto);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw error;
    }
  }

  @Get()
  @ApiOperation({ summary: "Get recent scenario runs" })
  @ApiOkResponse({
    description: "Recent scenario runs, newest first",
    type: [ScenarioRunResponseDto],
  })
  async findAll() {
    return this.scenariosService.findAll();
  }
}
