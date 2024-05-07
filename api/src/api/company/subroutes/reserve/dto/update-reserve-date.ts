import { IsNotEmpty, IsOptional, Validate } from "class-validator";
import { isValidISO8601Date } from "src/validation/iso-date";

export class UpdateReserveDateRequestDto {
  @IsNotEmpty({ message: 'O campo data é obrigatório' })
  @Validate(isValidISO8601Date, { message: 'Data inválida' })
  date: Date;
}