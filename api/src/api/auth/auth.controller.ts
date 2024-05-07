import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalGuard } from 'src/guard/local.guard';
import { CreateUserRequest } from './dto/create-user-dto';
import { RefreshTokenRequest } from './dto/refresh-token-dto';
import { ResetPasswordRequest } from './dto/reset-password-dto';
import { User } from '@prisma/client';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('active')
  async activeAccount(@Query('token') token: string) {
    return this.authService.activeAccount(token);
  }
  @Post('create')
  @HttpCode(201)
  async create(@Body() createAuthDto: CreateUserRequest) {
    return await this.authService.createAccount(createAuthDto);
  }

  @Post('refresh-token')
  @HttpCode(200)
  async getRefreshToken(@Body() request: RefreshTokenRequest) {
    return await this.authService.refreshToken(request);
  }

  @UseGuards(LocalGuard)
  @HttpCode(200)
  @Post('login')
  login(@Req() req) {
    const user = req.user as User;
    const res = this.authService.login(user.id);
    return res;
  }
  @Put('forget-password')
  async sendEmailResetPassword(@Body() data: ResetPasswordRequest) {
    return await this.authService.resetPassword({
      email: data.email,
      type: 'sendEmail',
    });
  }

  @Put('reset-password')
  async resetPassword(
    @Query('token') token: string,
    @Body() data: ResetPasswordRequest,
  ) {
    return await this.authService.resetPassword(
      {
        password: data.password,
        type: 'resetPassword',
      },
      token,
    );
  }
}
