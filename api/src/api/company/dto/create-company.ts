import { Optional } from "@nestjs/common";
import { Company } from "@prisma/client";
import { IsNotEmpty, IsString, Length, Matches, MaxLength, ValidateNested } from "class-validator";
import { CreateOrUpdateTimeRequest } from "../subroutes/time/dto/create-time";
import { Type } from "class-transformer";

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
export class CreateCompanyRequestDto {
  @Length(3, 40, { message: "O campo nome deve ter entre 3 e 40 caracteres"})
  name: string;

  @Optional()
  description?: string;

  @Length(1, 30, { message: "O campo identificador deve ter entre 1 e 30 caracteres"})
  identifier: string;

  @Optional()
  @ValidateNested()
  @Type(() => Address)
  address?: Address;

  @ValidateNested()
  @Type(() => CreateOrUpdateTimeRequest)
  workTime?: CreateOrUpdateTimeRequest;
}
export class CreateCompanyResponseDto {
  id: string;
  name: string;
  description: string;
  identifier: string;
  address: Address;

  static mapToResponse(company: Company & { address?: Address }) {
    const res = new CreateCompanyResponseDto();
    res.id = company.id;
    res.name = company.name;
    res.description = company.description;
    res.identifier = company.identifier;
    if (company.address) {
      res.address = {
        city: company.address.city,
        state: company.address.state,
        street: company.address.street,
        district: company.address.district,
        country: company.address.country,
        complement: company.address.complement,
        zipCode: company.address.zipCode,
        number: company.address.number,
      };
    }
    return res;
  }
}