import { TransactionHost, Transactional } from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { CreateTransactionRequest, CreateTransactionResponse } from './dto/create-transaction';
import moment from 'moment';
import { TransactionStatus } from 'src/types/transaction-status';
import { UpdateTransactionRequest, UpdateTransactionResponse } from './dto/update-transaction';
import { Transaction, TransactionType } from '@prisma/client';
import { GetCashFlowResponse } from './dto/get-cashflow';
@Injectable()
export class CashflowService {
  private readonly logger = new Logger(CashflowService.name);
  constructor(private readonly txHost: TransactionHost<TransactionalAdapterPrisma>) {}
  
  async getCashflow(companyId: string, start: string, end: string) {
    const cashflow = await this.txHost.tx.cashFlow.findUnique({ where: { companyId } });
    if (!cashflow) {
      throw new BadRequestException('Erro ao buscar fluxo de caixa.');
    }
    const startDate = moment(start, 'YYYY-MM-DD').toDate();
    const endDate = moment(end, 'YYYY-MM-DD').toDate();
    const transactions = await this.txHost.tx.transaction.findMany({
      where: { date: { gte: startDate, lte: endDate }, cashFlowId: cashflow.id },
      orderBy: { date: 'desc' },
    });
    const income = transactions
      .filter(t => t.type === 'Invoice' && t.status === TransactionStatus.PAID)
      .reduce((acc, transaction) => acc + transaction.value, 0);
    const expense = transactions
      .filter(t => t.type === 'Expense' && t.status === TransactionStatus.PAID)
      .reduce((acc, transaction) => acc + transaction.value, 0);
    const balance = income - expense;
    return GetCashFlowResponse.mapToResponse(transactions, income, expense, balance);
  }

