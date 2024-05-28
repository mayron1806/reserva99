import { IsEmail, IsIn, IsNotEmpty, IsOptional, IsPositive, Validate, ValidateNested } from "class-validator";
import { PaymentStatus } from "src/types/payment";
import { isValidISO8601Date } from "src/validation/iso-date";
class Client {
  @IsNotEmpty({ message: 'O campo nome é obrigatorio.' })
  name: string;
  
  @IsOptional()
  alias?: string;
  
  @IsOptional()
  @IsEmail(null, { message: 'E-mail inválido.'})
  email?: string;
  
  @IsOptional()
  phone?: string; 
}
export class CreateReserveRequestDto {
  @IsOptional()
  status?: string;
  
  @IsIn([PaymentStatus.Paid, PaymentStatus.Unpaid], { message: 'Status de pagamento inválido' })
  paymentStatus: PaymentStatus;
  
  @IsOptional()
  paymentMethod?: string;

  @IsOptional()
  description?: string;

  @IsOptional()
  @IsPositive({ message: 'A duração deve ser positiva.'})  
  price?: number;

  @IsOptional()
  @IsPositive({ message: 'A duração deve ser positiva.'})
  duration?: number;
  
  @IsNotEmpty({ message: 'O campo data é obrigatório' })
  @Validate(isValidISO8601Date, { message: 'Data inválida' })
  date: Date;
  
  @IsNotEmpty({ message: 'O serviço é obrigatório' })
  serviceId: string;

  @IsOptional()
  variantId?: string;

  @IsOptional()
  clientId?: string;

  @IsOptional()
  @ValidateNested({ each: true })
  client: Client;

  @IsOptional()
  hardSet?: boolean;

}