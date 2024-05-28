import { z } from 'zod';

const updateClientSchema = z.object({
  name: z.string().min(1, 'O campo nome é obrigatorio').max(50, { message: 'O nome deve ter no máximo 50 caracteres.' }),
  alias: z.string().max(50, { message: 'O nome deve ter no máximo 50 caracteres.' }).optional(),
  email: z.union([z.literal(''), z.string().email('E-mail inválido.')]).optional(),
  phone: z.union([z.literal(''), z.string().length(13, { message:'Número de telefone inválido.'})]).optional(),
});

export type UpdateClientSchema = z.infer<typeof updateClientSchema>;

export { updateClientSchema };