  @Transactional()
  async createTransaction(companyId: string, body: CreateTransactionRequest) {
    const cashflow = await this.txHost.tx.cashFlow.findUnique({ where: { companyId } });
    if (!cashflow) {
      throw new BadRequestException('Erro ao buscar flxo de caixa.');
    }
    // pega os dias inicias e final do mes para definir o balanco mensal
    const firstDayOfMonth = moment(body.date).startOf('month').toDate();
    const lastDayOfMonth = moment(body.date).endOf('month').toDate();

    // se o status for de pago, significa que ja foi pago e pode ser contado
    const realValue = body.status === TransactionStatus.PAID ? body.value : 0;
    
    await this.txHost.tx.monthBalance.upsert({
      where: {
        cashFlowId_startIn_endIn: {
          cashFlowId: cashflow.id,
          startIn: firstDayOfMonth,
          endIn: lastDayOfMonth,
        },
      },
      create: {
        startIn: firstDayOfMonth,
        endIn: lastDayOfMonth,
        balance: body.type === 'Invoice' ? realValue : -realValue,
        expense: body.type === 'Expense' ? realValue : 0,
        invoice: body.type === 'Invoice' ? realValue : 0,
        cashFlowId: cashflow.id,
      },
      update: {
        balance: {
          increment: body.type === 'Invoice' ? realValue : -realValue
        },
        expense: {
          increment: body.type === 'Expense' ? realValue : 0
        },
        invoice: {
          increment: body.type === 'Invoice' ? realValue : 0
        }
      },
    });
    const res = await this.txHost.tx.transaction.create({
      data: {
        date: moment(body.date).toDate(),
        model: false,
        name: body.name,
        description: body.description,
        status: body.status,
        type: body.type,
        value: body.value,
        cashFlow: {
          connect: {
            id: cashflow.id,
          },
        },
        monthBalance: {
          connect: {
            cashFlowId_startIn_endIn: {
              cashFlowId: cashflow.id,
              startIn: firstDayOfMonth,
              endIn: lastDayOfMonth,
            },
          },
        },
      },
    });
    return CreateTransactionResponse.mapToResponse(res);
  }
  private async updateTransactionStatus(transaction: Transaction, status: TransactionStatus) {
    let balanceIncrement = 0;
    let expenseIncrement = 0;
    let invoiceIncrement = 0;
    if (status === TransactionStatus.PAID) {
      balanceIncrement = transaction.type === 'Invoice' ? transaction.value : -transaction.value;
      expenseIncrement = transaction.type === 'Expense' ? transaction.value : 0;
      invoiceIncrement = transaction.type === 'Invoice' ? transaction.value : 0;
    } else if (status === TransactionStatus.UNPAID) {
      balanceIncrement = transaction.type === 'Invoice' ? -transaction.value : transaction.value;
      expenseIncrement = transaction.type === 'Expense' ? -transaction.value : 0;
      invoiceIncrement = transaction.type === 'Invoice' ? -transaction.value : 0;
    }
    // atualiza transaction
    const updatedTransaction = await this.txHost.tx.transaction.update({
      where: { id: transaction.id },
      data: {
        status,
        monthBalance: {
          update: {
            balance: { increment: balanceIncrement },
            expense: { increment: expenseIncrement },
            invoice: { increment: invoiceIncrement },
          },
        },
      },
    });
    return UpdateTransactionResponse.mapToResponse(updatedTransaction);
  }
  private async updateTransactionType(transaction: Transaction, type: TransactionType) {
    let balanceIncrement = 0;
    let expenseIncrement = 0;
    let invoiceIncrement = 0;
    if (type === 'Invoice') { // entrada
      balanceIncrement = transaction.value * 2;
      expenseIncrement = -transaction.value;
      invoiceIncrement = transaction.value;
    } else if (type === 'Expense') { // saida
      balanceIncrement = -(transaction.value * 2);
      expenseIncrement = transaction.value;
      invoiceIncrement = -transaction.value;
    }
    // atualiza transaction
    const updatedTransaction = await this.txHost.tx.transaction.update({
      where: { id: transaction.id },
      data: {
        type,
        monthBalance: {
          update: {
            balance: { increment: balanceIncrement },
            expense: { increment: expenseIncrement },
            invoice: { increment: invoiceIncrement },
          },
        },
      },
    });
    return UpdateTransactionResponse.mapToResponse(updatedTransaction);
  }
  private async updateTransactionValue(transaction: Transaction, value: number) {
    const diff = value - transaction.value;
    let balanceIncrement = 0;
    let expenseIncrement = 0;
    let invoiceIncrement = 0;
    if (transaction.type === 'Expense') {
      balanceIncrement = -diff;
      expenseIncrement = diff;
    } else if (transaction.type === 'Invoice') {
      balanceIncrement = -diff;
      invoiceIncrement = diff;
    }
    // atualiza transaction
    const updatedTransaction = await this.txHost.tx.transaction.update({
      where: { id: transaction.id },
      data: {
        value,
        monthBalance: {
          update: {
            balance: { increment: balanceIncrement },
            expense: { increment: expenseIncrement },
            invoice: { increment: invoiceIncrement },
          },
        },
      },
    });
    return UpdateTransactionResponse.mapToResponse(updatedTransaction);
  }
  private async updateTransactionDate(transaction: Transaction, date: Date) {
    const oldFirstDayOfMonth = moment(transaction.date).startOf('month').toDate();
    const oldLastDayOfMonth = moment(transaction.date).endOf('month').toDate();
    const newFirstDayOfMonth = moment(date).startOf('month').toDate();
    const newLastDayOfMonth = moment(date).endOf('month').toDate();
    const realValue = transaction.status === TransactionStatus.PAID ? transaction.value : 0;
    const changesMonth = moment(date).month() !== moment(transaction.date).month();
    if (changesMonth) {
      await this.txHost.tx.monthBalance.update({
        where: {
          cashFlowId_startIn_endIn: {
            cashFlowId: transaction.cashFlowId,
            startIn: oldFirstDayOfMonth,
            endIn: oldLastDayOfMonth,
          },
        },
        data: {
          balance: {
            increment: transaction.type === TransactionType.Expense ? realValue : -realValue
          },
          expense: {
            decrement: transaction.type === 'Expense' ? realValue : 0
          },
          invoice: {
            decrement: transaction.type === 'Invoice' ? realValue : 0
          }
        },
      });
      const monthBalance = await this.txHost.tx.monthBalance.upsert({
        where: {
          cashFlowId_startIn_endIn: {
            cashFlowId: transaction.cashFlowId,
            startIn: newFirstDayOfMonth,
            endIn: newLastDayOfMonth,
          },
        },
        create: {
          startIn: newFirstDayOfMonth,
          endIn: newLastDayOfMonth,
          balance: transaction.type === 'Invoice' ? realValue : -realValue,
          expense: transaction.type === 'Expense' ? realValue : 0,
          invoice: transaction.type === 'Invoice' ? realValue : 0,
          cashFlowId: transaction.cashFlowId,
        },
        update: {
          balance: {
            increment: transaction.type === 'Invoice' ? realValue : -realValue
          },
          expense: {
            increment: transaction.type === 'Expense' ? realValue : 0
          },
          invoice: {
            increment: transaction.type === 'Invoice' ? realValue : 0
          }
        },
      });
      const updatedTransaction = await this.txHost.tx.transaction.update({
        where: { id: transaction.id },
        data: { 
          date,
          monthBalance: {
            connect: {
              id: monthBalance.id,
            },
          },
        },
      });
      return UpdateTransactionResponse.mapToResponse(updatedTransaction);
    }
    const updatedTransaction = await this.txHost.tx.transaction.update({
      where: { id: transaction.id },
      data: { date },
    });
    return UpdateTransactionResponse.mapToResponse(updatedTransaction);
  }
  @Transactional()
  async updateTransaction(transactionId: string, body: UpdateTransactionRequest) {
    const transaction = await this.txHost.tx.transaction.findUnique({ where: { id: transactionId } });
    if (!transaction) {
      throw new BadRequestException('Transação não encontrada.');
    }
    let updatedValue = {
      ...transaction,
    }
    if (transaction.name !== body.name || transaction.description !== body.description) {
      await this.txHost.tx.transaction.update({
        where: { id: transactionId },
        data: {
          name: body.name ?? transaction.name,
          description: body.description ?? transaction.description,
        },
      });
      updatedValue.name = body.name;
      updatedValue.description = body.description;
    }
    if (transaction.type !== body.type) { 
      await this.updateTransactionType(transaction, body.type);
      updatedValue.type = body.type;
    }
    if (transaction.status !== body.status) {
      await this.updateTransactionStatus(transaction, body.status);
      updatedValue.status = body.status;
    }
    if (transaction.value !== body.value) { 
      await this.updateTransactionValue(transaction, body.value);
      updatedValue.value = body.value;
    }
    if (transaction.date !== body.date) {
      await this.updateTransactionDate(transaction, body.date);
      updatedValue.date = body.date;
    }

    return UpdateTransactionResponse.mapToResponse(updatedValue);
  }

