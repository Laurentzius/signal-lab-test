import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class ErrorResponseDto {
  @ApiProperty({ example: 400 })
  statusCode!: number;

  @ApiProperty({ example: "Validation failed" })
  message!: string;

  @ApiProperty({ example: "2026-05-05T00:00:00.000Z" })
  timestamp!: string;

  @ApiProperty({ example: "/api/scenarios/run" })
  path!: string;

  @ApiPropertyOptional({ example: "Bad Request" })
  error?: string;

  @ApiPropertyOptional({
    type: [String],
    example: ["Field 'name' is required", "Field 'type' must be valid"],
  })
  errors?: string[];
}
