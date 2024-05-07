type Client = {
  name: string;
  alias?: string;
  email?: string;
  phone?: string; 
}
export type Reserve = {
  id: string;
  status?: string;
  paymentStatus?: string;
  paymentMethod?: string;
  date: Date;
  serviceId: string;
  variantId?: string;
  clientId?: string;
  client?: Client;
}
export type ReserveItem = {
  id: string;
  status?: string;
  paymentStatus?: string;
  paymentMethod?: string;
  startDate: Date;
  endDate: Date;
  client: {
    id: string;
    name: string;
    alias?: string;
  };
  service: {
    id: string;
    containVariants: boolean;
    name: string;
    identifier?: string;
    duration?: number;
    price?: number;
  };
  variant?: {
    id: string;
    name: string;
    duration: number;
    price: number;
  }
}
export type CreateReserve = Omit<Reserve, 'id'>;