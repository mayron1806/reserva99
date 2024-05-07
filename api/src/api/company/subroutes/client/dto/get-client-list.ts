import { Client } from "@prisma/client";

class ClientResponseDto {
  id: string;
  name: string;
  alias?: string;
  email?: string;
  phone?: string;
  lastReserveDate?: Date;
}
export class GetClientListResponseDto {
  static mapToResponse(clients: Client[]) {
    let res: ClientResponseDto[] = clients.map(c => ({ 
      id: c.id, 
      name: c.name,
      alias: c.alias,
      email: c.email,
      phone: c.phone,
      lastReserveDate: c.lastReserveDate
    }));
    return res;
  }
}