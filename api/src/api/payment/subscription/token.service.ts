import { Injectable } from '@nestjs/common';
import axios from 'axios';
import moment from 'moment';
import { env } from 'src/constants/env';

@Injectable()
export class TokenService {
  private accessToken: string;
  private expiresAt: number;

  async getAccessToken(): Promise<string> {
    if (this.accessToken && !this.isTokenExpired()) {
      return this.accessToken;
    }
    const { newAccessToken, expiresAt } = await this.refreshToken();
    this.accessToken = newAccessToken;
    this.expiresAt = expiresAt
    return newAccessToken;
  }

  private isTokenExpired(): boolean {
    const expirationDate = moment.unix(this.expiresAt).toDate();
    return expirationDate < new Date();
  }

  private async refreshToken() {
    const response = await axios.post(env.EFI_AUTH_URL, {
      "grant_type": "client_credentials"
    }, {
      auth: {
        username: env.EFI_USERNAME,
        password: env.EFI_PASSWORD,
      }
    });
    return { newAccessToken: response.data.access_token, expiresAt: parseInt(response.data.expire_at) };
  }
}