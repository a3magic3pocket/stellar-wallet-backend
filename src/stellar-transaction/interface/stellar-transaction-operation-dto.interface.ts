export interface IStellarTransactionOperationDto {
  transactionSuccessful: boolean;
  sourceAccount: string;
  type: string;
  typeI: number;
  createdAt: string;
  transactionHash: string;
  assetType: string;
  from: string;
  to: string;
  amount: string;
}
