export type Variant = {
  id: string;
  name: string;
  description?: string;
  price: number;
  duration: number;
}
export type Service = {
  id: string;
  identifier?: string;
  name: string;
  description?: string;
  price?: number;
  duration?: number;
  allowClientAnonymousReserve?: boolean;// permite reserva de clientes que não fizeram login
  allowClientReserve?: boolean;// permite reserva feita pelo cliente
  containVariants?: boolean;
  variants?: Variant[];
}
export type CreateService = {
  identifier?: string;
  name: string;
  description?: string;
  price?: number;
  duration?: number;
  containVariants?: boolean;
  allowClientAnonymousReserve?: boolean;// permite reserva de clientes que não fizeram login
  allowClientReserve?: boolean;// permite reserva feita pelo cliente
  variants?: Omit<Variant, 'id'>[];
}