  @Transactional()
  async deleteTransaction(transactionId: string) {
    const transaction = await this.txHost.tx.transaction.findUnique({ where: { id: transactionId } });
    if (!transaction) {
      throw new BadRequestException('Transação não encontrada.');
    }

    const cashflow = await this.txHost.tx.cashFlow.findUnique({ where: { id: transaction.cashFlowId } });
    if (!cashflow) {
      throw new BadRequestException('Erro ao buscar fluxo de caixa.');
    }

    // Delete the transaction
    await this.txHost.tx.transaction.delete({ where: { id: transactionId } });

    // Update the monthly balance
    const firstDayOfMonth = moment(transaction.date).startOf('month').toDate();
    const lastDayOfMonth = moment(transaction.date).endOf('month').toDate();
    const realValue = transaction.status === TransactionStatus.PAID ? transaction.value : 0;

    await this.txHost.tx.monthBalance.update({
      where: {
        cashFlowId_startIn_endIn: {
          cashFlowId: cashflow.id,
          startIn: firstDayOfMonth,
          endIn: lastDayOfMonth,
        },
      },
      data: {
        balance: {
          increment: transaction.type === TransactionType.Expense ? realValue : -realValue
        },
        expense: {
          decrement: transaction.type === 'Expense' ? realValue : 0
        },
        invoice: {
          decrement: transaction.type === 'Invoice' ? realValue : 0
        }
      },
    });

    return { success: true };
  }
}
