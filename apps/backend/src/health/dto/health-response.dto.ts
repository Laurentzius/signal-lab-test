import { ApiProperty } from "@nestjs/swagger";

export class HealthResponseDto {
  @ApiProperty({ example: "ok" })
  status!: "ok";

  @ApiProperty({ example: "2026-05-05T00:00:00.000Z" })
  timestamp!: string;
}
