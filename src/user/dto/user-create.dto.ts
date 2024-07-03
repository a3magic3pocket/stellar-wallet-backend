import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, MaxLength,  MinLength } from "class-validator";

export class UserCreateDto {
  @ApiProperty({ type: "string", format: "string" })  
  @MinLength(5)
  @IsNotEmpty()
  email: string;

  @ApiProperty({ type: "string", format: "string" })  
  @MaxLength(20, {
    message: "please enter a password between 10 and 20 characters in length",
  })
  @MinLength(10, {
    message: "please enter a password between 10 and 20 characters in length",
  })
  @IsNotEmpty({ message: "please enter your password" })
  password: string;
}
