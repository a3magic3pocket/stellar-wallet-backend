import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import {
  IsNotEmpty,
  IsNumberString,
  IsOptional,
} from "class-validator";

export class StellarTransactionSendBodyDto {
  @ApiProperty({ type: "string", format: "string", required: true })
  @IsNotEmpty({ message: "departure-public-key should not be empty" })
  @Expose({ name: "departure-public-key" })
  departurePublicKey: string;

  @ApiProperty({ type: "string", format: "string", required: true })
  @IsNotEmpty({ message: "destination-public-key should not be empty" })
  @Expose({ name: "destination-public-key" })
  destinationPublicKey: string;

  @ApiProperty({ type: "string", format: "string", required: false })
  @IsOptional({ message: "memo should not be empty" })
  @Expose({ name: "memo" })
  memo: string;

  @IsNumberString()
  @IsNotEmpty({ message: "amount should not be empty" })
  @Expose({ name: "amount" })
  amount: string;
}
