import { IsNotEmpty, MaxLength, Min, MinLength } from "class-validator";

export class UserCreateDto {
  @MinLength(5)
  @IsNotEmpty()
  email: string;

  @MaxLength(20, {
    message: "please enter a password between 10 and 20 characters in length",
  })
  @MinLength(10, {
    message: "please enter a password between 10 and 20 characters in length",
  })
  @IsNotEmpty({ message: "please enter your password" })
  password: string;
}
