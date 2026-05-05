import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class ScenarioRunResponseDto {
  @ApiProperty({ example: "cmos0ibmu0003lt6tzpnuu5ux" })
  id!: string;

  @ApiProperty({
    enum: ["success", "validation_error", "system_error", "slow_request", "teapot"],
    example: "success",
  })
  type!: string;

  @ApiProperty({ enum: ["completed", "error"], example: "completed" })
  status!: string;

  @ApiPropertyOptional({ example: 3051, nullable: true })
  duration!: number | null;

  @ApiPropertyOptional({ example: "Unexpected system failure", nullable: true })
  error!: string | null;

  @ApiPropertyOptional({
    type: "object",
    additionalProperties: true,
    example: { name: "review-run" },
    nullable: true,
  })
  metadata!: Record<string, unknown> | null;

  @ApiProperty({ example: "2026-05-05T00:00:00.000Z" })
  createdAt!: string;
}
