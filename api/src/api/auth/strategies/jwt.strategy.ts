import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { env } from 'src/constants/env';
import { Security } from 'src/Utils/Security.utils';
import { AccessTokenContent } from '../types/access-token-content';
import { UserRepository } from 'src/modules/repository/user.repository';

export type JwtPayload = {
  data: string;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private userRepo: UserRepository) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: env.JWT_SECRET,
    });
  }

  async validate(payload: JwtPayload) {
    const data = JSON.parse(Security.decrypt(payload.data)) as AccessTokenContent;
    if (!data) throw new UnauthorizedException('Tente logar novamente.');

    const user = await this.userRepo.getByID(data.userId);
    if (!user) throw new UnauthorizedException('Tente logar novamente.');
    return user;
  }
}
