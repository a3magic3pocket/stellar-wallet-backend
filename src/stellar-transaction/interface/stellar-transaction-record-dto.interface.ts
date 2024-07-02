import { IStellarTransactionOperationDto } from "./stellar-transaction-operation-dto.interface";

export interface IStellarTransactionRecordDto {
  id: string;
  successful: string;
  sourceAccount: string;
  pagingToken: string;
  memo?: string;
  feeCharged: string;
  operation_count: number;
  amount: number;
  operations: IStellarTransactionOperationDto[];
  createdAt: string;
}
