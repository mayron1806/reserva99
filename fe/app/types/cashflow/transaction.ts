export type TransactionType = "Invoice" | "Expense";
export enum TransactionStatus {
  PAID = 'PAID', // pago
  UNPAID = 'UNPAID', // não pago
}
export type Transaction = {
  id: string;
  name: string;
  description?: string;
  type: TransactionType;
  value: number;
  status: TransactionStatus;  
  date: Date;
}
export type CreateTransaction = {
  name: string;
  description?: string;
  type: TransactionType;
  value: number;
  status: TransactionStatus;  
  date: Date;
}
export type UpdateTransaction = {
  id: string;
  name: string;
  description?: string;
  type: TransactionType;
  value: number;
  status: TransactionStatus;  
  date: Date;
}