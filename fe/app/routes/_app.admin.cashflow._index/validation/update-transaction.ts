import { z } from "zod";

export const updateTransactionSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'O campo nome deve ter entre 1 e 20 caracteres').max(20, 'O campo nome deve ter entre 1 e 20 caracteres'),
  description: z.string().max(1000, 'O campo descrição deve ter entre 1 e 1000 caracteres').optional(),
  type: z.string(),
  value: z.string().refine(v => {
    const cleanValue = v.replace('R$ ', '').replace(',', '');
    const numberValue = Number(cleanValue);
    return numberValue > 0;
  }, 'O valor deve ser positivo'),
  status: z.string(),
  date: z.string(),
});

export type UpdateTransactionSchema = z.infer<typeof updateTransactionSchema>;
