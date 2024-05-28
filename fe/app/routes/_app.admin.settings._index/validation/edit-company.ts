import { z } from "zod";

export const editCompanySchema = z.object({
  name: z.string()
    .min(3, 'O campo nome deve ter entre 3 e 40 caracteres')
    .max(40, 'O campo nome deve ter entre 3 e 40 caracteres'),
  description: z.string()
    .max(255, 'A descrição deve ter no maximo 255 caracteres')
    .optional(),
  address: z.object({
    country: z.string()
      .min(1, 'O país é obrigatório'),
    state: z.string()
      .min(1, 'O estado é obrigatório'),
    city: z.string()
      .min(1, 'A cidade é obrigatória'),
    district: z.string()
      .min(1, 'O bairro é obrigatório'),
    street: z.string()
      .min(1, 'A rua é obrigatória'),
    number: z.string()
      .min(1, 'O número é obrigatório'),
    complement: z.string()
      .optional(),
    zipCode: z.string()
      .min(1, 'O CEP é obrigatório')
      .regex(/^\d{5}-\d{3}$/, 'Formato de CEP inválido. Use o formato 12345-678')
  })
})
export type EditCompanySchema = z.infer<typeof editCompanySchema>;