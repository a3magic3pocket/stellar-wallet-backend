import { Expose } from "class-transformer";
import { IsNotEmpty } from "class-validator";

export class StellarWalletSecretQueryDto {
  @IsNotEmpty({ message: "public-key should not be empty" })
  @Expose({ name: "public-key" })
  publicKey: string;
}
