import { IsEmail, IsNotEmpty, IsOptional, Validate, ValidateNested } from "class-validator";
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
  
  @IsOptional()
  paymentStatus?: string;
  
  @IsOptional()
  paymentMethod?: string;
  
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

}