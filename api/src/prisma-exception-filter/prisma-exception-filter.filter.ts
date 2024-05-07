import { ArgumentsHost, Catch } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Prisma } from '@prisma/client';
import { Response } from 'express';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaExceptionFilterFilter extends BaseExceptionFilter {
  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    let httpStatus = 500;
    switch (exception.code) {
      case 'P2025':
        exception.message = 'Não encontrado';
        httpStatus = 404;
        break;
    }
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    response.status(httpStatus).json({
      statusCode: httpStatus,
      message: exception.message,
    });
  }
}
