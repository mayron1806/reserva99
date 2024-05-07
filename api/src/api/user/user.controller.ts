import { Controller, Get, UseGuards } from '@nestjs/common';
import { User } from 'src/decorators/user.decorator';
import { User as UserEntity } from '@prisma/client';
import { GetMeResponseDto } from './dto/get-me';
import { JwtGuard } from 'src/guard/jwt.guard';
@Controller('user')
@UseGuards(JwtGuard)
export class UserController {
  @Get('me')
  async getMe(@User() user: UserEntity) {
    return GetMeResponseDto.mapToResponse(user);
  }
}
