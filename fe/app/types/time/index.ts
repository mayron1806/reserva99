
export type Time = {
  start: string;
  end: string;
}

export type WeekTime = {
  monday?: Time[]; 
  tuesday?: Time[]; 
  wednesday?: Time[]; 
  thursday?: Time[]; 
  friday?: Time[]; 
  saturday?: Time[]; 
  sunday?: Time[]; 
}
export type Days =  "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday";
export const daysOfWeek: Record<Days, string> = {
  "monday": "Segunda",
  "tuesday": "Terça",
  "wednesday": "Quarta",
  "thursday": "Quinta",
  "friday": "Sexta",
  "saturday": "Sábado",
  "sunday": "Domingo"
};