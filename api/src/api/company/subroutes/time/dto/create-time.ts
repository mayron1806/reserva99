import { Validate, ValidateNested } from "class-validator";

const hourValid = (hour: string) => {
  if(!hour) return true;
  if (hour.length !== 5 || hour[2] !== ':') return false;
  const [horas, minutos] = hour.split(':').map(Number);
  if (isNaN(horas) || isNaN(minutos)) return false;
  if (horas < 0 || horas > 23 || minutos < 0 || minutos > 59) return false;
  return true;
}
class Time {
  @Validate(hourValid, { message: 'Hora de início invalida.' })
  start: string;
  
  @Validate(hourValid, { message: 'Hora final invalida.' })
  end: string;
}
export class CreateOrUpdateTimeRequest {
  @ValidateNested({ each: true })
  monday?: Time[]; 
  
  @ValidateNested({ each: true })
  tuesday?: Time[]; 
  
  @ValidateNested({ each: true })
  wednesday?: Time[]; 
  
  @ValidateNested({ each: true })
  thursday?: Time[]; 
  
  @ValidateNested({ each: true })
  friday?: Time[]; 
  
  @ValidateNested({ each: true })
  saturday?: Time[]; 
  
  @ValidateNested({ each: true })
  sunday?: Time[]; 
}