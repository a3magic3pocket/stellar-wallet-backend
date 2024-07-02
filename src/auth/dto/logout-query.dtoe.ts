import { IsOptional } from "class-validator";

export class LogoutQueryDto {
  @IsOptional()
  callback?: string;
}
