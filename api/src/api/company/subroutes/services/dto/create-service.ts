import { IsNumber, IsOptional, ValidateNested, MaxLength, Min, Matches } from 'class-validator';
import { Type } from 'class-transformer';

export class Variant {
  @MaxLength(50, { message: 'O nome deve ter no máximo 50 caracteres' })
  name: string;

  @MaxLength(2000, { message: 'A descrição deve ter no máximo 2000 caracteres' })
  description: string;

  @IsNumber({ allowNaN: false, allowInfinity: false }, { message: 'O preço deve ser um número válido' })
  @Min(0, { message: 'O preço deve ser positivo' })
  price: number; 

  @IsNumber({ allowNaN: false, allowInfinity: false }, { message: 'A duração deve ser um número válido' })
  @Min(0, { message: 'A duração deve ser positiva' })
  duration: number; 
}

export class CreateServiceRequest {
  @IsOptional()
  @MaxLength(50, { message: 'O identificador deve ter no máximo 50 caracteres' })
  @Matches(/^[a-zA-Z0-9-]*$/, { message: 'O identificador deve conter apenas letras, números e "-" '})
  identifier?: string;

  @MaxLength(50, { message: 'O nome deve ter no máximo 50 caracteres' })
  name: string;

  @MaxLength(2000, { message: 'A descrição deve ter no máximo 2000 caracteres' })
  description: string;

  @IsOptional()
  @IsNumber({ allowNaN: false, allowInfinity: false }, { message: 'O preço deve ser um número válido' })
  @Min(0, { message: 'O preço deve ser positivo' })
  price?: number; 

  @IsOptional()
  @IsNumber({ allowNaN: false, allowInfinity: false }, { message: 'A duração deve ser um número válido' })
  @Min(0, { message: 'A duração deve ser positiva' })
  duration?: number; 

  @IsOptional()
  containVariants?: boolean;

  @IsOptional()
  allowClientAnonymousReserve?: boolean;// permite reserva de clientes que não fizeram login

  @IsOptional()
  allowClientReserve?: boolean;// permite reserva feita pelo cliente

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => Variant)
  variants?: Variant[];
}