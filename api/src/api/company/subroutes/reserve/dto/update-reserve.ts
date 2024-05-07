import { IsOptional } from "class-validator";

export class UpdateReserveRequestDto {
  @IsOptional()
  status?: string;
  
  @IsOptional()
  paymentStatus?: string;
  
  @IsOptional()
  paymentMethod?: string;
}