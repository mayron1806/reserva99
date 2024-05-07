import { z } from "zod";
import { createClientSchema } from "~/routes/_app.admin.clients.create/validation/create-client";

export const createScheduleSchema = z.object({
  client: createClientSchema.nullish().optional(),
  clientId: z.string().optional(),
  createClient: z.boolean().optional(),
  serviceId: z.string().min(1, 'O campo serviço é obrigatorio'),
  variantId: z.string().optional(),
  date: z.string().min(1, 'O campo data é obrigatório'),
  paymentStatus: z.string().optional()
});
export type CreateScheduleSchema = z.infer<typeof createScheduleSchema>;