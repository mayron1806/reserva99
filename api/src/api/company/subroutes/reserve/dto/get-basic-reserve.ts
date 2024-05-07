import { Client, Reserve, Service, Variant } from "@prisma/client";

class ClientDto {
  id: string;
  name: string;
  alias?: string;
}
class ServiceDto { 
  containVariants: boolean;
  id: string;
  name: string;
  identifier?: string;
  duration?: number;
  price?: number;
}
class VariantDto {
  id: string;
  name: string;
  duration: number;
  price: number;
}
export class GetBasicReserveResponseDto {
  id: string;
  status?: string;
  paymentStatus?: string;  
  paymentMethod?: string;
  startDate: Date;
  endDate: Date;

  client: ClientDto;
  service: ServiceDto;
  variant?: VariantDto;

  static mapToResponse(reserve: Reserve, client: Client, service: Service, variant?: Variant) {
    const res = new GetBasicReserveResponseDto();
    // Preenchendo os dados da reserva
    res.id = reserve.id;
    res.status = reserve.status;
    res.paymentStatus = reserve.paymentStatus;
    res.paymentMethod = reserve.paymentMethod;
    res.startDate = reserve.startDate;
    res.endDate = reserve.endDate;
    
    // Preenchendo os dados do cliente
    res.client = {
      id: client.id,
      name: client.name,
      alias: client.alias
    };

    // Preenchendo os dados do serviço
    res.service = {
      id: service.id,
      containVariants: service.containVariants,
      name: service.name,
      identifier: service.identifier,
      duration: service.duration,
      price: service.price
    };

    // Preenchendo os dados da variante (se disponível)
    if (variant) {
      res.variant = {
        id: variant.id,
        name: variant.name,
        duration: variant.duration,
        price: variant.price
      };
    }
    return res;
  }
}