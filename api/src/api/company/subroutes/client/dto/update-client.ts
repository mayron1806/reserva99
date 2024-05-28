import { IsNotEmpty, IsEmail, IsOptional, IsPhoneNumber, Length, MaxLength } from 'class-validator';

export class UpdateClientRequestDto {
  @IsOptional()
  @IsNotEmpty({ message: 'O nome é obrigatório.' })
  name?: string;

  @IsOptional()
  @MaxLength(50, { message: 'O alias deve ter no máximo 50 caracteres.' })
  alias?: string;

  @IsOptional()
  @IsEmail({}, { message: 'O email deve ser válido.' })
  email?: string;

  @IsOptional()
  @IsPhoneNumber('BR', { message: 'O número de telefone deve ser válido.' })
  phone?: string;
}
