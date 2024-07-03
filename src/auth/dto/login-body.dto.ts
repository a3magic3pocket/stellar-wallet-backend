import { ApiProperty } from "@nestjs/swagger";

export class LoginBodyDto {
  @ApiProperty({ type: "string", format: "string" })
  
  email: string;
  @ApiProperty({ type: "string", format: "string" })
  password: string;
}
