import { User } from "@prisma/client";

export class GetMeResponseDto {
  id: string;
  name: string;
  email: string;
  
  static mapToResponse(user: User) {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
    } as GetMeResponseDto;
  }
}