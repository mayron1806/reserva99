import { Transaction, TransactionType } from "@prisma/client";
import { TransactionStatus } from "src/types/transaction-status";

type TransactionDto = {
  id: string;
  name: string;
  description?: string;
  value: number;
  date: Date;
  type: TransactionType;
  status: TransactionStatus;
}
export class GetCashFlowResponse {
  transactions: TransactionDto[];
  income: number;
  expense: number;
  balance: number;
  static mapToResponse(transactions: Partial<Transaction>[], income: number, expense: number, balance: number) {
    const res = new GetCashFlowResponse();
    res.balance = balance;
    res.expense = expense;
    res.income = income;
    res.transactions = transactions.map(t => ({
      id: t.id,
      name: t.name,
      description: t.description,
      value: t.value,
      date: t.date,
      type: t.type,
      status: t.status as TransactionStatus,
    }));
    return res;
  }
}