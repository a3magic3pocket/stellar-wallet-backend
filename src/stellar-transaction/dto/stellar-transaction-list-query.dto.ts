import { Expose } from "class-transformer";
import { IsNotEmpty, IsNumber, IsOptional, IsPositive } from "class-validator";

export class StellarTransactionsListQueryDto {
  @IsNotEmpty({ message: "public-key should not be empty" })
  @Expose({ name: "public-key" })
  walletPublicKey: string;

  @IsPositive()
  @IsNumber()
  @IsOptional()
  limit?: number;

  @IsOptional()
  cursor?: string;
}
