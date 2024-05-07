export type UserType = 'client' | 'admin' | 'both';
export type Token = {
  userId: string;
  userType: UserType;
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}