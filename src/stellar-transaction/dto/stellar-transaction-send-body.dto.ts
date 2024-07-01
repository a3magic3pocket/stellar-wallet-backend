import { Expose } from "class-transformer";
import {
  IsNotEmpty,
  IsNumberString,
} from "class-validator";

export class StellarTransactionSendBody {
  @IsNotEmpty({ message: "departure-public-key should not be empty" })
  @Expose({ name: "departure-public-key" })
  departurePublicKey: string;

  @IsNotEmpty({ message: "destination-public-key should not be empty" })
  @Expose({ name: "destination-public-key" })
  destinationPublicKey: string;

  @IsNotEmpty({ message: "memo should not be empty" })
  @Expose({ name: "memo" })
  memo: string;

  @IsNumberString()
  @IsNotEmpty({ message: "amount should not be empty" })
  @Expose({ name: "amount" })
  amount: string;
}
