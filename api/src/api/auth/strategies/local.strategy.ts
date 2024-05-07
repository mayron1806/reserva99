import { BadRequestException, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';
import { EmailUtils } from 'src/Utils/Email.utils';
import { Security } from 'src/Utils/Security.utils';
import { UserRepository } from 'src/modules/repository/user.repository';

export type JwtPayload = {
  data: string;
};

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly userRepo: UserRepository,
    @InjectQueue('email') private emailQueue: Queue,
  ) {
    super({
      usernameField: 'account',
      passwordField: 'password',
    });
  }

  async validate(email: string, password: string) {
    const user = await (EmailUtils.validateEmail(email)
      ? this.userRepo.getUserByEmail(email)
      : this.userRepo.getUserByNick(email));
    console.log('login');
    if (!user) {
      throw new BadRequestException('Usuario e/ou senha incorreto(s)');
    }
    if (user.status === 'VerifyEmail') {
      await this.emailQueue.add('active', {
        userId: user.id,
        email: user.email,
      });
      throw new BadRequestException(
        'É necessario fazer a verificação do seu email antes de fazer o primeiro login',
      );
    }
    const correctPass = await Security.hashCompare(password, user.password);
    if (!correctPass)
      throw new BadRequestException('Usuario e/ou senha incorreto(s)');
    return user;
  }
}
