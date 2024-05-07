import { Address } from "./address";

export type CompanyList = {
  id: string;
  identifier: string;
  name: string;
}[];
export type Company = {
  id: string;
  name: string;
  identifier: string;
  description?: string;
  address: Address;
}