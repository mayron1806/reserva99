import { z } from "zod";
import { createClientSchema } from "~/routes/_app.admin.clients.create/validation/create-client";

export const createScheduleSchema = z.object({
  client: createClientSchema.nullish().optional(),
  clientId: z.string().optional(),
  createClient: z.boolean().optional(),
  serviceId: z.string().min(1, 'O campo serviço é obrigatorio'),
  variantId: z.string().optional(),
  date: z.string().min(1, 'O campo data é obrigatório'),
  paymentStatus: z.string().optional(),
  paymentDate: z.string().optional(),
  description: z.string().max(2000, { message: 'A descrição deve ter no máximo 2000 caracteres' }).optional(),
  price: z.string(),
  duration: z.string(),
});
export type CreateScheduleSchema = z.infer<typeof createScheduleSchema>;