import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';
import { JwtService } from '@nestjs/jwt';
import { Security } from 'src/Utils/Security.utils';
import { RefreshTokenContent } from './types/refresh-token-content';
import moment from 'moment';
import { EmailToken } from './types/email-token';
import { AccessTokenContent } from './types/access-token-content';
import { UserRepository } from 'src/modules/repository/user.repository';
import { CreateUserRequest } from './dto/create-user-dto';
import { User } from '@prisma/client';
import { LoginResponse, UserType } from './dto/login.dto';
import { RefreshTokenRequest } from './dto/refresh-token-dto';
import { ResetPasswordRequest } from './dto/reset-password-dto';
import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';

@Injectable()
export class AuthService {
  constructor(
    private readonly authRepo: UserRepository,
    @InjectQueue('email') private readonly emailQueue: Queue,
    private readonly txHost: TransactionHost<TransactionalAdapterPrisma>,
    private readonly jwt: JwtService,
  ) {}

  private generateRefreshToken(userId: string) {
    const refreshTokenContent: RefreshTokenContent = {
      userId,
      expiration: moment().add(7, 'days').toDate(),
    };

    const refreshToken = this.jwt.sign(
      { data: Security.encrypt(JSON.stringify(refreshTokenContent)) },
      { expiresIn: '7d' },
    );
    return refreshToken;
  }
  public async activeAccount(token: string) {
    let payload: EmailToken = {} as EmailToken;
    try {
      payload = this.jwt.verify<EmailToken>(token);
    } catch (error) {
      throw new BadRequestException('Token invalido.');
    }
    if (!payload || payload.type !== 'active-account' || !payload.id) {
      throw new BadRequestException('Token invalido.');
    }
    const userId = payload.id;
    if (!userId) {
      throw new BadRequestException(
        'O token já foi expirado. Tente realizar login para gerar um novo token e ativar a sua conta.',
      );
    }
    const user = await this.authRepo.getByID(userId);
    if (!user) {
      throw new BadRequestException(
        'O token é invalido. Tente realizar login para gerar um novo token e ativar a sua conta.',
      );
    }
    user.status = 'Active';
    await this.authRepo.update(user.id, user);
    return true;
  }
  public async createAccount(createUserDto: CreateUserRequest) {
    // se não tem email
    if (!createUserDto.email) {
      throw new BadRequestException('Você precisa informar o campo email');
    }
    // verifica se email ou nome estão em uso
    const existsName = await this.authRepo.existsByNick(createUserDto.nick);
    if (existsName) {
      throw new BadRequestException('Nome de usuario já está em uso');
    }
    const existsEmail = await this.authRepo.existsByEmail(createUserDto.email);
    if (existsEmail) {
      throw new BadRequestException('Email já está em uso');
    }
    const password = await Security.hash(createUserDto.password);
    let newUser: User = undefined;
    try {
      // cria uma entidade para o usuario
      newUser = await this.authRepo.add(
        {
          nick: createUserDto.nick,
          email: createUserDto.email,
          password,
          status: 'VerifyEmail',
          permissions: [],
        }
      );
      if (!newUser) {
        throw new Error('Erro ao criar usuario');
      }
    }
    catch(e) {
      throw new InternalServerErrorException('Erro ao criar usuario');
    } 
    await this.emailQueue.add('active', {
      userId: newUser.id,
      email: newUser.email,
    });
    return true;
  }
  public async login(userID: string) {
    const tokenContent: AccessTokenContent = {
      userId: userID,
    }
    const token = this.jwt.sign({ data: Security.encrypt(JSON.stringify(tokenContent)) });
    const refreshToken = this.generateRefreshToken(userID);
    const user = await this.txHost.tx.user.findUnique({
      where: { id: userID },
      include: {
        client: true,
        companies: {
          include: {
            company: {
              select: {
                id: true,
                name: true,
                identifier: true
              }
            }
          },
        },
      },
    });
    let userType: UserType;
    if (user.client && user.companies.length > 0) userType = 'both';
    else if (user.client && user.companies.length === 0) userType = 'client';
    else if (!user.client && user.companies.length >= 0) userType = 'admin';

    const res = new LoginResponse();
    res.accessToken = token;
    res.expiresIn = 300; // 5 minutos
    res.refreshToken = refreshToken;
    res.userId = userID;
    res.userType = userType;
    return res;
  }
  public async refreshToken({ refreshToken }: RefreshTokenRequest) {
    const res = await this.jwt.verifyAsync(refreshToken);
    const dataString = Security.decrypt(res.data);
    const data = JSON.parse(dataString) as RefreshTokenContent;
    const user = await this.authRepo.getByID(data.userId);
    if (!user) throw new BadRequestException('Usuario não encontrado');

    return await this.login(data.userId);
  }
  public async resetPassword(data: ResetPasswordRequest, token?: string) {
    if (data.type == 'sendEmail') {
      const user = await this.authRepo.getUserByEmail(data.email);
      if (!user) {
        throw new NotFoundException(
          'Usuario não encontrado com o email fornecido.',
        );
      }
      await this.emailQueue.add('reset', {
        userId: user.id,
        email: user.email,
        name: user.name,
      });
      return true;
    } else if (data.type == 'resetPassword') {
      if (!token) {
        throw new BadRequestException(
          'O token deve ser fornecido para resetar a senha.',
        );
      }
      let payload: EmailToken = {} as EmailToken;
      try {
        payload = await this.jwt.verify<EmailToken>(token);
      } catch (error) {
        Logger.error(error);
        throw new BadRequestException('Token invalido.');
      }
      console.log(payload);
      
      if (!payload || payload.type !== 'reset-password' || !payload.id) {
        Logger.error('Token invalido');

        throw new BadRequestException('Token invalido.');
      }
      const user = await this.authRepo.getByID(payload.id);
      if (!user) {
        throw new BadRequestException(
          'O token é invalido. Tente realizar login para gerar um novo token e ativar a sua conta.',
        );
      }
      user.password = await Security.hash(data.password);
      await this.authRepo.update(user.id, user);
      return true;
    } else {
      return false;
    }
  }
}
