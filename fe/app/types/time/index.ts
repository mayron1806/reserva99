
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