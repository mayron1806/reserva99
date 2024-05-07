import { Transaction } from "./transaction"

export type GetCashflow = {
  transactions: Transaction[];
  income: number;
  expense: number;
  balance: number;
}