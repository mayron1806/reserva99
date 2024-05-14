import { z } from "zod";
import { refineTime, timeSchema } from "~/validation/time";

export const createOrUpdateTimeSchema = z.object({
  edit: z.boolean().optional(),
  monday: z.array(timeSchema).refine(refineTime, { message: 'Os horários não podem se sobrepor.' }).optional(),
  tuesday: z.array(timeSchema).refine(refineTime, { message: 'Os horários não podem se sobrepor.' }).optional(),
  wednesday: z.array(timeSchema).refine(refineTime, { message: 'Os horários não podem se sobrepor.' }).optional(),
  thursday: z.array(timeSchema).refine(refineTime, { message: 'Os horários não podem se sobrepor.' }).optional(),
  friday: z.array(timeSchema).refine(refineTime, { message: 'Os horários não podem se sobrepor.' }).optional(),
  saturday: z.array(timeSchema).refine(refineTime, { message: 'Os horários não podem se sobrepor.' }).optional(),
  sunday: z.array(timeSchema).refine(refineTime, { message: 'Os horários não podem se sobrepor.' }).optional(),
});
export type CreateOrUpdateTimeSchema = z.infer<typeof createOrUpdateTimeSchema>;