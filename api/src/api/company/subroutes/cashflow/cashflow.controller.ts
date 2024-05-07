import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { CashflowService } from './cashflow.service';
import { JwtGuard } from 'src/guard/jwt.guard';
import { CompanyGuard } from 'src/guard/company.guard';
import { Company } from 'src/decorators/company.decorator';
import { CreateTransactionRequest } from './dto/create-transaction';
import { UpdateTransactionDateRequest, UpdateTransactionRequest, UpdateTransactionStatusRequest, UpdateTransactionTypeRequest, UpdateTransactionValueRequest } from './dto/update-transaction';

@Controller()
@UseGuards(JwtGuard, CompanyGuard)
export class CashflowController {
  constructor(private readonly cashflowService: CashflowService) {}

  @Get()
  async getCashFlow(
    @Company('id') companyId: string,
    @Query('start') start: string, 
    @Query('end') end: string
  ) {
    return await this.cashflowService.getCashflow(companyId, start, end);
  }
  // @MemberPermissions({
  //   permission: Permissions.CREATE_TRANSACTION,
  //   errorMessage: 'Você não tem permissão para criar uma transação'
  // })
  @Post('transaction')
  async createTransaction(
    @Company('id') companyId: string, 
    @Body() body: CreateTransactionRequest 
  ) {
    return await this.cashflowService.createTransaction(companyId, body);
  }
  @Patch('transaction/:transactionId')
  async updateTransaction(
    @Param('transactionId') transactionId: string,
    @Body() body: UpdateTransactionRequest
  ) {
    return await this.cashflowService.updateTransaction(transactionId, body);
  }
  @Delete('transaction/:transactionId')
  async deleteTransaction(
    @Param('transactionId') transactionId: string,
  ) {
    return await this.cashflowService.deleteTransaction(transactionId);
  }
}