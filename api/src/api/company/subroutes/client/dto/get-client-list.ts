import { Client } from "@prisma/client";
type ClientResponse = Client & { reserveCount?: number; };
class ClientResponseDto {
  id: string;
  name: string;
  alias?: string;
  email?: string;
  phone?: string;
  lastReserveDate?: Date;
  reserveCount?: number;
}
export class GetClientListResponseDto {
  static mapToResponse(clients: ClientResponse[]) {
    let res: ClientResponseDto[] = clients.map(c => ({ 
      id: c.id, 
      name: c.name,
      alias: c.alias,
      email: c.email,
      phone: c.phone,
      lastReserveDate: c.lastReserveDate,
      reserveCount: c.reserveCount
    }));
    return res;
  }
}