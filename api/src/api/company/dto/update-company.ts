import { Optional } from "@nestjs/common";
import { Company } from "@prisma/client";
import { IsNotEmpty, IsString, Length, Matches, MaxLength, ValidateNested } from "class-validator";

export class Address {
  @IsNotEmpty({ message: 'O país é obrigatório' })
  @IsString({ message: 'O país deve ser uma string' })
  country: string;

  @IsNotEmpty({ message: 'O estado é obrigatório' })
  @IsString({ message: 'O estado deve ser uma string' })
  state: string;

  @IsNotEmpty({ message: 'A cidade é obrigatória' })
  @IsString({ message: 'A cidade deve ser uma string' })
  city: string;

  @IsNotEmpty({ message: 'O bairro é obrigatória' })
  @IsString({ message: 'O bairro deve ser uma string' })
  district: string;

  @IsNotEmpty({ message: 'A rua é obrigatório' })
  @IsString({ message: 'A rua deve ser uma string' })
  street: string;

  @IsNotEmpty({ message: 'O número é obrigatório' })
  @IsString({ message: 'O número deve ser uma string' })
  number: string;

  @IsString({ message: 'O complemento deve ser uma string' })
  @MaxLength(255, { message: 'O complemento deve ter no máximo 255 caracteres' })
  complement: string;

  @IsNotEmpty({ message: 'O CEP é obrigatório' })
  @IsString({ message: 'O CEP deve ser uma string' })
  @Matches(/^\d{5}-\d{3}$/, { message: 'Formato de CEP inválido. Use o formato 12345-678' })
  zipCode: string;
}
export class UpdateCompanyRequestDto {
  @Optional()
  @Length(3, 40, { message: "O campo nome deve ter entre 3 e 40 caracteres"})
  name?: string;

  @Optional()
  description?: string;

  @Optional()
  @ValidateNested({ each: true })
  address?: Address;

  @Optional()
  preReserveTime?: number; // (tempo com que agendamento pode ser criado ex: 4h antes)
  
  @Optional()
  preCancelTime?: number; // (tempo com que agendamento pode ser cancelado Ex: 4h antes)
  
  @Optional()
  maxPreReserveTime?: number; // (tempo com que agendamento pode ser feito, Ex: até 3 meses antes)
  
  @Optional()
  cancellationPolicy?: string; // politica de cancelamento
}
export class UpdateCompanyResponseDto {
  id: string;
  name: string;
  description: string;
  identifier: string;
  address: Address;

  static mapToResponse(company: Company & { address?: Address }) {
    const res = new UpdateCompanyResponseDto();
    res.id = company.id;
    res.identifier = company.identifier;
    res.name = company.name;
    res.description = company.description;
    if (company.address) {
      res.address = {
        country: company.address.country,
        state: company.address.state,
        city: company.address.city,
        district: company.address.district,
        street: company.address.street,
        number: company.address.number,
        complement: company.address.complement,
        zipCode: company.address.zipCode,
      };
    }
    return res;
  }
}