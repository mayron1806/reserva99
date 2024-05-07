import { ValidateNested } from "class-validator";

class Date {
  day: number;
  month: number;
}
export class CreateOrUpdateBlockRequest {
  monday?: boolean;
  tuesday?: boolean;
  wednesday?: boolean;
  thursday?: boolean;
  friday?: boolean;
  saturday?: boolean;
  sunday?: boolean;

  @ValidateNested({ each: true })
  dates?: Date[];
}