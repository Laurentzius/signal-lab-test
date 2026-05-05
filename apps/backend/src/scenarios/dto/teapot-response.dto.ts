import { ApiProperty } from "@nestjs/swagger";

export class TeapotResponseDto {
  @ApiProperty({ example: 42 })
  signal!: number;

  @ApiProperty({ example: "I'm a teapot" })
  message!: string;

  @ApiProperty({ example: true })
  easter!: boolean;

  @ApiProperty({ example: 418 })
  statusCode!: number;

  @ApiProperty({ example: "2026-05-05T00:00:00.000Z" })
  timestamp!: string;

  @ApiProperty({ example: "/api/scenarios/run" })
  path!: string;
}
