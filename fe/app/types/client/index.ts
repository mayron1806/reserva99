export type Client = {
  id: string;
  name: string;
  alias?: string;
  email?: string;
  phone?: string;
  lastReserveDate?: Date;
}
export type CreateClient = {
  name: string;
  alias?: string;
  email?: string;
  phone?: string;
}