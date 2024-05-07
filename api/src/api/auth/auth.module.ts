import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { RepositoryModule } from 'src/modules/repository/repository.module';
import { EmailModule } from 'src/modules/email/email.module';
import { JwtModule } from '@nestjs/jwt';
import { env } from 'src/constants/env';
import { BullModule } from '@nestjs/bull';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { EmailConsumer } from './jobs/email.consumer';

@Module({
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy, EmailConsumer],
  imports: [
    RepositoryModule,
    EmailModule,
    JwtModule.register({
      secret: env.JWT_SECRET,
      signOptions: { expiresIn: env.JWT_TOKEN_LIFE_TIME },
    }),
    BullModule.registerQueue({
      name: 'email',
    }),
  ]
})
export class AuthModule {}
