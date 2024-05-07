export type UserType = 'client' | 'admin' | 'both';
export class LoginResponse {
  userId: string;
  userType: UserType;
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}
