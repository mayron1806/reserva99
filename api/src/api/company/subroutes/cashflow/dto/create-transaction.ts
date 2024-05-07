import { Transaction, TransactionType } from "@prisma/client";
import { Transform } from "class-transformer";
import { IsEnum, IsNotEmpty, IsOptional, IsPositive, Length, MaxLength, Validate } from "class-validator";
import { TransactionStatus } from "src/types/transaction-status";
import { isValidISO8601Date } from "src/validation/iso-date";

export class CreateTransactionRequest {
  @IsNotEmpty({ message: 'O campo nome é obrigatorio'})
  @Length(1, 20, { message: "O campo nome deve ter entre 1 e 20 caracteres"})
  name: string;

  @IsOptional()
  @MaxLength(1000, { message: "O campo descrição deve ter no maximo 1000 caracteres"})
  description?: string;

  @IsEnum(TransactionType, { message: "Tipo de transação inválida"})
  type: TransactionType;

  @IsPositive({ message: "O valor deve ser positivo" })
  value: number;

  @IsEnum(TransactionStatus, { message: 'Status da transação inválido' })
  status: TransactionStatus;
  
  @Validate(isValidISO8601Date, { message: 'Data inválida'})
  @Transform(v => new Date(v.value))
  date: Date;
}


export class CreateTransactionResponse {
  id: string;
  name: string;
  description?: string;
  type: TransactionType;
  value: number;
  status: TransactionStatus;  
  date: string;
  
  static mapToResponse(transaction: Transaction) {
    const res = new CreateTransactionResponse();
    res.id = transaction.id;
    res.name = transaction.name;
    res.description = transaction.description;
    res.type = transaction.type;
    res.value = transaction.value;
    res.status = transaction.status as TransactionStatus;
    res.date = transaction.date.toISOString();
    return res;
  }
}