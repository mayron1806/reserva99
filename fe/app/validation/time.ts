import { z } from "zod";

export const hourValid = (hour: string) => {
  if(!hour) return true;
  if (hour.length !== 5 || hour[2] !== ':') return false;
  const [horas, minutos] = hour.split(':').map(Number);
  if (isNaN(horas) || isNaN(minutos)) return false;
  if (horas < 0 || horas > 23 || minutos < 0 || minutos > 59) return false;
  return true;
}
export const timeSchema = z.object({
  start: z.string().refine(hourValid, { message: 'Hora inválida' }).optional(),
  end: z.string().refine(hourValid, { message: 'Hora inválida' }).optional(),
});
export type Time = z.infer<typeof timeSchema>;

export const isTimeValid = (newTime: Time, existingTimes: Time[]): boolean => {
  const newStartTime = newTime.start;
  const newEndTime = newTime.end;
  if (!newStartTime || !newEndTime) return true;
  
  for (const existingTime of existingTimes) {
    const existingStartTime = existingTime.start;
    const existingEndTime = existingTime.end;
    if(existingEndTime && existingStartTime) {
      if (
        (newStartTime >= existingStartTime && newStartTime < existingEndTime) ||
        (newEndTime > existingStartTime && newEndTime <= existingEndTime) ||
        (newStartTime <= existingStartTime && newEndTime >= existingEndTime)
      ) {
        return false;
      }
    }
    return true;
  }

  return true;
};
export const refineTime = (times: Time[]) => {
  if (!times) return true;
  for (let i = 0; i < times.length; i++) {
    if (!isTimeValid(times[i], times.slice(0, i).concat(times.slice(i + 1)))) {
      return false;
    }
  }
  return true;
}