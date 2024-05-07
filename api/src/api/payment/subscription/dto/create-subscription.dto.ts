import { IsNotEmpty } from "class-validator";

export class CreateSubscriptionRequestDto {
  @IsNotEmpty({ message: 'O campo plano é obrigatorio'})
  planId: number;

  @IsNotEmpty({ message: 'O campo projeto é obrigatorio'})
  projectId: string;
}